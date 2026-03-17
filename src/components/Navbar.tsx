import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, Menu, X, Facebook, Instagram, MessageCircle, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Trang chủ', path: '/' },
    { name: 'Sản phẩm', path: '/products' },
    { name: 'Tra mệnh', path: '/destiny' },
    { name: 'Kiến thức', path: '/blog' },
    { name: 'Về chúng tôi', path: '/about' },
    { name: 'Liên hệ', path: '/contact' },
  ];

  // Determine text color based on scroll and page
  const getTextColor = () => {
    if (isScrolled) return 'text-secondary';
    if (isHomePage) return 'text-white';
    return 'text-secondary';
  };

  const getBgColor = () => {
    if (isScrolled) return 'bg-white/95 backdrop-blur-md shadow-sm py-3';
    if (isHomePage) return 'bg-transparent py-5';
    return 'bg-white shadow-sm py-3';
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${getBgColor()}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2 group">
              <span className={`text-2xl font-serif font-bold tracking-tighter transition-all duration-300 ${
                isScrolled ? 'text-gradient-gold' : isHomePage ? 'text-white group-hover:text-primary' : 'text-gradient-gold'
              }`}>
                NGỌC NHẤT LINH
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary relative group ${
                    location.pathname === link.path 
                      ? 'text-primary' 
                      : getTextColor()
                  }`}
                >
                  {link.name}
                  <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-gold transition-all duration-300 group-hover:w-full ${
                    location.pathname === link.path ? 'w-full' : ''
                  }`}></span>
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-5">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className={`${getTextColor()} hover:text-primary transition-colors`}
              >
                <Search size={20} />
              </button>
              <a 
                href="https://www.facebook.com/profile.php?id=61575224635423" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${getTextColor()} hover:text-primary transition-colors`}
              >
                <Facebook size={20} />
              </a>
              <a 
                href="https://zalo.me/0902111626" 
                target="_blank" 
                rel="noopener noreferrer"
                className={`${getTextColor()} hover:text-primary transition-colors`}
              >
                <MessageCircle size={20} />
              </a>
              <button 
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} className={getTextColor()} /> : <Menu size={24} className={getTextColor()} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-secondary/40 backdrop-blur-sm z-40 md:hidden"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="fixed right-0 top-0 bottom-0 w-[85%] max-w-sm bg-white z-50 md:hidden shadow-2xl flex flex-col bg-pattern-subtle"
              >
                <div className="p-6 flex justify-between items-center border-b border-accent">
                  <span className="text-xl font-serif font-bold text-gradient-gold tracking-tighter">MENU</span>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 hover:bg-accent rounded-full transition-colors">
                    <X size={24} className="text-secondary" />
                  </button>
                </div>
                <div className="flex-grow overflow-y-auto py-8 px-6 space-y-2">
                  {navLinks.map((link, i) => (
                    <motion.div
                      key={link.path}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Link
                        to={link.path}
                        className={`block py-4 text-lg font-medium border-b border-accent/50 transition-colors ${
                          location.pathname === link.path ? 'text-primary' : 'text-secondary hover:text-primary'
                        }`}
                      >
                        {link.name}
                      </Link>
                    </motion.div>
                  ))}
                </div>
                <div className="p-8 border-t border-accent space-y-6 bg-accent/20">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center text-primary">
                      <MessageCircle size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-secondary">Tư vấn ngay</p>
                      <p className="text-xs text-secondary/60">0902 111 626</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center text-xs text-secondary/40">
                    <span>© 2024 Ngọc Nhất Linh</span>
                    <div className="flex space-x-4">
                      <a href="https://www.facebook.com/profile.php?id=61575224635423" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                        <Facebook size={16} />
                      </a>
                      <Instagram size={16} className="hover:text-primary transition-colors" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Search Overlay */}
      <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-[60] flex flex-col"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full pt-10">
              <div className="flex justify-between items-center mb-20">
                <span className="text-2xl font-serif font-bold tracking-tighter text-charcoal">
                  NGỌC NHẤT LINH
                </span>
                <button 
                  onClick={() => setIsSearchOpen(false)}
                  className="p-3 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={32} className="text-charcoal" />
                </button>
              </div>
              
              <div className="max-w-4xl mx-auto">
                <div className="relative group">
                  <Search size={32} className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" />
                  <input 
                    autoFocus
                    type="text" 
                    placeholder="Tìm kiếm sản phẩm, bài viết..." 
                    className="w-full bg-transparent border-b-2 border-gray-100 py-6 pl-14 text-3xl md:text-5xl font-serif focus:outline-none focus:border-primary transition-all placeholder:text-gray-200"
                  />
                </div>
                
                <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Gợi ý tìm kiếm</h4>
                    <div className="flex flex-wrap gap-3">
                      {['Vòng tay', 'Thạch anh', 'Mệnh Kim', 'Tỳ hưu', 'Nhẫn nam'].map(tag => (
                        <button key={tag} className="px-5 py-2 rounded-full bg-gray-50 text-sm hover:bg-primary hover:text-white transition-all">
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-6">Danh mục nổi bật</h4>
                    <ul className="space-y-4">
                      {['Trang sức phong thủy', 'Vật phẩm để bàn', 'Quà tặng cao cấp'].map(cat => (
                        <li key={cat}>
                          <Link to="/products" className="text-xl font-serif hover:text-primary transition-colors flex items-center">
                            {cat} <ArrowRight size={18} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
