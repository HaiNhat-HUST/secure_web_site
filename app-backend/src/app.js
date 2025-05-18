require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const session = require('express-session');
const passport = require('./config/passport');
const path = require('path');

// Import routes
const authRoutes = require('./routes/authRoutes');
const jobRoutes = require('./routes/jobRoutes');
const profileRoutes = require('./routes/profileRoutes');
const passwordRecoveryRoutes = require('./routes/passwordRecoveryRoutes');
const dashboardRoutes = require('../src/routes/dashboardRoutes');

const app = express();

// Middleware
app.use(helmet()); // Security headers

// Customize the  security headers as needed
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],  // Only allow content from the same origin
      scriptSrc: ["'self'", "'unsafe-inline'", "trusted-cdn.com"], // Allow inline scripts and trusted CDN
      styleSrc: ["'self'", "'unsafe-inline'"], // Allow inline styles
      imgSrc: ["'self'", "data:"], // Allow images from self and data URIs
      objectSrc: ["'none'"], // Prevent loading any plugins
      upgradeInsecureRequests: [] // Automatically upgrade HTTP to HTTPS
    }
  },
  frameguard: {
    action: 'deny' // Prevents the  site from being embedded in an iframe
  },
  hsts: {
    maxAge: 31536000, // 1 year in seconds
    includeSubDomains: true, // Apply to all subdomains
    preload: true // Add the  site to the HSTS preload list
  },
  xssFilter: true, // Enable XSS filter
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' } // Referrer policy for better privacy
}));

app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// CORS setup
const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000'
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// Session setup for Passport
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    httpOnly: true, // Prevents client-side JS from reading the cookie
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
const API_PREFIX = '/api';
const { authenticateJWT, hasRoleAssigned } = require('./middleware/authMiddleware');

// Public routes
app.use('/auth', authRoutes);
app.use(passwordRecoveryRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Protected routes - using job routes correctly
app.use(API_PREFIX, jobRoutes);

app.use(`${API_PREFIX}/profiles`, authenticateJWT, hasRoleAssigned, profileRoutes);
app.use('/api/dashboard',dashboardRoutes);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.get(API_PREFIX, (req, res) => {
  res.json({ message: 'Welcome to RMS API v1' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    status: err.statusCode || 500
  });
});

module.exports = app;

