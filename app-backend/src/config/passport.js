const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('../models/userModel');
const { verify } = require('jsonwebtoken');

passport.serializeUser((user, done) => {
  done(null, user.user_id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});


passport.use(
  new LocalStrategy(
    {
      usernameField: 'identifier',
      passwordField: 'password'
    },

    async (escapeIdentifier, password, done) => {
      try {

        let user = await UserModel.findByEmail(identifier);

        if (!user) {
          await UserModel.findByUsername(identifier);
        }
        
        if (!user) {
          return done(null, false, {message: 'Invalid credentials'})
        }

        if (!user.password_hash) {
          return done(null, false, {
            message: 'This account was created with Google OAuth. Please log in with Goole.'
          });
        }

        const isPasswordValid = await verifyPassword(password, user.password_hash);
        if (!isPasswordValid) {
          return done(null, false, {message: 'Valid credentails'});
        }

        return done(null,user);
      } catch(error) {
        return done(error, false);
      }
    }
  )
)

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
        let user = await UserModel.findByGoogleId(profile.id);
        
        if (user) {
          return done(null, user);
        }
        
        user = await UserModel.createWithGoogle(profile);
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

module.exports = passport; 