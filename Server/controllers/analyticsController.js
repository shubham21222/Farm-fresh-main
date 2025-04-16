const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Preorder = require('../models/Preorder');

// @desc    Get farmer analytics
// @route   GET /api/analytics/farmer
// @access  Private/Farmer
const getFarmerAnalytics = async (req, res) => {
  try {
    const farmerId = req.user._id;

    // Get date range (default to last 30 days)
    const { startDate, endDate } = req.query;
    const dateFilter = {
      createdAt: {
        $gte: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        $lte: endDate ? new Date(endDate) : new Date()
      }
    };

    // Get orders
    const orders = await Order.find({
      'items.product': { $in: await Product.find({ farmer: farmerId }).distinct('_id') },
      ...dateFilter
    });

    // Get products
    const products = await Product.find({ farmer: farmerId });

    // Calculate metrics
    const metrics = {
      sales: {
        total: orders.reduce((sum, order) => sum + order.finalAmount, 0),
        count: orders.length,
        average: orders.length ? orders.reduce((sum, order) => sum + order.finalAmount, 0) / orders.length : 0
      },
      products: {
        total: products.length,
        active: products.filter(p => p.status === 'active').length,
        outOfStock: products.filter(p => p.status === 'out_of_stock').length
      },
      customers: {
        total: new Set(orders.map(o => o.user.toString())).size,
        repeat: orders.filter(o => o.user.toString() === req.user._id.toString()).length
      },
      delivery: {
        total: orders.filter(o => o.deliveryMethod === 'delivery').length,
        pickup: orders.filter(o => o.deliveryMethod === 'pickup').length
      }
    };

    // Get top products
    const productSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        if (products.some(p => p._id.toString() === item.product.toString())) {
          productSales[item.product] = (productSales[item.product] || 0) + item.quantity;
        }
      });
    });

    const topProducts = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([productId, quantity]) => ({
        product: products.find(p => p._id.toString() === productId),
        quantity
      }));

    // Get preorder statistics
    const preorders = await Preorder.find({
      product: { $in: products.map(p => p._id) },
      ...dateFilter
    });

    const preorderStats = {
      total: preorders.length,
      pending: preorders.filter(p => p.status === 'pending').length,
      fulfilled: preorders.filter(p => p.status === 'fulfilled').length,
      cancelled: preorders.filter(p => p.status === 'cancelled').length,
      totalRevenue: preorders.reduce((sum, p) => sum + p.totalAmount, 0)
    };

    res.json({
      success: true,
      data: {
        metrics,
        topProducts,
        preorderStats,
        timeRange: {
          start: dateFilter.createdAt.$gte,
          end: dateFilter.createdAt.$lte
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get admin analytics
// @route   GET /api/analytics/admin
// @access  Private/Admin
const getAdminAnalytics = async (req, res) => {
  try {
    // Get date range (default to last 30 days)
    const { startDate, endDate } = req.query;
    const dateFilter = {
      createdAt: {
        $gte: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        $lte: endDate ? new Date(endDate) : new Date()
      }
    };

    // Get all orders
    const orders = await Order.find(dateFilter);

    // Get all products
    const products = await Product.find();

    // Get all users
    const users = await User.find();

    // Calculate platform metrics
    const metrics = {
      sales: {
        total: orders.reduce((sum, order) => sum + order.finalAmount, 0),
        count: orders.length,
        average: orders.length ? orders.reduce((sum, order) => sum + order.finalAmount, 0) / orders.length : 0
      },
      users: {
        total: users.length,
        farmers: users.filter(u => u.role === 'farmer').length,
        customers: users.filter(u => u.role === 'user').length
      },
      products: {
        total: products.length,
        active: products.filter(p => p.status === 'active').length,
        outOfStock: products.filter(p => p.status === 'out_of_stock').length
      }
    };

    // Get top farmers by sales
    const farmerSales = {};
    orders.forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p._id.toString() === item.product.toString());
        if (product) {
          farmerSales[product.farmer] = (farmerSales[product.farmer] || 0) + item.quantity * item.price;
        }
      });
    });

    const topFarmers = Object.entries(farmerSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([farmerId, sales]) => ({
        farmer: users.find(u => u._id.toString() === farmerId),
        sales
      }));

    // Get platform growth
    const growth = {
      users: users.filter(u => u.createdAt >= dateFilter.createdAt.$gte).length,
      orders: orders.length,
      revenue: orders.reduce((sum, order) => sum + order.finalAmount, 0)
    };

    res.json({
      success: true,
      data: {
        metrics,
        topFarmers,
        growth,
        timeRange: {
          start: dateFilter.createdAt.$gte,
          end: dateFilter.createdAt.$lte
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

module.exports = {
  getFarmerAnalytics,
  getAdminAnalytics
}; 