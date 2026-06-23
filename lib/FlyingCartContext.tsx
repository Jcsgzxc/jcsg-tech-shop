'use client';

import { createContext, useContext, useRef, ReactNode, RefObject } from 'react';

type CartIconRef = RefObject<HTMLElement | null>;

const FlyingCartContext = createContext<CartIconRef | null>(null);

export function FlyingCartProvider({ children }: { children: ReactNode }) {
  const cartIconRef = useRef<HTMLElement>(null);
  return (
    <FlyingCartContext.Provider value={cartIconRef}>
      {children}
    </FlyingCartContext.Provider>
  );
}

export function useCartIconRef() {
  const ctx = useContext(FlyingCartContext);
  if (!ctx) throw new Error('useCartIconRef must be used within FlyingCartProvider');
  return ctx;
}