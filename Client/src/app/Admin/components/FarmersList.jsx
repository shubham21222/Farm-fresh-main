"use client";

import { useState } from 'react';
import { Search, MoreVertical, ChevronDown } from 'lucide-react';

const farmers = [
  {
    id: 1,
    name: 'Rajesh Kumar',
    location: 'Punjab',
    products: ['Wheat', 'Rice'],
    revenue: 125000,
    status: 'active',
    image: '/farmers/farmer1.jpg'
  },
  {
    id: 2,
    name: 'Priya Patel',
    location: 'Gujarat',
    products: ['Cotton', 'Groundnut'],
    revenue: 98000,
    status: 'active',
    image: '/farmers/farmer2.jpg'
  },
  {
    id: 3,
    name: 'Amit Singh',
    location: 'Haryana',
    products: ['Rice', 'Vegetables'],
    revenue: 85000,
    status: 'inactive',
    image: '/farmers/farmer3.jpg'
  },
  {
    id: 4,
    name: 'Meera Reddy',
    location: 'Karnataka',
    products: ['Coffee', 'Spices'],
    revenue: 156000,
    status: 'active',
    image: '/farmers/farmer4.jpg'
  },
  {
    id: 5,
    name: 'Suresh Verma',
    location: 'Maharashtra',
    products: ['Sugarcane', 'Soybean'],
    revenue: 112000,
    status: 'active',
    image: '/farmers/farmer5.jpg'
  }
];

const FarmersList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('revenue');

  const filteredFarmers = farmers
    .filter(farmer => 
      farmer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      farmer.location.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'revenue') {
        return b.revenue - a.revenue;
      }
      return a.name.localeCompare(b.name);
    });

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Registered Farmers</h2>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search farmers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-sm"
              />
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            </div>
            <button
              onClick={() => setSortBy(sortBy === 'revenue' ? 'name' : 'revenue')}
              className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-900"
            >
              <span>Sort by {sortBy === 'revenue' ? 'Revenue' : 'Name'}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-3 text-left text-sm font-medium text-gray-600">Farmer</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">Location</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">Products</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">Revenue</th>
                <th className="pb-3 text-left text-sm font-medium text-gray-600">Status</th>
                <th className="pb-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredFarmers.map((farmer) => (
                <tr key={farmer.id} className="group">
                  <td className="py-4">
                    <div className="flex items-center space-x-3">
                      <img
                        src={farmer.image}
                        alt={farmer.name}
                        className="h-10 w-10 rounded-full object-cover"
                      />
                      <span className="text-sm font-medium text-gray-900">{farmer.name}</span>
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-sm text-gray-600">{farmer.location}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex flex-wrap gap-1">
                      {farmer.products.map((product, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {product}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-4">
                    <span className="text-sm font-medium text-gray-900">
                      ₹{farmer.revenue.toLocaleString()}
                    </span>
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        farmer.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {farmer.status.charAt(0).toUpperCase() + farmer.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-4">
                    <button className="invisible group-hover:visible p-2 hover:bg-gray-100 rounded-full">
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default FarmersList; 