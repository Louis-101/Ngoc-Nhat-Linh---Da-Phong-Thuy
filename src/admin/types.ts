import { Product, Post } from '../types/product';

// Admin-specific types (extended for forms/tables)
export interface AdminProduct extends Omit<Product, 'created_at' | 'updated_at'> {
  stock?: number;
  specs?: Record<string, any>;
  images?: string[];
  created_at?: string;
  updated_at?: string;
}

export interface AdminPost extends Omit<Post, 'created_at' | 'updated_at'> {
  excerpt?: string;
  published?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface AdminContact {
  id: string;
  name: string;
  email?: string;
  phone: string;
  message: string;
  ip_address?: string;
  created_at: string;
}

// Form states
export interface ProductFormData {
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
  menh?: string;
  meaning?: string;
  stock?: number;
}

export interface PostFormData {
  title: string;
  slug: string;
  content: string;
  image_url: string;
  category: string;
  author: string;
  published: boolean;
}

export interface ContactFormData {
  // Read-only for admin
}
