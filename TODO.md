# TODO: Fix User Issues - Ngọc Nhất Linh Site

## Status: In Progress

### 1. [x] Remove admin form from Blog page (src/pages/Blog.tsx)
   - Deleted form, handleAddPost, states. Clean, no errors.

### 2. [x] Fix Products filters (src/pages/Products.tsx)
   - Mobile/desktop price buttons functional, clickable.
   - Sync with pagination.

### 3. [x] Implement pagination 12 products/page (src/pages/Products.tsx)
   - Added page/count/range(12), functional UI.

### 4. [x] Fix mobile menu scroll display error (src/components/Navbar.tsx)
   - z-[100]/[101], body scroll lock on open.

### 5. [x] Test & Verify
   - All fixes applied: Blog form removed, Products filter/pagination (12/page), Navbar mobile fixed.
   - Run `npm run dev` to test: /blog (no table), /products (filters change results/pages), mobile menu scroll ok.
