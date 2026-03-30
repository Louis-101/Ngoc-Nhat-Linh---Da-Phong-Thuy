import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Star, ShieldCheck, Truck } from 'lucide-react';
import { supabase } from '../service/supabaseClient';
import SEO from '../components/SEO';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [heroError, setHeroError] = useState(false);
  const [productImageErrors, setProductImageErrors] = useState<Record<string, boolean>>({});

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
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div className="overflow-hidden bg-pattern-subtle">
      <SEO
        title="Trang Chủ"
        description="Khám phá bộ sưu tập đá phong thủy cao cấp tại Ngọc Nhất Linh Cần Thơ. Vòng tay thạch anh, tượng phật, linh vật đá tự nhiên giúp chiêu tài lộc và bình an."
      />

      {/* Hero Section */}
      <section className="relative min-h-screen md:h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          {heroError ? (
            <div className="w-full h-full bg-slate-900 flex items-center justify-center">
              <div className="text-center text-white">
                <h2 className="text-3xl font-serif">NGỌC NHẤT LINH</h2>
              </div>
            </div>
          ) : (
            <img
              src="/buddha-hero.jpg"
              alt="Ngọc Nhất Linh Hero"
              className="w-full h-full object-cover brightness-50"
              onError={() => setHeroError(true)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/70"></div>
        </div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl sm:text-6xl font-serif text-white font-bold mb-8"
          >
            Ngọc Nhất Linh – Tinh Hoa Đá Phong Thủy
          </motion.h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link to="/products" className="bg-primary text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform">
              Xem Sản Phẩm
            </Link>
            <Link to="/contact" className="bg-white/10 backdrop-blur-md text-white border border-white/30 px-10 py-4 rounded-full font-bold hover:bg-white/20 transition-all">
              Liên Hệ Tư Vấn
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-accent/10">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="text-center space-y-4">
            <ShieldCheck className="mx-auto text-primary" size={48} />
            <h3 className="text-xl font-bold">Chất Lượng Thật</h3>
            <p className="text-gray-600 text-sm">Cam kết 100% đá tự nhiên có kiểm định.</p>
          </div>
          <div className="text-center space-y-4">
            <Star className="mx-auto text-primary" size={48} />
            <h3 className="text-xl font-bold">Tư Vấn Tận Tâm</h3>
            <p className="text-gray-600 text-sm">Chuyên gia phong thủy hỗ trợ chọn đá theo mệnh.</p>
          </div>
          <div className="text-center space-y-4">
            <Truck className="mx-auto text-primary" size={48} />
            <h3 className="text-xl font-bold">Giao Hàng Nhanh</h3>
            <p className="text-gray-600 text-sm">Vận chuyển toàn quốc, kiểm tra hàng trước khi thanh toán.</p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <h2 className="text-3xl md:text-4xl font-serif font-bold">Tuyệt Tác Chọn Lọc</h2>
            <Link to="/products" className="text-primary font-medium flex items-center">
              Xem tất cả <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-gray-100 aspect-square rounded-xl"></div>
              ))
            ) : (
              featuredProducts.map((product) => (
                <motion.div key={product.id} whileHover={{ y: -5 }} className="group">
                  <Link to={`/product/${product.id}`}>
                    <div className="aspect-square rounded-xl overflow-hidden mb-4 bg-gray-50 border border-gray-100">
                      <img
                        src={product.image_url || '/images/fallback.jpg'}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        onError={() => setProductImageErrors(prev => ({ ...prev, [product.id]: true }))}
                      />
                      {productImageErrors[product.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-accent/20">
                          <span className="text-xs text-gray-400">Ảnh đang cập nhật</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] text-gray-400 uppercase tracking-widest">{product.category}</span>
                      <h3 className="font-bold text-sm line-clamp-2 text-secondary">{product.name}</h3>
                      <p className="text-primary font-bold">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(product.price)}
                      </p>
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
