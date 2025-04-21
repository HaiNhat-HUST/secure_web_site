/**
 * Middleware to ensure user is authenticated
 */
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  
  // Using our standardized API response
  return res.unauthorized('Authentication required. Please log in.');
};

/**
 * Middleware to ensure user is NOT authenticated
 * Useful for login/register pages
 */
const ensureGuest = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return next();
  }
  
  // For API requests
  if (req.xhr || req.headers.accept.includes('json')) {
    return res.success(null, 'Already authenticated', 200);
  }
  
  // For browser requests
  return res.redirect(process.env.CLIENT_SUCCESS_REDIRECT || '/');
};

/**
 * Middleware to ensure user has specific role
 * @param {string|string[]} roles - Single role or array of allowed roles
 */
const ensureRole = (roles) => {
  return (req, res, next) => {
    // First check if authenticated
    if (!req.isAuthenticated()) {
      return res.unauthorized('Authentication required. Please log in.');
    }
    
    // Convert single role to array for consistent handling
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    // Check if user's role is in the allowed roles
    if (allowedRoles.includes(req.user.role)) {
      return next();
    }
    
    return res.error('You do not have permission to access this resource', 403);
  };
};

/**
 * Attaches user info to all responses if user is authenticated
 * Useful for React components that need to know auth state
 */
const attachUserToResponse = (req, res, next) => {
  // Store the original json function
  const originalJson = res.json;
  
  // Override the json function
  res.json = function(obj) {
    // If user is authenticated and response is an object
    if (req.isAuthenticated() && typeof obj === 'object' && obj !== null) {
      // Don't include authentication info if it's an error response
      if (!obj.error) {
        const { password_hash, ...sanitizedUser } = req.user;
        // Attach auth info to response
        obj.auth = {
          isAuthenticated: true,
          user: sanitizedUser
        };
      }
    }
    
    // Call the original json function
    return originalJson.call(this, obj);
  };
  
  next();
};

module.exports = {
  ensureAuth,
  ensureGuest,
  ensureRole,
  attachUserToResponse
}; 