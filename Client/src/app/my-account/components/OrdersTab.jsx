// components/OrdersTab.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const OrdersTab = ({ setOpenDetail }) => {
  const [activeOrders, setActiveOrders] = useState('all');

  const orderFilters = ['all', 'pending', 'delivery', 'completed', 'canceled'];
  
  const orders = [
    {
      id: 's184989823',
      status: 'delivery',
      items: [
        { name: 'Sheepskin Sweatshirt', size: 'XL', color: 'Yellow', qty: 1, price: 45 },
        { name: 'Sheepskin Sweatshirt', size: 'XL', color: 'White', qty: 2, price: 70 }
      ]
    },
    {
      id: 's184989824',
      status: 'pending',
      items: [{ name: 'Sheepskin Sweatshirt', size: 'L', color: 'Pink', qty: 1, price: 69 }]
    }
  ];

  const statusColors = {
    delivery: 'bg-purple-100 text-purple-700',
    pending: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
    canceled: 'bg-red-100 text-red-700'
  };

  return (
    <div className="orders-tab">
      <h2 className="text-2xl font-semibold mb-6">Your Orders</h2>
      
      <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200">
        {orderFilters.map(filter => (
          <button
            key={filter}
            onClick={() => setActiveOrders(filter)}
            className={`px-4 py-2 capitalize relative ${
              activeOrders === filter ? 'text-indigo-600' : 'text-gray-600'
            }`}
          >
            {activeOrders === filter && (
              <motion.span
                layoutId="active-order-pill"
                className="absolute bottom-0 left-0 w-full h-0.5 bg-indigo-600"
              />
            )}
            {filter}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {orders
          .filter(order => activeOrders === 'all' || order.status === activeOrders)
          .map(order => (
            <div key={order.id} className="border rounded-lg p-6 bg-white shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-gray-600">Order Number: </span>
                  <span className="font-semibold">{order.id}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${statusColors[order.status]}`}>
                  {order.status}
                </span>
              </div>

              {order.items.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-4 border-t border-gray-100"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src="/images/product/1000x1000.png"
                      alt={item.name}
                      className="w-16 h-16 rounded object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-sm text-gray-600">
                        {item.size} / {item.color}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium">
                    {item.qty} x ${item.price.toFixed(2)}
                  </p>
                </div>
              ))}

              <div className="flex gap-4 mt-4">
                <button
                  onClick={() => setOpenDetail(true)}
                  className="button-main"
                >
                  Order Details
                </button>
                <button className="px-6 py-3 border rounded-lg hover:bg-gray-100">
                  Cancel Order
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default OrdersTab;