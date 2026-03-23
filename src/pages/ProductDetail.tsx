import React, { useState, useEffect } from 'react';
import { Product, DestinyResult } from '../types/product';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Share2, Shield, Truck, RotateCcw, MessageCircle, Star, Facebook, Sparkles, Phone } from 'lucide-react';
import { supabase } from '../service/supabaseClient';
import { useWishlist } from '../Context/WishlistContext';
import { calculateDestinyFromYear } from '../service/destinyService';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [userDestiny, setUserDestiny] = useState(null);
  const [birthYearInput, setBirthYearInput] = useState('');
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('meaning');
  const [mainImage, setMainImage] = useState('');
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

  async function fetchSuggestedProducts(elementName) {
    setSuggestionsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .ilike('description', `%${elementName}%`)
        .limit(4)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setSuggestedProducts((data || []) as Product[]);
    } catch (err) {
      console.error('Error fetching suggestions:', err);
    } finally {
      setSuggestionsLoading(false);
    }
  }

  const handleDestinySubmit = (e) => {
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
        setMainImage(data?.image_url || '');
      } catch (err) {
        console.error('Error fetching product:', err);
        // Fallback data
        const fallback = {
          id: id,
          name: 'Vòng Tay Thạch Anh Tóc Vàng 12ly',
          price: 4500000,
          description: 'Pháp bảo chiêu tài, dẫn lộc và gia tăng vượng khí cho chủ nhân.',
          image_url: 'https://picsum.photos/seed/gem1/800/800',
          category: 'Vòng tay',
          meaning: 'Thạch anh tóc vàng quyền năng giúp tăng tài lộc, bình an và thịnh vượng.',
          specs: {
            material: 'Thạch anh tóc vàng tự nhiên',
            size: '12 ly',
            count: '17-18 hạt',
            certification: 'SJC / PNJ Lab'
          },
          images: [
            'https://picsum.photos/seed/gem11/800/800', 
            'https://picsum.photos/seed/gem12/800/800', 
            'https://picsum.photos/seed/gem13/800/800', 
            'https://picsum.photos/seed/gem14/800/800'
          ]
        };
        setProduct(fallback);
        setMainImage(fallback.image_url);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const handleThumbClick = (img) => {
    setMainImage(img);
  };

  if (loading) return (
    <div className="min-h-screen pt-24 pb-20 text-center bg-gradient-to-b from-beige-subtle to-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="animate-pulse space-y-8">
          <div className="aspect-square w-full max-w-md mx-auto bg-accent/20 rounded-3xl"></div>
          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="h-12 bg-accent/20 rounded-2xl w-3/4 mx-auto"></div>
            <div className="h-8 bg-accent/20 rounded-xl w-1/2 mx-auto"></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen pt-24 pb-20 text-center">
      <h1 className="text-2xl font-serif font-bold text-secondary">Không tìm thấy sản phẩm</h1>
    </div>
  );

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gradient-to-b from-beige-subtle to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex text-sm md:text-base text-gray-500 mb-8 space-x-2">
          <Link to="/" className="hover:text-primary transition-colors font-medium">Trang chủ</Link>
          <span> / </span>
          <Link to="/products" className="hover:text-primary transition-colors font-medium">Sản phẩm</Link>
          <span> / </span>
          <span className="text-secondary font-bold">{product.name}</span>
        </nav>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mb-16 items-start">
          {/* Image Gallery */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 order-1 lg:order-1"
          >
            {/* Main Image */}
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-50 shadow-xl group cursor-pointer">
              <img 
                src={mainImage} 
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
            {/* Thumbnails */}
            <div className="flex gap-3 no-scrollbar overflow-x-auto pb-2">
              {(product.images || [product.image_url]).slice(0,5).map((imgUrl, i) => (
                <motion.button
                  key={i}
                  className={`flex-shrink-0 w-20 aspect-square rounded-xl overflow-hidden border-4 transition-all ${
                    mainImage === imgUrl ? 'border-primary shadow-lg scale-105' : 'border-transparent hover:border-primary/50'
                  }`}
                  onClick={() => handleThumbClick(imgUrl)}
                  whileTap={{ scale: 0.95 }}
                >
                  <img src={imgUrl} alt={`Thumbnail ${i+1}`} className="w-full h-full object-cover" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Product Info */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8 lg:max-w-lg order-2 lg:order-2"
          >
            <div className="space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight">
                {product.name}
              </h1>
              <div className="flex items-baseline space-x-2">
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary">
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
                </p>
                <span className="text-sm text-gray-400 uppercase tracking-wider font-medium">{product.category}</span>
              </div>
              <p className="text-gray-600 leading-relaxed text-lg sm:text-xl">
                {product.description}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Link 
                to="https://zalo.me/0902111626"
                target="_blank"
                className="block w-full bg-gradient-gold text-secondary py-5 px-8 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center justify-center space-x-3"
              >
                <Phone size={24} />
                <span>TƯ VẤN ZALO NGAY</span>
              </Link>
              <button 
                onClick={() => toggleWishlist(product)}
                className="w-full p-5 border-2 border-primary/30 rounded-2xl flex items-center justify-center space-x-3 hover:bg-primary/5 hover:border-primary hover:shadow-lg transition-all font-semibold text-lg"
              >
                <Heart size={24} fill={isInWishlist(product.id) ? 'currentColor' : 'none'} className="text-primary" />
                <span>{isInWishlist(product.id) ? 'ĐÃ THÊM VÀO YÊU THÍCH' : 'THÊM VÀO YÊU THÍCH'}</span>
              </button>
            </div>

            {/* Consult Section */}
            <div className="pt-8 border-t border-gray-200">
              <h3 className="text-2xl font-serif font-bold mb-6 text-secondary">Tư vấn miễn phí</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <a 
                  href="https://m.me/61575224635423"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-blue-600 text-white p-5 rounded-xl flex items-center space-x-4 hover:bg-blue-700 hover:shadow-xl transition-all font-semibold shadow-lg"
                >
                  <Facebook size={28} className="group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-bold text-lg">Facebook Messenger</div>
                    <div className="text-sm opacity-90">Tư vấn nhanh qua Messenger</div>
                  </div>
                </a>
                <a 
                  href="https://zalo.me/0902111626"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group bg-green-500 text-white p-5 rounded-xl flex items-center space-x-4 hover:bg-green-600 hover:shadow-xl transition-all font-semibold shadow-lg"
                >
                  <MessageCircle size={28} className="group-hover:scale-110 transition-transform" />
                  <div>
                    <div className="font-bold text-lg">Zalo</div>
                    <div className="text-sm opacity-90">Chat Zalo 24/7</div>
                  </div>
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Tabs Section */}
        <div className="max-w-6xl mx-auto">
          <div className="flex bg-white/50 backdrop-blur-md rounded-3xl p-1 shadow-xl mb-12">
            <button 
              className={`flex-1 py-4 px-6 rounded-2xl font-serif font-bold text-lg transition-all ${
                activeTab === 'meaning' ? 'bg-white shadow-lg text-secondary' : 'text-secondary/60 hover:text-secondary'
              }`}
              onClick={() => setActiveTab('meaning')}
            >
              Ý nghĩa phong thủy
            </button>
            <button 
              className={`flex-1 py-4 px-6 rounded-2xl font-serif font-bold text-lg transition-all ${
                activeTab === 'specs' ? 'bg-white shadow-lg text-secondary' : 'text-secondary/60 hover:text-secondary'
              }`}
              onClick={() => setActiveTab('specs')}
            >
              Thông số kỹ thuật
            </button>
          </div>

          {/* Tab Content */}
          <div className="space-y-12">
            {activeTab === 'meaning' && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-serif font-bold mb-8 text-secondary">Ý nghĩa & Năng lượng</h2>
                <p className="text-gray-600 leading-relaxed text-lg max-w-4xl mb-12">
                  {product.meaning}
                </p>
                <div className="aspect-[16/9] md:aspect-video rounded-3xl overflow-hidden bg-gray-50 shadow-2xl">
                  <img src="https://picsum.photos/seed/ngoc-hoang-long/1200/675" alt="Đá quý tự nhiên" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                </div>
              </motion.section>
            )}

            {activeTab === 'specs' && (
              <motion.section 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h2 className="text-3xl font-serif font-bold mb-12 text-secondary">Thông số chi tiết</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-3xl">
                  {Object.entries(product.specs || {}).map(([key, value]) => (
                    <div key={key} className="bg-white/50 backdrop-blur-sm p-6 rounded-2xl border border-accent/20 shadow-lg hover:shadow-xl transition-all group">
                      <h4 className="font-serif font-bold text-lg text-secondary mb-2 capitalize">{key.replace('_', ' ')}:</h4>
                      <p className="text-xl font-bold text-primary group-hover:text-primary-dark">{String(value)}</p>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </div>
        </div>

        {/* Suggested Products */}
        {suggestedProducts.length > 0 && (
          <motion.section 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="max-w-7xl mx-auto mt-32"
          >
            <h2 className="text-3xl font-serif font-bold mb-12 text-center text-secondary">
              Sản phẩm phù hợp với mệnh của bạn
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {suggestedProducts.map((suggestion) => (
                <Link key={suggestion.id} to={`/product/${suggestion.id}`} className="group">
                  <div className="aspect-square rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2">
                    <img 
                      src={suggestion.image_url} 
                      alt={suggestion.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h4 className="font-serif font-bold text-lg group-hover:text-primary transition-colors mb-2 line-clamp-1">{suggestion.name}</h4>
                    <p className="text-primary font-bold text-xl">
                      {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(suggestion.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}

