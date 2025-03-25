const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const jwt = require('jsonwebtoken'); // Add this if not already imported elsewhere
const { default: mongoose } = require('mongoose');

// Get farmer's profile
exports.getFarmerProfile = async (req, res) => {
  try {
    const farmer = await User.findById(req.user.id).select('-password');
    if (!farmer || farmer.role !== 'farmer') {
      return res.status(404).json({ message: 'Farmer not found' });
    }
    res.json(farmer);
  } catch (error) {
    console.error('Error in getFarmerProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get farmer's products
exports.getFarmerProducts = async (req, res) => {
  try {
    const products = await Product.find({ farmer: req.user.id });
    res.json(products);
  } catch (error) {
    console.error('Error in getFarmerProducts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get farmer's orders
exports.getFarmerOrders = async (req, res) => {
  try {
    const orders = await Order.find({ 'items.farmer': req.user.id })
      .populate('user', 'name email')
      .populate('items.product', 'name price image')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error('Error in getFarmerOrders:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get farmer's analytics
exports.getFarmerAnalytics = async (req, res) => {
  try {
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());

    const orders = await Order.find({
      'items.farmer': req.user.id,
      status: 'completed',
      createdAt: { $gte: lastMonth }
    });

    const totalSales = orders.reduce((acc, order) => {
      const farmerItems = order.items.filter(item => item.farmer.toString() === req.user.id.toString());
      return acc + farmerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, 0);

    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
    const previousMonthOrders = await Order.find({
      'items.farmer': req.user.id,
      status: 'completed',
      createdAt: { $gte: previousMonth, $lt: lastMonth }
    });

    const previousMonthSales = previousMonthOrders.reduce((acc, order) => {
      const farmerItems = order.items.filter(item => item.farmer.toString() === req.user.id.toString());
      return acc + farmerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, 0);

    const salesChange = previousMonthSales === 0 
      ? 100 
      : ((totalSales - previousMonthSales) / previousMonthSales) * 100;

    const activeOrders = await Order.countDocuments({
      'items.farmer': req.user.id,
      status: { $in: ['pending', 'processing'] }
    });

    const customers = await Order.distinct('user', { 'items.farmer': req.user.id });

    const scheduledDeliveries = await Order.countDocuments({
      'items.farmer': req.user.id,
      status: 'processing',
      deliveryDate: { $exists: true }
    });

    const salesData = await Order.aggregate([
      { $match: { 'items.farmer': req.user.id, status: 'completed', createdAt: { $gte: lastMonth } } },
      { $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }, total: { $sum: "$total" } } },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      totalSales,
      salesChange: salesChange.toFixed(1),
      activeOrders,
      ordersChange: 0,
      totalCustomers: customers.length,
      customersChange: 0,
      scheduledDeliveries,
      deliveriesChange: 0,
      salesData: salesData.map(item => ({ date: item._id, amount: item.total }))
    });
  } catch (error) {
    console.error('Error in getFarmerAnalytics:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update farmer's profile
exports.updateFarmerProfile = async (req, res) => {
  try {
    const { name, farmName, address, phone } = req.body;
    const farmer = await User.findById(req.user.id);

    if (!farmer || farmer.role !== 'farmer') {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    farmer.name = name || farmer.name;
    farmer.farmName = farmName || farmer.farmName;
    farmer.address = address || farmer.address;
    farmer.phone = phone || farmer.phone;

    await farmer.save();
    res.json(farmer);
  } catch (error) {
    console.error('Error in updateFarmerProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a new product
exports.addProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;
    const product = new Product({
      name,
      description,
      price,
      category,
      stock,
      image,
      farmer: req.user.id
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error in addProduct:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a product
exports.updateProduct = async (req, res) => {
  try {
    const { name, description, price, category, stock, image } = req.body;
    const product = await Product.findOne({ _id: req.params.id, farmer: req.user.id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    product.image = image || product.image;

    await product.save();
    res.json(product);
  } catch (error) {
    console.error('Error in updateProduct:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ _id: req.params.id, farmer: req.user.id });

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update order status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOne({ _id: req.params.id, 'items.farmer': req.user.id });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.items.forEach(item => {
      if (item.farmer.toString() === req.user.id.toString()) {
        item.status = status;
      }
    });

    const allItemsSameStatus = order.items.every(item => item.status === status);
    if (allItemsSameStatus) {
      order.status = status;
    }

    await order.save();
    res.json(order);
  } catch (error) {
    console.error('Error in updateOrderStatus:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get public farmer profile by ID
exports.getPublicFarmerProfile = async (req, res) => {
  try {
    const farmer = await User.findById(req.params.id)
      .select('name farmName address description categories rating totalReviews avatar banner')
      .populate({ path: 'products', select: 'name price image description category', limit: 6 })
      .populate({
        path: 'reviews',
        select: 'rating comment user createdAt',
        populate: { path: 'user', select: 'name' },
        limit: 10,
        sort: { createdAt: -1 }
      });

    if (!farmer || farmer.role !== 'farmer') {
      return res.status(404).json({ message: 'Farmer not found' });
    }

    const response = {
      id: farmer._id,
      name: farmer.name,
      farmName: farmer.farmName,
      banner: farmer.banner || "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg",
      avatar: farmer.avatar || "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg",
      description: farmer.description,
      categories: farmer.categories || [],
      rating: farmer.rating || 0,
      totalReviews: farmer.totalReviews || 0,
      products: farmer.products.map(product => ({
        id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        category: product.category
      })),
      reviews: farmer.reviews.map(review => ({
        id: review._id,
        user: review.user.name,
        rating: review.rating,
        comment: review.comment,
        date: formatDate(review.createdAt)
      }))
    };

    res.json(response);
  } catch (error) {
    console.error('Error in getPublicFarmerProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all public farmers list
exports.getAllPublicFarmers = async (req, res) => {
  try {
    const farmers = await User.find({ role: 'farmer', isVerified: true })
      .select('name farmName address description categories rating totalReviews avatar')
      .limit(20);

    const response = farmers.map(farmer => ({
      id: farmer._id,
      name: farmer.name,
      location: farmer.address,
      image: farmer.avatar || "https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg",
      specialty: farmer.categories?.[0] || "Organic Farming",
      experience: "5+ years",
      description: farmer.description || "Passionate about sustainable farming"
    }));

    res.json(response);
  } catch (error) {
    console.error('Error in getAllPublicFarmers:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Login farmer
exports.loginFarmer = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Find farmer by email and role
    const farmer = await User.findOne({ email, role: 'farmer' }).select('+password');
    if (!farmer) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials or not a farmer'
      });
    }

    // Check password match
    const isMatch = await farmer.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Generate JWT token 
    const token = jwt.sign({ id: farmer._id }, process.env.JWT_SECRET, { expiresIn: '30d' });

    // Send response
    res.json({
      success: true,
      data: {
        user: {
          _id: farmer._id,
          name: farmer.name,
          email: farmer.email,
          role: farmer.role,
          phone: farmer.phone,
          billingAddress: farmer.billingAddress,
          isVerified: farmer.isVerified,
          farmName: farmer.farmName // Include farmer-specific fields if available
        },
        token
      }
    });
  } catch (error) {
    console.error('Farmer login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
};

// Helper function to format date
const formatDate = (date) => {
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
};


exports.getPublicFarmerProfile = async (req, res) => {
  try {
    const farmerId = req.params.id;
    console.log('Requested farmer ID:', farmerId);

    if (!mongoose.Types.ObjectId.isValid(farmerId)) {
      console.log('Invalid ObjectId:', farmerId);
      return res.status(400).json({ message: 'Invalid farmer ID' });
    }

    const farmer = await User.findById(farmerId)
      .select('name farmName farmAddress farmDescription categories rating totalReviews avatar banner products role isVerified') // Add role and isVerified
      .populate({
        path: 'products',
        select: 'name price image description category',
        limit: 6
      });

    console.log('Fetched farmer:', farmer);

    if (!farmer) {
      console.log('Farmer not found in DB');
      return res.status(404).json({ message: 'Farmer not found or not verified' });
    }
    if (farmer.role !== 'farmer') {
      console.log('Role mismatch:', farmer.role);
      return res.status(404).json({ message: 'Farmer not found or not verified' });
    }
    if (!farmer.isVerified) {
      console.log('Farmer not verified:', farmer.isVerified);
      return res.status(404).json({ message: 'Farmer not found or not verified' });
    }

    const products = await Product.find({ farmer: farmerId })
      .populate({
        path: 'reviews.user',
        select: 'name'
      })
      .limit(10)
      .sort({ createdAt: -1 });

    const reviews = products.flatMap(product => 
      product.reviews.map(review => ({
        id: review._id,
        user: review.user.name,
        rating: review.rating,
        comment: review.comment,
        date: formatDate(review.createdAt)
      }))
    ).slice(0, 10);

    const response = {
      id: farmer._id,
      name: farmer.name,
      farmName: farmer.farmName,
      banner: farmer.banner || 'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg',
      avatar: farmer.avatar || 'https://images.pexels.com/photos/2886937/pexels-photo-2886937.jpeg',
      description: farmer.farmDescription,
      address: farmer.farmAddress,
      categories: farmer.categories || [],
      rating: farmer.rating || 0,
      totalReviews: farmer.totalReviews || 0,
      products: farmer.products.map(product => ({
        id: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        category: product.category
      })),
      reviews
    };

    res.json(response);
  } catch (error) {
    console.error('Error in getPublicFarmerProfile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};