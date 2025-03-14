"use client";

import { 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  UserPlus, 
  Package, 
  RefreshCw 
} from 'lucide-react';

const activities = [
  {
    id: 1,
    type: 'approval',
    action: 'Approved farmer registration',
    user: 'Rajesh Kumar',
    timestamp: '2 minutes ago',
    status: 'success',
    icon: CheckCircle2
  },
  {
    id: 2,
    type: 'rejection',
    action: 'Rejected product listing',
    user: 'Priya Patel',
    timestamp: '15 minutes ago',
    status: 'error',
    icon: XCircle
  },
  {
    id: 3,
    type: 'warning',
    action: 'Flagged suspicious activity',
    user: 'Amit Singh',
    timestamp: '1 hour ago',
    status: 'warning',
    icon: AlertCircle
  },
  {
    id: 4,
    type: 'registration',
    action: 'New farmer registration',
    user: 'Meera Reddy',
    timestamp: '2 hours ago',
    status: 'info',
    icon: UserPlus
  },
  {
    id: 5,
    type: 'product',
    action: 'Updated product prices',
    user: 'System',
    timestamp: '3 hours ago',
    status: 'info',
    icon: Package
  },
  {
    id: 6,
    type: 'system',
    action: 'System maintenance',
    user: 'System',
    timestamp: '5 hours ago',
    status: 'info',
    icon: RefreshCw
  }
];

const getStatusStyles = (status) => {
  const styles = {
    success: 'text-green-600 bg-green-100',
    error: 'text-red-600 bg-red-100',
    warning: 'text-yellow-600 bg-yellow-100',
    info: 'text-blue-600 bg-blue-100'
  };
  return styles[status] || styles.info;
};

const ActivityLog = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
          <button className="text-sm text-gray-600 hover:text-gray-900">
            View all
          </button>
        </div>

        <div className="space-y-6">
          {activities.map((activity) => {
            const Icon = activity.icon;
            const statusStyle = getStatusStyles(activity.status);

            return (
              <div key={activity.id} className="flex items-start space-x-4">
                <div className={`p-2 rounded-full ${statusStyle}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-gray-900">
                      {activity.action}
                    </p>
                    <span className="text-xs text-gray-500">
                      {activity.timestamp}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    by {activity.user}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <button className="w-full px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
            Load More Activities
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityLog; 