require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');

const routes = require('./routes/indexRoutes');

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

// middleware
app.use(express.json());

// route
app.use("/api", routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

