import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
<footer className="bg-[#4d241e] text-white pt-16 pb-8 relative overflow-hidden shrink-0">
      <div className="absolute inset-0 bg-pattern-subtle opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12 mb-12">

          {/* Brand Info */}
          <div className="space-y-6 col-span-2 lg:col-span-1">
            <h3 className="text-xl font-serif font-bold italic tracking-widest text-gradient-gold">
              NGỌC NHẤT LINH
            </h3>
            <p className="text-white/60 text-sm leading-relaxed">
              Đơn vị uy tín hàng đầu trong lĩnh vực vật phẩm phong thủy và đá quý thiên nhiên. 
              Mang tinh hoa đất trời đến gần hơn với cuộc sống của bạn.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61575224635423" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300">
                <Facebook size={18} />
              </a>
              <a href="https://www.tiktok.com/@ngocnhatlinh2108" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300">
                <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                  <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a6.44 6.44 0 0 1-1.57-1.17v6.28c-.03 3.15-2.1 6.35-5.22 7.13-2.15.52-4.58.04-6.39-1.23A7.43 7.43 0 0 1 2 12.33c.02-3.76 3.46-7.25 7.21-7.25.88 0 1.74.19 2.54.55V9.65c-.84-.35-1.77-.5-2.66-.35-1.22.21-2.3.93-2.91 2.01-.57 1.08-.63 2.45-.08 3.5.55 1.05 1.61 1.83 2.79 2.05 1.35.25 2.87-.19 3.65-1.33.45-.65.66-1.44.64-2.22V0h.01z"/>
                </svg>
              </a>
              <a href="mailto:daphongthuyngocnhatlinh@gmail.com" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300">
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-serif font-bold mb-6 text-accent">Sản phẩm</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link to="/products?category=vong-tay" className="hover:text-primary transition-colors">Vòng tay phong thủy</Link></li>
              <li><Link to="/products?category=mat-day" className="hover:text-primary transition-colors">Mặt dây chuyền</Link></li>
              <li><Link to="/products?category=tuong-phat" className="hover:text-primary transition-colors">Tượng phật đá quý</Link></li>
              <li><Link to="/products?category=vat-pham" className="hover:text-primary transition-colors">Vật phẩm để bàn</Link></li>
              <li><Link to="/products?category=qua-tang" className="hover:text-primary transition-colors">Quà tặng doanh nghiệp</Link></li>
            </ul>
          </div>

          {/* Policies */}
          <div>
            <h4 className="text-lg font-serif font-bold mb-6 text-accent">Chính sách</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li><Link to="/about" className="hover:text-primary transition-colors">Về chúng tôi</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Vận chuyển & Giao nhận</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Đổi trả & Hoàn tiền</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

          {/* Contact & Maps */}
          <div className="col-span-2 lg:col-span-1">

            <h4 className="text-lg font-serif font-bold mb-6 text-accent">Liên hệ</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary mt-0.5 shrink-0" />
                <a 
                  href="https://www.google.com/maps/search/?api=1&query=65+%C4%90%C6%B0%E1%BB%9Dng+3%2F2+Ph%C6%B0%E1%BB%9Dng+T%C3%A2n+An+Th%C3%A0nh+Ph%E1%BB%91+C%E1%BA%A7n+Th%C6%A1"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  65 Đường 3/2 Phường Tân An Thành Phố Cần Thơ
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-primary shrink-0" />
                <a href="tel:0902111626" className="hover:text-primary transition-colors">0902 111 626</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-primary shrink-0" />
                <span>daphongthuyngocnhatlinh@gmail.com</span>
              </li>
            </ul>
          </div>

          {/* Map Section */}
          <div className="col-span-2 lg:col-span-4 mt-8">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3555.552830988385!2d105.75481205280464!3d10.01572032227409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a089f9b67e85ff%3A0xb7931ccbde2bcddc!2zxJDDoSBQaG9uZyBUaOG7p3kgQ-G6p24gVGjGoSAtIE5n4buNYyBOaOG6pXQgTGluaA!5e1!3m2!1svi!2s!4v1774104483785!5m2!1svi!2s" 
              width="100%" 
              height="300" 
              style={{border:0}} 
              allowFullScreen={true} 
              referrerPolicy="no-referrer-when-downgrade"
              title="Ngọc Nhất Linh - Cần Thơ"
              className="rounded-2xl w-full drop-shadow-lg"
              loading="lazy"
            />
          </div>
        </div>


        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 mt-12">
          <p className="text-xs text-white/40">
            © 2024 NGỌC NHẤT LINH. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link to="/contact" className="text-xs text-white/40 hover:text-white transition-colors">Điều khoản sử dụng</Link>
            <Link to="/contact" className="text-xs text-white/40 hover:text-white transition-colors">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
