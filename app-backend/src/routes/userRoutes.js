const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const router = express.Router();

// register
router.post('/register', async (req, res) => {
  const {name, email, password} = req.body;
  const existing = await User.findOne({ email});
  if (existing) return res.status(400).json({message: 'User already exists'});

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({name, email, password: hashedPassword});


  res.json({ token: generateToken(user)});
});

//login
router.post("/login", async (req, res) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({message: 'Invalid credentials'});
  }

  res.json({ token: generateToken(user)});
});

module.exports = router;
