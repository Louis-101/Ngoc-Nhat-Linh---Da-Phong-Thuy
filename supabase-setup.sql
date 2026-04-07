-- Supabase setup script for Ngọc Nhất Linh app
-- 1. Tạo bảng products và posts
-- 2. Seed dữ liệu mẫu

-- Ensure extensions are enabled
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Create products table
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique,
  description text,
  price integer not null,
  image_url text,
  category text,
  menh text,
  specs jsonb,
  meaning text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Ensure column exists even on legacy table versions
alter table products add column if not exists menh text;

-- Create posts table (blog)
create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  content text,
  excerpt text,
  author text,
  image_url text,
  category text,
  published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table posts add column if not exists image_url text;
alter table posts add column if not exists category text;
alter table posts add column if not exists published boolean default true;

-- Add product gallery images for multiple photos
alter table products add column if not exists images jsonb;

-- Create contacts table (contact form)
create table if not exists contacts (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  email text not null,
  phone text not null,
  message text not null,
  created_at timestamptz default now()
);

-- Create notifications table
create table if not exists notifications (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  content text,
  created_at timestamptz default now()
);

-- Bật bảo mật RLS cho bảng contacts
alter table contacts enable row level security;
alter table products enable row level security;
alter table posts enable row level security;
alter table notifications enable row level security;

-- Cho phép khách gửi liên hệ (Insert)
drop policy if exists "Allow public insert contacts" on contacts;
create policy "Allow public insert contacts" on contacts for insert with check (true);

-- Chỉ Admin (người đã login) mới được xem liên hệ
drop policy if exists "Allow admin select contacts" on contacts;
create policy "Allow admin select contacts" on contacts for select using (auth.role() = 'authenticated');

-- Admin delete policies
drop policy if exists "Allow admin delete contacts" on contacts;
create policy "Allow admin delete contacts" on contacts for delete using (auth.role() = 'authenticated');
drop policy if exists "Allow admin delete products" on products;
create policy "Allow admin delete products" on products for delete using (auth.role() = 'authenticated');
drop policy if exists "Allow admin delete posts" on posts;
create policy "Allow admin delete posts" on posts for delete using (auth.role() = 'authenticated');

-- Thêm các quyền Insert/Update cho Products và Posts (Cần thiết để Admin hoạt động)
drop policy if exists "Allow admin insert products" on products;
create policy "Allow admin insert products" on products for insert with check (auth.role() = 'authenticated');
drop policy if exists "Allow admin update products" on products;
create policy "Allow admin update products" on products for update using (auth.role() = 'authenticated');
drop policy if exists "Allow admin select products" on products;
create policy "Allow admin select products" on products for select using (true);

drop policy if exists "Allow admin insert posts" on posts;
create policy "Allow admin insert posts" on posts for insert with check (auth.role() = 'authenticated');
drop policy if exists "Allow admin update posts" on posts;
create policy "Allow admin update posts" on posts for update using (auth.role() = 'authenticated');
drop policy if exists "Allow admin select posts" on posts;
create policy "Allow admin select posts" on posts for select using (auth.role() = 'authenticated');
create policy "Public read published posts" on posts for select using (published = true);

-- 1. Buckets Setup
insert into storage.buckets (id, name, public) values ('blog-images', 'blog-images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('product-images', 'product-images', true) on conflict (id) do nothing;
insert into storage.buckets (id, name, public) values ('product-gallery', 'product-gallery', true) on conflict (id) do nothing;

-- 2. Storage Policies Setup
-- Cho phép đọc (SELECT) công khai cho tất cả file trong storage
drop policy if exists "Public Access" on storage.objects;
create policy "Public Access" on storage.objects for select using (true);

-- Cho phép Admin (đã đăng nhập) có toàn quyền Thêm/Sửa/Xóa (INSERT/UPDATE/DELETE) cho các bucket cụ thể
drop policy if exists "Admin Manage Storage" on storage.objects;
create policy "Admin Manage Storage" on storage.objects for all 
using (auth.role() = 'authenticated' and bucket_id in ('product-images', 'product-gallery', 'blog-images')) 
with check (auth.role() = 'authenticated' and bucket_id in ('product-images', 'product-gallery', 'blog-images'));

-- Đảm bảo cột slug tồn tại để tránh lỗi 400 khi lưu từ Admin
ALTER TABLE products ADD COLUMN IF NOT EXISTS slug TEXT;

-- Seed products
insert into products (name, description, price, image_url, images, category, menh, specs, meaning)
values
('Vòng Tay Thạch Anh Tóc Vàng 12ly','Pháp bảo chiêu tài, dẫn lộc và gia tăng vượng khí.',4500000,'https://picsum.photos/seed/gem1/600/600','["https://picsum.photos/seed/gem1a/200/200","https://picsum.photos/seed/gem1b/200/200"]','Vòng tay','Kim','{"material":"Thạch anh tóc vàng tự nhiên","size":"12 ly","count":"17-18 hạt","certification":"SJC / PNJ Lab"}','Thạch anh tóc vàng tăng tài lộc, bình an.'),
('Mặt Dây Chuyền Cẩm Thạch Sơn Thủy','Ngọc cẩm thạch từ tự nhiên giúp cân bằng năng lượng.','12800000','https://picsum.photos/seed/gem2/600/600','["https://picsum.photos/seed/gem2a/200/200","https://picsum.photos/seed/gem2b/200/200"]','Mặt dây','Mộc','{"material":"Cẩm thạch tự nhiên","size":"M","count":"1","certification":"PNJ"}','Thu hút may mắn, ý nghĩa thanh tịnh.'),
('Vòng Tay Aquamarine Hải Lam Ngọc','Đá quý Aquamarine đem lại sự an yên cho chủ nhân.','6200000','https://picsum.photos/seed/gem3/600/600','["https://picsum.photos/seed/gem3a/200/200","https://picsum.photos/seed/gem3b/200/200"]','Vòng tay','Thủy','{"material":"Aquamarine tự nhiên","size":"12 ly","count":"17-18 hạt","certification":"SJC"}','Hỗ trợ giao tiếp, thăng tiến công danh.'),
('Thiềm Thừ Ngọc Hoàng Long Tự Nhiên','Linh vật chiêu tài phong thủy.','25000000','https://picsum.photos/seed/gem4/600/600','["https://picsum.photos/seed/gem4a/200/200","https://picsum.photos/seed/gem4b/200/200"]','Vật phẩm','Hỏa','{"material":"Ngọc hoàng long","size":"L","count":"1","certification":"PNJ"}','Tăng tài vận, xua đuổi hung khí.'),
('Vòng Tay Thạch Anh Tím Khói','Thạch anh tím thạch anh khói tăng tư duy và trực giác.','3200000','https://picsum.photos/seed/gem5/600/600','["https://picsum.photos/seed/gem5a/200/200","https://picsum.photos/seed/gem5b/200/200"]','Vòng tay','Thổ','{"material":"Thạch anh tím khói","size":"12 ly","count":"17-18 hạt","certification":"SJC"}','Cân bằng cảm xúc, hóa giải tiêu cực.');
