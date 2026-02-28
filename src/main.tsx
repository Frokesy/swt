import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { CartProvider } from './context/CartProvider.tsx';
import { LikesProvider } from './context/LikesProvider.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LikesProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </LikesProvider>
  </StrictMode>
);
