import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const createFallbackClient = (): SupabaseClient => {
  const data = { data: [], error: null };
  const chain = {
    select: () => chain,
    limit: () => chain,
    eq: () => chain,
    ilike: () => chain,
    or: () => chain,
    single: () => chain,
    then: (onFulfilled: any, onRejected: any) => Promise.resolve(data).then(onFulfilled, onRejected),
    catch: (onRejected: any) => Promise.resolve(data).catch(onRejected),
  } as unknown as SupabaseClient;
  return {
    from: () => chain,
  } as unknown as SupabaseClient;
};

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials missing. Please check your .env file. Running in fallback mode.');
}

export const supabase: SupabaseClient =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : createFallbackClient();
