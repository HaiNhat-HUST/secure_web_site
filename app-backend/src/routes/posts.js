const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
// Apply authentication middleware to all routes

// Get all posts
router.get('/', postsController.getAllPosts);

// Get a single post
router.get('/:id', postsController.getPostById);

// Create a new post
router.post('/', postsController.createPost);

// Update a post
router.put('/:id', postsController.updatePost);

// Delete a post
router.delete('/:id', postsController.deletePost);

module.exports = router; 