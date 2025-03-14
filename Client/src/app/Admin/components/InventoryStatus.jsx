"use client";

import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Package } from 'lucide-react';
import Image from 'next/image';

ChartJS.register(ArcElement, Tooltip, Legend);

const InventoryStatus = () => {
  const data = {
    labels: ['In Stock', 'Low Stock', 'Out of Stock'],
    datasets: [
      {
        data: [65, 25, 10],
        backgroundColor: [
          'rgb(22, 163, 74)',  // green
          'rgb(234, 179, 8)',  // yellow
          'rgb(239, 68, 68)',  // red
        ],
        borderColor: [
          'rgb(22, 163, 74)',
          'rgb(234, 179, 8)',
          'rgb(239, 68, 68)',
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 6,
          boxHeight: 6,
          padding: 20,
        },
      },
      tooltip: {
        backgroundColor: 'white',
        titleColor: '#374151',
        bodyColor: '#374151',
        borderColor: '#E5E7EB',
        borderWidth: 1,
        padding: 12,
        boxPadding: 4,
        usePointStyle: true,
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.raw || 0;
            return `${label}: ${value}%`;
          }
        }
      }
    },
    cutout: '75%',
  };

  const products = [
    { 
      name: 'Organic Tomatoes', 
      status: 'in-stock', 
      quantity: 250, 
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8dG9tYXRvfHx8fHx8MTcwODUwMjQwMA&ixlib=rb-4.0.3&q=80&w=100'
    },
    { 
      name: 'Fresh Carrots', 
      status: 'low-stock', 
      quantity: 50, 
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8Y2Fycm90fHx8fHx8MTcwODUwMjQwMA&ixlib=rb-4.0.3&q=80&w=100'
    },
    { 
      name: 'Green Spinach', 
      status: 'out-of-stock', 
      quantity: 0, 
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8c3BpbmFjaHx8fHx8fDE3MDg1MDI0MDA&ixlib=rb-4.0.3&q=80&w=100'
    },
    { 
      name: 'Red Potatoes', 
      status: 'in-stock', 
      quantity: 180, 
      unit: 'kg',
      image: 'https://images.unsplash.com/photo-1590165482129-1b8b27698780?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=100&ixid=MnwxfDB8MXxyYW5kb218MHx8cG90YXRvfHx8fHx8MTcwODUwMjQwMA&ixlib=rb-4.0.3&q=80&w=100'
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'in-stock':
        return 'bg-green-100 text-green-700';
      case 'low-stock':
        return 'bg-yellow-100 text-yellow-700';
      case 'out-of-stock':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status) => {
    return status.split('-').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Inventory Status</h2>
        <button className="text-green-600 hover:text-green-700 text-sm font-medium">
          View All
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="h-[240px] flex items-center justify-center">
          <Doughnut data={data} options={options} />
        </div>

        {/* Product List */}
        <div className="space-y-4">
          {products.map((product, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-12 rounded-lg overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="text-sm font-medium text-gray-800">{product.name}</h3>
                  <p className="text-xs text-gray-500">{product.quantity} {product.unit}</p>
                </div>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(product.status)}`}>
                {getStatusText(product.status)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InventoryStatus; 