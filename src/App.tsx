import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Session } from '@supabase/supabase-js';
import FixedHome from './pages/FixedHome';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Blog from './pages/Blog';
import BlogPost from './pages/BlogPost';
import Destiny from './pages/Destiny';
import About from './pages/About';
import Contact from './pages/Contact';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import { supabase } from './service/supabaseClient';
import { WishlistProvider } from './Context/WishlistContext';
import { CartProvider } from './Context/CartContext';

function App() {
  return (
    <WishlistProvider>
      <CartProvider>
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AppContent />
        </Router>
      </CartProvider>
    </WishlistProvider>
  );
}

function AppContent() {
  const location = useLocation();
  const isHideNavbar = location.pathname.startsWith('/admin') || location.pathname === '/admin-login';

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {!isHideNavbar && <Navbar />}
      <main className="grow">
        <Routes>
            <Route path="/" element={<FixedHome />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
            <Route path="/destiny" element={<Destiny />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/login" element={<Login />} />
            {/* Admin Routes */}
            <Route path="/admin-login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedAdminRoute />}>
              <Route index element={<Admin />} />
            </Route>
          </Routes>
        </main>
      {!isHideNavbar && <Footer />}
      </div>
  );
}

// Protected Route Wrapper
function ProtectedAdminRoute() {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin-login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}

export default App;
