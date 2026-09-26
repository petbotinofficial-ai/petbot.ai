-- Add an optional alert email to pet_profiles.
-- When set, location-alert emails go here instead of the order's customer_email.
alter table public.pet_profiles
  add column if not exists alert_email text;

-- Drop existing functions before recreating with new return types / signatures
drop function if exists public.get_petbot_profile(text);
drop function if exists public.activate_petbot_profile(text, text, boolean, text, text, boolean, text);
drop function if exists public.activate_petbot_profile(text, text, boolean, text, text, boolean, text, text);

-- Rebuild get_petbot_profile so it returns alert_email (only when the profile is live).
create or replace function public.get_petbot_profile(p_public_id text)
returns table (
  public_id   text,
  pet_name    text,
  breed       text,
  public_message text,
  is_friendly boolean,
  is_ready    boolean,
  owner_phone text,
  owner_address text,
  share_address boolean,
  alert_email text
)
language sql
security definer
set search_path = public
as $$
  select
    p.public_id,
    p.pet_name,
    p.breed,
    p.public_message,
    p.is_friendly,
    p.is_public as is_ready,
    case when p.is_public then p.owner_phone else null end,
    case when p.is_public and p.share_address then p.owner_address else null end,
    case when p.is_public then p.share_address else false end,
    case when p.is_public then p.alert_email else null end
  from public.pet_profiles p
  where p.public_id = lower(trim(p_public_id));
$$;

revoke all on function public.get_petbot_profile(text) from public;
grant execute on function public.get_petbot_profile(text) to anon, authenticated;

-- Rebuild activate_petbot_profile to accept and store an alert email.
create or replace function public.activate_petbot_profile(
  p_public_id     text,
  p_pet_name      text,
  p_is_friendly   boolean,
  p_owner_phone   text,
  p_owner_address text    default null,
  p_share_address boolean default false,
  p_public_message text   default null,
  p_alert_email   text    default null
)
returns table (public_id text)
language plpgsql
security definer
set search_path = public
as $$
begin
  if char_length(trim(p_pet_name)) not between 1 and 80
    or char_length(trim(p_owner_phone)) not between 8 and 25 then
    raise exception 'Please enter a pet name and a valid contact number';
  end if;

  if p_alert_email is not null
    and trim(p_alert_email) <> ''
    and trim(p_alert_email) !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Please enter a valid alert email address';
  end if;

  update public.pet_profiles as profile
  set pet_name      = trim(p_pet_name),
      is_friendly   = p_is_friendly,
      owner_phone   = trim(p_owner_phone),
      owner_address = nullif(trim(coalesce(p_owner_address, '')), ''),
      share_address = p_share_address,
      public_message = nullif(trim(coalesce(p_public_message, '')), ''),
      alert_email   = nullif(trim(coalesce(p_alert_email, '')), ''),
      is_public     = true,
      activated_at  = now()
  where profile.public_id = lower(trim(p_public_id)) and profile.is_public = false;

  if not found then
    raise exception 'This profile has already been activated or the link is invalid';
  end if;

  return query select lower(trim(p_public_id));
end;
$$;

revoke all on function public.activate_petbot_profile(text, text, boolean, text, text, boolean, text, text) from public;
grant execute on function public.activate_petbot_profile(text, text, boolean, text, text, boolean, text, text) to anon, authenticated;

-- Rebuild create_petbot_location_alert so it prefers alert_email over customer_email.
-- Keeps the same rate-limit logic as 20260925010000_location_alert_daily_cap.sql.
create or replace function public.create_petbot_location_alert(
  p_public_id      text,
  p_accuracy_meters numeric default null
)
returns table (pet_name text, owner_email text)
language plpgsql
security definer
set search_path = public
as $$
declare
  matched_profile_id  uuid;
  matched_pet_name    text;
  matched_owner_email text;
  recent_alert_count  integer;
  daily_alert_count   integer;
begin
  if p_public_id !~ '^[a-z0-9-]{3,80}$' then
    raise exception 'Profile unavailable';
  end if;

  if p_accuracy_meters is not null
    and (p_accuracy_meters < 0 or p_accuracy_meters > 100000) then
    raise exception 'Invalid location accuracy';
  end if;

  -- Prefer alert_email; fall back to the order's customer_email.
  select profile.id,
         profile.pet_name,
         coalesce(nullif(trim(profile.alert_email), ''), customer_order.customer_email)
    into matched_profile_id, matched_pet_name, matched_owner_email
  from public.pet_profiles as profile
  left join public.orders as customer_order on customer_order.id = profile.order_id
  where profile.public_id = lower(trim(p_public_id))
    and profile.is_public = true;

  if not found then
    raise exception 'Profile unavailable';
  end if;

  if matched_owner_email is null
    or trim(matched_owner_email) = ''
    or trim(matched_owner_email) !~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$' then
    raise exception 'Owner notification unavailable';
  end if;

  -- 30-minute cap (3 per window).
  select count(*) into recent_alert_count
  from public.pet_location_alerts as alert
  where alert.pet_profile_id = matched_profile_id
    and alert.created_at > now() - interval '30 minutes';

  if recent_alert_count >= 3 then
    raise exception 'Location alerts are temporarily limited';
  end if;

  -- 24-hour cap (12 per day).
  select count(*) into daily_alert_count
  from public.pet_location_alerts as alert
  where alert.pet_profile_id = matched_profile_id
    and alert.created_at > now() - interval '24 hours';

  if daily_alert_count >= 12 then
    raise exception 'Location alerts are temporarily limited';
  end if;

  insert into public.pet_location_alerts (pet_profile_id, accuracy_meters)
  values (matched_profile_id, p_accuracy_meters);

  return query select matched_pet_name, matched_owner_email;
end;
$$;

revoke all on function public.create_petbot_location_alert(text, numeric) from public;
grant execute on function public.create_petbot_location_alert(text, numeric) to anon, authenticated;
