const bcrypt = require('bcrypt')
const rateLimit = require('express-rate-limit');


// Password securing
const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password,salt )
};

const verifyPassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res, next, options) => {
    return res.status(429).json({
      error: true,
      message: 'Too many login attempts. Please try again after 15 minutes.',
      retryAfter: options.windowMs / 1000, // seconds
    });
  }
});

module.exports = {
  hashPassword,
  verifyPassword,
  loginLimiter
}