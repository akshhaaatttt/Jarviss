/*
  # Create products table for P2P marketplace

  1. New Tables
    - `products`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (numeric)
      - `image_url` (text)
      - `seller_address` (text)
      - `created_at` (timestamp)
      - `status` (text)

  2. Security
    - Enable RLS on `products` table
    - Add policies for:
      - Public viewing of active products
      - Authenticated users can create products
      - Sellers can update their own products
*/

-- Create the products table if it doesn't exist
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  price numeric NOT NULL CHECK (price > 0),
  image_url text NOT NULL,
  seller_address text NOT NULL,
  created_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'sold'))
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Anyone can view active products" ON products;
    DROP POLICY IF EXISTS "Authenticated users can create products" ON products;
    DROP POLICY IF EXISTS "Sellers can update their own products" ON products;
END $$;

-- Create new policies
CREATE POLICY "Anyone can view active products"
  ON products
  FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "Authenticated users can create products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Sellers can update their own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (seller_address = auth.jwt() ->> 'sub')
  WITH CHECK (seller_address = auth.jwt() ->> 'sub');