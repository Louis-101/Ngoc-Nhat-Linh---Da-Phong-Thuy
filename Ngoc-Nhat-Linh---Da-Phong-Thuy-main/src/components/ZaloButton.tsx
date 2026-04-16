import React from 'react';
import { MessageCircle } from 'lucide-react';

export default function ZaloButton() {
  return (
    <div className="fixed bottom-8 right-8 z-40">
      <a 
        href="https://zalo.me/0902111626" 
        target="_blank" 
        rel="noopener noreferrer"
        className="flex items-center space-x-3 bg-secondary text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 active:scale-95 group border border-primary/30"
      >
        <div className="relative">
          <MessageCircle size={24} className="text-primary" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-secondary animate-pulse"></span>
        </div>
        <span className="font-medium hidden sm:inline text-white">Tư vấn Zalo</span>
      </a>
    </div>
  );
}
