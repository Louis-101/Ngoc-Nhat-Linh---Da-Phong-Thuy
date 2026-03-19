import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-white pt-16 pb-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-pattern-subtle opacity-10"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Info */}
          <div className="space-y-6">
            <h3 className="text-2xl font-serif font-bold tracking-tighter text-gradient-gold">
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
              <a href="#" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:bg-primary hover:border-primary transition-all duration-300">
                <Instagram size={18} />
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
              <li><Link to="/shipping" className="hover:text-primary transition-colors">Vận chuyển & Giao nhận</Link></li>
              <li><Link to="/returns" className="hover:text-primary transition-colors">Đổi trả & Hoàn tiền</Link></li>
              <li><Link to="/privacy" className="hover:text-primary transition-colors">Chính sách bảo mật</Link></li>
              <li><Link to="/faq" className="hover:text-primary transition-colors">Câu hỏi thường gặp</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-serif font-bold mb-6 text-accent">Liên hệ</h4>
            <ul className="space-y-4 text-sm text-white/60">
              <li className="flex items-start space-x-3">
                <MapPin size={18} className="text-primary mt-0.5 flex-shrink-0" />
                <a 
                  href="https://www.bing.com/maps/default.aspx?v=2&pc=FACEBK&mid=8100&where1=65%20đường%203/2%2C%20phường%20Hưng%20Lợi%2C%20Quận%20Ninh%20Kiều%2C%20Thành%20phố%20Cần%20Thơ%2C%20Vietnam%2C%2090000&FORM=FBKPL1&mkt=en-GB" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  Số 65 đường 3/2, phường Hưng Lợi, Quận Ninh Kiều, TP. Cần Thơ
                </a>
              </li>
              <li className="flex items-center space-x-3">
                <Phone size={18} className="text-primary flex-shrink-0" />
                <a href="tel:0902111626" className="hover:text-primary transition-colors">0902 111 626</a>
              </li>
              <li className="flex items-center space-x-3">
                <Mail size={18} className="text-primary flex-shrink-0" />
                <span>daphongthuyngocnhatlinh@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-xs text-white/40">
            © 2024 Ngọc Nhất Linh. All rights reserved.
          </p>
          <div className="flex items-center space-x-6">
            <Link to="/terms" className="text-xs text-white/40 hover:text-white transition-colors">Điều khoản sử dụng</Link>
            <Link to="/privacy" className="text-xs text-white/40 hover:text-white transition-colors">Chính sách bảo mật</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
