const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

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

    // Get total sales
    const orders = await Order.find({
      'items.farmer': req.user.id,
      status: 'completed',
      createdAt: { $gte: lastMonth }
    });

    // Calculate total sales and change percentage
    const totalSales = orders.reduce((acc, order) => {
      const farmerItems = order.items.filter(item => item.farmer.toString() === req.user.id.toString());
      return acc + farmerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, 0);

    // Get previous month's sales for comparison
    const previousMonth = new Date(today.getFullYear(), today.getMonth() - 2, today.getDate());
    const previousMonthOrders = await Order.find({
      'items.farmer': req.user.id,
      status: 'completed',
      createdAt: { 
        $gte: previousMonth,
        $lt: lastMonth
      }
    });

    const previousMonthSales = previousMonthOrders.reduce((acc, order) => {
      const farmerItems = order.items.filter(item => item.farmer.toString() === req.user.id.toString());
      return acc + farmerItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }, 0);

    // Calculate sales change percentage
    const salesChange = previousMonthSales === 0 
      ? 100 
      : ((totalSales - previousMonthSales) / previousMonthSales) * 100;

    // Get active orders count
    const activeOrders = await Order.countDocuments({
      'items.farmer': req.user.id,
      status: { $in: ['pending', 'processing'] }
    });

    // Get total customers (unique users who have ordered)
    const customers = await Order.distinct('user', {
      'items.farmer': req.user.id
    });

    // Get scheduled deliveries
    const scheduledDeliveries = await Order.countDocuments({
      'items.farmer': req.user.id,
      status: 'processing',
      deliveryDate: { $exists: true }
    });

    // Get sales data for chart
    const salesData = await Order.aggregate([
      {
        $match: {
          'items.farmer': req.user.id,
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
      totalSales,
      salesChange: salesChange.toFixed(1),
      activeOrders,
      ordersChange: 0, // Calculate this similarly to salesChange if needed
      totalCustomers: customers.length,
      customersChange: 0, // Calculate this similarly to salesChange if needed
      scheduledDeliveries,
      deliveriesChange: 0, // Calculate this similarly to salesChange if needed
      salesData: salesData.map(item => ({
        date: item._id,
        amount: item.total
      }))
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
    const order = await Order.findOne({
      _id: req.params.id,
      'items.farmer': req.user.id
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update status only for items belonging to this farmer
    order.items.forEach(item => {
      if (item.farmer.toString() === req.user.id.toString()) {
        item.status = status;
      }
    });

    // Update main order status if all items have the same status
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