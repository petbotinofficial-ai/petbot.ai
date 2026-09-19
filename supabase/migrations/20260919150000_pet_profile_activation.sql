-- A tag receives one permanent public link. The first person with that link can
-- complete the profile; thereafter only the safe, public profile is displayed.
alter table public.pet_profiles
  add column if not exists is_friendly boolean,
  add column if not exists owner_phone text,
  add column if not exists owner_address text,
  add column if not exists share_address boolean not null default false,
  add column if not exists activated_at timestamptz;

create or replace function public.get_petbot_profile(p_public_id text)
returns table (
  public_id text,
  pet_name text,
  breed text,
  public_message text,
  is_friendly boolean,
  is_ready boolean,
  owner_phone text,
  owner_address text,
  share_address boolean
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
    case when p.is_public then p.share_address else false end
  from public.pet_profiles p
  where p.public_id = lower(trim(p_public_id));
$$;

create or replace function public.activate_petbot_profile(
  p_public_id text,
  p_pet_name text,
  p_is_friendly boolean,
  p_owner_phone text,
  p_owner_address text default null,
  p_share_address boolean default false,
  p_public_message text default null
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

  update public.pet_profiles
  set pet_name = trim(p_pet_name),
      is_friendly = p_is_friendly,
      owner_phone = trim(p_owner_phone),
      owner_address = nullif(trim(coalesce(p_owner_address, '')), ''),
      share_address = p_share_address,
      public_message = nullif(trim(coalesce(p_public_message, '')), ''),
      is_public = true,
      activated_at = now()
  where public_id = lower(trim(p_public_id)) and is_public = false;

  if not found then
    raise exception 'This profile has already been activated or the link is invalid';
  end if;

  return query select lower(trim(p_public_id));
end;
$$;

revoke all on function public.get_petbot_profile(text) from public;
revoke all on function public.activate_petbot_profile(text, text, boolean, text, text, boolean, text) from public;
grant execute on function public.get_petbot_profile(text) to anon, authenticated;
grant execute on function public.activate_petbot_profile(text, text, boolean, text, text, boolean, text) to anon, authenticated;
