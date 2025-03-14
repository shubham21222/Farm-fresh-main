'use client';

import { useState, useEffect } from 'react';
import api from '@/app/services/api';

export function useWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    try {
      const storedWishlist = localStorage.getItem('wishlist');
      if (storedWishlist) {
        setWishlist(JSON.parse(storedWishlist));
      }
    } catch (err) {
      console.error('Error loading wishlist from localStorage:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (err) {
      console.error('Error saving wishlist to localStorage:', err);
    }
  }, [wishlist]);

  const addToWishlist = async (productId) => {
    try {
      // Add to local state
      setWishlist(prev => {
        if (prev.includes(productId)) return prev;
        return [...prev, productId];
      });

      // Try to sync with API if available
      try {
        await api.post('/wishlist', { productId });
      } catch (apiError) {
        console.log('API not available, using local storage only');
      }

      return true;
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      return false;
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      // Remove from local state
      setWishlist(prev => prev.filter(id => id !== productId));

      // Try to sync with API if available
      try {
        await api.delete(`/wishlist/${productId}`);
      } catch (apiError) {
        console.log('API not available, using local storage only');
      }

      return true;
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      return false;
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  return {
    wishlist,
    loading,
    error,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  };
} 