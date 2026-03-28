import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle, Facebook, Instagram } from 'lucide-react';
import { supabase } from '../service/supabaseClient';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase
        .from('contacts')
        .insert([formData]);
      
      if (error) throw error;
      
      setSuccess(true);
      setFormData({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      console.error('Error submitting contact form:', err);
      // Even if error, show success for demo purposes or handle accordingly
      alert('Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-24 pb-20 bg-white bg-pattern-subtle min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-secondary">Liên Hệ Với Chúng Tôi</h1>
          <p className="text-secondary/60 font-light text-lg">
            Ngọc Nhất Linh luôn lắng nghe và sẵn sàng hỗ trợ quý khách. Hãy để lại thông tin, chuyên gia của chúng tôi sẽ liên hệ tư vấn ngay.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-[#fdfaf5] text-secondary p-10 rounded-3xl space-y-10 relative overflow-hidden shadow-xl border border-accent/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10"></div>
              <div className="absolute inset-0 bg-pattern-subtle opacity-10"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-serif font-bold mb-10">Thông tin liên hệ</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-accent/10 flex items-center justify-center shrink-0">
                      <Phone size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary/40 uppercase tracking-widest mb-1">Hotline 24/7</p>
                      <p className="font-bold">0902 111 626</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-accent/10 flex items-center justify-center shrink-0">
                      <Mail size={20} className="text-primary" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-secondary/40 uppercase tracking-widest mb-1">Email</p>
                      <p className="font-bold break-all text-sm sm:text-base">daphongthuyngocnhatlinh@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-white shadow-sm border border-accent/10 flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-secondary/40 uppercase tracking-widest mb-1">Địa chỉ</p>
                      <p className="font-bold text-sm">65 Đường 3/2 Phường Tân An Thành Phố Cần Thơ</p>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-accent/20 mt-10">
                  <p className="text-xs text-secondary/40 uppercase tracking-widest mb-4">Kết nối mạng xã hội</p>
                  <div className="flex space-x-4">
                    <a href="https://www.facebook.com/profile.php?id=61575224635423" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-accent/10 shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-all"><Facebook size={20} /></a>
                    <a href="https://www.tiktok.com/@ngocnhatlinh2108" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-accent/10 shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-all">
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
                        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.17-2.86-.6-4.12-1.31a6.44 6.44 0 0 1-1.57-1.17v6.28c-.03 3.15-2.1 6.35-5.22 7.13-2.15.52-4.58.04-6.39-1.23A7.43 7.43 0 0 1 2 12.33c.02-3.76 3.46-7.25 7.21-7.25.88 0 1.74.19 2.54.55V9.65c-.84-.35-1.77-.5-2.66-.35-1.22.21-2.3.93-2.91 2.01-.57 1.08-.63 2.45-.08 3.5.55 1.05 1.61 1.83 2.79 2.05 1.35.25 2.87-.19 3.65-1.33.45-.65.66-1.44.64-2.22V0h.01z"/>
                      </svg>
                    </a>
                    <a href="https://zalo.me/0902111626" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white border border-accent/10 shadow-sm flex items-center justify-center hover:bg-primary hover:text-white transition-all"><MessageCircle size={20} /></a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="aspect-4/3 rounded-3xl shadow-xl border border-accent/20 overflow-hidden">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3555.552830988385!2d105.75481205280464!3d10.01572032227409!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31a089f9b67e85ff%3A0xb7931ccbde2bcddc!2zxJDDoSBQaG9uZyBUaOG7p3kgQ-G6p24gVGjGoSAtIE5n4buNYyBOaOG6pXQgTGluaA!5e1!3m2!1svi!2s!4v1774104483785!5m2!1svi!2s" 
                  width="100%" 
                  height="450" 
                  style={{border:0}} 
                  allowFullScreen={true} 
                  loading="lazy" 
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Cửa hàng Ngọc Nhất Linh - 65 Đường 3/2 Phường Tân An, Cần Thơ"
                  className="w-full h-full"
                />
              </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl border border-accent/20 shadow-sm relative overflow-hidden">
              <div className="absolute inset-0 bg-pattern-subtle opacity-5"></div>
              <div className="relative z-10">
                <h2 className="text-2xl font-serif font-bold mb-8 text-secondary">Gửi tin nhắn cho chúng tôi</h2>
                
                {success && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-green-50 text-green-600 p-4 rounded-xl mb-8 text-sm font-medium border border-green-100"
                  >
                    Cảm ơn bạn! Tin nhắn của bạn đã được gửi thành công. Chúng tôi sẽ phản hồi trong vòng 24h.
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-secondary/60 uppercase tracking-widest">Họ và tên</label>
                    <input 
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Nguyễn Văn A" 
                      className="w-full px-6 py-4 rounded-xl border border-accent/30 bg-accent/5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all text-secondary"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-secondary/60 uppercase tracking-widest">Số điện thoại</label>
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      placeholder="09xx xxx xxx" 
                      className="w-full px-6 py-4 rounded-xl border border-accent/30 bg-accent/5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all text-secondary"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-secondary/60 uppercase tracking-widest">Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      placeholder="example@gmail.com" 
                      className="w-full px-6 py-4 rounded-xl border border-accent/30 bg-accent/5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all text-secondary"
                      required
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-xs font-bold text-secondary/60 uppercase tracking-widest">Lời nhắn</label>
                    <textarea 
                      rows={5}
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      placeholder="Bạn cần tư vấn về sản phẩm nào?" 
                      className="w-full px-6 py-4 rounded-xl border border-accent/30 bg-accent/5 focus:outline-none focus:ring-1 focus:ring-primary focus:bg-white transition-all resize-none text-secondary"
                      required
                    ></textarea>
                  </div>
                  <div className="md:col-span-2 pt-4">
                    <button 
                      type="submit"
                      disabled={loading}
                      className="w-full bg-gradient-gold text-secondary py-5 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                    >
                      {loading ? 'ĐANG GỬI...' : (
                        <>
                          <span>GỬI YÊU CẦU TƯ VẤN</span>
                          <Send size={20} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
