import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, ShieldCheck, Truck, Heart } from 'lucide-react';
import { supabase } from '../service/supabaseClient';
import type { Product, Post } from '../types';
import SEO from '../components/SEO';

const LandingHome: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchFeatured();
    fetchPosts();
  }, []);

  const fetchFeatured = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*, images(*)')
      .eq('featured', true)
      .limit(4)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching featured:', error);
    else setFeaturedProducts(data || []);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('title, slug, excerpt, image_url, created_at')
      .eq('published', true)
      .limit(3)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching posts:', error);
    else setLatestPosts(data || []);
  };

  return (
    <>
      <SEO 
        title="Ngọc Nhất Linh - Đá quý phong thủy mệnh Hỏa, mệnh Thủy cao cấp" 
        description="Vòng tay thạch anh, cẩm thạch, aquamarine tự nhiên. Tư vấn phong thủy cá nhân hóa. Giao hàng toàn quốc."
      />
      
      {/* Hero */}
      <section className="relative min-h-screen bg-linear-to-br from-purple-900 via-indigo-900 to-blue-900 overflow-hidden">
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 container mx-auto px-4 h-screen flex items-center justify-center text-center text-white pt-20">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-yellow-400 via-orange-400 to-red-500 bg-clip-text text-transparent leading-tight">
              Ngọc Nhất Linh
            </h1>
            <p className="text-xl md:text-2xl mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed opacity-90">
              Vòng tay đá quý phong thủy tự nhiên • Chọn theo mệnh Hỏa, Thủy • Năng lượng thịnh vượng vạn năm
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Link 
                to="/products" 
                className="group bg-linear-to-r from-yellow-500 to-orange-500 hover:from-yellow-400 hover:to-orange-400 text-black font-bold py-4 px-8 rounded-xl text-lg shadow-2xl hover:shadow-3xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2"
              >
                Khám phá ngay
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                to="/destiny" 
                className="group border-2 border-white/50 hover:border-white text-white font-bold py-4 px-8 rounded-xl text-lg hover:bg-white hover:text-gray-900 transition-all duration-300 flex items-center gap-2 backdrop-blur-sm"
              >
                Xem mệnh của bạn
                <Sparkles className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-4 bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
          >
            Sản phẩm nổi bật
          </motion.h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Đá quý tự nhiên cao cấp • Phù hợp phong thủy • Nguồn năng lượng tích cực
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, idx) => (
              <motion.div 
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group cursor-pointer hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 rounded-3xl p-8 bg-linear-to-br from-white to-gray-50 border border-gray-100"
              >
                <Link to={`/products/${product.id}`} className="block">
                  <div className="w-full h-64 bg-linear-to-br from-purple-50 to-indigo-50 rounded-2xl overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-500 flex items-center justify-center">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:brightness-110 transition-all duration-500"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">{product.name}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold bg-linear-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">
                      {product.price.toLocaleString()}đ
                    </span>
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={"w-5 h-5 " + (i < 4.8 ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300')} />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Chính hãng 100%</span>
                  </div>
                  <button className="w-full bg-linear-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Xem chi tiết
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>
          
          {featuredProducts.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center py-20"
            >
              <div className="w-32 h-32 bg-linear-to-br from-purple-100 to-indigo-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
                <Sparkles className="w-16 h-16 text-purple-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">Sắp có sản phẩm mới</h3>
              <p className="text-lg text-gray-500">Theo dõi để cập nhật những viên đá quý đẹp nhất</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* Blog Preview */}
      <section className="py-24 bg-linear-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold text-center mb-4 bg-linear-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent"
          >
            Kiến thức phong thủy
          </motion.h2>
          <p className="text-xl text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            Hướng dẫn chọn đá quý theo mệnh • Bí quyết kích hoạt năng lượng
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            {latestPosts.slice(0, 3).map((post, idx) => (
              <motion.div 
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
              >
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="h-56 bg-linear-to-br from-emerald-400 to-teal-500 relative overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-110"
                    />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="inline-block bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-semibold text-emerald-700">
                        Phong thủy
                      </span>
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 leading-tight group-hover:text-emerald-600 transition-colors">{post.title}</h3>
                    <p className="text-gray-600 mb-6 line-clamp-2">{post.excerpt}</p>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                      <Heart className="w-4 h-4" />
                      <span>Đọc thêm</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="text-center mt-20">
            <Link 
              to="/blog"
              className="inline-flex items-center gap-2 bg-linear-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-bold py-4 px-10 rounded-2xl text-lg shadow-xl hover:shadow-2xl transition-all duration-300 group"
            >
              Xem tất cả bài viết
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-linear-to-tl from-purple-600 via-indigo-600 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <div className="w-24 h-24 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-8 backdrop-blur-sm">
              <Sparkles className="w-12 h-12 text-yellow-300" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Tìm đúng viên đá 
              <span className="block bg-linear-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                cho vận mệnh của bạn
              </span>
            </h2>
            <p className="text-xl mb-12 opacity-90 max-w-2xl mx-auto leading-relaxed">
              Chọn đá quý theo năm sinh chính xác • Tư vấn phong thủy 1:1 • Cam kết năng lượng phù hợp mệnh
            </p>
            <div className="grid md:grid-cols-3 gap-8 mb-12 max-w-4xl mx-auto">
              <div className="flex flex-col items-center p-6">
                <ShieldCheck className="w-16 h-16 text-yellow-300 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Chính hãng</h3>
                <p>Đá tự nhiên 100%</p>
              </div>
              <div className="flex flex-col items-center p-6">
                <Truck className="w-16 h-16 text-yellow-300 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Giao nhanh</h3>
                <p>Toàn quốc 1-3 ngày</p>
              </div>
              <div className="flex flex-col items-center p-6">
                <Heart className="w-16 h-16 text-yellow-300 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Tư vấn</h3>
                <p>Miễn phí trọn đời</p>
              </div>
            </div>
            <div className="flex flex-col lg:flex-row gap-4 justify-center items-center max-w-2xl mx-auto">
              <Link 
                to="/destiny" 
                className="group bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-3 w-full lg:w-auto justify-center"
              >
                Kiểm tra mệnh ngay
                <Sparkles className="w-5 h-5 group-hover:scale-110 transition-transform" />
              </Link>
              <Link 
                to="/products" 
                className="group bg-linear-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 font-bold py-4 px-8 rounded-2xl text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 flex items-center gap-2 w-full lg:w-auto justify-center"
              >
                Xem sản phẩm
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default LandingHome;

