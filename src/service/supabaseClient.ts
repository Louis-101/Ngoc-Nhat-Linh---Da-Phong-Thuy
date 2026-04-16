import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseClient: ReturnType<typeof createClient> | null = null;

if (!supabaseUrl || !supabaseAnonKey || !supabaseUrl.startsWith('http')) {
  console.warn('Supabase credentials missing/invalid. Using mock client. Check .env.local / Vercel dashboard.');
} else {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized');
  } catch (error) {
    console.error('Failed to init Supabase:', error);
  }
}

// Mock data for fallback
const mockProducts = [
  { id: 1, name: 'Vòng Tay Thạch Anh Tóc Vàng 12ly', price: 4500000, image_url: 'https://picsum.photos/seed/gem1/600/600', category: 'Vòng tay', menh: 'Hỏa', created_at: new Date().toISOString() },
  { id: 2, name: 'Mặt Dây Chuyền Cẩm Thạch Sơn Thủy', price: 12800000, image_url: 'https://picsum.photos/seed/gem2/600/600', category: 'Mặt dây', menh: 'Thủy', created_at: new Date(Date.now() - 86400000).toISOString() },
  { id: 3, name: 'Vòng Tay Aquamarine Hải Lam Ngọc', price: 6200000, image_url: 'https://picsum.photos/seed/gem3/600/600', category: 'Vòng tay', menh: 'Thủy', created_at: new Date().toISOString() },
  { id: 4, name: 'Thiềm Thừ Ngọc Hoàng Long Tự Nhiên', price: 25000000, image_url: 'https://picsum.photos/seed/gem4/600/600', category: 'Vật phẩm', menh: 'Thổ', created_at: new Date(Date.now() - 172800000).toISOString() },
];

const mockPosts = [
  { id: 1, title: 'Cách chọn vòng tay phong thủy theo mệnh', slug: 'chon-vong-tay-phong-thuy', excerpt: 'Hướng dẫn chi tiết cách chọn vòng tay đá quý phù hợp với từng mệnh...', image_url: 'https://picsum.photos/seed/post1/800/500', author: 'Ngọc Nhất Linh', created_at: new Date().toISOString() },
  { id: 2, title: 'Thạch anh tóc vàng - Bí mật năng lượng thịnh vượng', slug: 'thach-anh-toc-vang', excerpt: 'Khám phá nguồn gốc và ý nghĩa phong thủy của thạch anh tóc vàng...', image_url: 'https://picsum.photos/seed/post2/800/500', author: 'Chuyên gia', created_at: new Date(Date.now() - 86400000).toISOString() },
];

// Chainable mock query builder
class MockQuery {
  table: string;
  filters: any[] = [];
  sorts: any[] = [];
  limitVal = Infinity;
  offsetVal = 0;
  countMode = false;

  constructor(table: string) {
    this.table = table;
  }

  eq(field: string, value: string) {
    this.filters.push({ type: 'eq', field, value });
    return this;
  }

  ilike(field: string, pattern: string) {
    this.filters.push({ type: 'ilike', field, pattern: pattern.replace(/%/g, '') });
    return this;
  }

  or(conditions: string) {
    this.filters.push({ type: 'or', conditions });
    return this;
  }

  lte(field: string, value: number) {
    this.filters.push({ type: 'lte', field, value });
    return this;
  }

  gte(field: string, value: number) {
    this.filters.push({ type: 'gte', field, value });
    return this;
  }

  order(field: string, { ascending }: { ascending: boolean }) {
    this.sorts.push({ field, ascending });
    return this;
  }

  limit(n: number) {
    this.limitVal = n;
    return this;
  }

  range(from: number, to: number) {
    this.offsetVal = from;
    this.limitVal = to - from + 1;
    return this;
  }

  single() {
    this.limitVal = 1;
    return this;
  }

  select(fields?: string, opts?: { count: 'exact' }) {
    this.countMode = opts?.count === 'exact';
    return this;
  }

  async then(onFulfilled?: any, onRejected?: any): Promise<any> {
    // Mock exec - type-safe by table
    let data: any[] = [];
    if (this.table === 'products') {
      data = [...mockProducts];
    } else if (this.table === 'posts') {
      data = [...mockPosts];
    }

    // Apply all filters
    data = data.filter((item: any) => {
      for (const f of this.filters) {
        if (f.type === 'eq' && item[f.field] !== f.value) return false;
        if (f.type === 'ilike') {
          const val = (item[f.field] || '').toString().toLowerCase();
          const search = f.pattern.toLowerCase();
          if (!val.includes(search)) return false;
        }
        if (f.type === 'or') return true;
        if (f.type === 'lte' && (item[f.field] as number) > f.value) return false;
        if (f.type === 'gte' && (item[f.field] as number) < f.value) return false;
      }
      return true;
    });

    // Sort
    if (this.sorts.length > 0) {
      data.sort((a, b) => {
        for (const s of this.sorts) {
          const va = a[s.field], vb = b[s.field];
          if (va < vb) return s.ascending ? -1 : 1;
          if (va > vb) return s.ascending ? 1 : -1;
        }
        return 0;
      });
    }

    // Paginate
    const start = this.offsetVal;
    const end = Math.min(start + this.limitVal, data.length);
    data = data.slice(start, end);

    const count = this.countMode ? data.length : null; // simplistic

    return Promise.resolve({ data, error: null, count });
  }
}

const mockSupabase = {
  from: (table: string) => ({
    select: (...args: any[]) => new MockQuery(table),
    insert: async (data: any[]) => Promise.resolve({ data, error: null }),
    update: (data: any) => ({
      eq: (field: string, val: any) => Promise.resolve({ data, error: null })
    }),
    delete: () => ({
      eq: (field: string, val: any) => Promise.resolve({ error: null }),
      in: (field: string, vals: any[]) => Promise.resolve({ error: null })
    }),
    storage: {
      from: (bucket: string) => ({
        upload: async (path: string, file: File, options?: any) => {
          console.log('Mock upload', path);
          return { data: { path }, error: null };
        },
        getPublicUrl: (path: string) => ({ 
          data: { publicUrl: `https://dummy.storage/${path}?w=600` } 
        }),
      }),
    },
  }) as any,
  auth: {
    signInWithPassword: async () => Promise.resolve({ data: { session: {}, user: {} }, error: null }),
    signOut: async () => Promise.resolve({ error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    getSession: async () => Promise.resolve({ data: { session: null }, error: null }),
  },
  isReady: () => false,
  getError: () => 'Supabase not configured - using mock with sample data',
} as any;

export const supabase = supabaseClient ?? mockSupabase;
