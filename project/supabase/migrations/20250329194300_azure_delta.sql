/*
  # Fix product creation RLS policies

  1. Security Changes
    - Update RLS policies to allow product creation with wallet addresses
    - Remove authentication requirement for product creation
    - Keep view and update policies intact
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

CREATE POLICY "Anyone can create products"
  ON products
  FOR INSERT
  TO public
  WITH CHECK (
    seller_address IS NOT NULL AND
    status = 'active'
  );

CREATE POLICY "Sellers can update their own products"
  ON products
  FOR UPDATE
  TO public
  USING (seller_address IS NOT NULL)
  WITH CHECK (status IN ('active', 'sold'));