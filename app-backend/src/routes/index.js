const express = require('express');
const authRoutes = require('./oauth20');
const postsRoutes = require('./posts');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/posts', postsRoutes);

module.exports = router;
