'use client';

import { useState } from 'react';
import { Phone, Mail, Facebook, MapPin, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
export const runtime = 'edge';
export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = 'Name is required';
    else if (form.name.length < 2) e.name = 'Name must be at least 2 characters';
    if (!form.email.trim()) e.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = 'Invalid email address';
    if (form.phone && !/^09\d{9}$/.test(form.phone)) e.phone = 'Invalid PH mobile number (09XXXXXXXXX)';
    if (!form.message.trim()) e.message = 'Message is required';
    else if (form.message.length < 10) e.message = 'Message must be at least 10 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'contact',
          fullName: form.name,
          email: form.email,
          phone: form.phone,
          message: form.message,
        }),
      });

      const result = await response.json();
      
      if (!result.success) throw new Error(result.error || 'Failed to send');

      setSuccess(true);
      setForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => setSuccess(false), 5000);
    } catch (err: any) {
      setErrors({ message: err.message || 'Failed to send. Please try again.' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold glow-text mb-4">Get in Touch</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Have questions about our products or services? Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
                      <Phone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Phone</h3>
                      <a href="tel:09706850155" className="text-muted-foreground hover:text-primary transition-colors">09706850155</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
                      <Mail className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Email</h3>
                      <a href="mailto:carlogumaod@gmail.com" className="text-muted-foreground hover:text-primary transition-colors">carlogumaod@gmail.com</a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 border border-primary/20 flex-shrink-0">
                      <Facebook className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Facebook</h3>
                      <a href="https://www.facebook.com/johncarlosiscon.guamod" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Visit our Facebook Page</a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-card border border-primary/20 rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
              {success ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle className="h-16 w-16 text-primary mb-4" />
                  <h3 className="text-xl font-bold mb-2">Message Sent!</h3>
                  <p className="text-muted-foreground">Thank you for reaching out. We'll get back to you soon.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Juan Dela Cruz" className={errors.name ? 'border-destructive' : ''} />
                    {errors.name && <p className="text-sm text-destructive mt-1">{errors.name}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="juan@email.com" className={errors.email ? 'border-destructive' : ''} />
                    {errors.email && <p className="text-sm text-destructive mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <Label htmlFor="phone">Phone Number (optional)</Label>
                    <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="09XXXXXXXXX" className={errors.phone ? 'border-destructive' : ''} />
                    {errors.phone && <p className="text-sm text-destructive mt-1">{errors.phone}</p>}
                  </div>
                  <div>
                    <Label htmlFor="message">Message *</Label>
                    <Textarea id="message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="How can we help you?" rows={5} className={`resize-none ${errors.message ? 'border-destructive' : ''}`} />
                    {errors.message && <p className="text-sm text-destructive mt-1">{errors.message}</p>}
                  </div>
                  <Button type="submit" size="lg" className="w-full gap-2" disabled={submitting}>
                    {submitting ? (
                      <><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" /> Sending...</>
                    ) : (
                      <><Send className="h-4 w-4" /> Send Message</>
                    )}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}