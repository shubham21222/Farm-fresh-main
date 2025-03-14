import { MoreVertical, ArrowUpRight } from 'lucide-react';

const RecentOrders = () => {
  const orders = [
    {
      id: 'ORD001',
      customer: 'Rahul Sharma',
      items: ['Organic Tomatoes', 'Fresh Carrots'],
      total: '₹1,250',
      status: 'processing',
      date: '2024-03-20',
    },
    {
      id: 'ORD002',
      customer: 'Priya Patel',
      items: ['Green Spinach', 'Red Potatoes'],
      total: '₹850',
      status: 'delivered',
      date: '2024-03-19',
    },
    {
      id: 'ORD003',
      customer: 'Amit Kumar',
      items: ['Organic Onions', 'Bell Peppers'],
      total: '₹950',
      status: 'pending',
      date: '2024-03-19',
    },
    {
      id: 'ORD004',
      customer: 'Sneha Reddy',
      items: ['Fresh Cauliflower', 'Green Peas'],
      total: '₹1,100',
      status: 'delivered',
      date: '2024-03-18',
    },
    {
      id: 'ORD005',
      customer: 'Vikram Singh',
      items: ['Organic Tomatoes', 'Fresh Beans'],
      total: '₹750',
      status: 'processing',
      date: '2024-03-18',
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-700';
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="flex items-center justify-between p-6 border-b">
        <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
        <button className="text-green-600 hover:text-green-700 text-sm font-medium inline-flex items-center">
          View All Orders
          <ArrowUpRight className="h-4 w-4 ml-1" />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-left bg-gray-50">
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Customer
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Items
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Total
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {order.customer}
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">
                  <div className="flex flex-col">
                    {order.items.map((item, index) => (
                      <span key={index}>{item}</span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {order.total}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {formatDate(order.date)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders; 