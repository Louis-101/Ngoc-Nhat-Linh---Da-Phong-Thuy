import {StrictMode} from 'react';
import {createRoot, hydrateRoot} from 'react-dom/client';
import { Suspense } from 'react';
import App from './App.tsx';
import './index.css';
import { WishlistProvider } from './Context/WishlistContext';
import { CartProvider } from './Context/CartContext';
import { supabase } from './service/supabaseClient';

window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global error:', { message, source, lineno, colno, error });
  return false;
};

window.onunhandledrejection = (event) => {
  console.error('Unhandled Promise rejection:', event.reason);
};

const isDev = import.meta.env.DEV;
console.log('Starting app', { 
  mode: isDev ? 'development' : 'production',
  supabaseReady: supabase.isReady(),
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL, 
  supabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY 
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

if (isDev) {
  // Dev: use render (StrictMode for double-render checks)
  createRoot(rootElement).render(
    <StrictMode>
      <WishlistProvider>
        <CartProvider>
          <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-white">Đang tải...</div>}>
            <App />
          </Suspense>
        </CartProvider>
      </WishlistProvider>
    </StrictMode>
  );
} else {
  // Prod: use hydrateRoot (no StrictMode to avoid hydration mismatches)
  hydrateRoot(rootElement,
    <WishlistProvider>
      <CartProvider>
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-white">Đang tải...</div>}>
          <App />
        </Suspense>
      </CartProvider>
    </WishlistProvider>
  );
}
