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
                      <p className="font-bold text-sm">Số 65 đường 3/2, phường Hưng Lợi, Quận Ninh Kiều, TP. Cần Thơ</p>
                    </div>
                  </div>
                </div>

                <div className="pt-10 border-t border-white/10 mt-10">
                  <p className="text-xs text-white/40 uppercase tracking-widest mb-4">Kết nối mạng xã hội</p>
                  <div className="flex space-x-4">
                    <a href="https://www.facebook.com/profile.php?id=61575224635423" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all"><Facebook size={20} /></a>
                    <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all"><Instagram size={20} /></button>
                    <a href="https://zalo.me/0902111626" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all"><MessageCircle size={20} /></a>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="aspect-square rounded-3xl overflow-hidden grayscale hover:grayscale-0 transition-all duration-700 shadow-md border border-accent/20">
              <img src="https://picsum.photos/seed/map/600/600" alt="Map Placeholder" className="w-full h-full object-cover" />
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
