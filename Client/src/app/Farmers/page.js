// pages/Farmer.jsx
"use client";

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { registerFarmer } from '@/app/lib/auth';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

// Sample Farmers Data
const farmers = [
  {
    name: "John Doe",
    location: "Sunnyvale Farms, CA",
    image: "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg?auto=compress&cs=tinysrgb&w=600",
    specialty: "Organic Vegetables",
    experience: "15+ years",
    description: "Passionate about sustainable farming and organic produce."
  },
  {
    name: "Maria Silva",
    location: "Green Hills, OR",
    image: "https://images.pexels.com/photos/5946108/pexels-photo-5946108.jpeg?auto=compress&cs=tinysrgb&w=600",
    specialty: "Fruit Orchards",
    experience: "20+ years",
    description: "Third-generation farmer specializing in heritage fruit varieties."
  },
  {
    name: "Robert Chen",
    location: "Valley View Farm, WA",
    image: "https://images.pexels.com/photos/8911786/pexels-photo-8911786.jpeg?auto=compress&cs=tinysrgb&w=600",
    specialty: "Hydroponic Farming",
    experience: "10+ years",
    description: "Pioneer in modern sustainable farming techniques."
  }
];

const FarmerRegistrationModal = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    address: '',
    phone: '',
    farmName: '',
    farmAddress: '',
    farmDescription: '',
    farmProducts: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await registerFarmer({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        address: formData.address,
        phone: formData.phone,
        farmName: formData.farmName,
        farmAddress: formData.farmAddress,
        farmDescription: formData.farmDescription,
        farmProducts: formData.farmProducts.split(',').map(product => product.trim())
      });

      // Store user data in localStorage
      if (response.data) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.data._id,
          name: response.data.name,
          email: response.data.email,
          role: response.data.role,
          isVerified: response.data.isVerified
        }));

        toast.success('Registration successful!');
        setOpen(false);
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: '',
          address: '',
          phone: '',
          farmName: '',
          farmAddress: '',
          farmDescription: '',
          farmProducts: ''
        });

        // Redirect based on verification status
        if (response.data.isVerified) {
          router.push('/Farmer/Farmer-Dashboard');
        } else {
          router.push('/Farmer/pending-verification');
        }
      } else {
        toast.success('Registration successful! Please wait for admin verification.');
        router.push('/Farmer/login');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Register as a Farmer</DialogTitle>
          <DialogDescription>
            Join our community of local farmers and start selling your products.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

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
                placeholder="Create a password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                type="text"
                placeholder="Enter your address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="farmName">Farm Name</Label>
              <Input
                id="farmName"
                type="text"
                placeholder="Enter your farm name"
                value={formData.farmName}
                onChange={(e) => setFormData({ ...formData, farmName: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="farmAddress">Farm Address</Label>
              <Input
                id="farmAddress"
                type="text"
                placeholder="Enter your farm address"
                value={formData.farmAddress}
                onChange={(e) => setFormData({ ...formData, farmAddress: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="farmDescription">Farm Description</Label>
              <Textarea
                id="farmDescription"
                placeholder="Describe your farm and farming practices"
                value={formData.farmDescription}
                onChange={(e) => setFormData({ ...formData, farmDescription: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="farmProducts">Farm Products (comma-separated)</Label>
              <Input
                id="farmProducts"
                type="text"
                placeholder="e.g., Tomatoes, Lettuce, Carrots"
                value={formData.farmProducts}
                onChange={(e) => setFormData({ ...formData, farmProducts: e.target.value })}
                required
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register as Farmer'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Create a login handler component
const FarmerLoginHandler = () => {
  const router = useRouter();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (user && token && user.role === 'farmer') {
      if (user.isVerified) {
        router.push('/Farmer/Farmer-Dashboard');
      } else {
        router.push('/Farmer/pending-verification');
      }
    }
  }, [router]);

  return null;
};

// Farmers Page Component
const FarmerPage = () => {
  return (
    <>
      <FarmerLoginHandler />
      <Header />
      <section className="min-h-screen mt-14 bg-gradient-to-b from-green-50 via-white to-green-50 py-16">
        <div className="container mx-auto px-4">
         
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-extrabold text-green-800 mb-4 tracking-tight">
              Meet Our Farmers
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8">
              Discover the dedicated individuals who wake up at dawn to bring you nature&apos;s finest harvests. 
              Each farmer has a unique story and a commitment to sustainable agriculture.
            </p>
            
            {/* Registration Button */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-full shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300"
                >
                  Register as a Farmer
                </Button>
              </DialogTrigger>
              <FarmerRegistrationModal />
            </Dialog>
          </motion.div>

          {/* Farmers List */}
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {farmers.map((farmer, index) => (
              <motion.div
                key={farmer.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="group relative bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300"
              >
                {/* Farmer Image with Gradient Overlay */}
                <div className="relative h-96">
                  <Image
                    src={farmer.image}
                    alt={farmer.name}
                    width={400}
                    height={500}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent group-hover:from-black/90 transition-all duration-300"></div>
                  
                  {/* Farmer Info Overlay */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <h2 className="text-3xl font-bold text-white mb-2">{farmer.name}</h2>
                    <div className="flex items-center text-green-300 mb-3">
                      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{farmer.location}</span>
                    </div>
                    
                    <div className="space-y-2 text-white opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                      <p className="text-lg font-semibold">Specialty: {farmer.specialty}</p>
                      <p className="text-sm">{farmer.experience} of Experience</p>
                      <p className="text-sm italic">{farmer.description}</p>
                      <Button
                        variant="outline"
                        className="mt-4 bg-transparent border-2 border-white text-white hover:bg-white hover:text-green-800 transition-all"
                      >
                        View Profile
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mt-16"
          >
            <Button
              asChild
              className="bg-green-600 hover:bg-green-700 text-white text-lg px-10 py-6 rounded-full shadow-lg transform hover:scale-105 hover:shadow-xl transition-all duration-300"
            >
              <Link href="/Shop">Explore Our Farm Fresh Products</Link>
            </Button>
          </motion.div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default FarmerPage;