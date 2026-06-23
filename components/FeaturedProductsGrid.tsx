'use client';

import { toast } from 'sonner';
import { useCart } from '@/lib/CartContext';
import ProductCard from './ProductCard';
import { Product } from '@/lib/supabase';
import { useEffect } from 'react';

interface Props {
  products: Product[];
}

export default function FeaturedProductsGrid({ products }: Props) {
  const { addItem } = useCart();

  const handleDirectBuy = (product: Product) => {
    // Add product to cart
    addItem(product);
    
    // Show success notification
    toast.success('Added to cart!', {
      description: `${product.name} has been added. Proceeding to checkout...`,
      duration: 2000,
    });

    // Dispatch custom event to open cart sidebar
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cart-sidebar'));
    }

    // Optional: Redirect to checkout page after a short delay
    // Uncomment the line below if you have a /checkout page
    // setTimeout(() => router.push('/checkout'), 1500);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p>No featured products found. Please check your database settings.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard 
          key={product.id} 
          product={product} 
          onDirectBuy={handleDirectBuy}
        />
      ))}
    </div>
  );
}