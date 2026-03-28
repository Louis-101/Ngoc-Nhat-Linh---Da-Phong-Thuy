import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus } from 'lucide-react';
import { useCart } from '../Context/CartContext';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  if (cart.length === 0) {
    return (
      <div className="pt-32 pb-20 text-center px-4">
        <div className="max-w-md mx-auto space-y-8">
          <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto">
            <ShoppingBag size={40} className="text-gray-300" />
          </div>
          <h1 className="text-3xl font-serif font-bold">Giỏ hàng trống</h1>
          <p className="text-gray-500 font-light">Bạn chưa có sản phẩm nào trong giỏ hàng. Hãy khám phá bộ sưu tập của chúng tôi nhé!</p>
          <Link to="/products" className="inline-block bg-primary text-white px-10 py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all">
            TIẾP TỤC MUA SẮM
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-12">Giỏ Hàng Của Bạn ({totalItems})</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cart.map((item) => (
              <motion.div 
                key={item.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6 p-6 bg-white border border-gray-100 rounded-3xl shadow-sm"
              >
                <div className="w-full sm:w-24 aspect-square sm:h-24 rounded-2xl overflow-hidden bg-gray-50 shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="grow space-y-1 w-full">
                  <h3 className="font-serif font-bold text-lg">{item.name}</h3>
                  <p className="text-primary font-bold">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</p>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">{item.category}</p>
                </div>
                <div className="flex items-center justify-between w-full sm:w-auto space-x-4">
                  <div className="flex items-center border border-gray-100 rounded-full px-3 py-1 bg-gray-50">
                    <button onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))} className="text-gray-400 hover:text-charcoal"><Minus size={14} /></button>
                    <span className="mx-4 font-medium w-4 text-center text-sm">{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-400 hover:text-charcoal"><Plus size={14} /></button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-2 text-gray-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-beige-subtle p-8 rounded-3xl border border-primary/10 sticky top-24">
              <h2 className="text-xl font-serif font-bold mb-8">Tổng đơn hàng</h2>
              <div className="space-y-4 text-sm mb-8">
                <div className="flex justify-between text-gray-500">
                  <span>Tạm tính</span>
                  <span>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                </div>
                <div className="flex justify-between text-gray-500">
                  <span>Phí vận chuyển</span>
                  <span className="text-green-600 font-medium">Miễn phí</span>
                </div>
                <div className="pt-4 border-t border-gray-200 flex justify-between text-lg font-bold text-charcoal">
                  <span>Tổng cộng</span>
                  <span className="text-primary">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(totalPrice)}</span>
                </div>
              </div>
              <button className="w-full bg-primary text-white py-4 rounded-full font-bold shadow-lg hover:shadow-xl transition-all flex items-center justify-center space-x-2">
                <span>THANH TOÁN NGAY</span>
                <ArrowRight size={20} />
              </button>
              <p className="mt-6 text-[10px] text-gray-400 text-center leading-relaxed">
                Bằng cách nhấn thanh toán, bạn đồng ý với các Điều khoản & Chính sách của Ngọc Nhất Linh.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
