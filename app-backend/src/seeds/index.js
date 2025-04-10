const seedPosts = require('./postsSeed');

async function runAllSeeds() {
  console.log('Running seed scripts...');
  await seedPosts();
}

module.exports = runAllSeeds;