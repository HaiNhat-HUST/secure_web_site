/**
 * Middleware to ensure user is authenticated
 */
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ error: 'Unauthorized - Please log in' });
};

/**
 * Middleware to ensure user is NOT authenticated
 * Useful for login/register pages
 */
const ensureGuest = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  return res.redirect('/');
};

module.exports = {
  ensureAuth,
  ensureGuest
}; 