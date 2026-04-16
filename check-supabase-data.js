import { createClient } from '@supabase/supabase-js';

const url = 'https://vwdriocchpkvolkzbqmn.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ3ZHJpb2NjaHBrdm9sa3picW1uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3NDg0MzEsImV4cCI6MjA4OTMyNDQzMX0.k7IcBWg8hlod9cL0ESXNXEM2IUiFibpGGVOviCvHFtc';

const supabase = createClient(url, key);

async function run() {
  console.log('Checking Supabase connectivity...');
  const [products, posts] = await Promise.all([
    supabase.from('products').select('*').limit(5),
    supabase.from('posts').select('*').limit(5)
  ]);

  console.log('products fetch:', products.error ? products.error : `${products.data.length} rows`);
  console.log('posts fetch:', posts.error ? posts.error : `${posts.data.length} rows`);

  if (products.error || posts.error) {
    process.exit(1);
  }
  console.log('Supabase fetch OK.');
}

run().catch((err) => {
  console.error('Unexpected error', err);
  process.exit(1);
});