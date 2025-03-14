import React from 'react';
import { ShoppingBag, Package, Heart, MapPin, Clock, TrendingUp } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const DashboardTab = () => {
  const { user } = useAuth();

  const stats = [
    { label: 'Total Orders', value: '12', icon: ShoppingBag },
    { label: 'In Progress', value: '3', icon: Package },
    { label: 'Wishlist', value: '5', icon: Heart },
    { label: 'Saved Address', value: '2', icon: MapPin },
  ];

  const recentActivity = [
    { type: 'order', status: 'delivered', date: '2024-02-20', id: '#ORD-123' },
    { type: 'wishlist', item: 'Organic Tomatoes', date: '2024-02-19' },
    { type: 'order', status: 'processing', date: '2024-02-18', id: '#ORD-122' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-gray-50 rounded-xl p-6 transition-transform hover:scale-105">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <Icon className="h-8 w-8 text-black opacity-80" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Account Overview */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Account Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Personal Information</h3>
            <div className="bg-white rounded-lg p-4">
              <p className="font-medium">{user?.name || 'User Name'}</p>
              <p className="text-gray-600 text-sm mt-1">{user?.email}</p>
              <button className="text-sm text-black hover:text-gray-700 mt-2 font-medium">
                Edit Profile
              </button>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-medium text-gray-600 mb-2">Default Address</h3>
            <div className="bg-white rounded-lg p-4">
              <p className="text-gray-600 text-sm">
                123 Main Street, Apt 4B<br />
                New York, NY 10001
              </p>
              <button className="text-sm text-black hover:text-gray-700 mt-2 font-medium">
                Change Address
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <div key={index} className="bg-white rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {activity.type === 'order' ? (
                  <Package className="h-6 w-6 text-black" />
                ) : (
                  <Heart className="h-6 w-6 text-black" />
                )}
                <div>
                  <p className="font-medium">
                    {activity.type === 'order' ? `Order ${activity.id}` : activity.item}
                  </p>
                  <p className="text-sm text-gray-600">
                    {activity.type === 'order' ? `Status: ${activity.status}` : 'Added to wishlist'}
                  </p>
                </div>
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Clock className="h-4 w-4 mr-1" />
                {activity.date}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DashboardTab; 