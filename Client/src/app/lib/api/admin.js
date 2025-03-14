import api from '../api';

// Get all users
export const getAllUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Get all farmers
export const getAllFarmers = async () => {
  const response = await api.get('/users/farmers');
  return response.data;
};

// Verify farmer
export const verifyFarmer = async (farmerId) => {
  const response = await api.put(`/users/farmers/${farmerId}/verify`);
  return response.data;
};

// Delete user
export const deleteUser = async (userId) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

// Get all products
export const getAllProducts = async () => {
  const response = await api.get('/products/all');
  return response.data;
};

// Get all orders
export const getAllOrders = async () => {
  const response = await api.get('/orders/all');
  return response.data;
};

// Get admin analytics
export const getAdminAnalytics = async () => {
  const response = await api.get('/analytics/admin');
  return response.data;
};

// Update product status
export const updateProductStatus = async (productId, status) => {
  const response = await api.put(`/products/${productId}/status`, { status });
  return response.data;
};

// Get admin dashboard stats
export const getAdminDashboardStats = async () => {
  const response = await api.get('/admin/dashboard-stats');
  return response.data;
}; 