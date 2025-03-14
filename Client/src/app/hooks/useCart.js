import { useState, useEffect } from 'react';
import { getCart } from '../lib/cart';
import { useAuth } from './useAuth';

export const useCart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchCart = async () => {
      if (user) {
        try {
          const cartData = await getCart();
          setCart(cartData);
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      }
      setLoading(false);
    };

    fetchCart();
  }, [user]);

  const updateCart = (newCart) => {
    setCart(newCart);
  };

  return {
    cart,
    loading,
    updateCart,
  };
}; 