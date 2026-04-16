-- Complete Supabase Setup for Ngọc Nhất Linh
-- Products, Blog, Contact + Storage + RLS + Indexes + Triggers + Correct bucket syntax

-- Enable extensions
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- 1. PRODUCTS TABLE
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique,
  description text,
  price bigint not null,
  image_url text,
  images jsonb default '[]',
  category text,
  menh text,
  specs jsonb,
  meaning text,
  stock integer default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_products_category on products(category);
create index if not exists idx_products_menh on products(menh);
create index if not exists idx_products_slug on products(slug);

-- 2. POSTS (BLOG) TABLE
create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  content text,
  excerpt text,
  author text default 'Admin',
  image_url text,
  category text,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Indexes
create index if not exists idx_posts_slug on posts(slug);
create index if not exists idx_posts_published on posts(published);

-- 3. CONTACTS TABLE
create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text,
  phone text not null,
  message text not null,
  ip_address inet,
  created_at timestamptz default now()
);

-- 4. STORAGE BUCKETS (Correct SQL syntax for Supabase)
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('product-gallery', 'product-gallery', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('blog-images', 'blog-images', true) on conflict (id) do nothing;

-- Storage Policies
-- Product images public read
drop policy if exists "Public read product images" on storage.objects;
create policy "Public read product images" on storage.objects for select using (bucket_id = 'product-images');
drop policy if exists "Public read product gallery" on storage.objects;
create policy "Public read product gallery" on storage.objects for select using (bucket_id = 'product-gallery');
drop policy if exists "Public read blog images" on storage.objects;
create policy "Public read blog images" on storage.objects for select using (bucket_id = 'blog-images');

-- Authenticated uploads
drop policy if exists "Authenticated upload product images" on storage.objects;
create policy "Authenticated upload product images" on storage.objects for insert with check (bucket_id = 'product-images');
drop policy if exists "Authenticated upload product gallery" on storage.objects;
create policy "Authenticated upload product gallery" on storage.objects for insert with check (bucket_id = 'product-gallery');
drop policy if exists "Authenticated upload blog images" on storage.objects;
create policy "Authenticated upload blog images" on storage.objects for insert with check (bucket_id = 'blog-images');

-- 5. RLS (Row Level Security) - FIXED: Safe policy recreation to avoid recursion
-- Disable RLS first, then recreate cleanly

alter table products disable row level security;
alter table posts disable row level security;
alter table contacts disable row level security;

-- Public reads
drop policy if exists "Public read products" on products;
create policy "Public read products" on products for select using (true);

drop policy if exists "Public read published posts" on posts;
create policy "Public read published posts" on posts for select using (published = true);

drop policy if exists "Public insert contacts" on contacts;
create policy "Public insert contacts" on contacts for insert with check (true);

-- Admin policies (authenticated) - simplified to prevent recursion
drop policy if exists "authenticated_insert_products" on products;
create policy "authenticated_insert_products" on products for insert with check (auth.role() = 'authenticated');

drop policy if exists "authenticated_update_products" on products;
create policy "authenticated_update_products" on products for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "authenticated_delete_products" on products;
create policy "authenticated_delete_products" on products for delete using (auth.role() = 'authenticated');

-- Same for posts/contacts (added insert/update policies)
drop policy if exists "authenticated_insert_posts" on posts;
create policy "authenticated_insert_posts" on posts for insert with check (auth.role() = 'authenticated');

drop policy if exists "authenticated_update_posts" on posts;
create policy "authenticatedo_update_posts" on posts for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');

drop policy if exists "authenticated_delete_posts" on posts;
create policy "authenticated_delete_posts" on posts for delete using (auth.role() = 'authenticated');

drop policy if exists "authenticated_select_contacts" on contacts;
create policy "authenticated_select_contacts" on contacts for select using (auth.role() = 'authenticated');

drop policy if exists "authenticated_delete_contacts" on contacts;
create policy "authenticated_delete_contacts" on contacts for delete using (auth.role() = 'authenticated');

-- Re-enable RLS
alter table products enable row level security;
alter table posts enable row level security;
alter table contacts enable row level security;

-- Service role bypass for admin scripts (prevents policy recursion)
create policy "service_role_all_products" on products for all to service_role using (true) with check (true);

-- OLD DUPLICATE POLICIES REMOVED - Use new simplified policies above to prevent recursion

-- 6. TIMESTAMP TRIGGER
create or replace function handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists products_updated_trigger on products;
drop trigger if exists posts_updated_trigger on posts;

create trigger products_updated_trigger
before update on products
for each row execute procedure handle_updated_at();

create trigger posts_updated_trigger
before update on posts
for each row execute procedure handle_updated_at();

-- 7. CONTACT FORM EDGE FUNCTION (Optional - for email notifications)
-- Create in Edge Functi ons tab: send-contact-email
