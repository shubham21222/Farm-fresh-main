"use client";

import { useState, useEffect } from 'react';
import { 
  Home,
  Package,
  ShoppingCart,
  TrendingUp,
  MessageSquare,
  Settings,
  Menu,
  X,
  ChevronRight,
  Leaf
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

const DashboardLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [profile, setProfile] = useState(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    setProfile(user);
  }, []);

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/Farmer/Farmer-Dashboard' },
    { icon: Package, label: 'Products', href: '/Farmer/Farmer-Dashboard/products' },
    { icon: ShoppingCart, label: 'Orders', href: '/Farmer/Farmer-Dashboard/orders' },
    { icon: TrendingUp, label: 'Analytics', href: '/Farmer/Farmer-Dashboard/analytics' },
    { icon: MessageSquare, label: 'Messages', href: '/Farmer/Farmer-Dashboard/messages' },
    { icon: Settings, label: 'Settings', href: '/Farmer/Farmer-Dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 bg-white border-r w-64 lg:w-72`}
      >
        <div className="h-full px-3 py-4 flex flex-col">
          <div className="flex items-center justify-between mb-6 px-2">
            <Link href="/Farmer/Farmer-Dashboard" className="flex items-center space-x-3">
              <div className="bg-green-100 p-2 rounded-xl">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <span className="text-xl font-bold text-gray-800">Farm Fresh</span>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center px-4 py-3 text-gray-700 rounded-lg hover:bg-green-50 hover:text-green-600 group transition-colors ${
                  pathname === item.href ? 'bg-green-50 text-green-600' : ''
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">{item.label}</span>
                <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </nav>

          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="text-sm font-medium text-green-800 mb-2">Need Help?</h3>
            <p className="text-xs text-green-600 mb-3">Contact our support team</p>
            <button className="w-full bg-green-600 text-white text-sm font-medium py-2 px-4 rounded-lg hover:bg-green-700 transition-colors">
              Get Support
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className={`lg:ml-72 min-h-screen`}>
        {/* Top Bar */}
        <header className="bg-white border-b sticky top-0 z-30">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <Menu className="h-6 w-6" />
            </button>
            
            <div className="flex items-center space-x-4">
              <button className="relative text-gray-500 hover:text-gray-700">
                <MessageSquare className="h-6 w-6" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  0
                </span>
              </button>
              {profile && (
                <div className="flex items-center space-x-3">
                  <div className="relative w-9 h-9 rounded-full overflow-hidden bg-green-100">
                    <Image
                      src={profile.avatar || "https://via.placeholder.com/100"}
                      alt="Farmer Avatar"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="hidden md:block">
                    <p className="text-sm font-medium text-gray-700">{profile.name}</p>
                    <p className="text-xs text-gray-500">{profile.farmName || 'Farmer'}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 