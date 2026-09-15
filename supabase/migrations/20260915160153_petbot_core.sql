create extension if not exists pgcrypto;

create type public.order_status as enum ('payment_pending', 'payment_submitted', 'payment_verified', 'in_production', 'shipped', 'delivered', 'cancelled');
create type public.payment_status as enum ('pending', 'submitted', 'verified', 'rejected');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_users (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (select 1 from public.admin_users where user_id = (select auth.uid()));
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

create table public.products (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(name) between 2 and 120),
  slug text not null unique check (slug ~ '^[a-z0-9]+(?:-[a-z0-9]+)*$'),
  description text not null default '',
  price_paise integer not null check (price_paise >= 0),
  compare_at_price_paise integer check (compare_at_price_paise >= price_paise),
  inventory_quantity integer not null default 0 check (inventory_quantity >= 0),
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.product_media (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage_path text not null,
  alt_text text not null default '',
  position smallint not null default 0 check (position >= 0),
  created_at timestamptz not null default now(),
  unique (product_id, position)
);

create table public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

insert into public.site_settings (key, value) values
  ('payment', '{"method":"manual_upi","upi_id":"petbot@ptyes","payee_business":"Pet bot","payee_name":"Kanishka Dwivedi","qr_path":"petbot-upi-qr.jpeg"}'::jsonb)
on conflict (key) do update set value = excluded.value, updated_at = now();

create table public.orders (
  id uuid primary key default gen_random_uuid(),
  order_number text not null unique default ('PB-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  customer_name text not null check (char_length(customer_name) between 2 and 120),
  customer_email text not null,
  customer_phone text not null check (char_length(customer_phone) between 8 and 25),
  shipping_address jsonb not null,
  status public.order_status not null default 'payment_pending',
  subtotal_paise integer not null check (subtotal_paise >= 0),
  shipping_paise integer not null default 0 check (shipping_paise >= 0),
  total_paise integer not null check (total_paise >= 0),
  tracking_token uuid not null default gen_random_uuid() unique,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders(id) on delete cascade,
  product_id uuid not null references public.products(id) on delete restrict,
  product_name text not null,
  unit_price_paise integer not null check (unit_price_paise >= 0),
  quantity smallint not null check (quantity > 0),
  personalization jsonb not null default '{}'::jsonb
);

create table public.payments (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null unique references public.orders(id) on delete cascade,
  method text not null default 'manual_upi' check (method = 'manual_upi'),
  status public.payment_status not null default 'pending',
  utr text,
  proof_path text,
  reviewed_by uuid references public.profiles(id) on delete set null,
  reviewed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.pet_profiles (
  id uuid primary key default gen_random_uuid(),
  public_id text not null unique default lower(substr(replace(gen_random_uuid()::text, '-', ''), 1, 12)),
  order_id uuid references public.orders(id) on delete set null,
  pet_name text not null,
  breed text,
  public_message text,
  photo_path text,
  is_public boolean not null default false,
  created_at timestamptz not null default now()
);

create index product_media_product_id_idx on public.product_media(product_id);
create index order_items_order_id_idx on public.order_items(order_id);
create index order_items_product_id_idx on public.order_items(product_id);
create index payments_order_id_idx on public.payments(order_id);
create index pet_profiles_order_id_idx on public.pet_profiles(order_id);

alter table public.profiles enable row level security;
alter table public.admin_users enable row level security;
alter table public.products enable row level security;
alter table public.product_media enable row level security;
alter table public.site_settings enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;
alter table public.payments enable row level security;
alter table public.pet_profiles enable row level security;

create policy "Admins manage profiles" on public.profiles for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins manage admin users" on public.admin_users for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Public sees published products" on public.products for select to anon, authenticated using (is_published or (select public.is_admin()));
create policy "Admins manage products" on public.products for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Public sees product media" on public.product_media for select to anon, authenticated using (exists (select 1 from public.products p where p.id = product_id and (p.is_published or (select public.is_admin()))));
create policy "Admins manage product media" on public.product_media for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins manage settings" on public.site_settings for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins manage orders" on public.orders for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins manage order items" on public.order_items for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Admins manage payments" on public.payments for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));
create policy "Public sees public pet profiles" on public.pet_profiles for select to anon, authenticated using (is_public or (select public.is_admin()));
create policy "Admins manage pet profiles" on public.pet_profiles for all to authenticated using ((select public.is_admin())) with check ((select public.is_admin()));

insert into storage.buckets (id, name, public) values ('product-media', 'product-media', true), ('payment-proofs', 'payment-proofs', false), ('pet-media', 'pet-media', false)
on conflict (id) do nothing;

create policy "Public reads product media" on storage.objects for select to anon, authenticated using (bucket_id = 'product-media');
create policy "Admins manage product media storage" on storage.objects for all to authenticated using (bucket_id = 'product-media' and (select public.is_admin())) with check (bucket_id = 'product-media' and (select public.is_admin()));
create policy "Admins manage payment proof storage" on storage.objects for all to authenticated using (bucket_id = 'payment-proofs' and (select public.is_admin())) with check (bucket_id = 'payment-proofs' and (select public.is_admin()));
create policy "Admins manage pet media storage" on storage.objects for all to authenticated using (bucket_id = 'pet-media' and (select public.is_admin())) with check (bucket_id = 'pet-media' and (select public.is_admin()));
