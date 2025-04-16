const Order = require('../models/Order');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');
const User = require('../models/User');

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

// @desc    Create subscription order
// @route   POST /api/orders/subscriptions
// @access  Private
exports.createSubscriptionOrder = asyncHandler(async (req, res, next) => {
  const { items, subscriptionDetails, shippingAddress, paymentMethod } = req.body;

  // Calculate total amount
  const totalAmount = items.reduce((total, item) => {
    return total + (item.product.price * item.quantity);
  }, 0);

  // Create subscription order
  const order = await Order.create({
    user: req.user.id,
    items,
    totalAmount,
    shippingAddress,
    paymentMethod,
    status: 'pending',
    isSubscription: true,
    subscriptionDetails
  });

  res.status(201).json({
    success: true,
    data: order
  });
});

// @desc    Update subscription order
// @route   PUT /api/orders/subscriptions/:id
// @access  Private
exports.updateSubscriptionOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  if (!order.isSubscription) {
    return next(new ErrorResponse('Not a subscription order', 400));
  }

  // Update subscription details
  order.subscriptionDetails = {
    ...order.subscriptionDetails,
    ...req.body.subscriptionDetails
  };

  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Cancel subscription order
// @route   DELETE /api/orders/subscriptions/:id
// @access  Private
exports.cancelSubscriptionOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  if (!order.isSubscription) {
    return next(new ErrorResponse('Not a subscription order', 400));
  }

  order.status = 'cancelled';
  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get subscription orders
// @route   GET /api/orders/subscriptions
// @access  Private
exports.getSubscriptionOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({
    user: req.user.id,
    isSubscription: true
  })
    .populate('items.product', 'name price')
    .sort('-createdAt');

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders
  });
});

// @desc    Track delivery
// @route   GET /api/orders/:id/tracking
// @access  Private
exports.trackDelivery = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  res.status(200).json({
    success: true,
    data: {
      status: order.deliveryStatus,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      deliveryHistory: order.deliveryHistory
    }
  });
});

// @desc    Update delivery status
// @route   PATCH /api/orders/:id/delivery-status
// @access  Private (Farmer/Admin)
exports.updateDeliveryStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  order.deliveryStatus = req.body.status;
  order.deliveryHistory.push({
    status: req.body.status,
    location: req.body.location,
    timestamp: new Date()
  });

  await order.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Request return
// @route   POST /api/orders/:id/returns
// @access  Private
exports.requestReturn = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  const returnRequest = {
    items: req.body.items,
    reason: req.body.reason,
    status: 'pending',
    requestedAt: new Date()
  };

  order.returnRequests.push(returnRequest);
  await order.save();

  res.status(201).json({
    success: true,
    data: returnRequest
  });
});

// @desc    Process return
// @route   POST /api/orders/:id/returns/:returnId/process
// @access  Private (Farmer/Admin)
exports.processReturn = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  const returnRequest = order.returnRequests.id(req.params.returnId);
  if (!returnRequest) {
    return next(new ErrorResponse('Return request not found', 404));
  }

  returnRequest.status = req.body.status;
  returnRequest.processedAt = new Date();
  returnRequest.processedBy = req.user.id;
  returnRequest.notes = req.body.notes;

  await order.save();

  res.status(200).json({
    success: true,
    data: returnRequest
  });
});

// @desc    Get return requests
// @route   GET /api/orders/returns
// @access  Private (Farmer/Admin)
exports.getReturnRequests = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({
    'returnRequests.0': { $exists: true }
  })
    .populate('user', 'name email')
    .populate('items.product', 'name price');

  const returnRequests = orders.reduce((acc, order) => {
    return [...acc, ...order.returnRequests.map(request => ({
      ...request.toObject(),
      orderId: order._id,
      user: order.user
    }))];
  }, []);

  res.status(200).json({
    success: true,
    count: returnRequests.length,
    data: returnRequests
  });
});

// @desc    Update return status
// @route   PATCH /api/orders/:id/returns/:returnId/status
// @access  Private (Farmer/Admin)
exports.updateReturnStatus = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  const returnRequest = order.returnRequests.id(req.params.returnId);
  if (!returnRequest) {
    return next(new ErrorResponse('Return request not found', 404));
  }

  returnRequest.status = req.body.status;
  await order.save();

  res.status(200).json({
    success: true,
    data: returnRequest
  });
});

// @desc    Apply loyalty points
// @route   POST /api/orders/:id/apply-loyalty
// @access  Private
exports.applyLoyaltyPoints = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  const pointsToApply = req.body.points;
  const user = await User.findById(req.user.id);

  if (user.loyaltyPoints < pointsToApply) {
    return next(new ErrorResponse('Not enough loyalty points', 400));
  }

  // Calculate discount based on points
  const discountAmount = pointsToApply * 0.1; // 1 point = $0.10
  order.loyaltyPointsApplied = pointsToApply;
  order.loyaltyDiscount = discountAmount;
  order.finalAmount = order.totalAmount - discountAmount;

  await order.save();

  // Deduct points from user
  user.loyaltyPoints -= pointsToApply;
  await user.save();

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Remove loyalty points
// @route   POST /api/orders/:id/remove-loyalty
// @access  Private
exports.removeLoyaltyPoints = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse('Order not found', 404));
  }

  if (!order.loyaltyPointsApplied) {
    return next(new ErrorResponse('No loyalty points applied', 400));
  }

  const user = await User.findById(req.user.id);
  user.loyaltyPoints += order.loyaltyPointsApplied;

  order.loyaltyPointsApplied = 0;
  order.loyaltyDiscount = 0;
  order.finalAmount = order.totalAmount;

  await Promise.all([order.save(), user.save()]);

  res.status(200).json({
    success: true,
    data: order
  });
});

// @desc    Get order analytics
// @route   GET /api/orders/analytics/:type
// @access  Private (Farmer/Admin)
exports.getOrderAnalytics = asyncHandler(async (req, res, next) => {
  const { type } = req.params;
  const { startDate, endDate } = req.query;

  const dateFilter = {
    createdAt: {
      $gte: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      $lte: endDate ? new Date(endDate) : new Date()
    }
  };

  let query = {};
  if (type === 'farmer') {
    query = {
      'items.product.farmer': req.user.id,
      ...dateFilter
    };
  } else if (type === 'admin') {
    query = dateFilter;
  }

  const orders = await Order.find(query)
    .populate('items.product', 'name price')
    .populate('user', 'name email');

  const analytics = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.finalAmount, 0),
    averageOrderValue: orders.length ? orders.reduce((sum, order) => sum + order.finalAmount, 0) / orders.length : 0,
    statusDistribution: {
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length
    },
    deliveryMethodDistribution: {
      delivery: orders.filter(o => o.deliveryMethod === 'delivery').length,
      pickup: orders.filter(o => o.deliveryMethod === 'pickup').length
    },
    subscriptionOrders: orders.filter(o => o.isSubscription).length
  };

  res.status(200).json({
    success: true,
    data: analytics
  });
}); 