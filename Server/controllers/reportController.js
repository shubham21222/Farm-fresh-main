const Order = require('../models/Order');
const Product = require('../models/Product');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Generate sales report
// @route   GET /api/reports/sales
// @access  Private (Admin/Farmer)
exports.generateSalesReport = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const query = {};

  // Add date range filter if provided
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  // If user is a farmer, only show their products' sales
  if (req.user.role === 'farmer') {
    query['items.product.farmer'] = req.user.id;
  }

  const orders = await Order.find(query)
    .populate('items.product', 'name price')
    .sort('-createdAt');

  // Calculate sales metrics
  const totalSales = orders.reduce((total, order) => total + order.totalAmount, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  res.status(200).json({
    success: true,
    data: {
      totalSales,
      totalOrders,
      averageOrderValue,
      orders
    }
  });
});

// @desc    Generate inventory report
// @route   GET /api/reports/inventory
// @access  Private (Admin/Farmer)
exports.generateInventoryReport = asyncHandler(async (req, res, next) => {
  const query = {};

  // If user is a farmer, only show their products
  if (req.user.role === 'farmer') {
    query.farmer = req.user.id;
  }

  const products = await Product.find(query)
    .populate('farmer', 'name')
    .sort('name');

  // Calculate inventory metrics
  const totalProducts = products.length;
  const totalStock = products.reduce((total, product) => total + product.stock, 0);
  const lowStockProducts = products.filter(product => product.stock < 10);

  res.status(200).json({
    success: true,
    data: {
      totalProducts,
      totalStock,
      lowStockProducts,
      products
    }
  });
});

// @desc    Get farmer reports
// @route   GET /api/reports/farmer
// @access  Private (Farmer)
exports.getFarmerReports = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const query = {};

  // Add date range filter if provided
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  // Get farmer's products
  const products = await Product.find({ farmer: req.user.id });
  const productIds = products.map(product => product._id);

  // Get orders containing farmer's products
  const orders = await Order.find({
    ...query,
    'items.product': { $in: productIds }
  })
    .populate('items.product', 'name price')
    .sort('-createdAt');

  // Calculate farmer-specific metrics
  const totalSales = orders.reduce((total, order) => {
    const farmerItems = order.items.filter(item => 
      productIds.includes(item.product._id.toString())
    );
    return total + farmerItems.reduce((sum, item) => 
      sum + (item.product.price * item.quantity), 0
    );
  }, 0);

  const totalOrders = orders.length;
  const averageOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

  res.status(200).json({
    success: true,
    data: {
      totalSales,
      totalOrders,
      averageOrderValue,
      orders,
      products
    }
  });
});

// @desc    Get admin reports
// @route   GET /api/reports/admin
// @access  Private (Admin)
exports.getAdminReports = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  const query = {};

  // Add date range filter if provided
  if (startDate && endDate) {
    query.createdAt = {
      $gte: new Date(startDate),
      $lte: new Date(endDate)
    };
  }

  // Get all orders
  const orders = await Order.find(query)
    .populate('user', 'name email')
    .populate('items.product', 'name price')
    .sort('-createdAt');

  // Get all products
  const products = await Product.find()
    .populate('farmer', 'name')
    .sort('name');

  // Calculate admin metrics
  const totalSales = orders.reduce((total, order) => total + order.totalAmount, 0);
  const totalOrders = orders.length;
  const totalProducts = products.length;
  const totalFarmers = new Set(products.map(product => product.farmer._id.toString())).size;
  const totalCustomers = new Set(orders.map(order => order.user._id.toString())).size;

  res.status(200).json({
    success: true,
    data: {
      totalSales,
      totalOrders,
      totalProducts,
      totalFarmers,
      totalCustomers,
      orders,
      products
    }
  });
}); 