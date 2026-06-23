import { createClient } from '@supabase/supabase-js';

console.log("Checking URL Key:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Checking Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image_url: string | null;
  category: string;
  stock: number;
  featured: boolean;
  created_at: string;
};

export type CartItem = {
  product: Product;
  quantity: number;
};

export type OrderItem = {
  product: {
    id: string;
    name: string;
    price: number;
    image_url?: string | null;
  };
  quantity: number;
};

export type OrderStatus = 'active' | 'deleted';

export type ClientOrder = {
  id: string;
  client_name: string;
  client_email: string | null;
  delivery_address: string;
  phone_number: string;
  total_amount: number;
  order_items: OrderItem[];
  special_instructions: string | null;
  status: OrderStatus | string;
  deleted_at: string | null;
  created_at?: string;
};
