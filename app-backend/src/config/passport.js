const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserModel = require('../models/userModel');

// Serialize user to session
passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user || false);
  } catch (error) {
    done(error, null);
  }
});

// Set up Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      scope: ['profile', 'email']       
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Check if user already exists in database with Google ID
        const existingUser = await UserModel.findByGoogleId(profile.id);

        if (existingUser) {
          return done(null, existingUser);
        }

        // Check if user exists with the same email
        const userWithEmail = await UserModel.findByEmail(profile.emails[0].value);
        
        if (userWithEmail) {
          // Update existing user with Google ID
          const [updatedUser] = await UserModel.linkGoogleAccount(
            profile.emails[0].value, 
            profile
          );
          
          return done(null, updatedUser);
        }

        // Create a new user with Google profile
        const newUser = await UserModel.createWithGoogle(profile);

        return done(null, newUser);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport; 