-- Supabase setup script for Ngọc Nhất Linh app
-- 1. Tạo bảng products và posts
-- 2. Seed dữ liệu mẫu

-- Create products table
create table if not exists products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
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
  author text,
  image_url text,
  category text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table posts add column if not exists image_url text;
alter table posts add column if not exists category text;

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

-- Optional: ensure extension for uuid
create extension if not exists "uuid-ossp";
create extension if not exists pgcrypto;

-- Seed products
insert into products (name, description, price, image_url, images, category, menh, specs, meaning)
values
('Vòng Tay Thạch Anh Tóc Vàng 12ly','Pháp bảo chiêu tài, dẫn lộc và gia tăng vượng khí.','4500000','https://picsum.photos/seed/gem1/600/600','["https://picsum.photos/seed/gem1a/200/200","https://picsum.photos/seed/gem1b/200/200"]','Vòng tay','Kim','{"material":"Thạch anh tóc vàng tự nhiên","size":"12 ly","count":"17-18 hạt","certification":"SJC / PNJ Lab"}','Thạch anh tóc vàng tăng tài lộc, bình an.'),
('Mặt Dây Chuyền Cẩm Thạch Sơn Thủy','Ngọc cẩm thạch từ tự nhiên giúp cân bằng năng lượng.','12800000','https://picsum.photos/seed/gem2/600/600','["https://picsum.photos/seed/gem2a/200/200","https://picsum.photos/seed/gem2b/200/200"]','Mặt dây','Mộc','{"material":"Cẩm thạch tự nhiên","size":"M","count":"1","certification":"PNJ"}','Thu hút may mắn, ý nghĩa thanh tịnh.'),
('Vòng Tay Aquamarine Hải Lam Ngọc','Đá quý Aquamarine đem lại sự an yên cho chủ nhân.','6200000','https://picsum.photos/seed/gem3/600/600','["https://picsum.photos/seed/gem3a/200/200","https://picsum.photos/seed/gem3b/200/200"]','Vòng tay','Thủy','{"material":"Aquamarine tự nhiên","size":"12 ly","count":"17-18 hạt","certification":"SJC"}','Hỗ trợ giao tiếp, thăng tiến công danh.'),
('Thiềm Thừ Ngọc Hoàng Long Tự Nhiên','Linh vật chiêu tài phong thủy.','25000000','https://picsum.photos/seed/gem4/600/600','["https://picsum.photos/seed/gem4a/200/200","https://picsum.photos/seed/gem4b/200/200"]','Vật phẩm','Hỏa','{"material":"Ngọc hoàng long","size":"L","count":"1","certification":"PNJ"}','Tăng tài vận, xua đuổi hung khí.'),
('Vòng Tay Thạch Anh Tím Khói','Thạch anh tím thạch anh khói tăng tư duy và trực giác.','3200000','https://picsum.photos/seed/gem5/600/600','["https://picsum.photos/seed/gem5a/200/200","https://picsum.photos/seed/gem5b/200/200"]','Vòng tay','Thổ','{"material":"Thạch anh tím khói","size":"12 ly","count":"17-18 hạt","certification":"SJC"}','Cân bằng cảm xúc, hóa giải tiêu cực.'),
('Tượng Di Lặc Đá Citrine','Tượng phật Di Lặc với đá Citrine mang đến niềm vui.','8500000','https://picsum.photos/seed/gem6/600/600','["https://picsum.photos/seed/gem6a/200/200","https://picsum.photos/seed/gem6b/200/200"]','Tượng phật','Kim','{"material":"Citrine","size":"30cm","count":"1","certification":"PNJ"}','Thu hút tiền tài, an lạc gia đình.');

-- Seed blog posts
delete from posts;
insert into posts (title, slug, content, author, image_url, category)
values
('Phong Thủy Cho Nhà Ở','phong-thuy-cho-nha-o','Nội dung bài viết phong thủy cho nhà ở...', 'Admin','https://picsum.photos/seed/blog1/1200/600','Phong thủy'),
('Chọn Đá Phong Thủy Theo Mệnh','chon-da-phong-thuy-theo-menh','Hướng dẫn chọn đá phong thủy ứng với ngũ hành...', 'Admin','https://picsum.photos/seed/blog2/1200/600','Phong thủy'),
('Cách Bảo Quản Trang Sức Đá Quý','cach-bao-quan-trang-suc-da-quy','Mẹo giữ gìn trang sức đá quý luôn sáng bóng...', 'Admin','https://picsum.photos/seed/blog3/1200/600','Bảo quản');

-- Storage buckets for product images\n-- Create buckets\ncreate bucket if not exists \"product-images\";\ncreate bucket if not exists \"product-gallery\";\n\n-- Public access policies\ncreate policy \"Public read product-images\" on storage.objects for select using ( bucket_id = 'product-images' );\ncreate policy \"Public read product-gallery\" on storage.objects for select using ( bucket_id = 'product-gallery' );\n\n-- Insert/update policies (admin only, adjust RLS)\ncreate policy \"Users upload product-images\" on storage.objects for insert with check ( bucket_id = 'product-images' );\ncreate policy \"Users upload product-gallery\" on storage.objects for insert with check ( bucket_id = 'product-gallery' );\ncreate policy \"Users update product images\" on storage.objects for update using ( bucket_id = 'product-images' ) with check ( bucket_id = 'product-images' );\ncreate policy \"Users update product gallery\" on storage.objects for update using ( bucket_id = 'product-gallery' ) with check ( bucket_id = 'product-gallery' );\n\n-- Update timestamp trigger\ncreate or replace function set_updated_at()\nreturns trigger as $$\nbegin\n  new.updated_at = now();\n  return new;\nend;\n$$ language plpgsql;\n\n-- Remove existing triggers if they exist (to allow re-running script)\ndrop trigger if exists products_updated_at on products;\ndrop trigger if exists posts_updated_at on posts;\n\ncreate trigger products_updated_at\nbefore update on products\nfor each row\nexecute procedure set_updated_at();\n\ncreate trigger posts_updated_at\nbefore update on posts\nfor each row\nexecute procedure set_updated_at();
