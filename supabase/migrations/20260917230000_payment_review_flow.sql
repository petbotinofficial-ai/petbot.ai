create or replace function public.mark_petbot_payment_completed(p_order_id uuid)
returns void language plpgsql security definer set search_path = public as $$
begin
  update public.payments set status = 'submitted' where order_id = p_order_id and status = 'pending';
  if not found then raise exception 'Payment is not available for review'; end if;
  update public.orders set status = 'payment_submitted' where id = p_order_id and status = 'payment_pending';
end;
$$;
revoke all on function public.mark_petbot_payment_completed(uuid) from public;
grant execute on function public.mark_petbot_payment_completed(uuid) to anon, authenticated;
