import React, { StrictMode } from 'react';
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
  supabaseReady: supabase.isReady?.() ?? false, // Safe check
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL ? 'OK' : 'MISSING', 
  supabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY 
});

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Consistent hydration fix: createRoot everywhere, StrictMode only true DEV
const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen bg-white">Đang tải...</div>}>
      <App />
    </Suspense>
  </React.StrictMode>
);
