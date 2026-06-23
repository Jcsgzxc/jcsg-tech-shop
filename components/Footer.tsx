'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Zap, Phone, Mail, Facebook } from 'lucide-react';



export default function Footer() {
  const router = useRouter();
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <>
      <footer className="border-t border-primary/20 bg-background/95">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-teal-400 glow-teal">
                  <Zap className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="font-bold">Jcsg Tech Shop</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Premium tech accessories and professional PC services.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
                <li><Link href="/store" className="hover:text-primary transition-colors">Store</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Categories</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Keyboards</li>
                <li>Mice</li>
                <li>Services</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-3 text-sm">
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4 text-primary" />
                  <span>09706850155</span>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4 text-primary" />
                  <a href="mailto:carlogumaod@gmail.com" className="hover:text-primary transition-colors">carlogumaod@gmail.com</a>
                </li>
                <li className="flex items-center gap-2 text-muted-foreground">
                  <Facebook className="h-4 w-4 text-primary" />
                  <a href="https://www.facebook.com/johncarlosiscon.guamod" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Facebook</a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-primary/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Jcsg Tech Shop. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </>
  );
}
