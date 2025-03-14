"use client";

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Calendar, 
  Settings, 
  Menu,
  X,
  ChevronRight,
  Home,
  TrendingUp,
  Package,
  MessageSquare,
  UserCheck,
  Store,
  Leaf
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import DashboardStats from '../components/DashboardStats';
import SalesChart from '../components/SalesChart';
import RecentOrders from '../components/RecentOrders';
import FarmersList from '../components/FarmersList';
import ProductsGrid from '../components/ProductsGrid';

// Import API services
import { adminApi } from '@/app/lib/adminApi';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState([]);
  const [farmers, setFarmers] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !user || user.role !== 'admin') {
        router.push('/Admin/login');
        return false;
      }
      return true;
    };

    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        if (!checkAuth()) return;

        // Fetch all data in parallel
        const [
          usersData, 
          farmersData, 
          productsData, 
          ordersData, 
          analyticsData,
          dashboardStats
        ] = await Promise.all([
          adminApi.getAllUsers(),
          adminApi.getAllFarmers(),
          adminApi.getAllProducts(),
          adminApi.getAllOrders(),
          adminApi.getAnalytics(),
          adminApi.getDashboardStats()
        ]);

        setUsers(usersData);
        setFarmers(farmersData);
        setProducts(productsData);
        setOrders(ordersData);
        setAnalytics(analyticsData);

        // Update stats with real data
        setStats([
          { 
            title: 'Total Revenue', 
            value: `₹${dashboardStats.totalRevenue || 0}`, 
            change: dashboardStats.revenueChange || '0%',
            isIncrease: dashboardStats.revenueChange > 0,
            icon: BarChart3 
          },
          { 
            title: 'Total Orders', 
            value: dashboardStats.totalOrders || 0, 
            change: dashboardStats.ordersChange || '0%',
            isIncrease: dashboardStats.ordersChange > 0,
            icon: ShoppingCart 
          },
          { 
            title: 'Active Farmers', 
            value: dashboardStats.activeFarmers || 0, 
            change: dashboardStats.farmersChange || '0%',
            isIncrease: dashboardStats.farmersChange > 0,
            icon: Store 
          },
          { 
            title: 'Total Users', 
            value: dashboardStats.totalUsers || 0, 
            change: dashboardStats.usersChange || '0%',
            isIncrease: dashboardStats.usersChange > 0,
            icon: Users 
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          router.push('/Admin/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const menuItems = [
    { icon: Home, label: 'Dashboard', href: '/Admin/Admin-Dashboard' },
    { icon: Store, label: 'Farmers', href: '/Admin/Admin-Dashboard/farmers' },
    { icon: Package, label: 'Products', href: '/Admin/Admin-Dashboard/products' },
    { icon: ShoppingCart, label: 'Orders', href: '/Admin/Admin-Dashboard/orders' },
    { icon: Users, label: 'Users', href: '/Admin/Admin-Dashboard/users' },
    { icon: TrendingUp, label: 'Analytics', href: '/Admin/Admin-Dashboard/analytics' },
    { icon: Settings, label: 'Settings', href: '/Admin/Admin-Dashboard/settings' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside 
        className={`fixed top-0 left-0 z-40 h-screen transition-transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 bg-black border-r w-64 lg:w-72`}
      >
        <div className="h-full px-3 py-4 flex flex-col">
          <div className="flex items-center justify-between mb-6 px-2">
            <Link href="/Admin/Admin-Dashboard" className="flex items-center space-x-3">
              <div className="bg-white/10 p-2 rounded-xl">
                <Leaf className="h-8 w-8 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Admin Panel</span>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden text-gray-400 hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center px-4 py-3 text-gray-300 rounded-lg hover:bg-gray-800 group transition-colors ${
                  item.href === '/Admin/Admin-Dashboard' ? 'bg-gray-800 text-white' : ''
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="text-sm font-medium">{item.label}</span>
                <ChevronRight className="h-4 w-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </nav>

          <div className="mt-auto">
            <div className="bg-gray-800 rounded-lg p-4">
              <h3 className="text-sm font-medium text-white mb-2">Need Assistance?</h3>
              <p className="text-xs text-gray-400 mb-3">Contact our support team</p>
              <button className="w-full bg-white text-black text-sm font-medium py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors">
                Get Help
              </button>
            </div>
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
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {orders.filter(order => order.status === 'new').length || 0}
                </span>
              </button>
              <div className="flex items-center space-x-3">
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-gray-100">
                  <Image
                    src="/admin-avatar.png"
                    alt="Admin Avatar"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-gray-700">Admin</p>
                  <p className="text-xs text-gray-500">System Administrator</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="p-4 lg:p-6 space-y-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-gray-900 to-black text-white p-8">
            <div className="relative z-10">
              <h1 className="text-2xl md:text-3xl font-bold mb-2">
                Welcome to Admin Dashboard 👋
              </h1>
              <p className="text-gray-300">Here&apos;s an overview of your marketplace.</p>
            </div>
            <div className="absolute right-0 top-0 h-full w-1/3 lg:w-1/2">
              <div className="relative h-full w-full opacity-10">
                <Image
                  src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8b2ZmaWNlLGRhc2hib2FyZHx8fHx8fDE3MDg1MDI0MDA&ixlib=rb-4.0.3&q=80&w=600"
                  alt="Dashboard Background"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <DashboardStats stats={stats} />

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <SalesChart data={analytics?.salesData || []} />
            <ProductsGrid products={products.slice(0, 6)} />
          </div>

          {/* Recent Orders & Farmers */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <RecentOrders orders={orders.slice(0, 5)} />
            </div>
            <div>
              <FarmersList farmers={farmers.slice(0, 5)} />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
