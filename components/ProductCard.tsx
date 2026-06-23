'use client';

import { useRef, useState } from 'react';
import { ShoppingCart, Star, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/lib/CartContext';
import { useCartIconRef } from '@/lib/FlyingCartContext';
import { Product } from '@/lib/supabase';
import { FlyingItem, FlyingItemData } from './FlyingItem';

interface Props {
  product: Product;
  onDirectBuy?: (product: Product) => void;
}

export default function ProductCard({ product, onDirectBuy }: Props) {
  const { addItem } = useCart();
  const cartIconRef = useCartIconRef();
  const imageRef = useRef<HTMLImageElement | HTMLDivElement>(null);
  const [flyers, setFlyers] = useState<FlyingItemData[]>([]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const imgEl = imageRef.current;
    const cartEl = cartIconRef.current;

    if (!imgEl || !cartEl || !product.image_url) {
      addItem(product);
      return;
    }

    const imgRect = imgEl.getBoundingClientRect();
    const cartRect = cartEl.getBoundingClientRect();

    const flyer: FlyingItemData = {
      id: Date.now() + Math.random(),
      src: product.image_url,
      startX: imgRect.left + imgRect.width / 2,
      startY: imgRect.top + imgRect.height / 2,
      endX: cartRect.left + cartRect.width / 2,
      endY: cartRect.top + cartRect.height / 2,
      onDone: (id) => setFlyers((prev) => prev.filter((f) => f.id !== id)),
    };

    setFlyers((prev) => [...prev, flyer]);
    window.setTimeout(() => addItem(product), 550);
  };

  const handleDirectBuy = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDirectBuy?.(product);
  };

  return (
    <div className="group flex flex-col overflow-hidden rounded-lg border border-primary/20 bg-card transition-all hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10">
      <div className="relative aspect-square overflow-hidden">
        {product.image_url ? (
          <img
            ref={imageRef as React.RefObject<HTMLImageElement>}
            src={product.image_url}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div
            ref={imageRef as React.RefObject<HTMLDivElement>}
            className="flex h-full w-full items-center justify-center bg-muted"
          >
            <span className="text-muted-foreground">No image</span>
          </div>
        )}

        {product.featured && (
          <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-xs font-bold text-primary-foreground">
            <Star className="h-3 w-3" fill="currentColor" /> Featured
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
          {product.name}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2 flex-1">
          {product.description}
        </p>

        <div className="mt-3 text-lg font-bold text-primary">
          PHP{product.price.toLocaleString()}
        </div>

        <div className="mt-3 grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleDirectBuy}
            className="flex items-center justify-center gap-1 border-primary/40 text-primary hover:bg-primary hover:text-primary-foreground"
          >
            <Zap className="h-4 w-4" />
            <span className="text-xs font-semibold">Direct Buy</span>
          </Button>

          <Button
            size="sm"
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <ShoppingCart className="h-4 w-4" />
            <span className="text-xs font-semibold">Add to Cart</span>
          </Button>
        </div>
      </div>

      {flyers.map((f) => (
        <FlyingItem key={f.id} {...f} />
      ))}
    </div>
  );
}