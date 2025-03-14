"use client";

import { useState } from 'react';
import { Clock, Check, X, ChevronRight } from 'lucide-react';

const initialApprovals = [
  {
    id: 1,
    type: 'farmer_registration',
    title: 'New Farmer Registration',
    name: 'Anita Sharma',
    location: 'Madhya Pradesh',
    products: ['Organic Vegetables', 'Fruits'],
    submitted: '2 hours ago',
    documents: ['ID Proof', 'Land Documents']
  },
  {
    id: 2,
    type: 'product_listing',
    title: 'New Product Listing',
    name: 'Rajesh Kumar',
    product: 'Organic Rice',
    price: '₹75/kg',
    submitted: '3 hours ago',
    details: ['Certification attached', 'Sample images']
  },
  {
    id: 3,
    type: 'price_update',
    title: 'Price Update Request',
    name: 'Priya Patel',
    product: 'Cotton',
    oldPrice: '₹120/kg',
    newPrice: '₹135/kg',
    submitted: '5 hours ago',
    reason: 'Market price increase'
  }
];

const PendingApprovals = () => {
  const [approvals, setApprovals] = useState(initialApprovals);
  const [selectedItem, setSelectedItem] = useState(null);

  const handleApprove = (id) => {
    setApprovals(approvals.filter(item => item.id !== id));
  };

  const handleReject = (id) => {
    setApprovals(approvals.filter(item => item.id !== id));
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
            <span className="px-2.5 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
              {approvals.length} pending
            </span>
          </div>
          <button className="text-sm text-gray-600 hover:text-gray-900">
            View all
          </button>
        </div>

        <div className="space-y-4">
          {approvals.map((item) => (
            <div
              key={item.id}
              className="group relative bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
              onClick={() => setSelectedItem(selectedItem === item.id ? null : item.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-white rounded-full">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600">
                      by {item.name}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Submitted {item.submitted}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleApprove(item.id);
                    }}
                    className="p-1 hover:bg-green-100 rounded-full transition-colors"
                  >
                    <Check className="h-5 w-5 text-green-600" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleReject(item.id);
                    }}
                    className="p-1 hover:bg-red-100 rounded-full transition-colors"
                  >
                    <X className="h-5 w-5 text-red-600" />
                  </button>
                  <ChevronRight
                    className={`h-5 w-5 text-gray-400 transition-transform ${
                      selectedItem === item.id ? 'rotate-90' : ''
                    }`}
                  />
                </div>
              </div>

              {selectedItem === item.id && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  {item.type === 'farmer_registration' && (
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-medium text-gray-500">Location</span>
                        <p className="text-sm text-gray-900">{item.location}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Products</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.products.map((product, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800"
                            >
                              {product}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Documents</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.documents.map((doc, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              {doc}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {item.type === 'product_listing' && (
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-medium text-gray-500">Product</span>
                        <p className="text-sm text-gray-900">{item.product}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Price</span>
                        <p className="text-sm text-gray-900">{item.price}</p>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Details</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.details.map((detail, index) => (
                            <span
                              key={index}
                              className="px-2 py-0.5 rounded text-xs font-medium bg-gray-200 text-gray-800"
                            >
                              {detail}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {item.type === 'price_update' && (
                    <div className="space-y-3">
                      <div>
                        <span className="text-xs font-medium text-gray-500">Product</span>
                        <p className="text-sm text-gray-900">{item.product}</p>
                      </div>
                      <div className="flex space-x-4">
                        <div>
                          <span className="text-xs font-medium text-gray-500">Old Price</span>
                          <p className="text-sm text-gray-900">{item.oldPrice}</p>
                        </div>
                        <div>
                          <span className="text-xs font-medium text-gray-500">New Price</span>
                          <p className="text-sm text-gray-900">{item.newPrice}</p>
                        </div>
                      </div>
                      <div>
                        <span className="text-xs font-medium text-gray-500">Reason</span>
                        <p className="text-sm text-gray-900">{item.reason}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {approvals.length === 0 && (
          <div className="text-center py-6">
            <p className="text-sm text-gray-600">No pending approvals</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PendingApprovals; 