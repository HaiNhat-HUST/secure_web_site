const Post = require('../models/Post');

const postsController = {
  // Get all posts
  getAllPosts: async (req, res) => {
    try {
      const posts = await Post.findAll({
        order: [['createdAt', 'DESC']],
      });
      res.json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      res.status(500).json({ error: 'Failed to fetch posts' });
    }
  },

  // Get a single post by ID
  getPostById: async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);
      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }
      res.json(post);
    } catch (error) {
      console.error('Error fetching post:', error);
      res.status(500).json({ error: 'Failed to fetch post' });
    }
  },

  // Create a new post
  createPost: async (req, res) => {
    try {
      const { title, content } = req.body;
      const authorId = req.user.id; // Assuming user is authenticated and user info is in req.user

      const post = await Post.create({
        title,
        content,
        authorId,
      });

      res.status(201).json(post);
    } catch (error) {
      console.error('Error creating post:', error);
      res.status(500).json({ error: 'Failed to create post' });
    }
  },

  // Update a post
  updatePost: async (req, res) => {
    try {
      const { title, content } = req.body;
      const post = await Post.findByPk(req.params.id);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Check if the user is the author of the post
      if (post.authorId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to update this post' });
      }

      await post.update({ title, content });
      res.json(post);
    } catch (error) {
      console.error('Error updating post:', error);
      res.status(500).json({ error: 'Failed to update post' });
    }
  },

  // Delete a post
  deletePost: async (req, res) => {
    try {
      const post = await Post.findByPk(req.params.id);

      if (!post) {
        return res.status(404).json({ error: 'Post not found' });
      }

      // Check if the user is the author of the post
      if (post.authorId !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to delete this post' });
      }

      await post.destroy();
      res.status(204).send();
    } catch (error) {
      console.error('Error deleting post:', error);
      res.status(500).json({ error: 'Failed to delete post' });
    }
  },
};

module.exports = postsController; 