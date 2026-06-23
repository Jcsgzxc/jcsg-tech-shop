'use client';

import Link from 'next/link';
import { useState } from 'react';
import { ShoppingCart, Menu, X, Zap } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useCartIconRef } from '@/lib/FlyingCartContext'; // <-- 1. ADD THIS IMPORT
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onCartClick: () => void;
}

export default function Header({ onCartClick }: HeaderProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount } = useCart();
  const cartIconRef = useCartIconRef(); // <-- 2. ADD THIS HOOK

  return (
    <header className="sticky top-0 z-50 w-full border-b border-primary/20 bg-background/95 backdrop-blur">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-teal-400 glow-teal">
            <Zap className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold glow-text">Jcsg Tech Shop</span>
        </Link>

        <nav className="hidden md:flex items-center gap-8">
          <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Home</Link>
          <Link href="/store" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Store</Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">Contact</Link>
        </nav>

        <div className="flex items-center gap-2">
          {/* 3. WRAP THE CART BUTTON IN THIS DIV TO ATTACH THE REF */}
          <div ref={cartIconRef as React.RefObject<HTMLDivElement>} className="relative">
            <Button variant="ghost" size="icon" className="relative" onClick={onCartClick}>
              <ShoppingCart className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {itemCount}
                </span>
              )}
            </Button>
          </div>

          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-primary/20 bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-2 px-4 py-4">
            <Link href="/" className="py-2 text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>Home</Link>
            <Link href="/store" className="py-2 text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>Store</Link>
            <Link href="/contact" className="py-2 text-muted-foreground hover:text-primary" onClick={() => setMobileOpen(false)}>Contact</Link>
          </nav>
        </div>
      )}
    </header>
  );
}