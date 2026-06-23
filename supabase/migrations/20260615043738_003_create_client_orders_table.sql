CREATE TABLE client_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  address TEXT NOT NULL,
  phone TEXT NOT NULL,
  instructions TEXT,
  cart_items JSONB NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE client_orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "client_orders_insert_all" ON client_orders FOR INSERT
  WITH CHECK (true);

CREATE POLICY "client_orders_read_authenticated" ON client_orders FOR SELECT
  TO authenticated USING (true);