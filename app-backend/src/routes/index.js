const express = require('express');
const authRoutes = require('./auth');
const postsRoutes = require('./posts');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/posts', postsRoutes);
router.use('/user', userRoutes);

module.exports = router;
