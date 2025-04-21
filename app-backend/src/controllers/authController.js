const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');

// Helper to generate JWT
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.user_id, 
      email: user.email,
      role: user.role 
    }, 
    process.env.SESSION_SECRET, 
    { expiresIn: '7d' }
  );
};

module.exports = {
  // Handle successful Google authentication
  googleCallback: (req, res) => {
    try {
      // Create JWT token
      const token = generateToken(req.user);
      
      // Redirect to frontend with token
      const redirectUrl = `${process.env.CLIENT_SUCCESS_REDIRECT}?token=${token}`;
      return res.redirect(redirectUrl);
    } catch (error) {
      console.error('Google callback error:', error);
      return res.redirect(process.env.CLIENT_FAILURE_REDIRECT);
    }
  },

  // Handle logout
  logout: (req, res) => {
    req.logout(function(err) {
      if (err) { return next(err); }
      res.redirect(process.env.CLIENT_LOGOUT_REDIRECT);
    });
  },

  // Get current user
  getCurrentUser: async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    try {
      const user = await UserModel.findById(req.user.user_id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      
      // Remove sensitive information
      const { password_hash, ...userWithoutPassword } = user;
      return res.status(200).json(userWithoutPassword);
    } catch (error) {
      console.error('Get current user error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }
}; 