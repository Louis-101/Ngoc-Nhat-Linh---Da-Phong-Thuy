import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Analytics } from '@vercel/analytics/react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ZaloButton from './components/ZaloButton';
import ScrollToTop from './components/ScrollToTop';
import ErrorBoundary from './components/ErrorBoundary';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Destiny from './pages/Destiny';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';

function App() {
  const [isSupabaseReady, setIsSupabaseReady] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const { supabase } = await import('./service/supabaseClient');
        if (supabase.isReady?.()) {
          setIsSupabaseReady(true);
        } else {
          setSupabaseError(supabase.getError?.() || 'Supabase unavailable');
        }
      } catch (err) {
        console.error('Supabase check failed:', err);
        setSupabaseError('Supabase check failed');
      }
    })();
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen flex flex-col bg-white text-charcoal font-sans selection:bg-primary/30 selection:text-primary">
          <ScrollToTop />
          <Navbar />
          <main className="flex-grow">
            {supabaseError ? (
              <div className="flex items-center justify-center min-h-[60vh] p-8">
                <div className="text-center max-w-md">
                  <div className="w-20 h-20 bg-gradient-gold rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl font-serif">✦</span>
                  </div>
                  <h2 className="text-2xl font-serif font-bold text-secondary mb-4">Kết nối dữ liệu tạm thời</h2>
                  <p className="text-gray-600 mb-6">{supabaseError}. Trang vẫn hoạt động với dữ liệu mẫu.</p>
                  <Link to="/" className="bg-primary text-white px-8 py-3 rounded-full font-bold hover:bg-primary/90 transition-all">
                    Tiếp tục mua sắm
                  </Link>
                </div>
              </div>
            ) : !isSupabaseReady ? (
              <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                  <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-gray-500">Đang khởi tạo...</p>
                </div>
              </div>
            ) : (
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/destiny" element={<Destiny />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            )}
          </main>
          <Footer />
          <ZaloButton />
        </div>
        <Analytics />
      </Router>
    </ErrorBoundary>
  );
}

export default App;

