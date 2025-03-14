// components/DashboardTab.jsx
import React from 'react';
import { Clock, XCircle, Package } from 'lucide-react';

const DashboardTab = () => {
  const stats = [
    { 
      label: 'Awaiting Pickup', 
      value: 4, 
      icon: Clock, 
      color: 'bg-yellow-100' 
    },
    { 
      label: 'Cancelled Orders', 
      value: 12, 
      icon: XCircle, 
      color: 'bg-red-100' 
    },
    { 
      label: 'Total Orders', 
      value: 200, 
      icon: Package, 
      color: 'bg-green-100' 
    },
  ];

  // Sample recent orders data
  const recentOrders = [
    {
      id: '54312452',
      product: 'Contrasting Sweatshirt',
      price: 45.00,
      status: 'Pending',
      statusColor: 'bg-yellow-100 text-yellow-700'
    },
    {
      id: '54312453',
      product: 'Faux-leather Trousers',
      price: 45.00,
      status: 'Delivery',
      statusColor: 'bg-purple-100 text-purple-700'
    },
    {
      id: '54312454',
      product: 'V-neck Knitted Top',
      price: 45.00,
      status: 'Completed',
      statusColor: 'bg-green-100 text-green-700'
    }
  ];

  return (
    <div className="dashboard-tab">
      <h2 className="text-2xl font-semibold mb-6">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        {stats.map(stat => (
          <div
            key={stat.label}
            className={`${stat.color} p-6 rounded-lg shadow-md flex items-center justify-between transform transition-all hover:scale-105`}
          >
            <div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
              <h3 className="text-3xl font-bold mt-2 text-gray-800">{stat.value}</h3>
            </div>
            <stat.icon size={40} className="text-gray-700 opacity-80" />
          </div>
        ))}
      </div>

      <div className="recent-orders bg-gray-50 p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px]">
            <thead className="border-b border-gray-200">
              <tr className="text-left text-sm text-gray-600 uppercase">
                <th className="pb-3 font-semibold">Order</th>
                <th className="pb-3 font-semibold">Product</th>
                <th className="pb-3 font-semibold">Price</th>
                <th className="pb-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(order => (
                <tr 
                  key={order.id}
                  className="border-b border-gray-100 hover:bg-gray-100 transition-colors"
                >
                  <td className="py-4">
                    <span className="font-medium">{order.id}</span>
                  </td>
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src="/images/product/1000x1000.png"
                        alt={order.product}
                        className="w-10 h-10 rounded object-cover"
                      />
                      <span className="font-medium">{order.product}</span>
                    </div>
                  </td>
                  <td className="py-4">${order.price.toFixed(2)}</td>
                  <td className="py-4 text-right">
                    <span 
                      className={`inline-block px-3 py-1 rounded-full text-sm ${order.statusColor}`}
                    >
                      {order.status}
                    </span>
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

export default DashboardTab;