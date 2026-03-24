import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabaseClient: ReturnType<typeof createClient> | null = null;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Using mock client. Check .env / Vercel dashboard.');
} else {
  try {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client initialized');
  } catch (error) {
    console.error('Failed to init Supabase:', error);
  }
}

export const supabase = {
  ...(supabaseClient || {}),
  // Graceful fallbacks for common ops
  from: (table: string) => ({
    select: async () => ({ data: [], error: { message: 'Supabase unavailable' }, count: 0 }),
    insert: async () => ({ data: [], error: { message: 'Supabase unavailable' } }),
    update: async () => ({ data: [], error: { message: 'Supabase unavailable' } }),
    storage: {
      from: () => ({
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
      }),
    },
  } as any),
  
  isReady: () => !!supabaseClient,
  
  getError: () => !supabaseClient ? 'Supabase not configured' : undefined,
};

