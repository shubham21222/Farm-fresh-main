"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { getCurrentUser, getUserProfile, logoutUser } from '../lib/auth';
import { useRouter } from 'next/navigation';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({ items: [] });
  const [wishlist, setWishlist] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          try {
            const userProfile = await getUserProfile();
            setUser(userProfile);

            // Initialize cart and wishlist
            const savedCart = JSON.parse(localStorage.getItem('cart') || '{"items": []}');
            const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
            setCart(savedCart);
            setWishlist(savedWishlist);
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setUser(currentUser);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (userData) => {
    try {
      setUser(userData);
      setCart([]);
      setWishlist([]);
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  };

  const logout = () => {
    logoutUser();
    setUser(null);
    setCart({ items: [] });
    setWishlist([]);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('wishlist');
    console.log('Logged out successfully');
  };

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateWishlist = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout,
        cart,
        wishlist,
        updateCart,
        updateWishlist
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 