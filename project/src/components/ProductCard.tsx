import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Trash2, Loader2, Star, TrendingUp } from 'lucide-react';
import { Product } from '../types';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  onPurchase: (product: Product) => void;
  isProcessing: boolean;
  onDelete: (productId: string) => void;
  index: number;
}

export function ProductCard({ product, onPurchase, isProcessing, onDelete, index }: ProductCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Different gradient combinations for cards
  const gradients = [
    'from-lavender-100 to-lavender-200',
    'from-lavender-200 to-lavender-300',
    'from-lavender-300 to-lavender-400',
    'from-lavender-400 to-lavender-500',
    'from-lavender-500 to-lavender-600',
    'from-lavender-600 to-lavender-700',
  ];

  // Different border colors
  const borderColors = [
    'border-lavender-200',
    'border-lavender-300',
    'border-lavender-400',
    'border-lavender-500',
    'border-lavender-600',
    'border-lavender-700',
  ];

  // Different text colors
  const textColors = [
    'text-lavender-800',
    'text-lavender-700',
    'text-lavender-600',
    'text-lavender-500',
    'text-lavender-400',
    'text-lavender-300',
  ];

  const gradientIndex = index % gradients.length;

  return (
    <motion.div
      variants={cardVariants}
      className={`relative overflow-hidden rounded-xl shadow-lg ${borderColors[gradientIndex]} bg-gradient-to-br ${gradients[gradientIndex]} hover:shadow-xl transition-all duration-300`}
      whileHover={{ y: -5, scale: 1.02 }}
    >
      {/* Animated background overlay */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"
        animate={{
          x: ['0%', '100%'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear"
        }}
      />

      <div className="relative p-4">
        <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
          <motion.img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={{ scale: 1.1 }}
            transition={{ duration: 0.3 }}
          />
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Star className="w-3 h-3 mr-1" />
            Verified
          </div>
        </div>

        <motion.h3 
          className={`text-lg font-semibold mb-2 ${textColors[gradientIndex]}`}
          whileHover={{ scale: 1.05 }}
        >
          {product.name}
        </motion.h3>

        <motion.p 
          className={`text-sm mb-4 ${textColors[gradientIndex]} opacity-90`}
          whileHover={{ scale: 1.02 }}
        >
          {product.description}
        </motion.p>

        <div className="flex items-center justify-between mb-4">
          <motion.span 
            className={`text-xl font-bold ${textColors[gradientIndex]}`}
            whileHover={{ scale: 1.1 }}
          >
            {product.price} APT
          </motion.span>
          <div className="flex items-center space-x-2">
            <div className="flex items-center text-yellow-400">
              <Star className="w-4 h-4 mr-1" />
              <span className="text-sm">4.8</span>
            </div>
            <div className="flex items-center text-green-400">
              <TrendingUp className="w-4 h-4 mr-1" />
              <span className="text-sm">Trending</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-2">
          <motion.button
            onClick={() => onPurchase(product)}
            disabled={isProcessing}
            className={`flex-1 bg-lavender-600 text-white px-4 py-2 rounded-lg hover:bg-lavender-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:hover:scale-100 ${gradients[gradientIndex]}`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isProcessing ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                Buy Now
              </>
            )}
          </motion.button>

          <motion.button
            onClick={() => {
              if (window.confirm('Are you sure you want to delete this product?')) {
                onDelete(product.id);
                toast.success('Product deleted successfully');
              }
            }}
            className="p-2 text-red-500 hover:text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Trash2 className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}