require('dotenv').config();
const express = require('express');

const sequelize = require('./config/db');
const postsRoutes = require('./routes/posts');
const runAllSeeds = require('./seeds/index'); 

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use('/api/posts', postsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log('Connected to the database');

    await sequelize.sync({ force: true }); // ⚠️ For dev only
    console.log('Database synchronized successfully');

    await runAllSeeds(); // 👈 Seeding happens here

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });

  } catch (err) {
    console.error('❌ Unable to start the server:', err);
  }
})();
