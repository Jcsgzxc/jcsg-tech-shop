CREATE POLICY "client_orders_read_anon" ON client_orders FOR SELECT
  TO anon USING (true);
