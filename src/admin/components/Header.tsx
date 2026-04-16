import React from 'react';
import { Bell, User } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="h-20 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-30">
      <div className="text-sm font-medium text-slate-500">
        Hệ thống Quản trị v1.0
      </div>
      <div className="flex items-center space-x-6">
        <button className="p-2 text-slate-400 hover:text-gold transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        <div className="flex items-center space-x-3 pl-6 border-l border-slate-200 dark:border-slate-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 dark:text-white">Admin Linh</p>
            <p className="text-xs text-slate-500">Quản trị viên</p>
          </div>
          <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center text-slate-500">
            <User size={20} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;