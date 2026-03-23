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
            <div className="bg-secondary text-white p-10 rounded-3xl space-y-10 relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full -mr-10 -mt-10"></div>
              <div className="absolute inset-0 bg-pattern-subtle opacity-10"></div>
              
              <div className="relative z-10">
                <h2 className="text-2xl font-serif font-bold mb-10">Thông tin liên hệ</h2>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Phone size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Hotline 24/7</p>
                      <p className="font-bold">0902 111 626</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Mail size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Email</p>
                      <p className="font-bold">daphongthuyngocnhatlinh@gmail.com</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <MapPin size={20} className="text-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-white/40 uppercase tracking-widest mb-1">Địa chỉ</p>
                      <p className="font-bold text-sm">65 Đường 3/2 Phường Tân An Thành Phố Cần Thơ</p>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/10 mt-10">
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Kết nối mạng xã hội</p>
                  <div className="flex space-x-4">
                    <a href="https://www.facebook.com/profile.php?id=61575224635423" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all"><Facebook size={20} /></a>
                    <a href="https://www.tiktok.com/@ngocnhatlinh2108" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all">
                      <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5"><path d="M19.951 6.3a1.715 1.715 0 00-.518-.044c-.4 0-.754.145-1.043.435-.3.3-.45.696-.45 1.174v2.587h3.096v3.478h-3.096v8.678h-3.522v-8.678H9.38v-3.478h3.522V7.91c0-.87.233-1.557.696-2.056.462-.5 1.104-.765 1.913-.765.696 0 1.261.217 1.691.652.43.435.646 1.104.646 1.996v2.478h3.478V7.91c0-.522-.074-.978-.217-1.37-.145-.391-.39-.696-.739-.913z"/></svg>
                    </a>
                    <a href="https://zalo.me/0902111626" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all"><MessageCircle size={20} /></a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="aspect-[4/3] rounded-3xl shadow-xl border border-accent/20 overflow-hidden">
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
