-- Public checkout is deliberately limited to these two narrowly scoped functions.
-- The browser never receives admin or service-role credentials.
create or replace function public.create_petbot_checkout(
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_shipping_address jsonb,
  p_product_id uuid,
  p_personalization jsonb default '{}'::jsonb
)
returns table (order_id uuid, order_number text)
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

  insert into public.orders (customer_name, customer_email, customer_phone, shipping_address, subtotal_paise, total_paise)
  values (trim(p_customer_name), lower(trim(p_customer_email)), trim(p_customer_phone), p_shipping_address, selected_product.price_paise, selected_product.price_paise)
  returning * into created_order;

  insert into public.order_items (order_id, product_id, product_name, unit_price_paise, quantity, personalization)
  values (created_order.id, selected_product.id, selected_product.name, selected_product.price_paise, 1, coalesce(p_personalization, '{}'::jsonb));

  insert into public.payments (order_id) values (created_order.id);
  pet_name_value := nullif(trim(coalesce(p_personalization->>'pet_name', '')), '');
  if pet_name_value is not null then
    insert into public.pet_profiles (order_id, pet_name, breed, public_message)
    values (created_order.id, pet_name_value, nullif(trim(coalesce(p_personalization->>'breed', '')), ''), nullif(trim(coalesce(p_personalization->>'message', '')), ''));
  end if;
  return query select created_order.id, created_order.order_number;
end;
$$;

create or replace function public.attach_petbot_photo(p_order_id uuid, p_photo_path text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_photo_path !~ ('^orders/' || p_order_id::text || '/') then raise exception 'Invalid photo path'; end if;
  update public.pet_profiles set photo_path = p_photo_path where order_id = p_order_id;
  if not found then raise exception 'Pet profile not found'; end if;
end;
$$;

create or replace function public.submit_petbot_utr(p_order_id uuid, p_utr text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_utr !~ '^[A-Za-z0-9-]{6,40}$' then raise exception 'Invalid payment reference'; end if;
  update public.payments set utr = p_utr where order_id = p_order_id and status = 'pending';
  if not found then raise exception 'Payment not found'; end if;
end;
$$;

revoke all on function public.create_petbot_checkout(text, text, text, jsonb, uuid, jsonb) from public;
revoke all on function public.attach_petbot_photo(uuid, text) from public;
revoke all on function public.submit_petbot_utr(uuid, text) from public;
grant execute on function public.create_petbot_checkout(text, text, text, jsonb, uuid, jsonb) to anon, authenticated;
grant execute on function public.attach_petbot_photo(uuid, text) to anon, authenticated;
grant execute on function public.submit_petbot_utr(uuid, text) to anon, authenticated;

-- Pet portraits are kept in a private bucket. Customers may upload only; admins retain all other access.
create policy "Customers upload pet order photos" on storage.objects for insert to anon, authenticated
with check (bucket_id = 'pet-media' and name like 'orders/%' and (storage.extension(name) in ('jpg', 'jpeg', 'png', 'webp')));
