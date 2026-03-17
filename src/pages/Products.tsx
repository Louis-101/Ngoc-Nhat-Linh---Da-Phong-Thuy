import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Filter, ChevronDown, Search, X } from 'lucide-react';
import { supabase } from '../service/supabaseClient';
import { Link } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

export default function Products() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Tất cả');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const categories = ['Tất cả', 'Vòng tay', 'Mặt dây', 'Tượng phật', 'Vật phẩm', 'Linh vật'];

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');
        
        if (activeCategory !== 'Tất cả') {
          query = query.eq('category', activeCategory);
        }

        if (searchQuery.trim()) {
          // Filter by name or description
          query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
        }

        const { data, error } = await query;
        if (error) throw error;
        setProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        // Fallback mock data with filtering for demo purposes
        const mockProducts = [
          { id: '1', name: 'Vòng Tay Thạch Anh Tóc Vàng 12ly', description: 'Đá tự nhiên cao cấp', price: 4500000, image_url: 'https://picsum.photos/seed/gem1/600/600', category: 'Vòng tay' },
          { id: '2', name: 'Mặt Dây Chuyền Cẩm Thạch Sơn Thủy', description: 'Ngọc cẩm thạch sơn thủy', price: 12800000, image_url: 'https://picsum.photos/seed/gem2/600/600', category: 'Mặt dây' },
          { id: '3', name: 'Vòng Tay Aquamarine Hải Lam Ngọc', description: 'Đá Aquamarine xanh biển', price: 6200000, image_url: 'https://picsum.photos/seed/gem3/600/600', category: 'Vòng tay' },
          { id: '4', name: 'Thiềm Thừ Ngọc Hoàng Long Tự Nhiên', description: 'Linh vật chiêu tài', price: 25000000, image_url: 'https://picsum.photos/seed/gem4/600/600', category: 'Linh vật' },
          { id: '5', name: 'Vòng Tay Thạch Anh Tím Khói', description: 'Thạch anh tím tự nhiên', price: 3200000, image_url: 'https://picsum.photos/seed/gem5/600/600', category: 'Vòng tay' },
          { id: '6', name: 'Tượng Di Lặc Đá Citrine', description: 'Tượng phật di lặc may mắn', price: 8500000, image_url: 'https://picsum.photos/seed/gem6/600/600', category: 'Tượng phật' },
        ];

        let filtered = mockProducts;
        if (activeCategory !== 'Tất cả') {
          filtered = filtered.filter(p => p.category === activeCategory);
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          filtered = filtered.filter(p => 
            p.name.toLowerCase().includes(q) || 
            (p.description && p.description.toLowerCase().includes(q))
          );
        }
        setProducts(filtered);
      } finally {
        setLoading(false);
      }
    }
    
    const timeoutId = setTimeout(fetchProducts, searchQuery.trim() ? 300 : 0);
    return () => clearTimeout(timeoutId);
  }, [activeCategory, searchQuery]);

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
                        {['Dưới 1 triệu', '1 - 5 triệu', '5 - 10 triệu', 'Trên 10 triệu'].map((range) => (
                          <label key={range} className="flex items-center space-x-3 cursor-pointer group">
                            <div className="w-5 h-5 rounded border border-accent group-hover:border-primary transition-colors"></div>
                            <span className="text-secondary/60 group-hover:text-primary transition-colors">{range}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-widest text-secondary/40 mb-6 border-b border-accent pb-2">Theo mệnh</h3>
                      <div className="space-y-3">
                        {['Mệnh Kim', 'Mệnh Mộc', 'Mệnh Thủy', 'Mệnh Hỏa', 'Mệnh Thổ'].map((m) => (
                          <label key={m} className="flex items-center space-x-3 cursor-pointer group">
                            <input type="checkbox" className="w-4 h-4 border-accent rounded text-primary focus:ring-primary" />
                            <span className="text-sm text-secondary/60 group-hover:text-primary transition-colors">{m}</span>
                          </label>
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
                {['Mệnh Kim', 'Mệnh Mộc', 'Mệnh Thủy', 'Mệnh Hỏa', 'Mệnh Thổ'].map((m) => (
                  <label key={m} className="flex items-center space-x-3 cursor-pointer group">
                    <input type="checkbox" className="w-4 h-4 border-accent rounded text-primary focus:ring-primary" />
                    <span className="text-sm text-secondary/60 group-hover:text-primary transition-colors">{m}</span>
                  </label>
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
              <h3 className="text-sm font-bold uppercase tracking-widest mb-6 border-b border-accent pb-2 text-secondary">Khoảng giá (VNĐ)</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input type="number" placeholder="Từ" className="w-full px-3 py-2 border border-accent rounded-md text-sm focus:outline-none focus:border-primary bg-white/50" />
                  <span className="text-gray-400">-</span>
                  <input type="number" placeholder="Đến" className="w-full px-3 py-2 border border-accent rounded-md text-sm focus:outline-none focus:border-primary bg-white/50" />
                </div>
                <button className="w-full bg-gradient-gold text-secondary py-2 rounded-md text-sm font-bold hover:shadow-lg transition-all">
                  Áp dụng
                </button>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="flex-grow">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <p className="text-sm text-secondary/60">Hiển thị {products.length} sản phẩm</p>
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
                <button className="flex items-center space-x-2 text-sm font-medium border border-accent px-4 py-2 rounded-full hover:border-primary transition-colors bg-white/50">
                  <span>Mới nhất</span>
                  <ChevronDown size={16} />
                </button>
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
              ) : products.length > 0 ? (
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
                        <span className="text-[10px] text-gray-400 uppercase tracking-widest">{product.category}</span>
                        <h3 className="font-serif font-bold text-lg group-hover:text-primary transition-colors line-clamp-1 text-secondary">{product.name}</h3>
                        <p className="text-primary font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                      </div>
                    </Link>
                  </motion.div>
                ))
              ) : (
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
              )}
            </div>

            {/* Pagination */}
            <div className="mt-16 flex justify-center items-center space-x-2">
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">1</button>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">2</button>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">3</button>
              <span className="px-2">...</span>
              <button className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center hover:border-primary hover:text-primary transition-colors">12</button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
