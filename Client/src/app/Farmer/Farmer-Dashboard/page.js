"use client";

import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  ShoppingCart, 
  Calendar
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

// Import components
import DashboardStats from '../../Admin/components/DashboardStats';
import SalesChart from '../../Admin/components/SalesChart';
import RecentOrders from '../../Admin/components/RecentOrders';
import InventoryStatus from '../../Admin/components/InventoryStatus';
import WeatherWidget from '../../Admin/components/WeatherWidget';

// Import API services
import { 
  getFarmerProfile,
  getFarmerProducts,
  getFarmerOrders,
  getFarmerAnalytics
} from '@/app/lib/api/farmer';

const FarmerDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (!token || !user || user.role !== 'farmer') {
        router.push('/Farmer/login');
        return false;
      }
      return true;
    };

    const fetchDashboardData = async () => {
      try {
        if (!checkAuth()) return;

        // Fetch all data in parallel
        const [profileData, productsData, ordersData, analyticsData] = await Promise.all([
          getFarmerProfile(),
          getFarmerProducts(),
          getFarmerOrders(),
          getFarmerAnalytics()
        ]);

        setProfile(profileData);
        setProducts(productsData);
        setOrders(ordersData);
        setAnalytics(analyticsData);

        // Update stats with real data
        setStats([
          { 
            title: 'Total Sales', 
            value: `₹${analyticsData.totalSales || 0}`, 
            change: analyticsData.salesChange || '0%',
            isIncrease: analyticsData.salesChange > 0,
            icon: BarChart3 
          },
          { 
            title: 'Active Orders', 
            value: analyticsData.activeOrders || 0, 
            change: analyticsData.ordersChange || '0%',
            isIncrease: analyticsData.ordersChange > 0,
            icon: ShoppingCart 
          },
          { 
            title: 'Total Customers', 
            value: analyticsData.totalCustomers || 0, 
            change: analyticsData.customersChange || '0%',
            isIncrease: analyticsData.customersChange > 0,
            icon: Users 
          },
          { 
            title: 'Scheduled Deliveries', 
            value: analyticsData.scheduledDeliveries || 0, 
            change: analyticsData.deliveriesChange || '0%',
            isIncrease: analyticsData.deliveriesChange > 0,
            icon: Calendar 
          },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error.response?.status === 401) {
          router.push('/Farmer/login');
        }
      }
    };

    fetchDashboardData();
  }, [router]);

  return (
    <div className="p-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-600 to-green-700 text-white p-8">
        <div className="relative z-10">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome back, {profile?.name || 'Farmer'}! 👋
          </h1>
          <p className="text-green-100">Here&apos;s what&apos;s happening with your farm today.</p>
        </div>
        <div className="absolute right-0 top-0 h-full w-1/3 lg:w-1/2">
          <div className="relative h-full w-full opacity-20">
            <Image
              src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&h=400&ixid=MnwxfDB8MXxyYW5kb218MHx8ZmFybXx8fHx8fDE3MDg1MDI0MDA&ixlib=rb-4.0.3&q=80&w=600"
              alt="Farm Background"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="mt-6">
        <DashboardStats stats={stats} />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        <SalesChart data={analytics?.salesData || []} />
        <InventoryStatus products={products} />
      </div>

      {/* Recent Orders & Weather */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <RecentOrders orders={orders.slice(0, 5)} />
        </div>
        <div>
          <WeatherWidget />
        </div>
      </div>
    </div>
  );
};

export default FarmerDashboard; 