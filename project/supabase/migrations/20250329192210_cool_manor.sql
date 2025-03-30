/*
  # Fix RLS policies for products table

  1. Security Changes
    - Update RLS policies to properly handle seller wallet addresses
    - Fix authentication check for product creation
    - Ensure proper access control for product updates
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Authenticated users can create products" ON products;
DROP POLICY IF EXISTS "Sellers can update their own products" ON products;

-- Create updated policies
CREATE POLICY "Anyone can view active products"
  ON products
  FOR SELECT
  TO public
  USING (status = 'active');

CREATE POLICY "Authenticated users can create products"
  ON products
  FOR INSERT
  TO authenticated
  WITH CHECK (
    seller_address IS NOT NULL AND
    seller_address = auth.jwt() ->> 'sub'
  );

CREATE POLICY "Sellers can update their own products"
  ON products
  FOR UPDATE
  TO authenticated
  USING (seller_address = auth.jwt() ->> 'sub')
  WITH CHECK (seller_address = auth.jwt() ->> 'sub');