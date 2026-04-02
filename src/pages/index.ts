export interface AdminProduct {
  id: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  description: string;
  menh?: string;
  meaning?: string;
  stock?: number;
  created_at?: string;
}

export interface AdminPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  category: string;
  author: string;
  published: boolean;
  created_at?: string;
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

export type ProductFormData = Omit<AdminProduct, 'id' | 'created_at'>;
export type PostFormData = Omit<AdminPost, 'id' | 'created_at'>;