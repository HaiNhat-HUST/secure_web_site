require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');

const sequelize = require('./config/db');
const routes = require('./routes/index');
const runAllSeeds = require('./seeds/index'); 

// Import passport configuration
require('./config/passport');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))
;
// Authentication middleware: passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Productivity middleware
app.use(express.json());

// ROUTES
app.use(routes);

// ERROR HANDLING
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
