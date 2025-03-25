"use client";

import api from './api';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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
      ? '/api/admin/login'
      : '/api/users/login';   // Use the same endpoint for both users and farmers

    const response = await api.post(endpoint, credentials);
    
    if (response.data && response.data.data && response.data.data.token) {
      return {
        success: true,
        data: {
          user: response.data.data.user,
          token: response.data.data.token
        }
      };
    } else {
      return {
        success: false,
        error: 'Invalid response from server'
      };
    }
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error.response?.data?.message || 'Login failed'
    };
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

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
          });

          const data = await response.json();

          if (response.ok && data.success) {
            // Store token and user data in localStorage
            if (typeof window !== 'undefined') {
              localStorage.setItem('token', data.data.token);
              localStorage.setItem('user', JSON.stringify(data.data.user));
            }
            
            // Return user object with token
            return {
              id: data.data.user._id,
              name: data.data.user.name,
              email: data.data.user.email,
              role: data.data.user.role,
              token: data.data.token
            };
          }
          return null;
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.token = user.token;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.token = token.token;
      }
      return session;
    }
  },
  pages: {
    signIn: '/Farmer/login',
    error: '/Farmer/login',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions); 