import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../service/supabaseClient';
import { Lock, Mail } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('Email hoặc mật khẩu không đúng.');
      setLoading(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-accent/20 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl p-10 border border-accent/20">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-serif font-bold text-secondary">Quản Trị Viên</h1>
          <p className="text-secondary/60 mt-2">Đăng nhập để quản lý nội dung</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-2">
            <label className="text-xs font-bold text-secondary/60 uppercase tracking-widest">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-xl border border-accent/30 focus:ring-1 focus:ring-primary outline-none"
                placeholder="admin@example.com"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-secondary/60 uppercase tracking-widest">Mật khẩu</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary/40" size={18} />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-6 py-4 rounded-xl border border-accent/30 focus:ring-1 focus:ring-primary outline-none"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          <button 
            disabled={loading}
            className="w-full bg-secondary text-white py-4 rounded-xl font-bold hover:bg-secondary/90 transition-all shadow-lg"
          >
            {loading ? 'ĐANG ĐĂNG NHẬP...' : 'ĐĂNG NHẬP'}
          </button>
        </form>
      </div>
    </div>
  );
}