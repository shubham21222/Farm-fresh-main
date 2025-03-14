import React, { createContext, useState, useContext, useEffect } from 'react';
import { getCart } from '../services/cartService';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
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

  const value = {
    cart,
    loading,
    updateCart,
  };

  return (
    <CartContext.Provider value={value}>
      {!loading && children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}; 