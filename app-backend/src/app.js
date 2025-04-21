require('dotenv').config();
const express = require('express');
const session = require('express-session');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

// Import passport config
const passport = require('./config/passport');
const apiResponse = require('./middleware/apiResponse');

// Import routes
const routes = require('./routes/indexRoutes');
const authRoutes = require('./routes/authRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Enhanced CORS configuration for React frontend
app.use(cors({
  origin: [
    process.env.CLIENT_URL || 'http://localhost:5000',
    // Add additional origins if needed for development/staging
    'http://localhost:3000',
    'http://localhost:5173', // Vite default port
    'http://localhost:5174'
  ],
  credentials: true, // Important for cookies/auth
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Security with helmet but configured for SPA
app.use(helmet({
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? undefined : false,
  crossOriginEmbedderPolicy: false
}));

// Logging
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Add standardized API response methods
app.use(apiResponse);

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000, // 1 day
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax'
  }
}));

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// API health check endpoint
app.get('/health', (req, res) => {
  res.success({ time: new Date().toISOString() }, 'API is healthy');
});

// Routes
app.use('/auth', authRoutes);
app.use('/api', routes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.error(message, statusCode);
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.notFound('Endpoint not found');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;

