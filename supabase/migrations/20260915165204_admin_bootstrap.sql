create or replace function public.handle_new_petbot_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do update set email = excluded.email, updated_at = now();

  if lower(new.email) = 'petbot.inofficial@gmail.com' then
    insert into public.admin_users (user_id)
    values (new.id)
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

revoke all on function public.handle_new_petbot_user() from public;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_petbot_user();

insert into public.profiles (id, email, full_name)
select id, email, coalesce(raw_user_meta_data ->> 'full_name', '')
from auth.users
on conflict (id) do update set email = excluded.email, updated_at = now();

insert into public.admin_users (user_id)
select id from auth.users where lower(email) = 'petbot.inofficial@gmail.com'
on conflict (user_id) do nothing;
