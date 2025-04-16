  const jwt = require('jsonwebtoken');
  const User = require('../models/User');
  const { sendEmail } = require('../config/email');
  const bcrypt = require('bcryptjs');

  // Generate JWT
  const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });
  };

  // @desc    Register new user
  // @route   POST /api/users/register
  // @access  Public
  const registerUser = async (req, res) => {
    try {
      const { name, email, password, address, phone, role } = req.body;

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create user
      const user = await User.create({
        name,
        email,
        password,
        address,
        phone,
        role: role || 'user'
      });

      if (user) {
        res.status(201).json({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user._id),
        });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // @desc    Register new farmer
  // @route   POST /api/users/farmer/register
  // @access  Public
  const registerFarmer = async (req, res) => {
    try {
      const { 
        name, 
        email, 
        password, 
        address, 
        phone, 
        farmName, 
        farmAddress, 
        farmDescription, 
        farmProducts 
      } = req.body;

      // Check if user exists
      const userExists = await User.findOne({ email });
      if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
      }

      // Create farmer
      const farmer = await User.create({
        name,
        email,
        password,
        address,
        phone,
        role: 'farmer',
        farmName,
        farmAddress,
        farmDescription,
        farmProducts
      });

      if (farmer) {
        res.status(201).json({
          _id: farmer._id,
          name: farmer.name,
          email: farmer.email,
          role: farmer.role,
          farmName: farmer.farmName,
          isVerified: farmer.isVerified,
          token: generateToken(farmer._id),
        });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // @desc    Login user
  // @route   POST /api/users/login
  // @access  Public
  const loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide both email and password'
        });
      }

      // Find user by email
      const user = await User.findOne({ email }).select('+password'); // Include password field
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Check password match
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }

      // Generate token
      const token = generateToken(user._id);

      // Send response
      res.json({
        success: true,
        data: {
          user: {
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            billingAddress: user.billingAddress,
            isVerified: user.isVerified
          },
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  };

  // @desc    Get user profile
  // @route   GET /api/users/profile
  // @access  Private
  const getProfile = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      res.json({ 
        success: true, 
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone,
          billingAddress: user.billingAddress,
          isVerified: user.isVerified
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // @desc    Update user profile
  // @route   PUT /api/users/profile
  // @access  Private
  const updateProfile = async (req, res) => {
    try {
      const { name, email, phone } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Check if email is being changed and if it's already taken
      if (email && email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return res.status(400).json({ success: false, message: 'Email already exists' });
        }
      }

      // Update fields
      user.name = name || user.name;
      user.email = email || user.email;
      user.phone = phone || user.phone;

      await user.save();

      res.json({ 
        success: true, 
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // @desc    Get all users (admin only)
  // @route   GET /api/users
  // @access  Private/Admin
  const getUsers = async (req, res) => {
    try {
      const users = await User.find({}).select('-password');
      res.json(users);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // @desc    Get all farmers (admin only)
  // @route   GET /api/users/farmers
  // @access  Private/Admin
  const getFarmers = async (req, res) => {
    try {
      const farmers = await User.find({ role: 'farmer' }).select('-password');
      res.json(farmers);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // @desc    Verify farmer (admin only)
  // @route   PUT /api/users/farmers/:id/verify
  // @access  Private/Admin
  const verifyFarmer = async (req, res) => {
    try {
      const farmer = await User.findById(req.params.id);

      if (farmer && farmer.role === 'farmer') {
        farmer.isVerified = true;
        const updatedFarmer = await farmer.save();
        res.json({
          _id: updatedFarmer._id,
          name: updatedFarmer.name,
          email: updatedFarmer.email,
          isVerified: updatedFarmer.isVerified
        });
      } else {
        res.status(404).json({ message: 'Farmer not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // @desc    Delete user (admin only)
  // @route   DELETE /api/users/:id
  // @access  Private/Admin
  const deleteUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);

      if (user) {
        await user.deleteOne();
        res.json({ message: 'User removed' });
      } else {
        res.status(404).json({ message: 'User not found' });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  };

  // @desc    Send verification email
  // @route   POST /api/users/send-verification
  // @access  Private
  const sendVerificationEmail = async (req, res) => {
    try {
      const user = req.user; // Get user from auth middleware
      
      // Generate verification token
      const verificationToken = jwt.sign(
        { userId: user._id },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Send verification email
      await sendEmail(
        user.email,
        'verification',
        verificationToken
      );

      res.status(200).json({ message: 'Verification email sent successfully' });
    } catch (error) {
      console.error('Error sending verification email:', error);
      res.status(500).json({ error: 'Failed to send verification email' });
    }
  };

  // @desc    Verify email
  // @route   POST /api/users/verify-email
  // @access  Public
  const verifyEmail = async (req, res) => {
    try {
      const { token } = req.body;
      
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Update user verification status
      const user = await User.findByIdAndUpdate(
        decoded.userId,
        { isVerified: true },
        { new: true }
      ).select('-password');

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate new auth token
      const authToken = generateToken(user._id);

      res.status(200).json({
        message: 'Email verified successfully',
        token: authToken,
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isVerified: user.isVerified,
          address: user.address,
          phone: user.phone,
          farmName: user.farmName,
          farmAddress: user.farmAddress,
          farmDescription: user.farmDescription,
          farmProducts: user.farmProducts
        }
      });
    } catch (error) {
      console.error('Error verifying email:', error);
      res.status(400).json({ error: 'Invalid or expired verification token' });
    }
  };

  // @desc    Update password
  // @route   PUT /api/users/password
  // @access  Private
  const updatePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ success: false, message: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);

      await user.save();

      res.json({ success: true, message: 'Password updated successfully' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // @desc    Update billing address
  // @route   PUT /api/users/billing-address
  // @access  Private
  const updateBillingAddress = async (req, res) => {
    try {
      const { 
        street,
        city,
        state,
        zipCode,
        country,
        phone
      } = req.body;

      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Update billing address
      user.billingAddress = {
        street,
        city,
        state,
        zipCode,
        country,
        phone
      };

      await user.save();

      res.json({ 
        success: true, 
        data: {
          billingAddress: user.billingAddress
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // @desc    Guest checkout
  // @route   POST /api/users/guest-checkout
  // @access  Public
  const guestCheckout = async (req, res) => {
    try {
      const { name, email, phone, billingAddress } = req.body;

      // Create temporary guest user
      const guestUser = await User.create({
        name,
        email,
        phone,
        billingAddress,
        role: 'guest',
        isVerified: true // Skip verification for guest users
      });

      // Generate temporary token
      const token = generateToken(guestUser._id);

      res.status(201).json({
        success: true,
        data: {
          user: {
            _id: guestUser._id,
            name: guestUser.name,
            email: guestUser.email,
            role: guestUser.role
          },
          token
        }
      });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  };

  // @desc    Update notification preferences
  // @route   PUT /api/users/notifications
  // @access  Private
  const updateNotificationPreferences = async (req, res) => {
    try {
      const { email, sms, marketing, orderUpdates } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      user.notificationPreferences = {
        email: email !== undefined ? email : user.notificationPreferences.email,
        sms: sms !== undefined ? sms : user.notificationPreferences.sms,
        marketing: marketing !== undefined ? marketing : user.notificationPreferences.marketing,
        orderUpdates: orderUpdates !== undefined ? orderUpdates : user.notificationPreferences.orderUpdates
      };

      await user.save();

      res.json({ success: true, data: user.notificationPreferences });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // @desc    Get loyalty program info
  // @route   GET /api/users/loyalty
  // @access  Private
  const getLoyaltyInfo = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({
        success: true,
        data: {
          points: user.loyaltyPoints,
          tier: user.loyaltyTier,
          nextTier: getNextTier(user.loyaltyPoints),
          pointsToNextTier: getPointsToNextTier(user.loyaltyPoints)
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // Helper function to get next loyalty tier
  const getNextTier = (points) => {
    if (points < 1000) return 'silver';
    if (points < 5000) return 'gold';
    if (points < 10000) return 'platinum';
    return null;
  };

  // Helper function to get points needed for next tier
  const getPointsToNextTier = (points) => {
    if (points < 1000) return 1000 - points;
    if (points < 5000) return 5000 - points;
    if (points < 10000) return 10000 - points;
    return 0;
  };

  // @desc    Add loyalty points
  // @route   POST /api/users/loyalty/add-points
  // @access  Private
  const addLoyaltyPoints = async (req, res) => {
    try {
      const { points, reason } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      user.loyaltyPoints += points;
      user.updateLoyaltyTier();
      await user.save();

      // Log points addition
      // TODO: Implement points history logging

      res.json({
        success: true,
        data: {
          points: user.loyaltyPoints,
          tier: user.loyaltyTier
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // @desc    Redeem loyalty points
  // @route   POST /api/users/loyalty/redeem
  // @access  Private
  const redeemLoyaltyPoints = async (req, res) => {
    try {
      const { points } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      if (user.loyaltyPoints < points) {
        return res.status(400).json({ success: false, message: 'Insufficient points' });
      }

      user.loyaltyPoints -= points;
      user.updateLoyaltyTier();
      await user.save();

      // Log points redemption
      // TODO: Implement points history logging

      res.json({
        success: true,
        data: {
          points: user.loyaltyPoints,
          tier: user.loyaltyTier
        }
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // @desc    Create subscription
  // @route   POST /api/users/subscriptions
  // @access  Private
  const createSubscription = async (req, res) => {
    try {
      const { productId, frequency, paymentMethodId } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // Calculate next delivery date based on frequency
      const nextDeliveryDate = calculateNextDeliveryDate(frequency);

      const subscription = {
        product: productId,
        frequency,
        nextDeliveryDate,
        status: 'active',
        paymentMethod: paymentMethodId
      };

      user.subscriptions.push(subscription);
      await user.save();

      res.status(201).json({
        success: true,
        data: subscription
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // Helper function to calculate next delivery date
  const calculateNextDeliveryDate = (frequency) => {
    const date = new Date();
    switch (frequency) {
      case 'weekly':
        date.setDate(date.getDate() + 7);
        break;
      case 'biweekly':
        date.setDate(date.getDate() + 14);
        break;
      case 'monthly':
        date.setMonth(date.getMonth() + 1);
        break;
    }
    return date;
  };

  // @desc    Update subscription
  // @route   PUT /api/users/subscriptions/:id
  // @access  Private
  const updateSubscription = async (req, res) => {
    try {
      const { frequency, status, paymentMethodId } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const subscription = user.subscriptions.id(req.params.id);
      if (!subscription) {
        return res.status(404).json({ success: false, message: 'Subscription not found' });
      }

      if (frequency) {
        subscription.frequency = frequency;
        subscription.nextDeliveryDate = calculateNextDeliveryDate(frequency);
      }
      if (status) subscription.status = status;
      if (paymentMethodId) subscription.paymentMethod = paymentMethodId;

      await user.save();

      res.json({
        success: true,
        data: subscription
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // @desc    Cancel subscription
  // @route   DELETE /api/users/subscriptions/:id
  // @access  Private
  const cancelSubscription = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const subscription = user.subscriptions.id(req.params.id);
      if (!subscription) {
        return res.status(404).json({ success: false, message: 'Subscription not found' });
      }

      subscription.status = 'cancelled';
      await user.save();

      res.json({
        success: true,
        data: subscription
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // @desc    Get user subscriptions
  // @route   GET /api/users/subscriptions
  // @access  Private
  const getSubscriptions = async (req, res) => {
    try {
      const user = await User.findById(req.user._id).populate('subscriptions.product');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.json({
        success: true,
        data: user.subscriptions
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // @desc    Add payment method
  // @route   POST /api/users/payment-methods
  // @access  Private
  const addPaymentMethod = async (req, res) => {
    try {
      const { type, details, isDefault } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      // If setting as default, unset other defaults
      if (isDefault) {
        user.paymentMethods.forEach(method => {
          method.isDefault = false;
        });
      }

      const paymentMethod = {
        type,
        details,
        isDefault: isDefault || false
      };

      user.paymentMethods.push(paymentMethod);
      await user.save();

      res.status(201).json({
        success: true,
        data: paymentMethod
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // @desc    Update payment method
  // @route   PUT /api/users/payment-methods/:id
  // @access  Private
  const updatePaymentMethod = async (req, res) => {
    try {
      const { details, isDefault } = req.body;
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const paymentMethod = user.paymentMethods.id(req.params.id);
      if (!paymentMethod) {
        return res.status(404).json({ success: false, message: 'Payment method not found' });
      }

      if (details) paymentMethod.details = details;
      if (isDefault !== undefined) {
        if (isDefault) {
          user.paymentMethods.forEach(method => {
            method.isDefault = false;
          });
        }
        paymentMethod.isDefault = isDefault;
      }

      await user.save();

      res.json({
        success: true,
        data: paymentMethod
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  // @desc    Delete payment method
  // @route   DELETE /api/users/payment-methods/:id
  // @access  Private
  const deletePaymentMethod = async (req, res) => {
    try {
      const user = await User.findById(req.user._id);

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const paymentMethod = user.paymentMethods.id(req.params.id);
      if (!paymentMethod) {
        return res.status(404).json({ success: false, message: 'Payment method not found' });
      }

      // Don't allow deletion if it's the only payment method
      if (user.paymentMethods.length === 1) {
        return res.status(400).json({ success: false, message: 'Cannot delete the only payment method' });
      }

      paymentMethod.remove();
      await user.save();

      res.json({
        success: true,
        data: {}
      });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Server error' });
    }
  };

  module.exports = {
    registerUser,
    registerFarmer,
    loginUser,
    getUsers,
    getFarmers,
    verifyFarmer,
    deleteUser,
    sendVerificationEmail,
    verifyEmail,
    getProfile,
    updateProfile,
    updatePassword,
    updateBillingAddress,
    guestCheckout,
    updateNotificationPreferences,
    getLoyaltyInfo,
    addLoyaltyPoints,
    redeemLoyaltyPoints,
    createSubscription,
    updateSubscription,
    cancelSubscription,
    getSubscriptions,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod
  }; 