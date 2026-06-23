'use client';

import { ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { useCartIconRef } from '@/lib/FlyingCartContext';
import { useEffect, useRef, useState } from 'react';

export function CartIconButton() {
  const { items } = useCart();
  const cartIconRef = useCartIconRef();
  const [bounce, setBounce] = useState(false);
  const prevCount = useRef(items.length);

  // Trigger a bounce whenever the cart count grows (i.e. a flyer just landed).
  useEffect(() => {
    if (items.length > prevCount.current) {
      setBounce(true);
      const t = setTimeout(() => setBounce(false), 500);
      prevCount.current = items.length;
      return () => clearTimeout(t);
    }
    prevCount.current = items.length;
  }, [items.length]);

  return (
    <div
      ref={cartIconRef as React.RefObject<HTMLDivElement>}
      className={`relative cursor-pointer transition-transform ${
        bounce ? 'animate-[bounce_0.5s_ease-out]' : ''
      }`}
    >
      <ShoppingCart className="h-6 w-6" />
      {items.length > 0 && (
        <span className="absolute -top-2 -right-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 text-xs font-bold text-primary-foreground">
          {items.length}
        </span>
      )}
    </div>
  );
}