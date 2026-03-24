# TODO: Fix White Screen & Vercel Deployment for Ngọc Nhất Linh

## Progress
- [x] **Analyzed project** (files, build, Supabase, configs)
- [x] **1. Create .env.example** (env vars for Vercel)
- [x] **2. Update supabaseClient.ts** (graceful handling, lazy init)
- [x] **3. Update main.tsx** (Suspense, StrictMode toggle)
- [x] **4. Update App.tsx** (loading fallback)
- [x] **5. Optimize vite.config.ts** (remove unused, chunking)
- [ ] **6. Update vercel.json** (headers, caching)
- [ ] **7. Add page-level error handling** (Home/Products)
- [ ] **8. Test local build/preview**
- [ ] **9. Vercel env vars & deploy**
- [ ] **10. Verify live site**
- [ ] **7. Fix Home.tsx & Products.tsx** (per-page error handling)
- [ ] **8. Test build & preview locally**
- [ ] **9. User sets Vercel env vars**
- [ ] **10. Deploy & verify**

## Commands to Run
```bash
npm run build
npm run preview  # http://localhost:4173
```

**Next Step**: Optimize vite.config.ts.
- [ ] **5. Optimize vite.config.ts** (remove unused, chunking)
- [ ] **6. Update vercel.json** (headers, caching)
- [ ] **7. Fix Home.tsx & Products.tsx** (per-page error handling)
- [ ] **8. Test build & preview locally**
- [ ] **9. User sets Vercel env vars**
- [ ] **10. Deploy & verify**

## Commands to Run
```bash
npm run build
npm run preview  # http://localhost:4173
```

**Next Step**: Update supabaseClient.ts for graceful Supabase handling.
