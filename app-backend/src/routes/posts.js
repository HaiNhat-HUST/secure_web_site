const express = require('express');
const router = express.Router();
const {
    getAllPosts,
    getPostById,
    getPostsByStatus,
    getPostsByAuthor
} = require('../controllers/postsController');

// Get all posts
router.get('/', getAllPosts);

// Get post by ID
router.get('/:id', getPostById);

// Get posts by status
router.get('/status/:status', getPostsByStatus);

// Get posts by author
router.get('/author/:authorId', getPostsByAuthor);

module.exports = router;