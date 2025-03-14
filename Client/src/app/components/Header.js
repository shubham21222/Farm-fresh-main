"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ShoppingCart, Heart, Search, Leaf, X, Menu, User, LogOut, Package, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter, usePathname } from "next/navigation";
import AuthModal from './auth/AuthModal';
import { useAuth } from '../hooks/useAuth';
import { logoutUser } from '../lib/auth';
import toast from 'react-hot-toast';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const { cart } = useCart();
  const { wishlist } = useWishlist();
  const profileRef = useRef(null);

  const navItems = [
    { name: "Home", path: "/" },
    { name: "Shop Organic", path: "/Shop" },
    { name: "Farmers", path: "/Farmers" },
    { name: "About Us", path: "/About" },
    { name: "Contact", path: "/Contact" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (cart) {
      setCartCount(cart.items.reduce((total, item) => total + item.quantity, 0));
    }
  }, [cart]);

  useEffect(() => {
    if (wishlist) {
      setWishlistCount(wishlist.length);
    }
  }, [wishlist]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleCategoryClick = (category) => {
    router.push(`/shop?category=${category}`);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  const buttonClasses = {
    primary: "w-full bg-gradient-to-br from-green-400 via-green-500 to-green-600 hover:from-green-500 hover:via-green-600 hover:to-green-700 text-white py-4 rounded-lg text-base font-semibold transition-all duration-300 transform hover:scale-[1.02] hover:shadow-[0_8px_25px_-8px_rgba(22,163,74,0.5)] active:scale-[0.98] focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none",
    social: "flex items-center justify-center px-4 py-3.5 border-2 border-green-100 rounded-lg bg-green-50/50 hover:bg-green-100/50 hover:border-green-200 hover:shadow-[0_0_15px_-3px_rgba(22,163,74,0.2)] transition-all duration-300 group",
    back: "flex items-center justify-center text-sm text-green-600 hover:text-green-700 transition-colors duration-200 py-2.5 hover:bg-green-50 rounded-lg group font-medium"
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-green-600'
      }`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 group">
              <div className={`relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                isScrolled 
                  ? 'bg-green-100 group-hover:bg-green-200' 
                  : 'bg-white/20 group-hover:bg-white/30'
              }`}>
                <Leaf className={`w-6 h-6 transition-all duration-300 ${
                  isScrolled 
                    ? 'text-green-600 group-hover:scale-110' 
                    : 'text-white group-hover:scale-110'
                }`} />
              </div>
              <span className={`text-2xl font-bold transition-colors duration-300 ${
                isScrolled ? 'text-green-600' : 'text-white'
              }`}>
                FarmFresh
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.path}
                  className={`text-sm font-medium transition-colors ${
                    pathname === item.path
                      ? isScrolled ? 'text-green-600' : 'text-white'
                      : isScrolled ? 'text-gray-600 hover:text-green-600' : 'text-white/90 hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-48 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>

              <Link href="/Wishlist" className="relative">
                <Heart className={`h-6 w-6 ${isScrolled ? 'text-gray-600' : 'text-white'}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              <Link href="/Cart" className="relative">
                <ShoppingCart className={`h-6 w-6 ${isScrolled ? 'text-gray-600' : 'text-white'}`} />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

              <div className="relative" ref={profileRef}>
                {user ? (
                  <div className="relative">
                    <Link href="/my-account" className="flex items-center space-x-2 focus:outline-none">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-gray-200">
                        {user.avatar ? (
                          <Image
                            src={user.avatar}
                            alt={user.name}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-green-100 flex items-center justify-center">
                            <User className="h-5 w-5 text-green-600" />
                          </div>
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-700">{user.name}</span>
                    </Link>

                    {/* <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="absolute -right-2 -top-2 w-5 h-5 rounded-full bg-green-600 text-white flex items-center justify-center text-xs hover:bg-green-700 transition-colors shadow-sm"
                    >
                      <LogOut className="h-3 w-3" />
                    </button> */}

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-100"
                        >
                          {/* <button
                            onClick={handleLogout}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-green-50 hover:text-green-600 transition-colors"
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </button> */}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Button
                    onClick={() => setIsAuthModalOpen(true)}
                    className={`${isScrolled ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-white text-green-600 hover:bg-gray-100'}`}
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <X className={`h-6 w-6 ${isScrolled ? 'text-gray-600' : 'text-white'}`} />
              ) : (
                <Menu className={`h-6 w-6 ${isScrolled ? 'text-gray-600' : 'text-white'}`} />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div
        className={`md:hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden bg-white`}
      >
        <div className="px-4 py-3 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`block text-sm font-medium ${
                pathname === item.path ? 'text-green-600' : 'text-gray-600'
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          <div className="flex items-center justify-between pt-4 border-t">
            <Link href="/Wishlist" className="relative">
              <Heart className="h-6 w-6 text-gray-600" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link href="/Cart" className="relative">
              <ShoppingCart className="h-6 w-6 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>

            <div className="flex items-center space-x-2">
              <User className="h-6 w-6 text-gray-600" />
              {user && (
                <span className="text-sm text-gray-600">{user.name}</span>
              )}
              <button
                onClick={() => {
                  setIsAuthModalOpen(true);
                  setIsMenuOpen(false);
                }}
                className="flex items-center space-x-1 text-sm text-gray-600"
              >
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </>
  );
};

export default Header;