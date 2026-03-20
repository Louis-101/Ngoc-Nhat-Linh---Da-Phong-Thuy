import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Filter, ChevronDown, Search, X } from 'lucide-react';
import { uploadProductImage } from '../service/imageService';
import { supabase } from '../service/supabaseClient';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [activeMenh, setActiveMenh] = useState('Tất cả');
  const [priceRange, setPriceRange] = useState('Tất cả');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
const [sortBy, setSortBy] = useState('Mới nhất');

  const [searchParams] = useSearchParams();

  useEffect(() => {
    const q = searchParams.get('search') || '';
    setSearchQuery(q);
  }, [searchParams]);

  const menhOptions = ['Tất cả', 'Kim', 'Mộc', 'Thủy', 'Hỏa', 'Thổ'];

const [showAdminForm, setShowAdminForm] = useState(false);
const [adminProduct, setAdminProduct] = useState({
  name: '',
  description: '',
  price: '',
  category: '',
  menh: '',
  specs: '{}',
  meaning: '',
});
const [imageFile, setImageFile] = useState(null);
const [galleryFiles, setGalleryFiles] = useState([]);

import { uploadProductImage } from '../service/imageService';

const handleAdminSubmit = async (e) => {
  e.preventDefault();
  try {
    const newProduct = { ...adminProduct, price: parseInt(adminProduct.price) };
    const { data, error } = await supabase.from('products').insert([newProduct]).select();
    if (error) throw error;

    const productId = data[0].id;
    if (imageFile) {
      const imageUrl = await uploadProductImage(imageFile, productId);
      if (imageUrl) {
        await supabase.from('products').update({ image_url: imageUrl }).eq('id', productId);
      }
    }
    // Update gallery similarly...
    setShowAdminForm(false);
    setAdminProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      menh: '',
      specs: '{}',
      meaning: '',
    });
    // Refetch products
    window.location.reload();
  } catch (error) {
    console.error('Admin submit error:', error);
  }
};

  const categories = ['Tất cả', 'Vòng tay', 'Mặt dây', 'Tượng phật', 'Vật phẩm', 'Linh vật', 'Bi ngọc'];
  const priceRanges = ['Tất cả', 'Dưới 1 triệu', '1 - 5 triệu', '5 - 10 triệu', 'Trên 10 triệu'];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      setErrorMsg('');

      const pageSize = 12;
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize - 1;

      try {
        let query = supabase
          .from('products')
          .select('*', { count: 'exact' });

        if (activeCategory !== 'Tất cả') {
          query = query.eq('category', activeCategory);
        }
        if (activeMenh !== 'Tất cả') {
          query = query.eq('menh', activeMenh);
        }
        if (searchQuery.trim()) {
          query = query.or(`name.ilike.%${searchQuery.trim()}%,description.ilike.%${searchQuery.trim()}%`);
        }

        if (priceRange !== 'Tất cả') {
          if (priceRange === 'Dưới 1 triệu') query = query.lte('price', 1000000);
          if (priceRange === '1 - 5 triệu') query = query.gte('price', 1000000).lte('price', 5000000);
          if (priceRange === '5 - 10 triệu') query = query.gte('price', 5000000).lte('price', 10000000);
          if (priceRange === 'Trên 10 triệu') query = query.gte('price', 10000000);
        }

  if (sortBy === 'Giá thấp → cao') {
          query = query.order('price', { ascending: true });
        } else if (sortBy === 'Giá cao → thấp') {
          query = query.order('price', { ascending: false });
        } else if (sortBy === 'Cũ nhất') {
          query = query.order('created_at', { ascending: true });
        } else {
          query = query.order('created_at', { ascending: false });
        }

        query = query.range(from, to);

        const { data, error, count } = await query;
        console.log('Supabase products query:', { data, count, error });

        if (error) {
          throw error;
        }

        setProducts(data || []);
        setTotalCount(count || 0);
      } catch (err: any) {
        console.error('Error fetching products:', err);
        setProducts([]);
        setTotalCount(0);
        setErrorMsg('Không thể tải sản phẩm. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [activeCategory, activeMenh, priceRange, searchQuery, currentPage, sortBy]);




  return (
    <div className="pt-24 pb-20 bg-white bg-pattern-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-secondary">Danh Mục Sản Phẩm</h1>
          <p className="text-gray-500 max-w-2xl mx-auto font-light">
            Khám phá bộ sưu tập đá quý phong thủy tuyển chọn, mang năng lượng tinh khiết từ thiên nhiên.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Mobile Filter Toggle */}
          <div className="lg:hidden fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="bg-secondary text-white px-8 py-4 rounded-full shadow-2xl flex items-center space-x-3 font-bold text-sm border border-white/10 backdrop-blur-md"
            >
              <Filter size={18} className={isFilterOpen ? 'text-primary' : ''} />
              <span>{isFilterOpen ? 'ĐÓNG BỘ LỌC' : 'BỘ LỌC SẢN PHẨM'}</span>
            </button>
          </div>

          {/* Mobile Filter Sidebar */}
          <AnimatePresence>
            {isFilterOpen && (
              <>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsFilterOpen(false)}
                  className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-40 lg:hidden"
                />
                <motion.div 
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed left-0 top-0 bottom-0 w-[85%] max-w-xs bg-white z-50 lg:hidden shadow-2xl flex flex-col bg-pattern-subtle"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center p-8 border-b border-accent/20 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-2xl font-serif font-bold text-secondary">Bộ Lọc</h2>
                    <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-accent rounded-full transition-colors">
                      <X size={24} className="text-secondary" />
                    </button>
                  </div>
                  
                  {/* Scrollable Content */}
                  <div className="flex-grow overflow-y-auto p-8 space-y-10 relative">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-secondary/40 mb-6 border-b border-accent pb-2">Danh mục</h3>
                      <div className="space-y-3">
                        {categories.map((cat) => (
                          <button
                            key={cat}
                            onClick={() => {
                              setActiveCategory(cat);
                              setIsFilterOpen(false);
                            }}
                            className={`block w-full text-left py-2 text-lg transition-colors ${
                              activeCategory === cat ? 'text-primary font-bold' : 'text-secondary/60 hover:text-primary'
                            }`}
                          >
                            {cat}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-secondary/40 mb-6 border-b border-accent pb-2">Khoảng giá</h3>
                      <div className="space-y-3">
                        {priceRanges.slice(1).map((range) => (
                          <button
                            key={range}
                            onClick={() => {
                              setPriceRange(range);
                              setIsFilterOpen(false);
                            }}
                            className={`block w-full text-left py-2 text-lg transition-colors ${
                              priceRange === range ? 'text-primary font-bold' : 'text-secondary/60 hover:text-primary'
                            }`}
                          >
                            {range}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-secondary/40 mb-6 border-b border-accent pb-2">Theo mệnh</h3>
                      <div className="space-y-3">
                        {menhOptions.map((m) => (
                          <button
                            key={m}
                            onClick={() => {
                              setActiveMenh(m);
                              setIsFilterOpen(false);
                            }}
                            className={`block w-full text-left py-2 text-lg transition-colors ${
                              activeMenh === m ? 'text-primary font-bold' : 'text-secondary/60 hover:text-primary'
                            }`}
                          >
                            {m}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Bottom Shadow Indicator */}
                  <div className="h-8 bg-gradient-to-t from-black/5 to-transparent pointer-events-none absolute bottom-0 left-0 right-0 z-10"></div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Sidebar Filters (Desktop) */}
          <aside className="hidden lg:block lg:w-64 space-y-10">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-accent pb-2 text-secondary">Theo mệnh</h3>
              <div className="space-y-3">
                {menhOptions.map((m) => (
                  <button
                    key={m}
                    onClick={() => setActiveMenh(m)}
                    className={`block text-sm w-full text-left transition-colors ${activeMenh === m ? 'text-primary font-bold' : 'text-secondary/60 hover:text-primary'}`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-accent pb-2 text-secondary">Loại sản phẩm</h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`block text-sm transition-colors ${activeCategory === cat ? 'text-primary font-bold' : 'text-secondary/60 hover:text-primary'}`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-accent pb-2 text-secondary">Khoảng giá</h3>
              <div className="space-y-3">
                {priceRanges.map((range) => (
                  <button 
                    key={range}
                    onClick={() => setPriceRange(range)}
                    className={`block text-sm transition-colors ${priceRange === range ? 'text-primary font-bold' : 'text-secondary/60 hover:text-primary'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <p className="text-sm text-secondary/60">
                Hiển thị {(currentPage - 1) * 12 + 1} - {Math.min(currentPage * 12, totalCount)} trong {totalCount} sản phẩm
              </p>
              <button 
                onClick={() => setShowAdminForm(!showAdminForm)}
                className="ml-auto bg-gradient-gold text-secondary px-6 py-2 rounded-xl font-bold hover:shadow-lg transition-all text-sm"
              >
                {showAdminForm ? 'Đóng' : 'Thêm sản phẩm'}
              </button>
              <div className="flex items-center space-x-4 w-full sm:w-auto">
                <div className="relative flex-grow sm:flex-grow-0">
                  <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary/40" />
                  <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm sản phẩm..." 
                    className="pl-10 pr-4 py-2 border border-accent rounded-full text-sm focus:outline-none focus:border-primary w-full sm:w-64 bg-white/50 transition-all focus:bg-white"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary/40 hover:text-secondary transition-colors"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-3">
                  <label className="text-sm font-medium text-secondary whitespace-nowrap">Sắp xếp:</label>
                  <select 
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border border-accent px-4 py-2 rounded-full text-sm font-medium focus:outline-none focus:border-primary bg-white/50 hover:bg-white transition-all appearance-none bg-no-repeat bg-right"
                    style={{ backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e")` }}
                  >
                    <option value="Mới nhất">Mới nhất</option>
                    <option value="Cũ nhất">Cũ nhất</option>
                    <option value="Giá thấp → cao">Giá thấp → cao</option>
                    <option value="Giá cao → thấp">Giá cao → thấp</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse space-y-4">
                    <div className="bg-accent/20 aspect-square rounded-2xl"></div>
                    <div className="h-4 bg-accent/20 rounded w-3/4"></div>
                    <div className="h-4 bg-accent/20 rounded w-1/2"></div>
                  </div>
                ))
              ) : errorMsg ? (
                <div className="col-span-full py-20 text-center">
                  <p className="text-red-600 font-bold text-lg mb-2">{errorMsg}</p>
                  <p className="text-secondary/70">Kiểm tra kết nối hoặc cấu hình Supabase.</p>
                </div>
              ) : products.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <div className="bg-accent/20 inline-block p-6 rounded-full mb-6">
                    <Search size={48} className="text-primary/40" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-2 text-secondary">Không tìm thấy sản phẩm</h3>
                  <p className="text-gray-500 mb-8">Rất tiếc, chúng tôi không tìm thấy sản phẩm nào phù hợp với lựa chọn của bạn.</p>
                  <button 
                    onClick={() => {
                      setActiveCategory('Tất cả');
                      setSearchQuery('');
                    }}
                    className="bg-gradient-gold text-secondary px-8 py-3 rounded-full font-bold hover:shadow-lg transition-all"
                  >
                    Xem tất cả sản phẩm
                  </button>
                </div>
              ) : showAdminForm ? (
                <div className="col-span-full">
                  <div className="bg-white p-12 rounded-3xl shadow-2xl border border-accent/20 max-w-2xl mx-auto">
                    <form onSubmit={handleAdminSubmit} className="space-y-6">
                      <div>
                        <label className="block text-sm font-bold text-secondary mb-2">Tên sản phẩm</label>
                        <input 
                          type="text" 
                          value={adminProduct.name}
                          onChange={(e) => setAdminProduct({...adminProduct, name: e.target.value})}
                          className="w-full px-4 py-3 rounded-2xl border border-accent focus:ring-primary focus:border-primary"
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-secondary mb-2">Giá (VND)</label>
                          <input 
                            type="number" 
                            value={adminProduct.price}
                            onChange={(e) => setAdminProduct({...adminProduct, price: e.target.value})}
                            className="w-full px-4 py-3 rounded-2xl border border-accent focus:ring-primary focus:border-primary"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-secondary mb-2">Danh mục</label>
                          <input 
                            type="text" 
                            value={adminProduct.category}
                            onChange={(e) => setAdminProduct({...adminProduct, category: e.target.value})}
                            className="w-full px-4 py-3 rounded-2xl border border-accent focus:ring-primary focus:border-primary"
                            required
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-bold text-secondary mb-2">Mệnh</label>
                          <select 
                            value={adminProduct.menh}
                            onChange={(e) => setAdminProduct({...adminProduct, menh: e.target.value})}
                            className="w-full px-4 py-3 rounded-2xl border border-accent focus:ring-primary focus:border-primary"
                          >
                            <option value="">Chọn mệnh</option>
                            <option value="Kim">Kim</option>
                            <option value="Mộc">Mộc</option>
                            <option value="Thủy">Thủy</option>
                            <option value="Hỏa">Hỏa</option>
                            <option value="Thổ">Thổ</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-secondary mb-2">Hình ảnh</label>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files ? e.target.files[0] : null)}
                            className="w-full px-4 py-3 rounded-2xl border border-accent focus:ring-primary focus:border-primary file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-primary/90 file:text-white hover:file:bg-primary"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-secondary mb-2">Mô tả ngắn</label>
                        <textarea 
                          rows={2}
                          value={adminProduct.description}
                          onChange={(e) => setAdminProduct({...adminProduct, description: e.target.value})}
                          className="w-full px-4 py-3 rounded-2xl border border-accent focus:ring-primary focus:border-primary resize-vertical"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-bold text-secondary mb-2">Ý nghĩa</label>
                        <textarea 
                          rows={3}
                          value={adminProduct.meaning}
                          onChange={(e) => setAdminProduct({...adminProduct, meaning: e.target.value})}
                          className="w-full px-4 py-3 rounded-2xl border border-accent focus:ring-primary focus:border-primary resize-vertical"
                        />
                      </div>
                      <div className="text-xs text-gray-500">Specs JSON optional</div>
                      <button 
                        type="submit"
                        className="w-full bg-gradient-gold text-secondary py-4 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transition-all"
                      >
                        Thêm sản phẩm mới
                      </button>
                    </form>
                  </div>
                </div>
              ) : (
                products.map((product) => (
                  <motion.div 
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="group"
                  >
                    <Link to={`/product/${product.id}`}>
                      <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-accent/10 shadow-sm group-hover:shadow-md transition-all">
                        <img 
                          src={product.image_url} 
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      <div className="space-y-1">
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">{product.category}{product.menh ? ` • ${product.menh}` : ''}</span>
                        <h3 className="font-serif font-bold text-lg group-hover:text-primary transition-colors line-clamp-1 text-secondary">{product.name}</h3>
                        <p className="text-primary font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))
              )}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center items-center space-x-1">
              <button 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ‹
              </button>
              {(() => {
                const totalPages = Math.ceil(totalCount / 12);
                const pages = [];
                const delta = 2;

                let rangeStart = Math.max(2, currentPage - delta);
                let rangeEnd = Math.min(totalPages - 1, currentPage + delta);

                // Always show page 1
                pages.push(1);

                // Add range
                for (let i = rangeStart; i <= rangeEnd; i++) {
                  pages.push(i);
                }

                // Always show last page
                if (totalPages > 1) pages.push(totalPages);

                // Remove duplicates and sort
                const uniquePages = [...new Set(pages)].sort((a, b) => a - b).slice(0, 5);

                return uniquePages.map((pageNum) => (
                  <button 
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      currentPage === pageNum 
                        ? 'bg-primary text-white border-primary shadow-md' 
                        : 'border border-gray-200 hover:border-primary hover:text-primary'
                    }`}
                  >
                    {pageNum}
                  </button>
                ));
              })()}
              <button 
                onClick={() => setCurrentPage(p => Math.min(Math.ceil(totalCount / 12), p + 1))}
                disabled={currentPage === Math.ceil(totalCount / 12)}
                className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ›
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
