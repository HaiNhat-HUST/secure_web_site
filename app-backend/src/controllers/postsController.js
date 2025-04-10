const Post = require('../models/Post');

// Get all posts
const getAllPosts = async (req, res) => {
    try {
        const posts = await Post.findAll({
            order: [['createdAt', 'DESC']]
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get a single post by ID
const getPostById = async (req, res) => {
    try {
        const post = await Post.findByPk(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.json(post);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get posts by status (draft/published)
const getPostsByStatus = async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: { status: req.params.status },
            order: [['createdAt', 'DESC']]
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get posts by author
const getPostsByAuthor = async (req, res) => {
    try {
        const posts = await Post.findAll({
            where: { authorId: req.params.authorId },
            order: [['createdAt', 'DESC']]
        });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    getAllPosts,
    getPostById,
    getPostsByStatus,
    getPostsByAuthor
};