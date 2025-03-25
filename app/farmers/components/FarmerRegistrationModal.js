'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export default function FarmerRegistrationModal({ open, setOpen }) {
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
        ...formData,
        farmProducts: formData.farmProducts.split(',').map(product => product.trim())
      });

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

        router.push(response.data.isVerified ? '/Farmer/Farmer-Dashboard' : '/Farmer/pending-verification');
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
  );
} 