-- One-time finder alerts. Coordinates are deliberately never persisted.
create table if not exists public.pet_location_alerts (
  id uuid primary key default gen_random_uuid(),
  pet_profile_id uuid not null references public.pet_profiles(id) on delete cascade,
  accuracy_meters numeric,
  created_at timestamptz not null default now()
);

create index if not exists pet_location_alerts_profile_created_idx
  on public.pet_location_alerts (pet_profile_id, created_at desc);

alter table public.pet_location_alerts enable row level security;

create or replace function public.create_petbot_location_alert(
  p_public_id text,
  p_accuracy_meters numeric default null
)
returns table (pet_name text, owner_email text)
language plpgsql
security definer
set search_path = public
as $$
declare
  matched_profile_id uuid;
  matched_pet_name text;
  matched_owner_email text;
  recent_alert_count integer;
begin
  if p_public_id !~ '^[a-z0-9-]{3,80}$' then
    raise exception 'Profile unavailable';
  end if;

  if p_accuracy_meters is not null and (p_accuracy_meters < 0 or p_accuracy_meters > 100000) then
    raise exception 'Invalid location accuracy';
  end if;

  select profile.id, profile.pet_name, customer_order.customer_email
    into matched_profile_id, matched_pet_name, matched_owner_email
  from public.pet_profiles as profile
  join public.orders as customer_order on customer_order.id = profile.order_id
  where profile.public_id = lower(trim(p_public_id))
    and profile.is_public = true;

  if not found then
    raise exception 'Profile unavailable';
  end if;

  if matched_owner_email !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Owner notification unavailable';
  end if;

  select count(*) into recent_alert_count
  from public.pet_location_alerts as alert
  where alert.pet_profile_id = matched_profile_id
    and alert.created_at > now() - interval '30 minutes';

  if recent_alert_count >= 3 then
    raise exception 'Location alerts are temporarily limited';
  end if;

  insert into public.pet_location_alerts (pet_profile_id, accuracy_meters)
  values (matched_profile_id, p_accuracy_meters);

  return query select matched_pet_name, matched_owner_email;
end;
$$;

revoke all on function public.create_petbot_location_alert(text, numeric) from public;
grant execute on function public.create_petbot_location_alert(text, numeric) to anon, authenticated;
