import api from './api';

// Get all products
export const getProducts = async (filters = {}) => {
  const response = await api.get('/products', { params: filters });
  return response.data;
};

// Get single product
export const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

// Create new product (farmer only)
export const createProduct = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

// Update product (farmer only)
export const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData);
  return response.data;
};

// Delete product (farmer only)
export const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Get farmer's products
export const getFarmerProducts = async (farmerId) => {
  const response = await api.get(`/products/farmer/${farmerId}`);
  return response.data;
};

// Create product review
export const createProductReview = async (productId, reviewData) => {
  const response = await api.post(`/products/${productId}/reviews`, reviewData);
  return response.data;
}; 