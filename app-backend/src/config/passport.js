const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();


passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL,
}, (accessToken, refreshToken, profile, done) => {
  try {
    // Your user lookup/creation logic
    return done(null, profile);
  } catch (error) {
    return done(error, null);
  }
}));


// serialize and deserialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

// deserialize when user send the next request
passport.deserializeUser((user, done) => {
  done(null, user);
});

