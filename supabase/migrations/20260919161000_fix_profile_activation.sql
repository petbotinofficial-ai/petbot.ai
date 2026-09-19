create or replace function public.activate_petbot_profile(p_public_id text, p_pet_name text, p_is_friendly boolean, p_owner_phone text, p_owner_address text default null, p_share_address boolean default false, p_public_message text default null)
returns table (public_id text)
language plpgsql security definer set search_path = public
as $$
begin
  if char_length(trim(p_pet_name)) not between 1 and 80 or char_length(trim(p_owner_phone)) not between 8 and 25 then
    raise exception 'Please enter a pet name and a valid contact number';
  end if;
  update public.pet_profiles as profile
  set pet_name = trim(p_pet_name), is_friendly = p_is_friendly, owner_phone = trim(p_owner_phone), owner_address = nullif(trim(coalesce(p_owner_address, '')), ''), share_address = p_share_address, public_message = nullif(trim(coalesce(p_public_message, '')), ''), is_public = true, activated_at = now()
  where profile.public_id = lower(trim(p_public_id)) and profile.is_public = false;
  if not found then raise exception 'This profile has already been activated or the link is invalid'; end if;
  return query select lower(trim(p_public_id))::text;
end;
$$;
