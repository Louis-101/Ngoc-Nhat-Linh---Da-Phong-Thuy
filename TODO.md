# Code Fix & Vercel Deploy Plan

**Current Status (Critical):**
- ❌ App.tsx, Navbar.tsx: Import syntax broken (incomplete `import` statements)
- ❌ TypeScript: 5+ errors
- ❌ Vite dev: Parse errors, site not rendering
- ✅ GitHub pushed, Vercel.json ready
- ✅ main.tsx OK, Home.tsx OK (other pages likely OK)

**Step 1: Fix Syntax (Highest Priority)**
```
git checkout -- src/App.tsx src/components/Navbar.tsx src/pages/ProductDetail.tsx src/index.css
```
- Restore from git to remove broken edits

**Step 2: Test**
```
npm run lint
npm run dev
```
Expected: No errors, site loads http://localhost:3000

**Step 3: Vercel Deploy**
```
git add .
git commit -m "Fix syntax errors, ready for Vercel"
git push origin main
vercel --prod
```
→ Deploy to https://www.daphongthuyngocnhatlinh.com/

**Supabase Warning:** Add .env:
```
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
```

**Run these commands to fix NOW:**
1. `git checkout -- src/App.tsx src/components/Navbar.tsx`
2. `npm run dev`

