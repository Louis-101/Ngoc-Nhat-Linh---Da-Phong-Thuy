import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { Award, Users, Heart, ShieldCheck } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function About() {
  const { pathname } = useLocation();

  useEffect(() => {
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTo(0, 0);
      document.body.scrollTo(0, 0);
    };

    scrollToTop();
    
    const timer = setTimeout(scrollToTop, 10);
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <div className="pt-24 pb-20 bg-white bg-pattern-subtle min-h-screen">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 md:mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-gradient-gold font-serif italic font-bold uppercase tracking-widest text-[10px] mb-4 block">Câu chuyện thương hiệu</span>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-8 leading-tight text-secondary">
              <span className="text-gradient-gold">Ngọc Nhất Linh</span> – Nơi Hội Tụ Tinh Hoa Đá Quý
            </h1>
            <p className="text-secondary/60 text-lg font-light leading-relaxed mb-8">
              Được thành lập từ niềm đam mê mãnh liệt với vẻ đẹp huyền bí của đá quý tự nhiên, Ngọc Nhất Linh không chỉ là một thương hiệu trang sức, mà còn là cầu nối mang năng lượng bình an từ đất trời đến với mỗi khách hàng.
            </p>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <h4 className="text-3xl font-serif font-bold text-primary mb-2">10+</h4>
                <p className="text-xs text-secondary/40 uppercase tracking-widest font-bold">Năm kinh nghiệm</p>
              </div>
              <div>
                <h4 className="text-3xl font-serif font-bold text-primary mb-2">50k+</h4>
                <p className="text-xs text-secondary/40 uppercase tracking-widest font-bold">Khách hàng tin dùng</p>
              </div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-4/5 rounded-[2.5rem] overflow-hidden shadow-2xl border border-accent/20 relative group">
              <img 
                src="https://vwdriocchpkvolkzbqmn.supabase.co/storage/v1/object/public/blog-images/DSC08597.JPG" 
                alt="Brand Story" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000" 
                loading="lazy" 
                decoding="async" 
              />
              <div className="absolute inset-0 bg-linear-to-t from-secondary/40 to-transparent opacity-60"></div>
            </div>
            <motion.div 
              initial={{ y: 20, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-gold rounded-3xl flex-col items-center justify-center text-secondary text-center p-6 hidden md:flex shadow-xl"
            >
              <Award size={40} className="mb-4" />
              <p className="text-xs font-bold uppercase tracking-widest">Cam kết chất lượng số 1</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-accent/30 py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern-subtle opacity-20"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6 text-secondary">Giá Trị Cốt Lõi</h2>
            <p className="text-secondary/60 font-light">Những nguyên tắc vàng giúp Ngọc Nhất Linh khẳng định vị thế trong lòng khách hàng.</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-12 px-1 sm:px-0">
            {[
              { icon: <ShieldCheck className="w-5 h-5 md:w-8 md:h-8" />, title: 'Chất Lượng Thật', desc: 'Mọi sản phẩm đều được kiểm định nghiêm ngặt, cam kết đá tự nhiên 100%.' },
              { icon: <Users className="w-5 h-5 md:w-8 md:h-8" />, title: 'Tâm Huyết', desc: 'Đội ngũ nghệ nhân và chuyên gia phong thủy làm việc bằng cả trái tim.' },
              { icon: <Heart className="w-5 h-5 md:w-8 md:h-8" />, title: 'Sứ Mệnh', desc: 'Mang lại sự thịnh vượng và bình an cho cộng đồng thông qua năng lượng đá quý.' }
            ].map((item, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="bg-white p-4 sm:p-6 md:p-10 rounded-xl md:rounded-3xl text-center space-y-2 sm:space-y-4 md:space-y-6 shadow-sm hover:shadow-md transition-all border border-accent/20 hover:border-primary/30 group"
              >
                <div className="w-10 h-10 md:w-16 md:h-16 bg-accent/50 rounded-full flex items-center justify-center mx-auto text-primary">
                  <div className="group-hover:scale-110 transition-transform">{item.icon}</div>
                </div>
                <h3 className="text-[10px] sm:text-base md:text-xl font-serif font-bold text-secondary leading-tight">{item.title}</h3>
                <p className="text-secondary/60 text-[10px] md:text-sm font-light leading-relaxed line-clamp-3 md:line-clamp-none">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <div className="aspect-21/9 rounded-3xl overflow-hidden shadow-xl border border-accent/20 group bg-accent/10">
              <img 
                src="/images/bang-hieu.jpg" 
                alt="Bảng hiệu Ngọc Nhất Linh" 
                className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500" 
                loading="lazy" 
                decoding="async" 
              />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-8 text-secondary">Tầm Nhìn & Sứ Mệnh</h2>
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold border border-primary/20">01</div>
                <div>
                  <h4 className="text-lg font-bold mb-2 text-secondary">Tầm nhìn 2030</h4>
                  <p className="text-secondary/60 text-sm font-light leading-relaxed">Trở thành thương hiệu đá quý phong thủy hàng đầu Việt Nam, vươn tầm quốc tế với những thiết kế mang đậm bản sắc văn hóa Á Đông.</p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 text-primary font-bold border border-primary/20">02</div>
                <div>
                  <h4 className="text-lg font-bold mb-2 text-secondary">Sứ mệnh cộng đồng</h4>
                  <p className="text-secondary/60 text-sm font-light leading-relaxed">Không chỉ bán sản phẩm, chúng tôi trao đi kiến thức và giải pháp phong thủy giúp mọi người cải thiện chất lượng cuộc sống.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
