const express = require('express');
const authRoutes = require('./authRoutes');
const postsRoutes = require('./postsRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/posts', postsRoutes);
router.use('/user', userRoutes);

module.exports = router;
