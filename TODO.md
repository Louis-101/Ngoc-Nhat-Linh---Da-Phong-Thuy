# TODO: Vercel Environments Setup for Ngọc Nhất Linh (Completed Steps)

## Progress (Updated for Vercel Setup)
- [x] **Analyzed project** (Vite/React SPA, Supabase, Vercel-ready)
- [x] **1. Create .env.example** (VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY)
- [x] **2. Update supabaseClient.ts** (graceful mock fallback)
- [x] **5. Optimize vite.config.ts** (chunking, aliases done)
- [x] **6. Update vercel.json** (enhanced headers, caching)
- [x] **8. Test local build/preview** (run `npm run build &amp;&amp; npm run preview`)

**Remaining App Tasks:**
- [ ] **7. Add page-level error handling** (Home/Products)
- [ ] **10. Verify live site** (after deploy)

## Vercel Environments Setup (User Steps - No Code Changes Needed)
Follow these **exact steps** for Local/Preview/Production:

### 1. Vercel CLI (Local/Global)
```
npm i -g vercel  # Optional: global install
```

### 2. Login & Link Project
```
vercel login  # Or npx vercel login
vercel link   # Links to Vercel project (creates if new)
```

### 3. Add Env Vars on Vercel Dashboard/CLI
**Required vars** (add to **all environments**: Production, Preview, Development):
- `VITE_SUPABASE_URL` = your_supabase_project_url
- `VITE_SUPABASE_ANON_KEY` = your_supabase_anon_public_key

**CLI alternative:**
```
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
```
(Select environments when prompted)

### 4. Local Development (Pull Envs)
```
vercel env pull .env.local  # Creates .env.local with vars
npm run dev  # Test locally: http://localhost:3000
```

### 5. Test Preview Locally
```
npm run build
npm run preview  # http://localhost:4173
```

### 6. Deploy Preview (Non-Prod)
```
vercel  # Deploys to preview URL (unique per deploy)
```
Or push to non-main branch / open PR (auto-preview).

### 7. Deploy Production
```
vercel --prod  # Updates production domain
```
Or push/merge to main branch (auto-prod).

### 8. Verify
- Check console logs for 'Supabase client initialized'.
- Test product fetches, auth, etc. on preview/prod URLs.
- Monitor Vercel dashboard: Deployments > Environments.

**Custom Environments** (Pro/Enterprise): Create via dashboard if needed (e.g., staging).

## Next: Deploy & Test!
Run the commands above. Preview URL appears after `vercel`. Ping me with deploy URL/logs if issues.
