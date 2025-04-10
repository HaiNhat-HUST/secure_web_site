const Post = require('../models/Post');

async function seedPosts() {
  try {
    await Post.bulkCreate([
      {
        title: 'Getting Started with Express',
        content: 'Express is a fast and minimalist web framework for Node.js.'
      },
      {
        title: 'Using Sequelize with PostgreSQL',
        content: 'Sequelize makes it easy to manage a Postgres database using models and sync.'
      },
      {
        title: 'Dockerizing Your App',
        content: 'Running PostgreSQL in Docker helps simplify local development.'
      }
    ]);
    console.log('Posts seeded successfully.');
  } catch (error) {
    console.error('Error seeding posts:', error);
  }
}

module.exports = seedPosts;