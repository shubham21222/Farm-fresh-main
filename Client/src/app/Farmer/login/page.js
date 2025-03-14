"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { loginUser } from '@/app/lib/auth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAuth } from '@/app/hooks/useAuth';
import Cookies from 'js-cookie';

const LoginPage = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await loginUser({
        ...formData,
        role: 'farmer'
      });

      // Check if we have a response with the required data
      if (response && response._id) {
        const userData = {
          id: response._id,
          name: response.name,
          email: response.email,
          role: response.role,
          isVerified: response.isVerified,
          token: response.token
        };
        
        // Set cookies for middleware authentication
        Cookies.set('token', response.token, { path: '/' });
        Cookies.set('userRole', response.role, { path: '/' });
        
        // Save user data to localStorage for client-side use
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // Update auth context with user data
        login(userData);
        toast.success('Logged in successfully');
        
        // Check verification status and route accordingly
        if (response.isVerified) {
          router.push('/Farmer/Farmer-Dashboard');
        } else {
          router.push('/Farmer/pending-verification');
        }
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 bg-white rounded-2xl shadow-2xl overflow-hidden">
        {/* Image Section */}
        <div className="hidden md:block relative">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600/90 to-green-800/90 z-10" />
          <Image
            src="/farm-login.jpg"
            alt="Farm landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="relative z-20 h-full flex flex-col items-start justify-end p-12 text-white">
            <h2 className="text-4xl font-bold mb-4">Farmer Portal</h2>
            <p className="text-lg text-green-50">
              Access your farm management dashboard and connect with customers.
            </p>
          </div>
        </div>

        {/* Form Section */}
        <div className="p-8 md:p-12">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
              <p className="text-gray-600">Sign in to your farmer account</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Don&apos;t have a farmer account?{' '}
                <a href="/Farmer/register" className="text-green-600 hover:text-green-700 font-medium">
                  Register here
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 