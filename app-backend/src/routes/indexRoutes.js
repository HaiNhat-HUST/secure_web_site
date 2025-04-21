const express = require('express');
const postsRoutes = require('./postsRoutes');
const { ensureAuth } = require('../middleware/auth');

const router = express.Router();

// Protected routes - require authentication
router.use('/posts', ensureAuth, postsRoutes);

// Home route for API
router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API' });
});

module.exports = router;
