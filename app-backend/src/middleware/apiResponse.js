/**
 * Middleware to add standardized API response methods to res object
 * This helps keep API responses consistent across the application
 * and makes it easier to work with them in the frontend
 */
const apiResponse = (req, res, next) => {
  // Success response
  res.success = (data, message = 'Success', statusCode = 200) => {
    return res.status(statusCode).json({
      success: true,
      message,
      data
    });
  };

  // Error response
  res.error = (message = 'Error occurred', statusCode = 400, errors = null) => {
    const response = {
      success: false,
      message,
      timestamp: new Date().toISOString()
    };

    if (errors) {
      response.errors = errors;
    }

    return res.status(statusCode).json(response);
  };

  // Not found response
  res.notFound = (message = 'Resource not found') => {
    return res.status(404).json({
      success: false,
      message
    });
  };

  // Unauthorized response
  res.unauthorized = (message = 'Unauthorized access') => {
    return res.status(401).json({
      success: false,
      message
    });
  };

  next();
};

module.exports = apiResponse; 