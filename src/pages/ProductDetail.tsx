import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, Share2, Shield, Truck, RotateCcw, MessageCircle, Star, Facebook, Sparkles, Search } from 'lucide-react';
import { supabase } from '../service/supabaseClient';
import { useWishlist } from '../Context/WishlistContext';
import { calculateDestinyFromYear, DestinyResult } from '../service/destinyService';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userDestiny, setUserDestiny] = useState(null);
  const [birthYearInput, setBirthYearInput] = useState('');
  const [suggestedProducts, setSuggestedProducts] = useState([]);
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

  async function fetchSuggestedProducts(elementName) {
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
      } catch (err) {
        console.error('Error fetching product:', err);
        setProduct({
          id: id,
          name: 'Vòng Tay Thạch Anh Tóc Vàng 12ly',
          price: 4500000,
          description: 'Pháp bảo chiêu tài, dẫn lộc và gia tăng vượng khí cho chủ nhân.',
          image_url: 'https://picsum.photos/seed/gem1/800/800',
          category: 'Vòng tay',
          meaning: 'Thạch anh tóc vàng quyền năng.',
          specs: {
            material: 'Thạch anh tóc vàng tự nhiên',
            size: '12 ly',
            count: '17-18 hạt',
            certification: 'SJC / PNJ Lab'
          },
          images: ['https://picsum.photos/seed/gem11/200/200', 'https://picsum.photos/seed/gem12/200/200', 'https://picsum.photos/seed/gem13/200/200', 'https://picsum.photos/seed/gem14/200/200']
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
    <div className="pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <nav className="flex text-xs text-gray-400 mb-8 space-x-2">
          <Link to="/" className="hover:text-primary">Trang chủ</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-primary">Sản phẩm</Link>
          <span>/</span>
          <span className="text-secondary">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-20">
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100">
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="grid grid-cols-4 gap-4">
              {(product.images || []).slice(0,4).map((imgUrl, i) => (
                <div key={i} className="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer hover:border-primary transition-colors border">
                  <img src={imgUrl} alt={`Gallery ${i+1}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">{product.name}</h1>
              <p className="text-2xl font-bold text-blue-600 mb-6">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}
              </p>
              <p className="text-gray-600">
                {product.description}
              </p>
            </div>

            <div className="space-y-4">
              <a href="https://zalo.me/0902111626" target="_blank" className="block w-full bg-blue-500 text-white py-4 rounded-xl font-bold text-center">
                TƯ VẤN ZALO
              </a>
              <button 
                onClick={() => toggleWishlist(product)}
                className="w-full p-4 border rounded-xl flex items-center justify-center space-x-2"
              >
                <Heart size={20} />
                <span>Yêu thích</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-2xl font-bold mb-6">Ý nghĩa</h2>
              <p className="text-gray-600">
                {product.meaning}
              </p>
              <div className="aspect-video rounded-3xl overflow-hidden bg-gray-100 mt-8">
                <img src={product.image_url} alt="Detail" className="w-full h-full object-cover" />
              </div>
            </section>
          </div>
          <div>
            <h3 className="text-lg font-bold mb-6">Thông số</h3>
            <ul className="space-y-2 text-sm">
              <li><strong>Loại đá:</strong> {product.specs?.material}</li>
              <li><strong>Kích thước:</strong> {product.specs?.size}</li>
              <li><strong>Số hạt:</strong> {product.specs?.count}</li>
              <li><strong>Kiểm định:</strong> {product.specs?.certification}</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

