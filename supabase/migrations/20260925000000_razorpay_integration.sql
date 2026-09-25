-- Adds Razorpay support alongside the existing manual-UPI flow, plus a scoped
-- order-tracking RPC for the public "/track-order" page. Manual UPI is left in place
-- (existing "confirm_petbot_payment" / admin approval flow) so no in-flight orders break.

alter type public.order_status add value if not exists 'payment_failed';

alter table public.payments drop constraint if exists payments_method_check;
alter table public.payments add constraint payments_method_check check (method in ('manual_upi', 'razorpay'));

alter table public.payments add column if not exists razorpay_order_id text;
alter table public.payments add column if not exists razorpay_payment_id text unique;
alter table public.payments add column if not exists razorpay_signature text;
alter table public.payments add column if not exists failure_reason text;

-- Called by the checkout client immediately after create_petbot_checkout, before the
-- Razorpay Checkout widget opens, so we have a Razorpay order id to reconcile against
-- in the verify-payment API route and the webhook handler.
create or replace function public.record_petbot_razorpay_order(p_order_id uuid, p_razorpay_order_id text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_razorpay_order_id !~ '^order_[A-Za-z0-9]{5,64}$' then
    raise exception 'Invalid Razorpay order reference';
  end if;
  update public.payments
  set method = 'razorpay', razorpay_order_id = p_razorpay_order_id
  where order_id = p_order_id and status = 'pending';
  if not found then raise exception 'Payment not found or already processed'; end if;
end;
$$;

revoke all on function public.record_petbot_razorpay_order(uuid, text) from public;
grant execute on function public.record_petbot_razorpay_order(uuid, text) to anon, authenticated;

-- Scoped, read-only lookup for the public order-tracking page. Requires the order number
-- AND the registered email or phone number, and returns only customer-safe fields — no
-- admin data, no full address, no personalization/photo details.
create or replace function public.get_petbot_order_status(p_order_number text, p_contact text)
returns table (
  order_number text,
  status public.order_status,
  created_at timestamptz,
  total_paise integer
)
language plpgsql
security definer
set search_path = public
stable
as $$
declare
  normalized_contact text := lower(trim(p_contact));
begin
  return query
  select o.order_number, o.status, o.created_at, o.total_paise
  from public.orders o
  where o.order_number = upper(trim(p_order_number))
    and (lower(o.customer_email) = normalized_contact or o.customer_phone = trim(p_contact))
  limit 1;
end;
$$;

revoke all on function public.get_petbot_order_status(text, text) from public;
grant execute on function public.get_petbot_order_status(text, text) to anon, authenticated;
