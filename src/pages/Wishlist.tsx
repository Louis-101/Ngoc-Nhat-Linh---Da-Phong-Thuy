import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '../Context/WishlistContext';
import { useCart } from '../Context/CartContext';

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();

  if (wishlist.length === 0) {
    return (
      <div className="pt-32 pb-20 text-center px-4 bg-white bg-pattern-subtle min-h-screen">
        <div className="max-w-md mx-auto space-y-8">
          <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center mx-auto border border-accent/30">
            <Heart size={40} className="text-primary/40" />
          </div>
          <h1 className="text-3xl font-serif font-bold text-secondary">Danh sách yêu thích trống</h1>
          <p className="text-secondary/60 font-light">Bạn chưa lưu sản phẩm nào. Hãy thả tim cho những tuyệt tác bạn yêu thích nhé!</p>
          <Link to="/products" className="inline-block bg-gradient-gold text-secondary px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
            KHÁM PHÁ SẢN PHẨM
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-white bg-pattern-subtle min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-12 text-secondary">Sản Phẩm Yêu Thích ({wishlist.length})</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {wishlist.map((product) => (
            <motion.div 
              key={product.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="group"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden mb-4 bg-accent/10 border border-accent/20 shadow-sm">
                <Link to={`/product/${product.id}`}>
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                </Link>
                <button 
                  onClick={() => toggleWishlist(product)}
                  className="absolute top-4 right-4 p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-500 shadow-sm hover:bg-white transition-all"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <div className="space-y-3">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">{product.category}</span>
                  <Link to={`/product/${product.id}`}>
                    <h3 className="font-serif font-bold text-lg text-secondary group-hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
                  </Link>
                  <p className="text-primary font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</p>
                </div>
                <Link 
                  to={`/product/${product.id}`}
                  className="w-full bg-secondary text-white py-3 rounded-full text-sm font-bold flex items-center justify-center space-x-2 hover:bg-secondary-dark transition-all shadow-md"
                >
                  <ArrowRight size={16} />
                  <span>Xem chi tiết</span>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
