'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ProductCard';
import { supabase, Product } from '@/lib/supabase';
import { useCart } from '@/lib/CartContext';
import { toast } from 'sonner';
export const runtime = 'edge';
const categories = ['All', 'Keyboards', 'Mice', 'Services'];

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const { addItem } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true);
      try {
        let query = supabase.from('products').select('*');
        if (category !== 'All') query = query.eq('category', category);
        const { data, error } = await query.order('created_at', { ascending: false });
        if (error) throw error;
        const rows = data || [];
        const filtered = search
          ? rows.filter((p) =>
              p.name.toLowerCase().includes(search.toLowerCase()) ||
              p.description?.toLowerCase().includes(search.toLowerCase())
            )
          : rows;
        setProducts(filtered);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [category, search]);

  const handleDirectBuy = (product: Product) => {
    addItem(product);
    
    toast.success('Added to cart!', {
      description: `${product.name} has been added. Proceeding to checkout...`,
      duration: 2000,
    });

    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-cart-sidebar'));
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10">
          <div>
            <h1 className="text-4xl font-bold glow-text mb-2">Our Products</h1>
            <p className="text-muted-foreground">Discover premium tech accessories and professional services</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input type="text" placeholder="Search products..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <Button key={cat} variant={category === cat ? 'default' : 'outline'} onClick={() => setCategory(cat)} className="transition-all">
              {cat}
            </Button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-80 rounded-lg bg-muted animate-pulse border border-primary/10" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onDirectBuy={handleDirectBuy}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16"><p className="text-muted-foreground text-lg">No products available</p></div>
        )}
      </div>
    </div>
  );
}