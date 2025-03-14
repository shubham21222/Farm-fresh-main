import api from '../api';

// Get farmer's products
export const getFarmerProducts = async () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const farmerId = user.id || user._id; // Handle both id formats
  if (!farmerId) {
    throw new Error('Farmer ID not found. Please login again.');
  }
  const response = await api.get(`/api/products/farmer/${farmerId}`);
  return response.data;
};

// Get farmer's orders
export const getFarmerOrders = async () => {
  const response = await api.get('/api/orders/farmer');
  return response.data;
};

// Get farmer's analytics
export const getFarmerAnalytics = async () => {
  const response = await api.get('/api/analytics/farmer');
  return response.data;
};

// Update product
export const updateProduct = async (productId, productData) => {
  const response = await api.put(`/api/products/${productId}`, productData);
  return response.data;
};

// Add new product
export const addProduct = async (productData) => {
  const response = await api.post('/api/products', productData);
  return response.data;
};

// Delete product
export const deleteProduct = async (productId) => {
  const response = await api.delete(`/api/products/${productId}`);
  return response.data;
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  const response = await api.put(`/api/orders/${orderId}/status`, { status });
  return response.data;
};

// Get farmer profile
export const getFarmerProfile = async () => {
  const response = await api.get('/api/users/profile');
  return response.data;
};

// Update farmer profile
export const updateFarmerProfile = async (profileData) => {
  const response = await api.put('/api/users/profile', profileData);
  return response.data;
}; 