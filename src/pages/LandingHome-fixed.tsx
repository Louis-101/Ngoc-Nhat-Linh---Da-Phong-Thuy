import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, ShieldCheck, Truck, Heart, Users, MessageCircle, Compass, Gem, Moon, Sun } from 'lucide-react';
import { supabase } from '../service/supabaseClient';
import type { Product, Post } from '../types';
import SEO from '../components/SEO';

const LandingHome: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [latestPosts, setLatestPosts] = useState<Post[]>([]);

  // Animation variants cho cảm giác mềm mại
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.8, ease: "easeOut" as const }
  };

  const staggerContainer = {
    initial: {},
    whileInView: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  useEffect(() => {
    fetchFeatured();
    fetchPosts();
  }, []);

  const fetchFeatured = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(8)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching featured:', error);
    else setFeaturedProducts(data || []);
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('posts')
      .select('id, title, slug, excerpt, image_url, created_at')
      .eq('published', true)
      .limit(3)
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching posts:', error);
    else setLatestPosts(data || []);
  };

  return (
    <div className="bg-[#fdfbf7] selection:bg-primary/20">
      <SEO 
        title="Ngọc Nhất Linh - Tinh Hoa Đá Quý & Phong Thủy Cao Cấp" 
        description="Năng lượng từ thiên nhiên, vẻ đẹp của sự an yên. Chuyên vòng tay thạch anh, vật phẩm phong thủy tự nhiên cao cấp."
      />
      
      {/* --- REFINED HERO SECTION --- */}
      <section className="relative min-h-screen overflow-hidden flex items-center pt-20">
        {/* Background Layer: Soft Jade Accents & Glows */}
        <div className="absolute top-[-10%] right-[-5%] w-125 h-125 bg-emerald-100/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] left-[-5%] w-100 h-100 bg-amber-100/20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '2s' }} />
        
        {/* Floating Light Particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full hidden md:block"
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%", 
              opacity: 0.1 
            }}
            animate={{ 
              y: ["-10%", "110%"],
              opacity: [0.1, 0.5, 0.1]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          />
        ))}

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -40 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="text-left"
            >
              <span className="inline-block text-primary/70 uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold mb-6">Tinh Hoa Đá Quý Thiên Nhiên</span>
              <h1 className="text-5xl md:text-7xl font-serif font-bold text-secondary mb-8 leading-[1.1]">
                Vẻ Đẹp Của <br />
                <span className="text-primary italic">Sự An Yên</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-lg leading-relaxed font-light">
                Khởi nguồn năng lượng thịnh vượng và bình an từ sâu trong lòng đất, kiến tạo giá trị tâm linh cho riêng bản mệnh của bạn.
              </p>
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <Link 
                  to="/products" 
                  className="bg-secondary text-white py-4 px-10 rounded-full font-bold shadow-2xl shadow-secondary/20 hover:bg-primary transition-all duration-500 group flex items-center gap-3"
                >
                  Khám Phá Sản Phẩm
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/destiny" 
                  className="border border-secondary/20 text-secondary py-4 px-10 rounded-full font-bold hover:bg-secondary/5 transition-all duration-500"
                >
                  Nhận Tư Vấn Phong Thuỷ
                </Link>
              </div>
            </motion.div>

            {/* Floating Image Collage */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2 }}
              className="relative hidden lg:block"
            >
              <div className="relative z-10 w-full aspect-square rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.15)] border-12 border-white/80 backdrop-blur-sm">
                <img 
                  src="https://vwdriocchpkvolkzbqmn.supabase.co/storage/v1/object/public/blog-images/DSC08597.JPG" 
                  alt="Ngọc Nhất Linh Hero" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-[3s]"
                />
              </div>
              {/* Decorative floating elements */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute -top-10 -right-10 w-40 h-40 bg-white p-4 rounded-3xl shadow-xl border border-accent/20 z-20"
              >
                <div className="w-full h-full rounded-2xl bg-primary/5 flex items-center justify-center">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
              </motion.div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-2xl" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- IMPROVED PRODUCT SECTION --- */}
      <section className="py-40 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <motion.span {...fadeInUp} className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Vật phẩm tuyển chọn</motion.span>
            <motion.h2 
              {...fadeInUp}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-serif font-bold text-secondary mb-6"
            >
              Tuyệt Tác Chọn Lọc
            </motion.h2>
            <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="w-24 h-px bg-primary/20 mx-auto" />
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-12"
          >
            {featuredProducts.map((product, idx) => (
              <motion.div 
                key={product.id}
                variants={fadeInUp}
                className="group"
              >
                <Link to={`/product/${product.id}`} className="block">
                  <div className="aspect-square bg-[#faf8f5] rounded-[2.5rem] overflow-hidden mb-8 group-hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.1)] transition-all duration-700 relative border border-secondary/5">
                    <img 
                      src={product.image_url} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s]"
                      loading="lazy"
                      decoding="async"
                    />
                    <div className="absolute inset-0 bg-secondary/0 group-hover:bg-secondary/5 transition-colors" />
                  </div>
                  <div className="px-2">
                    <h3 className="text-lg font-serif font-bold text-secondary mb-2 leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                    <p className="text-primary font-bold tracking-wider">
                      {product.price.toLocaleString()}đ
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div {...fadeInUp} className="mt-24 text-center">
            <Link 
              to="/products"
              className="inline-flex items-center gap-3 text-secondary font-bold border-b-2 border-primary/30 pb-2 hover:border-primary transition-all group"
            >
              Xem toàn bộ sưu tập
              <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- NEW CONSULTATION SECTION --- */}
      <section className="py-40 bg-[#fdfbf7]">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative group"
            >
              <div className="aspect-4/5 rounded-[4rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border-8 border-white">
                <img src="/images/bang-hieu.jpg" alt="Advisor" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" />
              </div>
              <div className="absolute -bottom-8 -right-8 bg-white/90 backdrop-blur-xl p-8 rounded-4xl shadow-2xl hidden md:block border border-white">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary">
                    <MessageCircle size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 font-bold uppercase">Hỗ trợ 24/7</p>
                    <p className="font-bold text-secondary">Zalo: 0902 111 626</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <span className="text-primary font-bold tracking-[0.2em] text-[10px] uppercase mb-4 block italic">Cá nhân hóa trải nghiệm</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold text-secondary mb-8 leading-tight">
                Chưa Biết Mình <br /> Hợp Loại Đá Nào?
              </h2>
              <p className="text-gray-500 text-lg mb-12 leading-relaxed font-light">
                Mỗi bản mệnh, mỗi nhu cầu cảm xúc, tài chính hay bình an đều có những loại đá tương sinh khác nhau. Hãy để chúng tôi đồng hành cùng bạn tìm ra "viên đá định mệnh".
              </p>
              
              <div className="grid gap-5">
                {[
                  { label: 'Chọn Đá Theo Mệnh', icon: <Compass />, link: '/destiny' },
                  { label: 'Chọn Đá Theo Nhu Cầu', icon: <Gem />, link: '/products' },
                  { label: 'Nhận Tư Vấn Riêng', icon: <MessageCircle />, link: '/contact' }
                ].map((item, i) => (
                  <Link 
                    key={i} 
                    to={item.link}
                    className="flex items-center justify-between p-7 bg-white/50 backdrop-blur-md rounded-3xl border border-secondary/5 hover:border-primary/40 hover:bg-white hover:shadow-xl transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-primary group-hover:scale-110 transition-transform">{item.icon}</span>
                      <span className="font-bold text-secondary text-lg">{item.label}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </Link>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <section className="py-40 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-16">
            {[
              { icon: <Sparkles className="w-10 h-10" />, title: 'Đá thiên nhiên tuyển chọn', desc: '100% đá quý thiên nhiên, mang năng lượng tinh khiết từ đất trời.' },
              { icon: <Sun className="w-10 h-10" />, title: 'Năng Lượng Thuần Khiết', desc: 'Mọi vật phẩm đều được thanh tẩy và kích hoạt năng lượng tích cực.' },
              { icon: <Users className="w-10 h-10" />, title: 'Tư Vấn Tận Tâm', desc: 'Đội ngũ tư vấn giàu kinh nghiệm, thấu hiểu cung mệnh và tâm lý khách hàng.' },
              { icon: <Truck className="w-10 h-10" />, title: 'Giao hàng toàn quốc', desc: 'Đóng gói chuyên nghiệp, bảo hiểm hàng hoá, giao nhanh 1-3 ngày.' }
            ].map((usp, i) => (
              <motion.div key={i} {...fadeInUp} transition={{ delay: i * 0.1 }} className="text-center group">
                <div className="w-20 h-20 bg-[#fdfbf7] rounded-3xl flex items-center justify-center mx-auto mb-8 text-primary group-hover:scale-110 group-hover:bg-secondary group-hover:text-white transition-all duration-500 shadow-sm">
                  {usp.icon}
                </div>
                <h3 className="text-xl font-serif font-bold text-secondary mb-4">{usp.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed font-light">{usp.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- BLOG SECTION --- */}
      <section className="py-40 bg-[#fdfbf7]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="text-left">
              <motion.span {...fadeInUp} className="text-primary font-bold tracking-[0.3em] text-[10px] uppercase mb-4 block">Góc trí tuệ</motion.span>
              <motion.h2 {...fadeInUp} className="text-4xl md:text-6xl font-serif font-bold text-secondary leading-tight">Kiến Thức <br /> Phong Thuỷ</motion.h2>
            </div>
            <Link to="/blog" className="text-secondary font-bold border-b border-primary/40 pb-2 flex items-center gap-2 hover:text-primary hover:border-primary transition-all group">
              Xem tất cả bài viết <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="whileInView"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-12"
          >
            {latestPosts.map((post, idx) => (
              <motion.div key={post.id} variants={fadeInUp} className="group">
                <Link to={`/blog/${post.slug}`} className="block">
                  <div className="aspect-4/3 rounded-4xl overflow-hidden mb-8 shadow-sm">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                    />
                  </div>
                  <h3 className="text-2xl font-serif font-bold text-secondary mb-4 leading-tight group-hover:text-primary transition-colors line-clamp-2">{post.title}</h3>
                  <p className="text-gray-500 mb-8 line-clamp-2 font-light leading-relaxed">{post.excerpt}</p>
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary flex items-center gap-2 group-hover:gap-4 transition-all">
                    Đọc Bài Viết <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* --- TESTIMONIALS & BRAND QUOTE --- */}
      <section className="py-40 bg-white">
        <div className="container mx-auto px-4 max-w-5xl">
          <motion.div {...fadeInUp} className="text-center">
            <Moon className="w-10 h-10 text-primary/30 mx-auto mb-12 rotate-[-15deg]" />
            <h2 className="text-3xl md:text-5xl font-serif italic text-secondary leading-relaxed mb-12">
              "Mỗi viên đá quý đều mang một câu chuyện của đất trời. <br />
              Tại Ngọc Nhất Linh, chúng tôi giúp bạn viết tiếp <br />
              câu chuyện bình an cho riêng mình."
            </h2>
            <div className="w-16 h-px bg-primary/40 mx-auto mb-12" />
            <p className="text-xs uppercase tracking-[0.5em] font-bold text-secondary/30">Ngọc Nhất Linh • Est 2014</p>
          </motion.div>
        </div>
      </section>

      {/* --- FINAL CTA SECTION --- */}
      <section className="pb-40 bg-white px-4">
        <div className="container mx-auto">
          <motion.div 
            {...fadeInUp}
            className="bg-secondary rounded-[4rem] p-12 md:p-32 text-center text-white relative overflow-hidden shadow-2xl"
          >
            <div className="absolute top-0 right-0 w-125 h-125 bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-48" />
            <div className="absolute bottom-0 left-0 w-100 h-100 bg-white/5 rounded-full blur-[100px] -ml-48 -mb-48" />
            
            <div className="relative z-10 max-w-2xl mx-auto">
              <span className="text-primary font-bold tracking-[0.4em] text-[10px] uppercase mb-8 block">Kiến tạo vận mệnh</span>
              <h2 className="text-4xl md:text-7xl font-serif font-bold mb-10 leading-tight">Tìm Viên Đá Dành Riêng Cho Bạn</h2>
              <p className="text-lg md:text-xl text-white/60 mb-14 font-light leading-relaxed">Bắt đầu hành trình tìm kiếm năng lượng bảo hộ và sự an yên cho bản thân ngay hôm nay.</p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link 
                  to="/products" 
                  className="bg-primary text-secondary px-12 py-5 rounded-full font-bold shadow-2xl hover:bg-white hover:scale-105 transition-all duration-500"
                >
                  Xem Bộ Sưu Tập
                </Link>
                <Link 
                  to="/contact" 
                  className="border border-white/30 px-12 py-5 rounded-full font-bold hover:bg-white/10 hover:border-white transition-all duration-500"
                >
                  Liên Hệ Tư Vấn
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default LandingHome;
