import React, { useState } from 'react';
import { DestinyResult } from '../types/product';
import { motion } from 'motion/react';
import { Search, Sparkles, Info, ArrowRight, User, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { calculateDestinyFromYear } from '../service/destinyService';

export default function Destiny() {
  const [name, setName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('Nam');
  const [result, setResult] = useState<DestinyResult | null>(null);

  // Load saved destiny on mount
  React.useEffect(() => {
    const savedDestiny = localStorage.getItem('userDestiny');
    if (savedDestiny) {
      const parsed = JSON.parse(savedDestiny);
      setResult(parsed);
      setName(parsed.userName || '');
      setYear(parsed.year || '');
    }
  }, []);

  const calculateDestiny = (e: React.FormEvent) => {
    e.preventDefault();
    if (!year) return;

    const birthYear = parseInt(year);
    const destiny = calculateDestinyFromYear(birthYear);

    const finalResult = {
      ...destiny,
      userName: name || 'Quý khách',
    };

    setResult(finalResult);
    localStorage.setItem('userDestiny', JSON.stringify(finalResult));
  };

  return (
    <div className="pt-24 pb-20 bg-white bg-pattern-subtle min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-6 text-secondary">Tra Cứu Cung Mệnh</h1>
          <p className="text-secondary/60 font-light text-lg">
            Khám phá bản mệnh của bạn dựa trên thuyết Ngũ Hành để tìm ra những loại đá quý mang lại năng lượng tương sinh, giúp cân bằng cuộc sống và thu hút tài lộc.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Form Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-accent/30 p-8 md:p-12 rounded-3xl border border-primary/20 shadow-sm relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-pattern-subtle opacity-20"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-serif font-bold mb-8 flex items-center text-secondary">
                <Search className="text-primary mr-3" /> Nhập thông tin của bạn
              </h2>
              <form onSubmit={calculateDestiny} className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-secondary/60 mb-2 uppercase tracking-widest">Họ và tên</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/40" size={18} />
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Nhập tên của bạn" 
                      className="w-full pl-12 pr-6 py-4 rounded-xl border border-accent/30 bg-white/50 focus:outline-none focus:border-primary text-secondary"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-secondary/60 mb-2 uppercase tracking-widest">Ngày sinh</label>
                    <input 
                      type="number" 
                      min="1" max="31"
                      value={day}
                      onChange={(e) => setDay(e.target.value)}
                      placeholder="Ngày" 
                      className="w-full px-4 py-4 rounded-xl border border-accent/30 bg-white/50 focus:outline-none focus:border-primary text-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-secondary/60 mb-2 uppercase tracking-widest">Tháng sinh</label>
                    <input 
                      type="number" 
                      min="1" max="12"
                      value={month}
                      onChange={(e) => setMonth(e.target.value)}
                      placeholder="Tháng" 
                      className="w-full px-4 py-4 rounded-xl border border-accent/30 bg-white/50 focus:outline-none focus:border-primary text-secondary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-secondary/60 mb-2 uppercase tracking-widest">Năm sinh</label>
                    <input 
                      type="number" 
                      min="1950" max="2026"
                      value={year}
                      onChange={(e) => setYear(e.target.value)}
                      placeholder="Năm" 
                      className="w-full px-4 py-4 rounded-xl border border-accent/30 bg-white/50 focus:outline-none focus:border-primary text-secondary"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-secondary/60 mb-2 uppercase tracking-widest">Giới tính</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setGender('Nam')}
                      className={`py-4 rounded-xl font-bold transition-all ${gender === 'Nam' ? 'bg-primary text-secondary shadow-md' : 'bg-white/50 text-secondary/40 border border-accent/20'}`}
                    >
                      Nam
                    </button>
                    <button 
                      type="button"
                      onClick={() => setGender('Nữ')}
                      className={`py-4 rounded-xl font-bold transition-all ${gender === 'Nữ' ? 'bg-primary text-secondary shadow-md' : 'bg-white/50 text-secondary/40 border border-accent/20'}`}
                    >
                      Nữ
                    </button>
                  </div>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-gradient-gold text-secondary py-5 rounded-xl font-bold text-lg hover:shadow-lg transition-all shadow-lg active:scale-95"
                >
                  TRA CỨU NGAY
                </button>
              </form>

              <div className="mt-8 flex items-start space-x-3 p-4 bg-white/30 rounded-xl border border-accent/20">
                <Info size={20} className="text-primary shrink-0 mt-1" />
                <p className="text-xs text-secondary/60 leading-relaxed">
                  Kết quả tra cứu dựa trên thuyết Ngũ Hành tương sinh tương khắc (Can Chi). Dữ liệu được tối ưu cho các năm từ 1950 đến 2026.
                </p>
              </div>
            </div>
          </motion.div>

          {/* Result Section */}
          <div className="relative">
            {!result ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6 py-20 lg:py-0">
                <div className="w-24 h-24 bg-accent/30 rounded-full flex items-center justify-center animate-bounce border border-accent/20">
                  <Sparkles size={40} className="text-primary" />
                </div>
                <h3 className="text-xl font-serif font-bold text-secondary/40">Kết quả sẽ hiển thị tại đây</h3>
                <p className="text-secondary/40 max-w-xs mx-auto text-sm">Vui lòng điền thông tin của bạn để bắt đầu hành trình khám phá bản mệnh.</p>
              </div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                <div className="bg-white p-6 md:p-10 rounded-3xl border-2 border-primary shadow-xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -mr-10 -mt-10"></div>
                  
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles size={16} className="text-primary" />
                    <span className="text-primary font-bold uppercase tracking-widest text-[10px] md:text-xs block">Kết quả tra cứu cho {result.userName}</span>
                  </div>

                  <div className="mb-8">
                    <span className="text-secondary/40 text-sm font-medium">Năm {year} ({result.canChi})</span>
                    <h3 className="text-4xl md:text-6xl font-serif font-bold text-secondary mt-1">Mệnh {result.name}</h3>
                    <p className="text-primary font-serif italic text-lg mt-2">{result.title}</p>
                  </div>

                  <div className="space-y-8">
                    <div className="p-6 bg-accent/10 rounded-2xl border border-accent/20">
                      <h4 className="text-xs font-bold text-secondary/60 uppercase mb-3 tracking-wider flex items-center">
                        <Info size={14} className="mr-2" /> Đặc điểm tính cách
                      </h4>
                      <p className="text-secondary/80 font-light leading-relaxed text-sm md:text-base">{result.description}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="text-xs font-bold text-secondary/60 uppercase mb-2 tracking-wider">Màu sắc hợp mệnh</h4>
                        <p className="text-primary font-bold text-base">{result.colors}</p>
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-secondary/60 uppercase mb-2 tracking-wider">Đá phong thủy</h4>
                        <p className="text-secondary/80 font-light text-sm">{result.stones}</p>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-accent/20">
                      <h4 className="text-xs font-bold text-secondary/60 uppercase mb-2 tracking-wider">Lời khuyên chuyên gia</h4>
                      <p className="text-secondary/80 font-medium text-sm italic">"{result.advice}"</p>
                    </div>
                  </div>
                </div>

                <div className="bg-secondary text-white p-6 md:p-8 rounded-3xl relative overflow-hidden shadow-xl group">
                  <div className="absolute inset-0 bg-pattern-subtle opacity-10"></div>
                  <div className="relative z-10">
                    <h4 className="text-lg md:text-xl font-serif font-bold mb-4">Sản phẩm dành riêng cho bạn</h4>
                    <p className="text-white/60 text-xs md:text-sm mb-6">Dựa trên mệnh {result.name}, chúng tôi đã tuyển chọn những vật phẩm mang năng lượng tương sinh tốt nhất để hỗ trợ bản mệnh của bạn.</p>
                    <Link to={`/products?category=Tất cả`} className="inline-flex items-center text-primary font-bold hover:underline">
                      Khám phá bộ sưu tập mệnh {result.name} <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
