/*
  # Update products table schema and policies

  1. Changes
    - Remove seller verification dependency
    - Update RLS policies to remove user_profiles dependency
    - Drop user_profiles table and related objects
*/

-- First, drop the policy that depends on user_profiles
DROP POLICY IF EXISTS "Only verified users can create products" ON products;

-- Drop existing policies
DROP POLICY IF EXISTS "Anyone can view active products" ON products;
DROP POLICY IF EXISTS "Anyone can create products" ON products;
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

-- Now we can safely drop the user_profiles table
DROP TABLE IF EXISTS user_profiles CASCADE;