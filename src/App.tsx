import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
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
import AdminLayout from './admin/layout/AdminLayout';
import Dashboard from './admin/pages/Dashboard';
import ProductsAdmin from './admin/pages/ProductsAdmin';
import BlogAdmin from './admin/pages/BlogAdmin';
import ContactsAdmin from './admin/pages/ContactsAdmin';
import AdminLogin from './admin/pages/Login';
import { useAdminAuth } from './admin/hooks/useAdminAuth';
import Admin from './pages/Admin';

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const location = useLocation();
  const isHideNavbar = location.pathname.startsWith('/admin');

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
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<ProtectedAdminRoute />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<ProductsAdmin />} />
              <Route path="blogs" element={<BlogAdmin />} />
              <Route path="contacts" element={<ContactsAdmin />} />
            </Route>
            <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
          </Routes>
        </main>
      {!isHideNavbar && <Footer />}
      </div>
  );
}

// Protected Route Wrapper
function ProtectedAdminRoute() {
  const { session, loading } = useAdminAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return <AdminLayout />;
}

export default App;
