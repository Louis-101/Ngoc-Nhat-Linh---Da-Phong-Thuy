import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { WishlistProvider } from './Context/WishlistContext';
import { CartProvider } from './Context/CartContext';

window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global error:', { message, source, lineno, colno, error });
  return false;
};

window.onunhandledrejection = (event) => {
  console.error('Unhandled Promise rejection:', event.reason);
};

console.log('Starting app', { supabaseUrl: import.meta.env.VITE_SUPABASE_URL, supabaseKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY });

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WishlistProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </WishlistProvider>
  </StrictMode>,
);
