const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = asyncHandler(async (req, res, next) => {
  // Get user's cart
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
  
  if (!cart || cart.items.length === 0) {
    return next(new ErrorResponse('Cart is empty', 400));
  }

  // Calculate total amount
  const totalAmount = cart.items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  // Create order
  const order = await Order.create({
    user: req.user.id,
    items: cart.items,
    totalAmount,
    shippingAddress: req.body.shippingAddress,
    paymentMethod: req.body.paymentMethod,
    status: 'pending'
  });

  // Clear cart
  cart.items = [];
  await cart.save();

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Get order details
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderDetails = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate('user', 'name email')
    .populate('items.product', 'name price');

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  // Check if user is authorized to view this order
  if (order.user._id.toString() !== req.user.id && 
      req.user.role !== 'admin' && 
      req.user.role !== 'farmer') {
    return next(new ErrorResponse('Not authorized to view this order', 403));
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Update order status
// @route   PATCH /api/orders/:id/status
// @access  Private (Farmer/Admin)
exports.updateOrderStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  order.status = req.body.status;
  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get user orders
// @route   GET /api/orders/user
// @access  Private
exports.getUserOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id })
    .populate('items.product', 'name price')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get farmer orders
// @route   GET /api/orders/farmer
// @access  Private (Farmer)
exports.getFarmerOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({
    'items.product.farmer': req.user.id
  })
    .populate('user', 'name email')
    .populate('items.product', 'name price')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Get all orders (Admin only)
// @route   GET /api/orders/admin
// @access  Private (Admin)
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find()
    .populate('user', 'name email')
    .populate('items.product', 'name price')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
}); 