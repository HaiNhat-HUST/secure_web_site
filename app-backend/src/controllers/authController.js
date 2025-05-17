const jwt = require('jsonwebtoken');
const UserModel = require('../models/userModel');
const { hashPassword, verifyPassword } = require('../utils/passwordUtils');

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
  register: async (req, res) => {
    try {
      const {username, email, password} = req.body;

      if (!username || !email || !password) {
        return res.status(400).json({message: 'Username, email and password are required' });
      }

      const existingUserByEmail = await UserModel.findByEmail(email);
      if (existingUserByEmail) {
        return res.status(400).json({message: 'Email already in use'});
      }

      const existingUserByUsername = await UserModel.findByUsername(username);
      if (existingUserByUsername) {
        return res.status(400).json({message: 'Username already in use'});
      }

      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/;

      if (!passwordRegex.test(password)) {
        return res.status(400).json({
          message: 'Password must be at least 8 characters and include uppercase, lowercase, number, and special character.'
        });
      }

      const passwordHash = await hashPassword(password);

      const userData = {  // user role will be null at register
        username,
        email,
        role: null,
        password_hash: passwordHash,
        created_at: new Date(),
        updated_at: new Date(),
      };

      const user = await UserModel.create(userData);

      const token = generateToken(user);

      const {password_hash, ...userWithoutPassword} = user;

      return res.status(201).json({
        user: userWithoutPassword,
        token
      });

    } catch (error) {
      console.log('Register error:', error);
      return res.status(500).json({ message: 'Server error during registration'});
    }
  },

  login: async (req,res) => {
    try {
      const { identifier, password }= req.body;

      if (!identifier || !password) {
        return res.status(400).json({message: 'Email/username and password are required' });
      }

      let user = await UserModel.findByEmail(identifier);
      if (!user) {
        user = await UserModel.findByUsername(identifier);
      }

      if (!user) {
        return res.status(401).json({message: 'Invalid credentials' });
      }

      if (!user.password_hash) {
        return res.status(401).json({
          message: 'This account was created with Google OAuth. Please log in with Google.'
        });
      }

      const validPassword = await verifyPassword(password, user.password_hash)
      if (!validPassword) {
        return res.status(401).json({message: "Invalid credentials"})
      }
      const token = generateToken(user);

      const {password_hash, ...userWithoutPassword} = user;

      return res.status(200).json({
        user: userWithoutPassword,
        token
      });

    } catch (error) {
      console.log('Login error: ', error);
      return res.status(500).json({message: 'Server error during login'});
    }
  },

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
  },

  // Select user role
  selectRole: async (req, res) => {
    try {
      const { role } = req.body;
      const userId = req.user.user_id;

      if (!role) {
        return res.status(400).json({ message: 'Role is required' });
      }

      // Validate role
      const validRoles = ['JobSeeker', 'Recruiter'];
      if (!validRoles.includes(role)) {
        return res.status(400).json({ message: 'Invalid role. Must be either JobSeeker or Recruiter' });
      }

      // Update user role
      const updatedUser = await UserModel.update(userId, { role });
      
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Generate new token with updated role
      const token = generateToken(updatedUser[0]);

      return res.status(200).json({
        message: 'Role selected successfully',
        user: updatedUser[0],
        token
      });

    } catch (error) {
      console.error('Role selection error:', error);
      return res.status(500).json({ message: 'Server error during role selection' });
    }
  }
}

