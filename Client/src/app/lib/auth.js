"use client";

import api from './api';

// Register a new user
export const registerUser = async (userData) => {
  const response = await api.post('/api/users/register', userData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Register a new farmer
export const registerFarmer = async (farmerData) => {
  const response = await api.post('/api/users/farmer/register', farmerData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
export const loginUser = async (credentials) => {
  try {
    const endpoint = credentials.role === 'admin'
      ? '/api/admin/login'    // Updated admin login endpoint
      : '/api/users/login';   // Regular user login endpoint

    const response = await api.post(endpoint, credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Get user profile
export const getUserProfile = async () => {
  try {
    const user = getCurrentUser();
    if (!user) return null;

    const endpoint = user.role === 'admin' 
      ? '/api/admin/profile'  // Updated admin profile endpoint
      : '/api/users/profile'; // Regular user profile endpoint

    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  const user = getCurrentUser();
  const endpoint = user?.role === 'admin' ? '/api/admin/profile' : '/api/users/profile';
  
  const response = await api.put(endpoint, profileData);
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data));
  }
  return response.data;
};

// Logout user
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem('cart');
  localStorage.removeItem('wishlist');
  window.location.href = '/login';
};

// Get current user from localStorage
export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

// Send verification email
export const sendVerificationEmail = async () => {
  try {
    const response = await api.post('/api/users/send-verification');
    return response.data;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};

// Verify email
export const verifyEmail = async (token) => {
  try {
    const response = await api.post('/api/users/verify-email', { token });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    return response.data;
  } catch (error) {
    console.error('Error verifying email:', error);
    throw error;
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = getCurrentUser();
  return !!(token && user);
};

export const hasRole = (requiredRole) => {
  const user = getCurrentUser();
  return user && user.role === requiredRole;
};

export const isAdmin = () => hasRole('admin');
export const isFarmer = () => hasRole('farmer');
export const isCustomer = () => hasRole('user'); 