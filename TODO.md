# New Task: Fix Footer & Improve Products Filter/Sort

**Issues:**
- Footer: lỗi hiển thị nhiều số 1 (kiểm tra runtime/products pagination?)
- Products page: thêm filter/sort rõ ràng "Giá cao → thấp", "Giá thấp → cao", "Mới nhất", "Cũ nhất"

**Plan steps:**
- [x] Step 1: Read Products.tsx pagination code & inspect footer runtime ✅
- [x] Step 2: Fix pagination bug (multiple 1's if few pages) ✅
- [x] Step 3: Add explicit sort options dropdown (Giá cao/thấp, Mới/Cũ) ✅
- [x] Step 4: Test filters work with Supabase query ✅
- [ ] Step 5: Git branch/PR new changes
