import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { CartProvider } from '@/lib/CartContext';
import { FlyingCartProvider } from '@/lib/FlyingCartContext';
import { Toaster } from '@/components/ui/sonner';
import LayoutClient from '@/components/LayoutClient';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jcsg Tech Shop | Premium Tech Accessories & PC Services',
  description: 'Your one-stop shop for premium mechanical keyboards, gaming mice, and professional PC tune-up services.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} min-h-screen flex flex-col`}>
        <CartProvider>
          <FlyingCartProvider>
            <Toaster richColors />
            <LayoutClient>{children}</LayoutClient>
          </FlyingCartProvider>
        </CartProvider>
      </body>
    </html>
  );
}
