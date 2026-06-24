import Link from 'next/link';
import { ArrowRight, Zap, Shield, Truck, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FeaturedProductsGrid from '@/components/FeaturedProductsGrid';
import ReviewsSlider from '@/components/ReviewsSlider';
import { supabase, Product } from '@/lib/supabase';
export const config = {
  runtime: 'edge',
};
// This forces Next.js to fetch fresh data every time the page is visited
export const revalidate = 0;

async function getFeaturedProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('featured', true)
      .limit(4);

    if (error) {
      console.error('Supabase fetch error:', error);
      return [];
    }
    
    return data || [];
  } catch (err) {
    console.error('Unexpected fetch error:', err);
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="min-h-screen">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 cyber-grid opacity-50" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl opacity-30" />
        <div className="container mx-auto px-4 py-24 lg:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Premium Tech at Unbeatable Prices</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Elevate Your <span className="text-primary glow-text">Gaming Experience</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover premium mechanical keyboards, precision gaming mice, and professional PC services. Quality tech that won&apos;t break the bank.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="gap-2 glow-teal">
                <Link href="/store">Shop Now <ArrowRight className="h-5 w-5" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Contact Us</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 border-y border-primary/20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[{ icon: Truck, title: 'Fast Shipping', desc: 'Nationwide delivery within 3-5 days' },
              { icon: Shield, title: 'Quality Guaranteed', desc: 'All products are tested and verified' },
              { icon: Zap, title: 'Premium Performance', desc: 'Top-tier components and services' },
              { icon: Clock, title: '24/7 Support', desc: 'We&apos;re always here to help you' }
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
            <h2 className="text-3xl font-bold glow-text">Featured Products</h2>
            <Button asChild variant="outline">
              <Link href="/store" className="gap-2">View All <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
          
          {/* Use the new client component */}
          <FeaturedProductsGrid products={featuredProducts} />
        </div>
      </section>

      <ReviewsSlider />

      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Upgrade Your Setup?</h2>
            <p className="text-muted-foreground mb-6">Browse our complete collection of tech accessories.</p>
            <Button asChild size="lg"><Link href="/store">Explore the Store</Link></Button>
          </div>
        </div>
      </section>
    </div>
  );
}