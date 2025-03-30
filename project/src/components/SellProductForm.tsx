import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { supabase } from '../lib/supabase';
import { Loader2, Upload, Package, DollarSign, Image as ImageIcon, User } from 'lucide-react';
import toast from 'react-hot-toast';
import type { Database } from '../types/supabase';
import { motion } from 'framer-motion';

type ProductInsert = Database['public']['Tables']['products']['Insert'];

export const SellProductForm: React.FC = () => {
  const { account } = useWallet();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Omit<ProductInsert, 'seller_address'>>({
    name: '',
    description: '',
    price: 0,
    image_url: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }

    if (formData.price <= 0) {
      toast.error('Price must be greater than 0');
      return;
    }

    if (!formData.image_url.trim()) {
      toast.error('Image URL is required');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase.from('products').insert([{
        ...formData,
        seller_address: account.address,
        status: 'active'
      }]).select();

      if (error) {
        console.error('Supabase error:', error);
        throw new Error(error.message);
      }

      toast.success('Product listed successfully!');
      // Reset form after successful submission
      setFormData({
        name: '',
        description: '',
        price: 0,
        image_url: '',
      });
    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to list product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="space-y-8 max-w-2xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg p-8 border border-purple-200"
      >
        <div className="flex items-center mb-8">
          <Package className="w-6 h-6 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-purple-800">
            Product Details
          </h2>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-purple-800 mb-2">
              Product Name
            </label>
            <div className="relative">
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="block w-full rounded-lg bg-purple-50 border border-purple-200 px-4 py-3 pl-10 shadow-sm focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all text-purple-800 placeholder-purple-400"
                placeholder="Enter product name"
                required
              />
              <Package className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-purple-800 mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="block w-full rounded-lg bg-purple-50 border border-purple-200 px-4 py-3 shadow-sm focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all text-purple-800 placeholder-purple-400"
              rows={4}
              placeholder="Describe your product..."
            />
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-purple-800 mb-2">
              Price (APT)
            </label>
            <div className="relative">
              <input
                type="number"
                id="price"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                className="block w-full rounded-lg bg-purple-50 border border-purple-200 px-4 py-3 pl-10 shadow-sm focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all text-purple-800 placeholder-purple-400"
                step="0.000001"
                min="0"
                required
                placeholder="0.00"
              />
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            </div>
          </div>

          <div>
            <label htmlFor="image_url" className="block text-sm font-medium text-purple-800 mb-2">
              Image URL
            </label>
            <div className="relative">
              <input
                type="url"
                id="image_url"
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                className="block w-full rounded-lg bg-purple-50 border border-purple-200 px-4 py-3 pl-10 shadow-sm focus:border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-600 transition-all text-purple-800 placeholder-purple-400"
                required
                placeholder="https://example.com/image.jpg"
              />
              <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-400 w-5 h-5" />
            </div>
          </div>
        </div>
      </motion.div>

      {account?.address && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-8 border border-purple-200"
        >
          <div className="flex items-center mb-6">
            <User className="w-6 h-6 text-purple-600 mr-3" />
            <h2 className="text-xl font-bold text-purple-800">
              Seller Information
            </h2>
          </div>
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <label className="block text-sm font-medium text-purple-800 mb-2">
              Wallet Address
            </label>
            <div className="text-sm font-mono text-purple-700 break-all">
              {account.address}
            </div>
          </div>
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={isSubmitting || !account}
        className="relative w-full h-12 items-center justify-center"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <div className="absolute inset-0 skew-x-[23deg] bg-purple-600"></div>
        <span className="relative z-10 text-white font-bold">
          {isSubmitting ? (
            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
          ) : (
            <>
              <Upload className="w-5 h-5 inline-block mr-2" />
              List Product
            </>
          )}
        </span>
      </motion.button>
    </motion.form>
  );
};