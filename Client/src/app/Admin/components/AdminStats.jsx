import { TrendingUp, TrendingDown } from 'lucide-react';

const AdminStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl shadow-sm p-6 transition-all hover:shadow-md hover:scale-[1.02]"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="bg-gray-900/5 p-3 rounded-lg">
              <stat.icon className="h-6 w-6 text-gray-900" />
            </div>
            <div className={`flex items-center space-x-1 text-sm ${
              stat.isIncrease ? 'text-green-600' : 'text-red-600'
            }`}>
              {stat.isIncrease ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span>{stat.change}</span>
            </div>
          </div>
          <h3 className="text-gray-500 text-sm font-medium">{stat.title}</h3>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
        </div>
      ))}
    </div>
  );
};

export default AdminStats; 