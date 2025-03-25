const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');
const ErrorResponse = require('../utils/errorResponse');

exports.protect = async (req, res, next) => {
  try {
    let token = req.header('Authorization');

    if (!token) {
      return next(new ErrorResponse('No authentication token, access denied', 401));
    }

    // Remove Bearer prefix if present
    if (token.startsWith('Bearer ')) {
      token = token.slice(7, token.length);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Try to find user in both User and Admin collections
    let user = await User.findById(decoded.id).select('-password');
    if (!user) {
      user = await Admin.findById(decoded.id).select('-password');
    }

    if (!user) {
      return next(new ErrorResponse('Token is invalid', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error in auth middleware:', error);
    return next(new ErrorResponse('Token is invalid', 401));
  }
};

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse(`User role ${req.user.role} is not authorized to access this route`, 403));
    }
    next();
  };
};

exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin role required.' });
    }
    next();
  } catch (error) {
    console.error('Error in isAdmin middleware:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.isFarmer = async (req, res, next) => {
  try {
    if (req.user.role !== 'farmer') {
      return res.status(403).json({ message: 'Access denied. Farmer role required.' });
    }
    next();
  } catch (error) {
    console.error('Error in isFarmer middleware:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 