import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Filter, Search, X } from 'lucide-react';
import { supabase } from '../service/supabaseClient';
import { Link, useSearchParams } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';

export default function FixedProducts() {
  const [products, setProducts] = useState([]);
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

        if (activeCategory !== 'Tất cả') query = query.eq('category', activeCategory);
        if (activeMenh !== 'Tất cả') query = query.eq('menh', activeMenh);
        if (searchQuery.trim()) query = query.or(`name.ilike.%${searchQuery.trim()}%,description.ilike.%${searchQuery.trim()}%`);

        if (priceRange !== 'Tất cả') {
          if (priceRange === 'Dưới 1 triệu') query = query.lte('price', 1000000);
          if (priceRange === '1 - 5 triệu') query = query.gte('price', 1000000).lte('price', 5000000);
          if (priceRange === '5 - 10 triệu') query = query.gte('price', 5000000).lte('price', 10000000);
          if (priceRange === 'Trên 10 triệu') query = query.gte('price', 10000000);
        }

        if (sortBy === 'Giá thấp → cao') query = query.order('price', { ascending: true });
        else if (sortBy === 'Giá cao → thấp') query = query.order('price', { ascending: false });
        else if (sortBy === 'Cũ nhất') query = query.order('created_at', { ascending: true });
        else query = query.order('created_at', { ascending: false });

        query = query.range(from, to);


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
        console.log('FixedProducts products:', data);
        console.log('Supabase products query:', { data, count, error });

        if (error) {
          throw error;
        }

        setProducts(data || []);
        setTotalCount(count || 0);
      } catch (err) {
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
                  className="fixed left-0 top-0 bottom-0 w-[85vw] max-w-xs bg-white z-50 shadow-2xl flex flex-col bg-pattern-subtle"
                >
                  {/* Header */}
                  <div className="flex justify-between items-center p-8 border-b border-accent/20 bg-white/80 backdrop-blur-md sticky top-0 z-10">
                    <h2 className="text-2xl font-serif font-bold text-secondary">Bộ Lọc</h2>
                    <button onClick={() => setIsFilterOpen(false)} className="p-2 hover:bg-accent rounded-full transition-colors">
                      <X size={24} className="text-secondary" />
                    </button>
                  </div>
                  
                  {/* Scrollable Content */}
                  <div className="flex-1 overflow-y-auto p-8 space-y-10">
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
                        </div>
                    </div>
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Desktop Filters */}
          <aside className="hidden lg:block lg:w-64 space-y-10 sticky top-24 h-fit">
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
                    className={`block text-sm transition-colors ${priceRange === range ? 'text-primary font-bold' : 'text-secondary/60 hover:text-primary'}`}
                    onClick={() => setPriceRange(range)}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          <main className="flex-1 lg:ml-0">
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-6 xl:gap-8 px-3 md:px-0 auto-rows-fr">
              {loading ? Array(8).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="bg-accent/20 aspect-square rounded-2xl" />
                  <div className="h-4 bg-accent/20 rounded w-3/4" />
                </div>
              )) : products.length === 0 ? (
                <div className="col-span-full py-20 text-center">
                  <h3 className="text-xl font-serif font-bold mb-2 text-secondary">Không tìm thấy sản phẩm</h3>
                </div>
              ) : products.map((product) => (
                <motion.div 
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 cursor-pointer border border-gray-100 hover:border-primary/20 p-4"
                >
                  <Link to={`/product/${product.id}`} className="block">
                    <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-accent/10 group-hover:bg-primary/5 transition-all flex items-center justify-center p-2">
                      <img 
                        src={product.image_url || '/images/fallback.jpg'} 
                        alt={product.name}
                        className="w-full h-full max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          e.currentTarget.src = '/images/fallback.jpg';
                        }}
                      />
                    </div>
                    <div className="space-y-2">
                      <span className="text-xs text-gray-400 uppercase tracking-wider px-2 py-1 bg-accent/50 rounded-full inline-block">{product.category} {product.menh && `| ${product.menh}`}</span>
                      <h3 className="font-serif font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      <p className="text-primary font-bold text-2xl">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
