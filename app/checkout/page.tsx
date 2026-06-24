'use client';

import { useCart } from '@/lib/CartContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
export const runtime = 'edge';
export default function CheckoutPage() {
  const cart = useCart();
  const items = cart.items || [];
  const total = cart.total || 0;
  const clearCart = cart.clearCart || (() => {});
  const router = useRouter();

  const handleCompletePurchase = () => {
    toast.success('Order placed successfully!');
    clearCart();
    router.push('/');
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <Button asChild>
          <Link href="/store">Continue Shopping</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="space-y-4">
            {items.map((item: any) => (
              <div key={item.id} className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold">PHP{(item.price * item.quantity).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <div className="p-4 border rounded-lg bg-muted mt-6">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>PHP{Number(total).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Payment Details</h2>
          <div className="p-6 border rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Full Name</label>
              <input type="text" className="w-full px-4 py-2 rounded-lg border bg-background" placeholder="John Doe" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input type="email" className="w-full px-4 py-2 rounded-lg border bg-background" placeholder="john@example.com" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Address</label>
              <textarea className="w-full px-4 py-2 rounded-lg border bg-background" rows={3} placeholder="Enter address" />
            </div>
          </div>
          <Button className="w-full" size="lg" onClick={handleCompletePurchase}>
            Complete Purchase - PHP{Number(total).toLocaleString()}
          </Button>
        </div>
      </div>
    </div>
  );
}