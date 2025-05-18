const csurf = require('csurf');

const actualCsrfMiddleware = csurf({ cookie: true }); // Using cookie-based storage for the token secret

const csrfTokenGenerator = (req, res, next) => {
  // This will set up req.csrfToken() if successful.
  actualCsrfMiddleware(req, res, (err) => {
    if (err) {
      // Handle any error from the csurf middleware itself.
      console.error("Error from csurf middleware during token generation:", err);
      return next(err);
    }

    if (typeof req.csrfToken === 'function') {
      // Generate the token and store it in res.locals.
      // The subsequent route handler for GET /auth/login 
      res.locals.csrfToken = req.csrfToken();
    } else {
      // a potential misconfiguration upstream (e.g., cookie-parser or session middleware not correctly set up before csurf runs).
      console.error("req.csrfToken is not a function after csurf middleware. Check Express middleware order and setup (e.g., cookie-parser, session).");

      res.locals.csrfToken = null; // To ensure the frontend doesn't get an undefined value if the handler blindly sends it
    }
    next();
  });
};

module.exports = csrfTokenGenerator;