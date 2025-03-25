"use client";

import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { updateBillingAddress } from '@/app/lib/api';
import toast from 'react-hot-toast';

const AddressTab = () => {
  const [activeAddress, setActiveAddress] = useState('billing');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    phone: ''
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await updateBillingAddress(formData);
      
      if (response.success) {
        toast.success('Address updated successfully');
        // Reset form or update with new data
        setFormData(response.data.billingAddress);
      } else {
        toast.error(response.message || 'Failed to update address');
      }
    } catch (error) {
      console.error('Error updating address:', error);
      toast.error(error.response?.data?.message || 'Failed to update address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="address-tab">
      <h2 className="text-2xl font-semibold mb-6 text-green-800">My Addresses</h2>
      
      <div className="space-y-6">
        {['billing', 'shipping'].map(type => (
          <div key={type} className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <button
              onClick={() => setActiveAddress(activeAddress === type ? null : type)}
              className="w-full flex justify-between items-center text-xl font-semibold text-green-700"
            >
              {type === 'billing' ? 'Billing Address' : 'Shipping Address'}
              <ChevronDown
                className={`h-5 w-5 transition-transform duration-200 ${
                  activeAddress === type ? 'rotate-180' : ''
                }`}
              />
            </button>

            {activeAddress === type && (
              <form onSubmit={handleSubmit} className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name *</label>
                  <input 
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name *</label>
                  <input 
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Company Name</label>
                  <input 
                    name="companyName"
                    value={formData.companyName || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Country *</label>
                  <input 
                    name="country"
                    value={formData.country || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-sm font-medium text-gray-700">Street Address *</label>
                  <input 
                    name="street"
                    value={formData.street || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">City *</label>
                  <input 
                    name="city"
                    value={formData.city || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">State *</label>
                  <input 
                    name="state"
                    value={formData.state || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ZIP *</label>
                  <input 
                    name="zipCode"
                    value={formData.zipCode || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone *</label>
                  <input 
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="col-span-full">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? 'Updating...' : 'Update Address'}
                  </Button>
                </div>
              </form>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressTab;