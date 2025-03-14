const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Admin = require('../models/Admin');
const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

const adminController = {
  // @desc    Login admin
  // @route   POST /api/admin/login
  // @access  Public
  loginAdmin: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Check for admin email
      const admin = await Admin.findOne({ email }).select('+password');
      if (!admin) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Check if password matches
      const isMatch = await admin.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }

      // Create token
      const token = generateToken(admin._id);

      res.json({
        success: true,
        user: {
          _id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role
        },
        token
      });
    } catch (error) {
      console.error('Admin login error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // @desc    Get admin profile
  // @route   GET /api/admin/profile
  // @access  Private
  getAdminProfile: async (req, res) => {
    try {
      const admin = await Admin.findById(req.user.id);
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      res.json({
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      });
    } catch (error) {
      console.error('Get admin profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // @desc    Update admin profile
  // @route   PUT /api/admin/profile
  // @access  Private
  updateAdminProfile: async (req, res) => {
    try {
      const admin = await Admin.findById(req.user.id);
      if (!admin) {
        return res.status(404).json({ message: 'Admin not found' });
      }

      admin.name = req.body.name || admin.name;
      admin.email = req.body.email || admin.email;
      
      if (req.body.password) {
        admin.password = req.body.password;
      }

      const updatedAdmin = await admin.save();
      const token = generateToken(updatedAdmin._id);

      res.json({
        _id: updatedAdmin._id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
        token
      });
    } catch (error) {
      console.error('Update admin profile error:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({ role: 'user' }).select('-password');
      res.json(users);
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get all farmers
  getAllFarmers: async (req, res) => {
    try {
      const farmers = await User.find({ role: 'farmer' })
        .select('-password')
        .sort({ createdAt: -1 });
      res.json(farmers);
    } catch (error) {
      console.error('Error in getAllFarmers:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get all products
  getAllProducts: async (req, res) => {
    try {
      const products = await Product.find()
        .populate('farmer', 'name farmName')
        .sort({ createdAt: -1 });
      res.json(products);
    } catch (error) {
      console.error('Error in getAllProducts:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get all orders
  getAllOrders: async (req, res) => {
    try {
      const orders = await Order.find()
        .populate('user', 'name email')
        .populate('items.farmer', 'name farmName')
        .populate('items.product', 'name price image')
        .sort({ createdAt: -1 });
      res.json(orders);
    } catch (error) {
      console.error('Error in getAllOrders:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get admin analytics
  getAdminAnalytics: async (req, res) => {
    try {
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

      // Get total revenue
      const orders = await Order.find({
        status: 'completed',
        createdAt: { $gte: lastMonth }
      });

      const totalRevenue = orders.reduce((acc, order) => acc + order.total, 0);

      // Get previous month's revenue for comparison
      const previousMonth = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
      const previousMonthOrders = await Order.find({
        status: 'completed',
        createdAt: { 
          $gte: previousMonth,
          $lt: lastMonth
        }
      });

      const previousMonthRevenue = previousMonthOrders.reduce((acc, order) => acc + order.total, 0);

      // Calculate revenue change percentage
      const revenueChange = previousMonthRevenue === 0 
        ? 100 
        : ((totalRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

      // Get total orders count
      const totalOrders = await Order.countDocuments({
        createdAt: { $gte: lastMonth }
      });

      // Get previous month's orders count
      const previousMonthOrdersCount = await Order.countDocuments({
        createdAt: { 
          $gte: previousMonth,
          $lt: lastMonth
        }
      });

      // Calculate orders change percentage
      const ordersChange = previousMonthOrdersCount === 0
        ? 100
        : ((totalOrders - previousMonthOrdersCount) / previousMonthOrdersCount) * 100;

      // Get active farmers count
      const activeFarmers = await User.countDocuments({
        role: 'farmer',
        createdAt: { $gte: lastMonth }
      });

      // Get previous month's active farmers count
      const previousMonthFarmers = await User.countDocuments({
        role: 'farmer',
        createdAt: { 
          $gte: previousMonth,
          $lt: lastMonth
        }
      });

      // Calculate farmers change percentage
      const farmersChange = previousMonthFarmers === 0
        ? 100
        : ((activeFarmers - previousMonthFarmers) / previousMonthFarmers) * 100;

      // Get total users count
      const totalUsers = await User.countDocuments({
        role: 'user',
        createdAt: { $gte: lastMonth }
      });

      // Get previous month's users count
      const previousMonthUsers = await User.countDocuments({
        role: 'user',
        createdAt: { 
          $gte: previousMonth,
          $lt: lastMonth
        }
      });

      // Calculate users change percentage
      const usersChange = previousMonthUsers === 0
        ? 100
        : ((totalUsers - previousMonthUsers) / previousMonthUsers) * 100;

      // Get sales data for chart
      const salesData = await Order.aggregate([
        {
          $match: {
            status: 'completed',
            createdAt: { $gte: lastMonth }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            total: { $sum: "$total" }
          }
        },
        {
          $sort: { _id: 1 }
        }
      ]);

      res.json({
        totalRevenue,
        revenueChange: revenueChange.toFixed(1),
        totalOrders,
        ordersChange: ordersChange.toFixed(1),
        activeFarmers,
        farmersChange: farmersChange.toFixed(1),
        totalUsers,
        usersChange: usersChange.toFixed(1),
        salesData: salesData.map(item => ({
          date: item._id,
          amount: item.total
        }))
      });
    } catch (error) {
      console.error('Error in getAdminAnalytics:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Get admin dashboard stats
  getAdminDashboardStats: async (req, res) => {
    try {
      const today = new Date();
      const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

      // Get total revenue
      const totalRevenue = await Order.aggregate([
        {
          $match: {
            status: 'completed'
          }
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$total" }
          }
        }
      ]);

      // Get total orders
      const totalOrders = await Order.countDocuments();

      // Get active farmers
      const activeFarmers = await User.countDocuments({ role: 'farmer' });

      // Get total users
      const totalUsers = await User.countDocuments({ role: 'user' });

      // Get change percentages
      const previousMonth = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
      
      const [
        previousRevenue,
        previousOrders,
        previousFarmers,
        previousUsers
      ] = await Promise.all([
        Order.aggregate([
          {
            $match: {
              status: 'completed',
              createdAt: { 
                $gte: previousMonth,
                $lt: lastMonth
              }
            }
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$total" }
            }
          }
        ]),
        Order.countDocuments({
          createdAt: { 
            $gte: previousMonth,
            $lt: lastMonth
          }
        }),
        User.countDocuments({
          role: 'farmer',
          createdAt: { 
            $gte: previousMonth,
            $lt: lastMonth
          }
        }),
        User.countDocuments({
          role: 'user',
          createdAt: { 
            $gte: previousMonth,
            $lt: lastMonth
          }
        })
      ]);

      const currentRevenue = totalRevenue[0]?.total || 0;
      const prevRevenue = previousRevenue[0]?.total || 0;

      res.json({
        totalRevenue: currentRevenue,
        revenueChange: prevRevenue === 0 ? 0 : (((currentRevenue - prevRevenue) / prevRevenue) * 100).toFixed(1),
        totalOrders,
        ordersChange: previousOrders === 0 ? 0 : (((totalOrders - previousOrders) / previousOrders) * 100).toFixed(1),
        activeFarmers,
        farmersChange: previousFarmers === 0 ? 0 : (((activeFarmers - previousFarmers) / previousFarmers) * 100).toFixed(1),
        totalUsers,
        usersChange: previousUsers === 0 ? 0 : (((totalUsers - previousUsers) / previousUsers) * 100).toFixed(1)
      });
    } catch (error) {
      console.error('Error in getAdminDashboardStats:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Verify farmer
  verifyFarmer: async (req, res) => {
    try {
      const farmer = await User.findById(req.params.id);

      if (!farmer || farmer.role !== 'farmer') {
        return res.status(404).json({ message: 'Farmer not found' });
      }

      farmer.isVerified = true;
      farmer.verifiedAt = new Date();
      await farmer.save();

      res.json({ message: 'Farmer verified successfully' });
    } catch (error) {
      console.error('Error in verifyFarmer:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      await user.remove();
      res.json({ message: 'User removed successfully' });
    } catch (error) {
      console.error('Error in deleteUser:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update product status
  updateProductStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const product = await Product.findById(req.params.id);

      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
      }

      product.status = status;
      await product.save();

      res.json(product);
    } catch (error) {
      console.error('Error in updateProductStatus:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
};

module.exports = adminController; 