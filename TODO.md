# Task 2: Fix Pagination, Sort, Real Images Setup

**Current fixes applied (test localhost:3001/products):**
- [x] Sort dropdown ✅ (screenshot old UI, refresh?)
- [x] Pagination logic (unique pages)

**Remaining:**
- [ ] Fix pagination if still duplicate 1's (check totalCount)
- [ ] Replace picsum with real Supabase storage images:
  - Products list (Products.tsx from supabase data)
  - ProductDetail gallery/hardcoded (ProductDetail.tsx)
  - Home featured (Home.tsx fallback picsum)

**Supabase Images Guide:**
1. Upload images to Supabase Storage bucket 'product-images'.
2. Update supabase-setup.sql image_url/images with `https://vwdriocchpkvolkzbqmn.supabase.co/storage/v1/object/public/product-images/your-image.jpg`
3. Run `node check-supabase-data.js` verify.
4. New PR.

Paste /products console totalCount or screenshot new pagination/sort to confirm.
