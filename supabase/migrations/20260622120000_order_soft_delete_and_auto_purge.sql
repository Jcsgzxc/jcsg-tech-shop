-- Soft delete: track when an order was deleted
ALTER TABLE client_orders ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

UPDATE client_orders
SET status = 'active'
WHERE status IS NULL OR status = 'pending';

ALTER TABLE client_orders ALTER COLUMN status SET DEFAULT 'active';

-- Admin dashboard uses the anon key for order management
CREATE POLICY "client_orders_update_anon" ON client_orders FOR UPDATE
  TO anon USING (true) WITH CHECK (true);

CREATE POLICY "client_orders_delete_anon" ON client_orders FOR DELETE
  TO anon USING (true);

-- Permanently remove soft-deleted orders older than 7 days
CREATE OR REPLACE FUNCTION purge_old_deleted_orders()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  removed_count INTEGER;
BEGIN
  DELETE FROM client_orders
  WHERE status = 'deleted'
    AND deleted_at IS NOT NULL
    AND deleted_at < NOW() - INTERVAL '7 days';

  GET DIAGNOSTICS removed_count = ROW_COUNT;
  RETURN removed_count;
END;
$$;

-- Enable pg_cron in Supabase Dashboard → Database → Extensions first
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM cron.job WHERE jobname = 'purge-deleted-orders'
  ) THEN
    PERFORM cron.schedule(
      'purge-deleted-orders',
      '0 0 * * *',
      'SELECT public.purge_old_deleted_orders();'
    );
  END IF;
END;
$$;
