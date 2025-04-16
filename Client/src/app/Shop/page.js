"use client";

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { getProducts, getProductsByCategory } from '../lib/api/products';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '@/store/slices/cartSlice'; // Import action
import { useWishlist } from '../hooks/useWishlist';
import { Button } from '@/components/ui/button';
import { ShoppingCart, Heart, Star, Filter, Search, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import CounterSection from '../components/CounterSection';
import ProductCarousel from '../components/ProductCarousel';
import { Suspense } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const categories = [
  { id: 'fruits', name: 'Organic Fruits', image: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  { id: 'vegetables', name: 'Organic Vegetables', image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  { id: 'dairy', name: 'Organic Dairy', image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
  { id: 'grains', name: 'Organic Grains', image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3' },
];

const ShopContent = () => {
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const category = searchParams.get('category');
  const [selectedCategory, setSelectedCategory] = useState(category || 'all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { user, token, isAuthenticated } = useSelector((state) => state.auth);
  const { loading: cartLoading, error: cartError } = useSelector((state) => state.cart);
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();
  const containerRef = useRef(null);

  useEffect(() => {
    console.log('Redux auth state:', { user, token, isAuthenticated });
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = containerRef.current?.querySelectorAll('.animate-on-scroll');
    elements?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = selectedCategory === 'all' 
          ? await getProducts() 
          : await getProductsByCategory(selectedCategory);
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [selectedCategory]);

  useEffect(() => {
    let filtered = [...products];
    if (searchQuery) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }
    setFilteredProducts(filtered);
  }, [searchQuery, sortBy, products]);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated || !token) {
      console.log('Authentication failed:', { isAuthenticated, token });
      toast.error('Please login to add items to cart');
      return;
    }

    try {
      await dispatch(addToCart({ productId: product._id, quantity: 1 })).unwrap();
      toast.success('Added to cart successfully!');
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error(error.message || 'Failed to add item to cart');
    }
  };

  const handleAddToWishlist = async (product) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to wishlist');
      return;
    }

    try {
      if (isInWishlist(product._id)) {
        await removeFromWishlist(product._id);
        toast.success('Removed from wishlist!');
      } else {
        await addToWishlist(product._id);
        toast.success('Added to wishlist!');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen mt-16 bg-gray-50 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-gray-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" ref={containerRef}>
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8 sm:mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-4 flex items-center justify-center gap-2">
            <Sparkles className="h-8 w-8 text-yellow-400" />
            Organic Shop
            <Sparkles className="h-8 w-8 text-yellow-400" />
          </h1>
          <p className="text-lg sm:text-xl text-gray-600">Discover fresh, organic products from local farmers</p>
        </motion.div>

        <ProductCarousel />
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          {categories.map((cat, index) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Link
                href={`/Shop?category=${cat.id}`}
                className={`relative h-32 sm:h-48 rounded-lg overflow-hidden group ${selectedCategory === cat.id ? 'ring-2 ring-green-500' : ''}`}
              >
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center p-4">
                  <h3 className="text-white text-base sm:text-xl font-semibold text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        <CounterSection />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6 sm:mb-8 backdrop-blur-sm bg-white/80"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 group-hover:text-green-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <Button 
                variant="outline" 
                className="flex items-center gap-2 hover:bg-green-50 hover:border-green-200 transition-all duration-300"
              >
                <Filter className="h-4 w-4" />
                Filters
              </Button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
          <motion.div 
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6"
          >
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 group"
              >
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <button
                    onClick={() => handleAddToWishlist(product)}
                    className={`absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-all duration-300 transform hover:scale-110 ${isInWishlist(product._id) ? 'text-red-500' : 'text-gray-600'}`}
                  >
                    <Heart className={`h-5 w-5 ${isInWishlist(product._id) ? 'fill-current' : ''}`} />
                  </button>
                </div>
                <div className="p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-1 sm:mb-2 group-hover:text-green-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center mb-3 sm:mb-4">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600 ml-2">({product.reviews || 0})</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
                    <span className="text-lg sm:text-xl font-bold text-green-600">
                      ${product.price}
                    </span>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      disabled={cartLoading}
                      className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white transition-all duration-300 transform hover:scale-105"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      {cartLoading ? 'Adding...' : 'Add to Cart'}
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence>
          {filteredProducts.length === 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center py-8 sm:py-12"
            >
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-sm sm:text-base text-gray-600">Try adjusting your search or filters</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default function ShopPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen mt-16 bg-gray-50 py-12 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    }>
      <Header />
      <ShopContent />
      <Footer />
    </Suspense>
  );
}