const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { sendEmail } = require('../config/email');

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

// @desc    Authenticate a user
// @route   POST /api/users/login
// @access  Public
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isVerified: user.isVerified,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        address: user.address,
        phone: user.phone,
        farmName: user.farmName,
        farmAddress: user.farmAddress,
        farmDescription: user.farmDescription,
        farmProducts: user.farmProducts,
        isVerified: user.isVerified
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.address = req.body.address || user.address;
      user.phone = req.body.phone || user.phone;
      
      // Update farmer specific fields if user is a farmer
      if (user.role === 'farmer') {
        user.farmName = req.body.farmName || user.farmName;
        user.farmAddress = req.body.farmAddress || user.farmAddress;
        user.farmDescription = req.body.farmDescription || user.farmDescription;
        user.farmProducts = req.body.farmProducts || user.farmProducts;
      }

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        address: updatedUser.address,
        phone: updatedUser.phone,
        farmName: updatedUser.farmName,
        farmAddress: updatedUser.farmAddress,
        farmDescription: updatedUser.farmDescription,
        farmProducts: updatedUser.farmProducts,
        isVerified: updatedUser.isVerified,
        token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
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

module.exports = {
  registerUser,
  registerFarmer,
  loginUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  getFarmers,
  verifyFarmer,
  deleteUser,
  sendVerificationEmail,
  verifyEmail,
}; 