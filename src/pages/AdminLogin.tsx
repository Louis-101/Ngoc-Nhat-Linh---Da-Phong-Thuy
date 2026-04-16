import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lock, Mail, ChevronRight, Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { supabase } from '../service/supabaseClient';
import { useNavigate, Link } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;
      
      // Chuyển hướng vào trang Admin sau khi đăng nhập thành công
      navigate('/admin');
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fdfaf5] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Hiệu ứng nền sang trọng */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[120px] -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-primary/10 rounded-full blur-[120px] -ml-48 -mb-48"></div>

      <div className="absolute top-8 left-8">
        <Link to="/" className="text-secondary/60 hover:text-primary transition-colors flex items-center space-x-2 text-sm font-medium">
          <ArrowLeft size={18} />
          <span>Quay về trang chủ</span>
        </Link>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white border border-primary/10 p-8 md:p-12 rounded-[2.5rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.08)] relative z-10"
      >
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold italic tracking-[0.2em] text-gradient-gold mb-2">
            NGỌC NHẤT LINH
          </h1>
          <p className="text-secondary/40 text-[10px] uppercase tracking-widest font-bold">Hệ thống quản trị viên</p>
        </div>

        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-xs mb-6 text-center font-medium"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-2">Email truy cập</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all placeholder-gray-300"
                placeholder="admin@ngocnhatlinh.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-secondary/40 uppercase tracking-widest ml-2">Mật khẩu bảo mật</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={18} />
              <input 
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-secondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all placeholder-gray-300"
                placeholder="••••••••"
                required
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-primary transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-gold text-secondary py-5 rounded-2xl font-bold text-sm shadow-lg hover:shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
          >
            {loading ? 'ĐANG XỬ LÝ...' : (
              <>
                <span>ĐĂNG NHẬP HỆ THỐNG</span>
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-gray-50 text-center">
          <p className="text-xs text-secondary/40">
            Nếu quên mật khẩu, vui lòng liên hệ kỹ thuật viên.
          </p>
        </div>
      </motion.div>
    </div>
  );
}