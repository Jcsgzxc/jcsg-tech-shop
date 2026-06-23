ALTER TABLE client_orders RENAME COLUMN full_name TO client_name;
ALTER TABLE client_orders RENAME COLUMN address TO delivery_address;
ALTER TABLE client_orders RENAME COLUMN phone TO phone_number;
ALTER TABLE client_orders RENAME COLUMN instructions TO special_instructions;
ALTER TABLE client_orders RENAME COLUMN cart_items TO order_items;
ALTER TABLE client_orders RENAME COLUMN total TO total_amount;
ALTER TABLE client_orders RENAME COLUMN email TO client_email;