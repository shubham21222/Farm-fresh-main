import api from './api';

// Get user's cart
export const getCart = async () => {
  const response = await api.get('/cart');
  return response.data;
};

// Add item to cart
export const addToCart = async (productId, quantity) => {
  const response = await api.post('/cart', { productId, quantity });
  return response.data;
};

// Update cart item quantity
export const updateCartItem = async (itemId, quantity) => {
  const response = await api.put(`/cart/${itemId}`, { quantity });
  return response.data;
};

// Remove item from cart
export const removeFromCart = async (itemId) => {
  const response = await api.delete(`/cart/${itemId}`);
  return response.data;
};

// Clear cart
export const clearCart = async () => {
  const response = await api.delete('/cart');
  return response.data;
}; 