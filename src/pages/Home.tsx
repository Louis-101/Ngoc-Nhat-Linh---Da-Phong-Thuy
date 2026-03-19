import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowRight, Star, ShieldCheck, Truck, MessageCircle } from 'lucide-react';
import { supabase } from '../service/supabaseClient';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroError, setHeroError] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .limit(4);
        
        if (error) throw error;
        setFeaturedProducts(data || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        // Fallback mock data
        setFeaturedProducts([
          { id: '1', name: 'Vòng Tay Thạch Anh Tóc Vàng 12ly', price: 4500000, image_url: 'https://picsum.photos/seed/gem1/600/600', category: 'Vòng tay' },
          { id: '2', name: 'Mặt Dây Chuyền Cẩm Thạch Sơn Thủy', price: 12800000, image_url: 'https://picsum.photos/seed/gem2/600/600', category: 'Mặt dây' },
          { id: '3', name: 'Vòng Tay Aquamarine Hải Lam Ngọc', price: 6200000, image_url: 'https://picsum.photos/seed/gem3/600/600', category: 'Vòng tay' },
          { id: '4', name: 'Thiềm Thừ Ngọc Hoàng Long Tự Nhiên', price: 25000000, image_url: 'https://picsum.photos/seed/gem4/600/600', category: 'Vật phẩm' },
        ]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="overflow-hidden bg-pattern-subtle">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
src="https://images.unsplash.com/photo-1588880354343-8c120dbf5d20?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80&ar=16:9"
            alt="Hero Background" 
            className="w-full h-full object-cover brightness-[0.4]"
            referrerPolicy="no-referrer"
            onError={() => setHeroError(true)}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/20 to-black/70"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-primary font-bold tracking-[0.4em] uppercase text-xs sm:text-sm mb-6 block drop-shadow-sm"
          >
            Thương hiệu đẳng cấp
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-serif text-gradient-gold font-bold mb-8 leading-[1.1] drop-shadow-2xl"
          >
            Ngọc Nhất Linh – Tinh Hoa Phong Thủy
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-white/90 mb-12 max-w-2xl mx-auto font-light leading-relaxed drop-shadow-lg"
          >
            Hành trình mang lại sự bình an và thịnh vượng thông qua những giá trị tâm linh đích thực từ đá quý thiên nhiên.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Link to="/products" className="bg-gradient-gold text-secondary px-10 py-5 rounded-full font-bold transition-all duration-300 w-full sm:w-auto shadow-xl hover:shadow-primary/30 hover:-translate-y-1">
              Khám phá ngay
            </Link>
            <Link to="/destiny" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 px-10 py-5 rounded-full font-bold transition-all duration-300 w-full sm:w-auto hover:-translate-y-1">
              Tư vấn chuyên sâu
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-accent/30 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-subtle opacity-50"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform">
                <ShieldCheck className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold text-secondary">Chất lượng Thật</h3>
              <p className="text-gray-600 text-sm">Cam kết 100% đá quý tự nhiên, có kiểm định PNJ/SJC.</p>
            </div>
            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform">
                <Star className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold text-secondary">Tư vấn Tận Tâm</h3>
              <p className="text-gray-600 text-sm">Đội ngũ chuyên gia phong thủy giàu kinh nghiệm hỗ trợ 24/7.</p>
            </div>
            <div className="text-center space-y-4 group">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto shadow-md group-hover:scale-110 transition-transform">
                <Truck className="text-primary" size={32} />
              </div>
              <h3 className="text-xl font-serif font-bold text-secondary">Giao hàng Toàn quốc</h3>
              <p className="text-gray-600 text-sm">Vận chuyển nhanh chóng, an toàn và bảo mật tuyệt đối.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-primary font-medium uppercase tracking-widest text-xs mb-2 block">Danh mục</span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-secondary">Tuyệt Tác Chọn Lọc</h2>
            </div>
            <Link to="/products" className="text-primary font-medium flex items-center hover:underline">
              Xem tất cả <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse space-y-4">
                  <div className="bg-gray-100 aspect-square rounded-2xl"></div>
                  <div className="h-4 bg-gray-100 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-100 rounded w-1/2"></div>
                </div>
              ))
            ) : (
              featuredProducts.map((product) => (
                <motion.div 
                  key={product.id}
                  whileHover={{ y: -10 }}
                  className="group"
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-accent/20 shadow-sm group-hover:shadow-md transition-all">
                      <img 
                        src={product.image_url} 
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-gradient-gold text-secondary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider shadow-sm">Hot</span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest">{product.category}</span>
                      <h3 className="font-serif font-bold text-lg group-hover:text-primary transition-colors line-clamp-1 text-secondary">{product.name}</h3>
                      <p className="text-primary font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

