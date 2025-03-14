// components/UserSidebar.jsx
import React from 'react';
import { Home, Package, Tag, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

const UserSidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();
  const router = useRouter();
  
  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'orders', icon: Package, label: 'History Orders' },
    { id: 'address', icon: Tag, label: 'My Address' },
    { id: 'setting', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = async () => {
    try {
      logout();
      toast.success('Logged out successfully');
      // Force a page refresh and redirect to home
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="sidebar bg-gradient-to-b from-white to-gray-50 rounded-xl shadow-lg p-6 sticky top-4 ">
      <div className="user-info text-center">
        <div className="relative group">
          <img
            src="/images/avatar/1.png"
            alt="User Avatar"
            className="w-32 h-32 rounded-full mx-auto border-4 border-indigo-500 transition-all group-hover:border-indigo-600"
          />
          <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
            <span className="text-white text-sm font-medium">Edit</span>
          </div>
        </div>
        <h3 className="mt-4 text-2xl font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
          Tony Nguyen
        </h3>
        <p className="text-gray-600 text-sm">hi.avitex@gmail.com</p>
      </div>

      <div className="menu mt-8">
        {menuItems.map(item => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 p-4 rounded-lg mb-2 transition-all duration-300 transform hover:scale-102 ${
              activeTab === item.id 
                ? 'bg-indigo-500 text-white shadow-md' 
                : 'text-gray-700 hover:bg-gray-100'
            }`}
          >
            <item.icon 
              size={24} 
              className={`${
                activeTab === item.id ? 'text-white' : 'text-gray-600'
              } transition-colors`}
            />
            <span className="font-medium">{item.label}</span>
          </button>
        ))}
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 p-4 rounded-lg text-red-500 hover:bg-red-50 transition-all duration-300 transform hover:scale-102"
        >
          <LogOut size={24} className="text-red-500" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default UserSidebar;