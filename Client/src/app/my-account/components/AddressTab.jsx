// components/AddressTab.jsx
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button";

const AddressTab = () => {
  const [activeAddress, setActiveAddress] = useState('billing');

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
              <form className="grid sm:grid-cols-2 gap-4 mt-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">First Name *</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Last Name *</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Company Name</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Country *</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="col-span-full space-y-2">
                  <label className="text-sm font-medium text-gray-700">Street Address *</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">City *</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">State *</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">ZIP *</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Phone *</label>
                  <input 
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all" 
                    required 
                  />
                </div>
              </form>
            )}
          </div>
        ))}
        <Button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-lg text-lg font-semibold transition-all"
        >
          Update Addresses
        </Button>
      </div>
    </div>
  );
};

export default AddressTab;