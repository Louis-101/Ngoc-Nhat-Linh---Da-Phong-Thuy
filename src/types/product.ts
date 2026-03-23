export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  image_url: string;
  category: string;
  meaning?: string;
  specs?: Record<string, string>;
  images?: string[];
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  content: string;
  image_url: string;
  author: string;
  category: string;
  created_at: string;
}

export interface DestinyResult {
  name: string;
  title: string;
  canChi: string;
  description: string;
  colors: string;
  stones: string;
  advice: string;
  userName?: string;
  year?: number | string;
}
