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
  specs jsonb,
  meaning text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Create posts table (blog)
create table if not exists posts (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text unique not null,
  content text,
  author text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

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
insert into products (name, description, price, image_url, category, specs, meaning)
values
('Vòng Tay Thạch Anh Tóc Vàng 12ly','Pháp bảo chiêu tài, dẫn lộc và gia tăng vượng khí.','4500000','https://picsum.photos/seed/gem1/600/600','Vòng tay','{"material":"Thạch anh tóc vàng tự nhiên","size":"12 ly","count":"17-18 hạt","certification":"SJC / PNJ Lab"}','Thạch anh tóc vàng tăng tài lộc, bình an.'),
('Mặt Dây Chuyền Cẩm Thạch Sơn Thủy','Ngọc cẩm thạch từ tự nhiên giúp cân bằng năng lượng.','12800000','https://picsum.photos/seed/gem2/600/600','Mặt dây','{"material":"Cẩm thạch tự nhiên","size":"M","count":"1","certification":"PNJ"}','Thu hút may mắn, ý nghĩa thanh tịnh.'),
('Vòng Tay Aquamarine Hải Lam Ngọc','Đá quý Aquamarine đem lại sự an yên cho chủ nhân.','6200000','https://picsum.photos/seed/gem3/600/600','Vòng tay','{"material":"Aquamarine tự nhiên","size":"12 ly","count":"17-18 hạt","certification":"SJC"}','Hỗ trợ giao tiếp, thăng tiến công danh.'),
('Thiềm Thừ Ngọc Hoàng Long Tự Nhiên','Linh vật chiêu tài phong thủy.','25000000','https://picsum.photos/seed/gem4/600/600','Vật phẩm','{"material":"Ngọc hoàng long","size":"L","count":"1","certification":"PNJ"}','Tăng tài vận, xua đuổi hung khí.'),
('Vòng Tay Thạch Anh Tím Khói','Thạch anh tím thạch anh khói tăng tư duy và trực giác.','3200000','https://picsum.photos/seed/gem5/600/600','Vòng tay','{"material":"Thạch anh tím khói","size":"12 ly","count":"17-18 hạt","certification":"SJC"}','Cân bằng cảm xúc, hóa giải tiêu cực.'),
('Tượng Di Lặc Đá Citrine','Tượng phật Di Lặc với đá Citrine mang đến niềm vui.','8500000','https://picsum.photos/seed/gem6/600/600','Tượng phật','{"material":"Citrine","size":"30cm","count":"1","certification":"PNJ"}','Thu hút tiền tài, an lạc gia đình.');

-- Seed blog posts
delete from posts;
insert into posts (title, slug, content, author)
values
('Phong Thủy Cho Nhà Ở','phong-thuy-cho-nha-o','Nội dung bài viết phong thủy cho nhà ở...', 'Admin'),
('Chọn Đá Phong Thủy Theo Mệnh','chon-da-phong-thuy-theo-menh','Hướng dẫn chọn đá phong thủy ứng với ngũ hành...', 'Admin'),
('Cách Bảo Quản Trang Sức Đá Quý','cach-bao-quan-trang-suc-da-quy','Mẹo giữ gìn trang sức đá quý luôn sáng bóng...', 'Admin');

-- Update timestamp trigger
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Remove existing triggers if they exist (to allow re-running script)
drop trigger if exists products_updated_at on products;
drop trigger if exists posts_updated_at on posts;

create trigger products_updated_at
before update on products
for each row
execute procedure set_updated_at();

create trigger posts_updated_at
before update on posts
for each row
execute procedure set_updated_at();
