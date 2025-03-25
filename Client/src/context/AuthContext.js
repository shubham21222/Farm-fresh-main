"use client";

import { useState, useEffect, createContext, useContext } from 'react';
import { getCurrentUser, getUserProfile, logoutUser } from '@/app/lib/auth';
import { useRouter } from 'next/navigation';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState({ items: [] });
  const [wishlist, setWishlist] = useState([]);
  const router = useRouter();

  // Initialize auth state and listen for changes
  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = getCurrentUser();
        if (currentUser) {
          try {
            const userProfile = await getUserProfile();
            setUser(userProfile);
          } catch (error) {
            console.error('Error fetching user profile:', error);
            setUser(currentUser); // Fallback to localStorage user
          }
          const savedCart = JSON.parse(localStorage.getItem('cart') || '{"items": []}');
          const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
          setCart(savedCart);
          setWishlist(savedWishlist);
        }
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    // Listen for storage changes (e.g., login from another tab)
    const handleStorageChange = () => {
      const updatedUser = getCurrentUser();
      setUser(updatedUser);
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const login = async (userData) => {
    try {
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      const expirationDate = new Date();
      expirationDate.setDate(expirationDate.getDate() + 7);
      document.cookie = `userRole=${userData.role}; path=/; expires=${expirationDate.toUTCString()}; SameSite=Strict`;
      
      setUser(userData);
      
      const savedCart = JSON.parse(localStorage.getItem('cart') || '{"items": []}');
      const savedWishlist = JSON.parse(localStorage.getItem('wishlist') || '[]');
      setCart(savedCart);
      setWishlist(savedWishlist);
      
      router.refresh();
      console.log('Login successful, user:', userData); // Debug log
      return true;
    } catch (error) {
      console.error('Error during login:', error);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      document.cookie = 'userRole=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT';
      setUser(null);
      setCart({ items: [] });
      setWishlist([]);
      throw error;
    }
  };

  const logout = () => {
    logoutUser(); // Use the imported logoutUser function
    setUser(null);
    setCart({ items: [] });
    setWishlist([]);
    router.push('/login');
    console.log('Logged out successfully');
  };

  const updateCart = (newCart) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const updateWishlist = (newWishlist) => {
    setWishlist(newWishlist);
    localStorage.setItem('wishlist', JSON.stringify(newWishlist));
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        login, 
        logout,
        cart,
        wishlist,
        updateCart,
        updateWishlist
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};