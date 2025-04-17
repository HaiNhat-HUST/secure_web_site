const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const generateToken = require('../utils/generateToken');

const router = express.Router();

// Google OAuth 2.0
router.get('/google', passport.authenticate('google', {scope: ['profile', 'email'],}));

router.get('/google/callback', 
  passport.authenticate('google', {
    failureRedirect: '/',
  }),
  (req, res) => {
    res.redirect('/auth/profile');
  }
);

// profile route
router.get('/profile', (req, res) => {
  if (!req.user) return res.redirect('/');
  res.json({user: req.user});
});

// Logout route
router.get('/logout', (req, res) => {
  req.logout(() => {
    res.redirect('/');
  });
});

module.exports = router;


