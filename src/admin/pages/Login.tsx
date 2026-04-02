import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../service/supabaseClient';
import { Lock, Mail, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message === 'Invalid login credentials' ? 'Email hoặc mật khẩu không đúng.' : error.message);
      } else {
        navigate('/admin', { replace: true });
      }
    } catch (err) {
      setError('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-linear-to-br from-slate-50 via-rose-50 to-emerald-50 dark:from-slate-900 dark:via-rose-900/20 dark:to-emerald-900/20">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white/90 dark:bg-slate-900/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-gold/20 dark:border-slate-700/50"
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-linear-to-br from-gold to-amber-500 rounded-2xl shadow-xl mx-auto mb-6 flex items-center justify-center">
            <Mail size={28} className="text-slate-900" />
          </div>
          <h1 className="text-4xl font-serif font-bold bg-linear-to-r from-slate-900 via-slate-800 to-emerald-900 bg-clip-text text-transparent mb-3">
            Quản Trị Viên
          </h1>
          <p className="text-slate-600 dark:text-slate-400">Đăng nhập để quản lý website</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 p-4 rounded-2xl text-sm backdrop-blur-sm"
            >
              {error}
            </motion.div>
          )}
          
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-2xl border border-slate-200/50 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:ring-2 focus:ring-gold/30 focus:border-transparent outline-none transition-all placeholder-slate-400"
                placeholder="admin@ngocnhatlinh.vn"
                required
                disabled={loading}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Mật khẩu
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-2xl border border-slate-200/50 dark:border-slate-700 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm focus:ring-2 focus:ring-gold/30 focus:border-transparent outline-none transition-all placeholder-slate-400"
                placeholder="Nhập mật khẩu"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
                disabled={loading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading || !email || !password}
            className="w-full bg-linear-to-r from-gold via-amber-400 to-emerald-500 hover:from-gold/90 hover:to-emerald-500/90 text-slate-900 py-5 px-6 rounded-2xl font-serif font-bold text-xl shadow-2xl hover:shadow-3xl hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
          >
            {loading ? (
              <>
                <div className="w-6 h-6 border-2 border-slate-900/20 border-r-slate-900 rounded-full animate-spin" />
                <span>Đang đăng nhập...</span>
              </>
            ) : (
              <>
                <ArrowRight size={24} />
                <span>Đăng nhập</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-slate-200/50 dark:border-slate-700 text-center">
          <p className="text-xs text-slate-500">
            Chưa có tài khoản?{' '}
            <a href="#" className="font-medium text-gold hover:underline transition-colors">
              Liên hệ developer
            </a>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
