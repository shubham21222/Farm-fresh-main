// components/SettingsTab.jsx
import React, { useState } from 'react';
import { ChevronDown, Eye, EyeOff } from 'lucide-react';

const SettingsTab = () => {
  // State for password visibility
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  return (
    <div className="settings-tab">
      <h2 className="text-2xl font-semibold mb-6">Account Settings</h2>
      
      <form className="space-y-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Personal Information</h3>
          <div className="flex items-center gap-6 mb-6">
            <div className="relative group">
              <img
                src="/images/avatar/1.png"
                alt="Avatar"
                className="w-24 h-24 rounded-full border-2 border-gray-200 transition-all group-hover:border-indigo-500"
              />
              <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="text-white text-sm">Change</span>
              </div>
            </div>
            <div>
              <label className="block text-sm mb-2 font-medium text-gray-700">Upload Avatar</label>
              <input 
                type="file" 
                accept="image/*" 
                className="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm mb-1 font-medium text-gray-700">First Name *</label>
              <input 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                defaultValue="Tony" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium text-gray-700">Last Name *</label>
              <input 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                defaultValue="Nguyen" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium text-gray-700">Phone Number *</label>
              <input 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                defaultValue="(+12) 345-678-910" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium text-gray-700">Email *</label>
              <input 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                defaultValue="hi.avitex@gmail.com" 
                type="email" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium text-gray-700">Gender *</label>
              <div className="relative">
                <select 
                  className="w-full p-3 border rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <ChevronDown 
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" 
                  size={20}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm mb-1 font-medium text-gray-700">Date of Birth *</label>
              <input 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                type="date" 
                required 
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-xl font-semibold mb-4">Change Password</h3>
          <div className="grid gap-6">
            <div className="relative">
              <label className="block text-sm mb-1 font-medium text-gray-700">Current Password *</label>
              <input 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                type={showCurrentPass ? "text" : "password"}
                required 
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-3 top-1/2 translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showCurrentPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative">
              <label className="block text-sm mb-1 font-medium text-gray-700">New Password *</label>
              <input 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                type={showNewPass ? "text" : "password"}
                required 
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-3 top-1/2 translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <div className="relative">
              <label className="block text-sm mb-1 font-medium text-gray-700">Confirm New Password *</label>
              <input 
                className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all" 
                type={showConfirmPass ? "text" : "password"}
                required 
              />
              <button
                type="button"
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-1/2 translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPass ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
        </div>

        <button 
          type="submit"
          className="button-main w-full sm:w-auto px-8 transform transition-all hover:scale-105"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default SettingsTab;