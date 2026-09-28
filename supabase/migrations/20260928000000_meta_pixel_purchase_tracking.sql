-- Supports Meta Pixel + Conversions API (CAPI) Purchase tracking.
--
-- Design: the browser must never be the sole Purchase signal, and it must never create or
-- decide the Meta event_id. A single stable event_id is created (once, idempotently) by
-- claim_petbot_meta_capi_attempt() the first time a server-side, signature-verified route
-- (Razorpay webhook or verify-payment) observes an order as 'payment_verified'. That same
-- function is the only writer of meta_capi_sent_at, and only after this app's server code has
-- confirmed Meta's Graph API actually accepted the event — never merely because a browser
-- attempted to fire the Pixel. The browser-facing get_petbot_meta_purchase_event() is read-only:
-- it hands back the already-created event_id (if any) so the Pixel event on /order-success can
-- share it with the server-side CAPI event for Meta's built-in dedup, but it never fabricates
-- one and never marks anything as delivered.

alter table public.orders drop column if exists meta_purchase_tracked_at;

alter table public.orders add column if not exists meta_purchase_event_id uuid unique;
alter table public.orders add column if not exists meta_capi_sent_at timestamptz;
alter table public.orders add column if not exists meta_capi_attempts integer not null default 0;
alter table public.orders add column if not exists meta_capi_last_error text;
alter table public.orders add column if not exists meta_fbp text;
alter table public.orders add column if not exists meta_fbc text;

drop function if exists public.claim_petbot_purchase_event(text, uuid);
drop function if exists public.create_petbot_checkout(text, text, text, jsonb, uuid, jsonb);

-- Adds optional Meta Pixel browser-id capture (_fbp/_fbc cookies, read client-side at checkout
-- submission) so the server-side CAPI event can include them for attribution matching. Neither
-- value is PII; both are safe to store as plain text and are omitted entirely when absent.
create or replace function public.create_petbot_checkout(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_shipping_address jsonb,
  p_product_id uuid,
  p_personalization jsonb default '{}'::jsonb,
  p_fbp text default null,
  p_fbc text default null
)
returns table (order_id uuid, order_number text, tracking_token uuid)
language plpgsql
security definer
set search_path = public
as $$
declare
  selected_product public.products%rowtype;
  created_order public.orders%rowtype;
  pet_name_value text;
begin
  if char_length(trim(p_customer_name)) not between 2 and 120
     or char_length(trim(p_customer_email)) < 5
     or char_length(trim(p_customer_phone)) not between 8 and 25 then
    raise exception 'Invalid checkout details';
  end if;

  select * into selected_product from public.products
  where id = p_product_id and is_published = true;
  if not found then raise exception 'This product is no longer available'; end if;

  insert into public.orders (customer_name, customer_email, customer_phone, shipping_address, subtotal_paise, total_paise, meta_fbp, meta_fbc)
  values (trim(p_customer_name), lower(trim(p_customer_email)), trim(p_customer_phone), p_shipping_address, selected_product.price_paise, selected_product.price_paise, nullif(trim(coalesce(p_fbp, '')), ''), nullif(trim(coalesce(p_fbc, '')), ''))
  returning * into created_order;

  insert into public.order_items (order_id, product_id, product_name, unit_price_paise, quantity, personalization)
  values (created_order.id, selected_product.id, selected_product.name, selected_product.price_paise, 1, coalesce(p_personalization, '{}'::jsonb));

  insert into public.payments (order_id) values (created_order.id);
  pet_name_value := nullif(trim(coalesce(p_personalization->>'pet_name', '')), '');
  if pet_name_value is not null then
    insert into public.pet_profiles (order_id, pet_name, breed, public_message)
    values (created_order.id, pet_name_value, nullif(trim(coalesce(p_personalization->>'breed', '')), ''), nullif(trim(coalesce(p_personalization->>'message', '')), ''));
  end if;
  return query select created_order.id, created_order.order_number, created_order.tracking_token;
end;
$$;

revoke all on function public.create_petbot_checkout(text, text, text, jsonb, uuid, jsonb, text, text) from public;
grant execute on function public.create_petbot_checkout(text, text, text, jsonb, uuid, jsonb, text, text) to anon, authenticated;

-- Server-only (service-role) entry point, called from src/lib/meta-capi.ts by both the Razorpay
-- webhook and verify-payment routes. Idempotent and retry-safe:
--   - meta_purchase_event_id is created once via coalesce(...) and reused on every subsequent
--     call for the same order (webhook retries, races with verify-payment, never a fresh id).
--   - Only returns a row (i.e. only allows an attempt) when the order is 'payment_verified',
--     meta_capi_sent_at is still null, and the bounded attempt budget isn't exhausted yet.
--   - Every claim increments meta_capi_attempts regardless of whether the caller's subsequent
--     Graph API call succeeds, which is what makes the retry budget bounded rather than infinite.
-- Not granted to anon/authenticated: only callable via the service-role admin client.
create or replace function public.claim_petbot_meta_capi_attempt(p_order_id uuid, p_max_attempts integer default 5)
returns table (
  event_id uuid,
  total_paise integer,
  product_slugs text[],
  fbp text,
  fbc text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  target public.orders%rowtype;
begin
  update public.orders o
  set meta_purchase_event_id = coalesce(o.meta_purchase_event_id, gen_random_uuid()),
      meta_capi_attempts = o.meta_capi_attempts + 1
  where o.id = p_order_id
    and o.status = 'payment_verified'
    and o.meta_capi_sent_at is null
    and o.meta_capi_attempts < p_max_attempts
  returning * into target;

  if not found then
    return;
  end if;

  return query
  select target.meta_purchase_event_id, target.total_paise, array_agg(p.slug order by p.slug), target.meta_fbp, target.meta_fbc
  from public.order_items oi
  join public.products p on p.id = oi.product_id
  where oi.order_id = target.id;
end;
$$;

revoke all on function public.claim_petbot_meta_capi_attempt(uuid, integer) from public, anon, authenticated;
grant execute on function public.claim_petbot_meta_capi_attempt(uuid, integer) to service_role;

-- Browser-facing, read-only. Requires the order number AND the unguessable tracking_token
-- (the same secret already used by this checkout's own success redirect — never exposed
-- elsewhere), only ever returns data for an order already 'payment_verified', and — unlike
-- claim_petbot_meta_capi_attempt — never creates an event_id and never marks anything as sent.
-- If the server-side claim hasn't run yet (rare race) this simply returns nothing and the
-- browser Pixel Purchase is skipped for that page load; CAPI still delivers the event.
create or replace function public.get_petbot_meta_purchase_event(p_order_number text, p_tracking_token uuid)
returns table (
  event_id uuid,
  total_paise integer,
  product_slugs text[]
)
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  target public.orders%rowtype;
begin
  select * into target
  from public.orders o
  where o.order_number = upper(trim(p_order_number))
    and o.tracking_token = p_tracking_token
    and o.status = 'payment_verified'
    and o.meta_purchase_event_id is not null
  limit 1;

  if not found then
    return;
  end if;

  return query
  select target.meta_purchase_event_id, target.total_paise, array_agg(p.slug order by p.slug)
  from public.order_items oi
  join public.products p on p.id = oi.product_id
  where oi.order_id = target.id;
end;
$$;

revoke all on function public.get_petbot_meta_purchase_event(text, uuid) from public;
grant execute on function public.get_petbot_meta_purchase_event(text, uuid) to anon, authenticated;
