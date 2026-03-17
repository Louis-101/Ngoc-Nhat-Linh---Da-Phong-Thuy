import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Share2, Shield, Truck, RotateCcw, MessageCircle, Star, Facebook, Sparkles, Search } from 'lucide-react';
import { supabase } from '../service/supabaseClient';
import { useWishlist } from '../Context/WishlistContext';
import { calculateDestinyFromYear, DestinyResult } from '../service/destinyService';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userDestiny, setUserDestiny] = useState<DestinyResult | null>(null);
  const [birthYearInput, setBirthYearInput] = useState('');
  const [suggestedProducts, setSuggestedProducts] = useState<any[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const { toggleWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const saved = localStorage.getItem('userDestiny');
    if (saved) {
      setUserDestiny(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (userDestiny) {
      fetchSuggestedProducts(userDestiny.name);
    }
  }, [userDestiny]);

  async function fetchSuggestedProducts(elementName: string) {
    setSuggestionsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('description', `%${elementName}%`)
        .limit(4);
      
      if (error) throw error;
      setSuggestedProducts(data || []);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    } finally {
      setSuggestionsLoading(false);
    }
  }

  const handleDestinySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const year = parseInt(birthYearInput);
    if (year >= 1950 && year <= 2026) {
      const result = calculateDestinyFromYear(year);
      setUserDestiny(result);
      localStorage.setItem('userDestiny', JSON.stringify(result));
    }
  };

  useEffect(() => {
    async function fetchProduct() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        setProduct(data);
      } catch (err) {
        console.error('Error fetching product:', err);
        // Fallback mock data
        setProduct({
          id: id,
          name: 'Vòng Tay Thạch Anh Tóc Vàng 12ly',
          price: 4500000,
          description: 'Pháp bảo chiêu tài, dẫn lộc và gia tăng vượng khí cho chủ nhân. Chế tác từ đá Thạch Anh Tóc Vàng tự nhiên 100%, chứa các sợi tinh thể rutil vàng rực rỡ như những tia nắng, tượng trưng cho sự thịnh vượng và quyền uy.',
          image_url: 'https://picsum.photos/seed/gem1/800/800',
          category: 'Vòng tay',
          meaning: 'Thạch anh tóc vàng (Golden Rutilated Quartz) là một trong những biến thể quý hiếm và quyền năng nhất trong dòng họ thạch anh. Những sợi tóc bên trong đá chính là các tinh thể Rutil hình kim, hình trụ có màu vàng rực rỡ dưới ánh sáng.',
          specs: {
            material: 'Thạch anh tóc vàng tự nhiên',
            size: '12 ly',
            count: '17-18 hạt (tùy size cổ tay)',
            certification: 'SJC / PNJ Lab'
          }
        });
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) return <div className="pt-32 pb-20 text-center">Đang tải...</div>;
  if (!product) return <div className="pt-32 pb-20 text-center">Không tìm thấy sản phẩm.</div>;

  return (
    <div className="pt-24 pb-20 bg-white bg-pattern-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex text-xs text-gray-400 mb-8 space-x-2">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">Sản phẩm</Link>
          <span>/</span>
          <span className="text-secondary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-accent/10 border border-accent/20 shadow-sm">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-accent/5 border border-accent/10 cursor-pointer hover:border-primary transition-colors">
                  <img src={`https://picsum.photos/seed/gem${i+10}/200/200`} alt="Gallery" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-8">
            <div>
              <span className="bg-accent text-primary-dark text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block shadow-sm">Premium Edition</span>
              <h1 className="text-3xl md:text-4xl font-serif font-bold mb-4 text-secondary">{product.name}</h1>
              <p className="text-2xl font-bold text-primary mb-6">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </p>
              <div className="flex items-center space-x-4 mb-6">
                <span className="flex items-center text-xs text-primary"><Star size={14} className="fill-current mr-1" /> 4.9 (48 đánh giá)</span>
                <span className="text-accent">|</span>
                <span className="text-xs text-gray-400">Mã SP: NNL-{product.id?.slice(0, 5)}</span>
              </div>
              <p className="text-gray-600 leading-relaxed font-light">
                {product.description}
              </p>
            </div>

            <div className="space-y-4 pt-6 border-t border-accent">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                <a 
                  href="https://zalo.me/0902111626" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-grow bg-[#0068FF] text-white py-4 rounded-full font-bold flex items-center justify-center space-x-3 hover:bg-[#0056d6] transition-all shadow-lg hover:shadow-xl active:scale-95"
                >
                  <MessageCircle size={22} />
                  <span>TƯ VẤN QUA ZALO</span>
                </a>
                <button 
                  onClick={() => toggleWishlist(product)}
                  className={`p-4 rounded-full border transition-all flex items-center justify-center ${isInWishlist(product.id) ? 'bg-red-50 border-red-200 text-red-500' : 'border-accent text-gray-400 hover:border-primary hover:text-primary'}`}
                >
                  <Heart size={22} className={isInWishlist(product.id) ? 'fill-current' : ''} />
                  <span className="sm:hidden ml-2 font-bold">Yêu thích</span>
                </button>
              </div>
              
              <a 
                href="https://www.facebook.com/profile.php?id=61575224635423" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-full bg-secondary text-white py-4 rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-all duration-300 active:scale-95 flex items-center justify-center space-x-3"
              >
                <Facebook size={22} />
                <span>TƯ VẤN QUA FACEBOOK</span>
              </a>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6">
              <div className="flex items-center space-x-3 text-xs text-secondary/60">
                <Shield size={18} className="text-primary" />
                <span>Kiểm định PNJ/SJC</span>
              </div>
              <div className="flex items-center space-x-3 text-xs text-secondary/60">
                <Truck size={18} className="text-primary" />
                <span>Giao hàng hỏa tốc</span>
              </div>
            </div>
          </div>
        </div>

        {/* Details Tabs */}
        <div className="border-t border-accent pt-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
            <div className="lg:col-span-2 space-y-12">
              <section>
                <h2 className="text-2xl font-serif font-bold mb-6 text-secondary">Ý nghĩa đá {product.name}</h2>
                <p className="text-gray-600 leading-relaxed font-light mb-6">
                  {product.meaning || 'Đang cập nhật ý nghĩa phong thủy cho sản phẩm này...'}
                </p>
                <div className="aspect-video rounded-3xl overflow-hidden bg-accent/10 mb-8 border border-accent/20">
                  <img src="https://picsum.photos/seed/detail/1200/800" alt="Detail" className="w-full h-full object-cover" />
                </div>
              </section>

              <section>
                <h2 className="text-2xl font-serif font-bold mb-6 text-secondary">Chế tác thủ công tinh xảo</h2>
                <p className="text-gray-600 leading-relaxed font-light">
                  Mỗi viên đá tại Ngọc Nhất Linh đều được tuyển chọn kỹ lưỡng về độ trong và mật độ tóc. Chúng tôi cam kết quá trình mài giũa hoàn toàn thủ công, giữ trọn năng lượng nguyên bản của đất trời.
                </p>
              </section>
            </div>

            <div className="space-y-8">
              <div className="bg-accent/30 p-8 rounded-3xl border border-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern-subtle opacity-30"></div>
                <div className="relative z-10">
                  <h3 className="text-lg font-serif font-bold mb-6 flex items-center text-secondary">
                    <Shield size={20} className="text-primary mr-2" /> Thông số sản phẩm
                  </h3>
                  <ul className="space-y-4 text-sm">
                    <li className="flex justify-between border-b border-accent/50 pb-2">
                      <span className="text-secondary/60">Loại đá</span>
                      <span className="font-medium text-secondary">{product.specs?.material || 'Đá tự nhiên'}</span>
                    </li>
                    <li className="flex justify-between border-b border-accent/50 pb-2">
                      <span className="text-secondary/60">Kích thước hạt</span>
                      <span className="font-medium text-secondary">{product.specs?.size || 'Đang cập nhật'}</span>
                    </li>
                    <li className="flex justify-between border-b border-accent/50 pb-2">
                      <span className="text-secondary/60">Số lượng hạt</span>
                      <span className="font-medium text-secondary">{product.specs?.count || 'Đang cập nhật'}</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-secondary/60">Kiểm định</span>
                      <span className="text-primary font-bold">{product.specs?.certification || 'PNJ / SJC'}</span>
                    </li>
                  </ul>
                  <div className="mt-8 p-4 bg-white/50 rounded-xl text-[10px] text-secondary/40 leading-relaxed italic border border-accent/30">
                    Sản phẩm đi kèm: Hộp đựng lót nhung cao cấp, dây dự phòng, kim xỏ, khăn lau đá chuyên dụng.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Destiny Suggestions Section */}
        <div className="mt-20 pt-20 border-t border-accent">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-secondary mb-4">Sản Phẩm Hợp Bản Mệnh</h2>
            <p className="text-secondary/60 max-w-2xl mx-auto">Khám phá những vật phẩm phong thủy được tuyển chọn riêng cho cung mệnh của bạn.</p>
          </div>

          {!userDestiny ? (
            <div className="max-w-xl mx-auto bg-accent/20 p-8 rounded-3xl border border-primary/20 text-center">
              <Sparkles className="text-primary mx-auto mb-4" size={32} />
              <h3 className="text-xl font-serif font-bold text-secondary mb-4">Bạn thuộc mệnh gì?</h3>
              <p className="text-sm text-secondary/60 mb-6">Nhập năm sinh để chúng tôi gợi ý những sản phẩm mang lại năng lượng tốt nhất cho bạn.</p>
              <form onSubmit={handleDestinySubmit} className="flex flex-col sm:flex-row gap-4">
                <input 
                  type="number" 
                  min="1950" 
                  max="2026"
                  value={birthYearInput}
                  onChange={(e) => setBirthYearInput(e.target.value)}
                  placeholder="Nhập năm sinh (VD: 1990)" 
                  className="flex-grow px-6 py-4 rounded-xl border border-accent/30 bg-white focus:outline-none focus:border-primary text-secondary"
                  required
                />
                <button 
                  type="submit"
                  className="bg-primary text-secondary px-8 py-4 rounded-xl font-bold hover:shadow-lg transition-all active:scale-95 whitespace-nowrap"
                >
                  XEM GỢI Ý
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-12">
              <div className="flex flex-col md:flex-row items-center justify-between bg-white p-6 rounded-2xl border border-primary/20 shadow-sm gap-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Sparkles className="text-primary" size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-secondary/40 font-bold uppercase tracking-widest">Bản mệnh của bạn</p>
                    <h4 className="text-xl font-serif font-bold text-secondary">Mệnh {userDestiny.name} ({userDestiny.canChi} - {userDestiny.year})</h4>
                  </div>
                </div>
                <button 
                  onClick={() => setUserDestiny(null)}
                  className="text-xs text-primary font-bold hover:underline"
                >
                  Thay đổi năm sinh
                </button>
              </div>

              {suggestionsLoading ? (
                <div className="text-center py-12 text-secondary/40">Đang tìm kiếm sản phẩm phù hợp...</div>
              ) : suggestedProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {suggestedProducts.map((item) => (
                    <Link 
                      key={item.id} 
                      to={`/product/${item.id}`}
                      className="group"
                      onClick={() => window.scrollTo(0, 0)}
                    >
                      <div className="aspect-square rounded-2xl overflow-hidden bg-accent/10 mb-4 border border-accent/20 group-hover:border-primary transition-colors">
                        <img 
                          src={item.image_url} 
                          alt={item.name} 
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <h5 className="font-serif font-bold text-secondary group-hover:text-primary transition-colors line-clamp-1">{item.name}</h5>
                      <p className="text-primary font-bold text-sm mt-1">
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}
                      </p>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-accent/10 rounded-2xl border border-dashed border-accent/40">
                  <p className="text-secondary/40 italic">Hiện chưa có sản phẩm gợi ý cụ thể cho mệnh {userDestiny.name}. Vui lòng liên hệ để được tư vấn trực tiếp.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
