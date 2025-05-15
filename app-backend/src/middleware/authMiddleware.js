const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

// Verify JWT token
const authenticateJWT = async (req, res, next) => {
  const token = 
    req.headers.authorization?.split(' ')[1] || 
    req.query.token || 
    req.cookies?.token;
  
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SESSION_SECRET);
    
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'Invalid token. User not found.' });
    }
    
    req.user = user;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ message: 'Invalid token.' });
  }
};

// Check if user has a role
const hasRole = (requiredRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return res.status(403).json({ message: 'Forbidden. User role not available.' });
    }
    
    const userRole = req.user.role;
    if (requiredRoles.includes(userRole)) {
      return next();
    }
    
    return res.status(403).json({ message: 'Forbidden. Insufficient permissions.' });
  };
};

// Check if user has an assigned role
const hasRoleAssigned = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required.' });
  }
  
  if (req.user.role === null || req.user.role === undefined || req.user.role === '') {
    return res.status(403).json({ 
      message: 'Role selection required.',
      user: { userId: req.user.userId, email: req.user.email },
      redirectTo: '/select-role'
    });
  }
  
  next();
};

module.exports = {
  authenticateJWT,
  hasRole,
  hasRoleAssigned
}; 