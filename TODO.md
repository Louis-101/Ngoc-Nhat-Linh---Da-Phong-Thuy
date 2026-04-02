# Admin Panel Implementation TODO

## Status: ✅ In Progress

**Legend**: ⏳ Pending | 🔄 Working | ✅ Done | ❌ Blocked

### Phase 1: Core Structure (Layout + Auth)
- [✅] **1.1** Create src/admin/layout/AdminLayout.tsx (sidebar, header, outlet, responsive luxury theme)
- [✅] **1.2** Create src/admin/hooks/useAdminAuth.ts (protected session logic)
- [✅] **1.3** Create src/admin/types.ts (AdminProduct, AdminPost, AdminContact interfaces)
- [✅] **1.4** Create src/admin/components/Sidebar.tsx
- [✅] **1.5** Create src/admin/components/Header.tsx

### Phase 2: Pages
- [✅] **2.1** src/admin/pages/Dashboard.tsx (stats, charts)
- [🔄] **2.2** src/admin/pages/ProductsAdmin.tsx (enhanced CRUD from existing)
- [ ] **2.2** src/admin/pages/ProductsAdmin.tsx (enhanced CRUD from existing)
- [ ] **2.3** src/admin/pages/BlogAdmin.tsx (posts CRUD + editor)
- [ ] **2.4** src/admin/pages/ContactsAdmin.tsx (read/delete)
- [ ] **2.5** Move/refactor src/admin/pages/Login.tsx (from src/pages/Login.tsx)

### Phase 3: Updates & Routing
- [ ] **3.1** Edit src/App.tsx (nested /admin/* routes + AdminLayout wrap + guards)
- [ ] **3.2** Edit src/service/imageService.ts (add uploadBlogImage, contacts if needed)
- [ ] **3.3** Edit src/types/product.ts (add AdminContact)
- [ ] **3.4** Deprecate src/pages/Admin.tsx (redirect to Dashboard)
- [ ] **3.5** Update tailwind.config.js/index.css if theme tweaks needed

### Phase 4: Testing & Polish
- [ ] **4.1** Test all routes/auth/CRUD (mock + real Supabase)
- [ ] **4.2** Responsive/mobile checks
- [ ] **4.3** Error handling, loading states, validations
- [ ] **4.4** Performance: pagination, real-time?
- [ ] **4.5** Final docs: setup guide, admin user creation

### Commands
```
npm run dev  # Test
npx supabase db push  # If schema changes (none planned)
```

