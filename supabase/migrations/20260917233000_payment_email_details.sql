-- Creates the public, narrowly scoped function called after a customer taps
-- “I've completed payment”. It stores the payment-review state first; the
-- website then sends Petbot's server-side Resend notification.
create or replace function public.confirm_petbot_payment(p_order_id uuid)
returns table (order_number text, customer_name text, customer_email text, total_paise integer)
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.payments
  set status = 'submitted'
  where order_id = p_order_id and status = 'pending';

  if not found then
    raise exception 'Payment is not available for review';
  end if;

  update public.orders
  set status = 'payment_submitted'
  where id = p_order_id and status = 'payment_pending';

  return query
  select o.order_number, o.customer_name, o.customer_email, o.total_paise
  from public.orders o
  where o.id = p_order_id;
end;
$$;

revoke all on function public.confirm_petbot_payment(uuid) from public;
grant execute on function public.confirm_petbot_payment(uuid) to anon, authenticated;
Did
