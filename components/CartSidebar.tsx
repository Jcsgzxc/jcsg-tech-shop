'use client';

import { useEffect, useState } from 'react';
import { X, Plus, Minus, Trash2, CheckCircle, MessageCircle, Mail, Phone, ArrowLeft } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/lib/supabase';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();
  const [step, setStep] = useState<'cart' | 'checkout' | 'summary'>('cart');
  const [submitting, setSubmitting] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    email: '',
    address: '',
    phone: '',
    instructions: '',
  });

  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setStep('cart');
      setForm({ name: '', email: '', address: '', phone: '', instructions: '' });
      setOrderId(null);
    }
  }, [isOpen]);

  const sendOrderEmail = async (payload: {
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    instructions: string | null;
    items: typeof items;
    total: number;
    orderId: string;
  }) => {
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const body = await response.json().catch(() => null);
        throw new Error(body?.error || `Email API returned ${response.status}`);
      }
    } catch (emailError) {
      console.error('Email notification failed:', emailError);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const sanitizedItems = items.map((item) => ({
      product: {
        id: item.product.id,
        name: item.product.name,
        price: item.product.price,
        image_url: item.product.image_url,
      },
      quantity: item.quantity,
    }));

    const orderPayload = {
      client_name: form.name.trim() || 'Guest',
      client_email: form.email.trim() || null,
      delivery_address: form.address.trim() || 'Not provided',
      phone_number: form.phone.trim() || 'Not provided',
      special_instructions: form.instructions.trim() || null,
      order_items: sanitizedItems,
      total_amount: total,
      status: 'active',
    };

    const emailPayload = {
      customerName: orderPayload.client_name,
      customerEmail: orderPayload.client_email || 'Not provided',
      customerPhone: orderPayload.phone_number,
      customerAddress: orderPayload.delivery_address,
      instructions: orderPayload.special_instructions,
      items: sanitizedItems,
      total: orderPayload.total_amount,
      orderId: '',
    };

    try {
      const { data, error } = await supabase
        .from('client_orders')
        .insert(orderPayload)
        .select('id')
        .single();

      if (error) throw error;

      setOrderId(data.id);
      setStep('summary');
      clearCart();

      void sendOrderEmail({ ...emailPayload, orderId: data.id });
    } catch {
      alert('Failed to submit order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const generateEmailBody = () => {
    const itemsList = items.map(item => `- ${item.product.name} (x${item.quantity}): PHP${(item.product.price * item.quantity).toLocaleString()}`).join('\n');
    return encodeURIComponent(
      `JCSG TECH SHOP ORDER\n\n` +
      `Name: ${form.name}\n` +
      `Address: ${form.address}\n` +
      `Phone: ${form.phone}\n` +
      `Special Instructions: ${form.instructions || 'None'}\n\n` +
      `ORDER ITEMS:\n${itemsList}\n\n` +
      `TOTAL: PHP${total.toLocaleString()}\n\n` +
      `Order ID: ${orderId || 'N/A'}\n\n` +
      `Please confirm my order. Thank you!`
    );
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-background border-l border-primary/20 z-50 shadow-2xl transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-primary/20">
            <div className="flex items-center gap-2">
              {step !== 'cart' && (
                <Button variant="ghost" size="icon" onClick={() => setStep(step === 'summary' ? 'checkout' : 'cart')}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <h2 className="text-lg font-bold glow-text">
                {step === 'cart' && 'Shopping Cart'}
                {step === 'checkout' && 'Checkout Details'}
                {step === 'summary' && 'Order Summary'}
              </h2>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            {step === 'cart' && (
              items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                    <CartIcon className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <p className="text-muted-foreground">Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-4 p-3 rounded-lg bg-muted/50 border border-primary/10">
                      <div className="w-20 h-20 rounded-md overflow-hidden bg-muted flex-shrink-0">
                        {item.product.image_url && (
                          <img src={item.product.image_url} alt={item.product.name} className="w-full h-full object-cover" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate">{item.product.name}</h3>
                        <p className="text-primary font-bold mt-1">PHP{item.product.price.toLocaleString()}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button variant="outline" size="icon" className="h-7 w-7" onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                            <Plus className="h-3 w-3" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-7 w-7 ml-auto text-destructive hover:text-destructive" onClick={() => removeItem(item.product.id)}>
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}

            {step === 'checkout' && (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Juan Dela Cruz" />
                </div>
                <div>
                  <Label htmlFor="phone">Contact Phone Number</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="09XXXXXXXXX" />
                </div>
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" />
                </div>
                <div>
                  <Label htmlFor="address">Complete Delivery Address</Label>
                  <Textarea id="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="123 Main St, Brgy. Example, City, Province" rows={2} />
                </div>
                <div>
                  <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                  <Textarea id="instructions" value={form.instructions} onChange={(e) => setForm({ ...form, instructions: e.target.value })} placeholder="Any special requests or delivery notes..." rows={3} />
                </div>

                <div className="bg-muted/50 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold mb-3">Order Items</h4>
                  <div className="space-y-2 text-sm">
                    {items.map((item) => (
                      <div key={item.product.id} className="flex justify-between">
                        <span className="text-muted-foreground">{item.product.name} x{item.quantity}</span>
                        <span>PHP{(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t border-primary/20 pt-2 mt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span className="text-primary">PHP{total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </form>
            )}

            {step === 'summary' && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-4 glow-teal">
                  <CheckCircle className="h-10 w-10 text-primary" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Order Received!</h3>
                <p className="text-muted-foreground mb-6">Your order has been saved. Complete your purchase by contacting us.</p>

                <div className="w-full space-y-3 mb-6">
                  <Button
                    className="w-full gap-2 bg-blue-600 hover:bg-blue-700"
                    onClick={() => window.open('https://www.facebook.com/johncarlosiscon.guamod', '_blank')}
                  >
                    <MessageCircle className="h-5 w-5" />
                    Message on Facebook Messenger
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => window.location.href = `mailto:carlogumaod@gmail.com?subject=Jcsg Tech Shop Order&body=${generateEmailBody()}`}
                  >
                    <Mail className="h-5 w-5" />
                    Send Email Order
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2"
                    onClick={() => window.location.href = 'tel:09706850155'}
                  >
                    <Phone className="h-5 w-5" />
                    Call / Text Us
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground">Order ID: {orderId?.slice(0, 8).toUpperCase()}</p>
              </div>
            )}
          </div>

          {items.length > 0 && step === 'cart' && (
            <div className="border-t border-primary/20 p-4 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold text-lg">PHP{total.toLocaleString()}</span>
              </div>
              <Button className="w-full" onClick={() => setStep('checkout')}>
                Proceed to Checkout
              </Button>
            </div>
          )}

          {step === 'checkout' && (
            <div className="border-t border-primary/20 p-4 space-y-4">
              <Button
                className="w-full"
                onClick={handleSubmit}
                disabled={submitting}
              >
                {submitting ? (
                  <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground mr-2" /> Submitting...</>
                ) : (
                  'Submit Order'
                )}
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function CartIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
    </svg>
  );
}
