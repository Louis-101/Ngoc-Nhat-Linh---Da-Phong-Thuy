import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, FileText, Users, LogOut, Sparkles } from 'lucide-react';
import { supabase } from '../../service/supabaseClient';

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Tổng quan' },
    { path: '/admin/products', icon: Package, label: 'Sản phẩm' },
    { path: '/admin/blogs', icon: FileText, label: 'Bài viết' },
    { path: '/admin/contacts', icon: Users, label: 'Liên hệ' },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside className="hidden md:flex flex-col w-72 bg-slate-900 text-slate-300 min-h-screen sticky top-0 border-r border-slate-800">
      <div className="p-8">
        <div className="flex items-center space-x-3 mb-10">
          <div className="w-10 h-10 bg-gold rounded-xl flex items-center justify-center shadow-lg shadow-gold/20">
            <Sparkles className="text-slate-900" size={24} />
          </div>
          <span className="text-xl font-serif font-bold text-white tracking-tight">Ngọc Nhất Linh</span>
        </div>

        <nav className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-300 group ${
                  isActive 
                    ? 'bg-gold text-slate-900 font-bold shadow-lg shadow-gold/10' 
                    : 'hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={20} className={isActive ? 'text-slate-900' : 'text-slate-500 group-hover:text-gold'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-8">
        <button onClick={handleLogout} className="flex items-center space-x-4 px-4 py-4 w-full rounded-2xl text-rose-400 hover:bg-rose-500/10 transition-colors font-bold">
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;