// MyAccountPage.jsx
"use client";
import React, { useState } from "react";
import UserSidebar from "./components/UserSidebar";
import DashboardTab from "./components/DashboardTab";
import OrdersTab from "./components/OrdersTab";
import AddressTab from "./components/AddressTab";
import SettingsTab from "./components/SettingsTab";
import OrderDetailsModal from "./components/OrderDetailsModal";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from '../hooks/useAuth';
import EmailVerification from '../components/EmailVerification';
import { User, Package, MapPin, Settings } from 'lucide-react';
// import './MyAccountPage.css';

const MyAccountPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [openDetail, setOpenDetail] = useState(false);
  const { user } = useAuth();

  const tabContent = {
    dashboard: <DashboardTab />,
    orders: <OrdersTab setOpenDetail={setOpenDetail} />,
    address: <AddressTab />,
    setting: <SettingsTab />,
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: User },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'address', label: 'Address', icon: MapPin },
    { id: 'setting', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mt-12 mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-gray-900 to-black rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">Welcome Back, {user?.name || 'User'}</h1>
            <p className="text-gray-300">Manage your account and track your orders</p>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/2 opacity-10">
            <div className="h-full w-full bg-pattern transform rotate-180"></div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:w-1/4">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <nav className="space-y-1">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center px-6 py-4 text-sm font-medium transition-colors ${
                        activeTab === tab.id
                          ? 'bg-black text-white'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {tab.label}
                    </button>
                  );
                })}
              </nav>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:w-3/4">
            <div className="bg-white rounded-xl shadow-sm p-6">
              {user && !user.isVerified && (
                <div className="mb-6">
                  <EmailVerification 
                    userEmail={user.email}
                    isVerified={user.isVerified}
                    onVerificationComplete={() => window.location.reload()}
                  />
                </div>
              )}
              
              <div className="transition-all duration-300">
                {tabContent[activeTab]}
              </div>
            </div>
          </div>
        </div>
      </div>

      {openDetail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <OrderDetailsModal setOpenDetail={setOpenDetail} />
        </div>
      )}
      
      <Footer />
    </div>
  );
};

export default MyAccountPage;
