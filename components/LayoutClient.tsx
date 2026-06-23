'use client';

import { useState, useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CartSidebar from './CartSidebar';

export default function LayoutClient({ children }: { children: React.ReactNode }) {
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    // Listen for the custom event from Direct Buy
    const handleOpenCart = () => {
      setCartOpen(true);
    };

    window.addEventListener('open-cart-sidebar', handleOpenCart);

    return () => {
      window.removeEventListener('open-cart-sidebar', handleOpenCart);
    };
  }, []);

  return (
    <>
      <Header onCartClick={() => setCartOpen(true)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}