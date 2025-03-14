import axios from './api';

export const adminApi = {
  // Auth
  login: async (credentials) => {
    const response = await axios.post('/api/admin/login', credentials);
    return response.data;
  },

  // Profile
  getProfile: async () => {
    const response = await axios.get('/api/admin/profile');
    return response.data;
  },

  updateProfile: async (profileData) => {
    const response = await axios.put('/api/admin/profile', profileData);
    return response.data;
  },

  // Users
  getAllUsers: async () => {
    const response = await axios.get('/api/admin/users');
    return response.data;
  },

  getAllFarmers: async () => {
    const response = await axios.get('/api/admin/farmers');
    return response.data;
  },

  verifyFarmer: async (farmerId) => {
    const response = await axios.put(`/api/admin/farmers/${farmerId}/verify`);
    return response.data;
  },

  deleteUser: async (userId) => {
    const response = await axios.delete(`/api/admin/users/${userId}`);
    return response.data;
  },

  // Products
  getAllProducts: async () => {
    const response = await axios.get('/api/admin/products');
    return response.data;
  },

  updateProductStatus: async (productId, status) => {
    const response = await axios.put(`/api/admin/products/${productId}/status`, { status });
    return response.data;
  },

  // Orders
  getAllOrders: async () => {
    const response = await axios.get('/api/admin/orders');
    return response.data;
  },

  // Analytics
  getDashboardStats: async () => {
    const response = await axios.get('/api/admin/dashboard-stats');
    return response.data;
  },

  getAnalytics: async () => {
    const response = await axios.get('/api/admin/analytics');
    return response.data;
  }
};

export default adminApi; 