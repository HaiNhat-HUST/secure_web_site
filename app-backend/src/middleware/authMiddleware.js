const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

// Verify JWT token from request
const authenticateJWT = async (req, res, next) => {
  // Get the token from header, query or cookies
  const token = 
    req.headers.authorization?.split(' ')[1] || 
    req.query.token || 
    req.cookies?.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    
    // Get user from database
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }
    
    // Add user to request
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Check if user is authenticated (for routes that need authentication)
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated() || req.user) {
    return next();
  }
  res.status(401).json({ message: 'Unauthorized. Please login.' });
};

// Check user role
const hasRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized. Please login.' });
    }
    
    if (roles.includes(req.user.role)) {
      return next();
    }
    
    return res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
  };
};

// Check if user has a role assigned
const hasRoleAssigned = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized. Please login.' });
  }
  
  if (req.user.role === null) {
    return res.status(403).json({ 
      message: 'Role not assigned',
      redirect: '/api/auth/select-role',
      user: req.user 
    });
  }
  
  return next();
};

module.exports = {
  authenticateJWT,
  isAuthenticated,
  hasRole,
  hasRoleAssigned
}; 