import React, { useState, useEffect } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { WalletConnect } from './components/WalletConnect';
import { ProductCard } from './components/ProductCard';
import { SellProductForm } from './components/SellProductForm';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import m1 from './logo.png'
import {
  Store,
  PlusCircle,
  Package,
  ShoppingBag,
  ArrowRight,
  Sparkles,
  Twitter,
  Github,
  Linkedin,
  Mail,
  Shield,
  Zap,
  Users,
  Star,
  TrendingUp,
  Loader2,
  ShoppingCart,
  CheckCircle2,
  Clock,
  Lock,
  Globe,
  Award,
  Heart,
  MessageSquare,
  ArrowUpRight,
  ChevronRight,
  Network,
} from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { supabase } from './lib/supabase';
import { Types } from 'aptos';
import toast from 'react-hot-toast';
import { Product } from './types';
import { motion, AnimatePresence } from 'framer-motion';
import { aptosClient, DECIMALS } from './lib/aptosClient';

function App() {
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    const visited = localStorage.getItem('hasVisited');
    if (!visited) {
      setHasVisited(true);
      localStorage.setItem('hasVisited', 'true');
    }
  }, []);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-white via-lavender-50 to-lavender-100 relative overflow-hidden">
        {/* Animated Background Elements */}
        <motion.div
          className="absolute top-0 left-0 w-96 h-96 bg-lavender-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-0 right-0 w-96 h-96 bg-lavender-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute bottom-0 left-1/2 w-96 h-96 bg-lavender-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"
          animate={{
            x: [0, 50, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <Toaster position="top-right" />
        <motion.header 
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-50 border-b border-lavender-200"
        >
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-8">
              <Link
                  to="/"
                  className="flex items-center text-2xl font-bold text-lavender-800 hover:text-lavender-900 transition-all"
                >
                  
                  <img 
                    src={m1}
                    alt="Logo"
                    className="h-[4.5rem] w-auto object-contain"
                  />
                </Link>
                <nav className="hidden md:flex space-x-6">
                  <Link
                    to="/"
                    className="text-lavender-700 hover:text-lavender-900 px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-all hover:bg-lavender-50"
                  >
                    <ShoppingBag className="h-5 w-4 mr-1" />
                    Browse
                  </Link>
                  <Link
                    to="/sell"
                    className="text-lavender-700 hover:text-lavender-900 px-3 py-2 rounded-lg text-sm font-medium flex items-center transition-all hover:bg-lavender-50"
                  >
                    <Package className="h-5 w-4 mr-1" />
                    Sell
                  </Link>
                </nav>
              </div>
              <WalletConnect />
            </div>
          </div>
        </motion.header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route
                path="/sell"
                element={
                  <ProtectedRoute>
                    <SellPage />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </AnimatePresence>
        </main>

        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white border-t border-lavender-200 mt-12"
        >
          <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center mb-4">
                  <Store className="h-6 w-6 mr-2 text-lavender-600" />
                  <span className="text-xl font-bold text-lavender-800">
                    P2P Marketplace
                  </span>
                </div>
                <p className="text-lavender-700 mb-4">
                  A decentralized marketplace powered by Aptos blockchain, enabling secure and transparent peer-to-peer transactions. Buy and sell products with confidence using smart contracts.
                </p>
                <div className="flex space-x-4">
                  <a href="#" className="text-lavender-600 hover:text-lavender-800 transition-colors">
                    <Twitter className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-lavender-600 hover:text-lavender-800 transition-colors">
                    <Github className="h-5 w-5" />
                  </a>
                  <a href="#" className="text-lavender-600 hover:text-lavender-800 transition-colors">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-lavender-800 mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link to="/" className="text-lavender-700 hover:text-lavender-900 transition-colors">
                      Browse Products
                    </Link>
                  </li>
                  <li>
                    <Link to="/sell" className="text-lavender-700 hover:text-lavender-900 transition-colors">
                      Sell Products
                    </Link>
                  </li>
                  <li>
                    <a href="#" className="text-lavender-700 hover:text-lavender-900 transition-colors">
                      About Us
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-lavender-800 mb-4">Contact</h3>
                <ul className="space-y-2">
                  <li>
                    <a href="#" className="text-lavender-700 hover:text-lavender-900 transition-colors flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Support
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-lavender-700 hover:text-lavender-900 transition-colors">
                      Terms of Service
                    </a>
                  </li>
                  <li>
                    <a href="#" className="text-lavender-700 hover:text-lavender-900 transition-colors">
                      Privacy Policy
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-lavender-200">
              <p className="text-center text-lavender-600 text-sm">
                © {new Date().getFullYear()} P2P Marketplace. All rights reserved.
              </p>
            </div>
          </div>
        </motion.footer>

        {/* Update the Testimonials Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-16 bg-gradient-to-br from-lavender-800 to-lavender-900 rounded-2xl shadow-xl mb-12 border border-lavender-700 relative overflow-hidden"
        >
          {/* Animated background elements */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-lavender-700/20 to-lavender-800/20"
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center mb-12">
              <motion.h2 
                className="text-3xl font-bold text-lavender-100 mb-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                What Our Users Say
              </motion.h2>
              <motion.p 
                className="text-lavender-200"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Join thousands of satisfied users who trust our platform
              </motion.p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  role: "Verified Buyer",
                  avatar: "bg-lavender-600",
                  text: "The most secure and user-friendly marketplace I've ever used. The blockchain integration makes transactions so smooth!",
                },
                {
                  name: "Mike Chen",
                  role: "Verified Seller",
                  avatar: "bg-lavender-500",
                  text: "As a seller, I love how easy it is to list products and receive payments. The platform is truly revolutionary!",
                },
                {
                  name: "Emma Davis",
                  role: "Verified User",
                  avatar: "bg-lavender-400",
                  text: "The customer support is excellent, and the platform's security features give me peace of mind.",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={testimonial.name}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className="bg-lavender-700/50 p-6 rounded-xl border border-lavender-600 backdrop-blur-sm"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 * index }}
                >
                  <motion.div 
                    className="flex items-center mb-4"
                    whileHover={{ scale: 1.1 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <motion.div
                          key={i}
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          transition={{ delay: 0.1 * i }}
                        >
                          <Star className="h-5 w-5" />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  <motion.p 
                    className="text-lavender-200 mb-4"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 * index }}
                  >
                    "{testimonial.text}"
                  </motion.p>
                  <motion.div 
                    className="flex items-center"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 * index }}
                  >
                    <motion.div 
                      className={`w-10 h-10 ${testimonial.avatar} rounded-full mr-3`}
                      whileHover={{ scale: 1.1, rotate: 360 }}
                      transition={{ duration: 0.5 }}
                    />
                    <div>
                      <div className="text-lavender-100 font-medium">{testimonial.name}</div>
                      <div className="text-lavender-300 text-sm">{testimonial.role}</div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Add floating elements to the sides */}
        <motion.div
          className="fixed left-4 top-1/2 w-16 h-16 bg-lavender-200 rounded-full opacity-20"
          animate={{
            y: [0, -20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="fixed right-4 top-1/3 w-24 h-24 bg-lavender-300 rounded-full opacity-20"
          animate={{
            y: [0, 20, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
        <motion.div
          className="fixed left-1/4 bottom-1/4 w-20 h-20 bg-lavender-400 rounded-full opacity-20"
          animate={{
            y: [0, -15, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        />

        {/* Video Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="py-16 bg-white rounded-2xl shadow-xl mb-12 border border-lavender-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-lavender-800 mb-4">
              Watch Our Project in Action
            </h2>
            <p className="text-lavender-600 mb-8">
              Check out the video below to see how our platform works.
            </p>
            <div className="relative" style={{ width: '100%', height: '0', paddingBottom: '56.25%' }}>
              <iframe
                src="https://www.youtube.com/embed/W4xhFWyRovM"
                title="P2P Ecommerce using Aptos"
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              />
            </div>
          </div>
        </motion.section>
      </div>
    </Router>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { connected } = useWallet();

  if (!connected) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function ProductList() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [processingId, setProcessingId] = React.useState<string | null>(null);
  const { account, signAndSubmitTransaction, connected } = useWallet();

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (product: Product) => {
    if (!account?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    try {
      setProcessingId(product.id);
      toast.loading('Processing transaction...');

      const payload = {
        type: "entry_function_payload",
        function: "0x1::coin::transfer",
        type_arguments: ["0x1::aptos_coin::AptosCoin"],
        arguments: [
          product.seller_address,
          (product.price * DECIMALS).toString()
        ]
      };

      const response = await signAndSubmitTransaction(payload);
      await aptosClient.waitForTransaction({ transactionHash: response.hash });

      await supabase
        .from('products')
        .update({ status: 'sold' })
        .eq('id', product.id);

      toast.dismiss();
      toast.success('Purchase successful!');
      fetchProducts();
    } catch (error) {
      console.error('Purchase error:', error);
      toast.dismiss();
      toast.error('Failed to complete purchase');
    } finally {
      setProcessingId(null);
    }
  };

  const handleDelete = async (productId: string) => {
    const updatedProducts = products.filter((p) => p.id !== productId);
    setProducts(updatedProducts);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="rounded-full h-12 w-12 border-4 border-lavender-400 border-t-transparent"
        />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden bg-gradient-to-br from-lavender-300 to-lavender-400 rounded-2xl shadow-xl mb-12 border border-lavender-300"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-lavender-200/30 to-lavender-300/30" />
        <div className="relative px-8 py-12 sm:px-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl font-bold text-lavender-900 mb-4">
              Discover Amazing Products
            </h1>
            <p className="text-xl text-lavender-800 mb-8">
              Browse through our curated collection of unique items or list your own products for sale. Powered by Aptos blockchain for secure and transparent transactions.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="flex items-center space-x-2 text-lavender-800">
                <Shield className="h-5 w-5 text-lavender-700" />
                <span>Secure Transactions</span>
              </div>
              <div className="flex items-center space-x-2 text-lavender-800">
                <Zap className="h-5 w-5 text-lavender-700" />
                <span>Fast Processing</span>
              </div>
              <div className="flex items-center space-x-2 text-lavender-800">
                <Users className="h-5 w-5 text-lavender-700" />
                <span>P2P Network</span>
              </div>
            </div>
            <Link
              to="/sell"
              className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-lavender-600 hover:bg-lavender-700 transition-all transform hover:scale-105"
            >
              Start Selling
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Featured Product Section */}
      {products.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative overflow-hidden bg-lavender-800 rounded-2xl shadow-xl mb-12 border border-lavender-700"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-lavender-500/20 to-lavender-600/20" />
          <div className="relative flex flex-col md:flex-row">
            <motion.div
              className="md:w-1/2 h-96"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={products[0].image_url}
                alt={products[0].name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full flex items-center">
                <Shield className="w-4 h-4 mr-1" />
                Verified
              </div>
            </motion.div>
            <div className="md:w-1/2 p-8">
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-3xl font-bold text-lavender-100 mb-4"
              >
                {products[0].name}
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lavender-200 mb-6"
              >
                {products[0].description}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="flex items-center space-x-4 mb-6"
              >
                <div className="flex items-center text-yellow-400">
                  <Star className="w-5 h-5 mr-1" />
                  <span>4.8</span>
                </div>
                <div className="flex items-center text-green-400">
                  <TrendingUp className="w-5 h-5 mr-1" />
                  <span>Trending</span>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 }}
                className="flex items-center justify-between"
              >
                <span className="text-3xl font-bold text-lavender-200">
                  {products[0].price} APT
                </span>
                <Link
                  to={`/product/${products[0].id}`}
                  className="text-lavender-300 hover:text-lavender-100 flex items-center"
                >
                  View Details
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </motion.div>
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                onClick={() => handlePurchase(products[0])}
                disabled={!connected || processingId === products[0].id || (account?.balance !== null && account.balance < products[0].price)}
                className="w-full mt-6 bg-lavender-600 text-white px-6 py-3 rounded-lg hover:bg-lavender-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all transform hover:scale-105 disabled:hover:scale-100"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {processingId === products[0].id ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5" />
                    Buy Now
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Product Grid */}
      <div className="flex justify-between items-center mb-6">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.8 }}
          className="text-2xl font-bold text-lavender-100 flex items-center"
        >
          <Sparkles className="h-6 w-6 mr-2 text-lavender-300" />
          Available Products
        </motion.h2>
        <Link
          to="/sell"
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-lavender-600 hover:bg-lavender-700 transition-all transform hover:scale-105"
        >
          <PlusCircle className="h-5 w-5 mr-2" />
          List Product
        </Link>
      </div>

      <AnimatePresence>
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-16"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
              },
            },
          }}
        >
          {products.slice(1).map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              onPurchase={handlePurchase}
              isProcessing={processingId === product.id}
              onDelete={handleDelete}
              index={index}
              
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* Why Choose Our Platform Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-16 bg-gradient-to-br from-lavender-100 via-lavender-200 to-lavender-300 rounded-2xl shadow-xl mb-12 border border-lavender-300 relative overflow-hidden"
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12">
            <motion.h2 
              className="text-3xl font-bold text-lavender-800 mb-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              Why Choose Our Platform
            </motion.h2>
            <motion.p 
              className="text-lavender-700"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Experience the future of e-commerce with our blockchain-powered marketplace
            </motion.p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Secure Transactions",
                description: "Every transaction is secured by blockchain technology, ensuring safe and transparent payments.",
                icon: Shield,
                gradient: "from-lavender-400 to-lavender-500",
                border: "border-lavender-400",
              },
              {
                title: "Fast Processing",
                description: "Lightning-fast transaction processing with minimal fees and instant confirmations.",
                icon: Zap,
                gradient: "from-lavender-500 to-lavender-600",
                border: "border-lavender-500",
              },
              {
                title: "P2P Network",
                description: "Direct peer-to-peer transactions without intermediaries, reducing costs and delays.",
                icon: Network,
                gradient: "from-lavender-600 to-lavender-700",
                border: "border-lavender-600",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`p-6 rounded-xl border ${feature.border} bg-gradient-to-br ${feature.gradient} shadow-lg backdrop-blur-sm`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 * index }}
              >
                <motion.div 
                  className="w-12 h-12 bg-white rounded-lg flex items-center justify-center mb-4"
                  whileHover={{ scale: 1.1, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-6 h-6 text-lavender-700" />
                </motion.div>
                <motion.h3 
                  className="text-xl font-semibold text-lavender-900 mb-2"
                  whileHover={{ scale: 1.05 }}
                >
                  {feature.title}
                </motion.h3>
                <motion.p 
                  className="text-lavender-800"
                  whileHover={{ scale: 1.02 }}
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Statistics Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-16 bg-lavender-800 rounded-2xl shadow-xl mb-12 border border-lavender-700"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="text-4xl font-bold text-lavender-300 mb-2">10K+</div>
              <div className="text-lavender-200">Active Users</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <div className="text-4xl font-bold text-lavender-300 mb-2">5K+</div>
              <div className="text-lavender-200">Products Listed</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
            >
              <div className="text-4xl font-bold text-lavender-300 mb-2">99.9%</div>
              <div className="text-lavender-200">Success Rate</div>
            </motion.div>
            <motion.div
              className="text-center"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <div className="text-4xl font-bold text-lavender-300 mb-2">24/7</div>
              <div className="text-lavender-200">Support</div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="py-16 bg-lavender-600 rounded-2xl shadow-xl mb-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-lavender-100 mb-4">
            Ready to Start Trading?
          </h2>
          <p className="text-lavender-100 mb-8 max-w-2xl mx-auto">
            Join our growing community of buyers and sellers. Experience the future of e-commerce today.
          </p>
          <Link
            to="/sell"
            className="inline-flex items-center px-8 py-4 border-2 border-lavender-100 rounded-lg text-lg font-medium text-lavender-100 hover:bg-lavender-100 hover:text-lavender-600 transition-all transform hover:scale-105"
          >
            Get Started Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </div>
      </motion.section>
    </motion.div>
  );
}

function SellPage() {
  const { connected } = useWallet();

  if (!connected) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <h2 className="text-2xl font-bold text-lavender-100 mb-4">
          Connect Your Wallet
        </h2>
        <p className="text-lavender-200">
          Please connect your wallet to list products for sale.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto"
    >
      <h2 className="text-2xl font-bold text-lavender-100 mb-6">
        List Your Product
      </h2>
      <SellProductForm />
    </motion.div>
  );
}

export default App;