class AppError extends Error {
    constructor(message, statusCode) {
      super(message); // Call the parent constructor with the message
      this.statusCode = statusCode || 500; // Default to 500 if no status code is provided
      this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'error'; // Set status based on code
      this.isOperational = true; // Set isOperational to true, which is useful for error tracking
      Error.captureStackTrace(this, this.constructor); // Capture the stack trace
    }
  }
  
  class BadRequestError extends AppError {
    constructor(message) {
      super(message || 'Bad Request', 400); // Set default message to 'Bad Request' for 400 status
    }
  }
  
  class NotFoundError extends AppError {
    constructor(message) {
      super(message || 'Not Found', 404); // Set default message to 'Not Found' for 404 status
    }
  }
  
  class UnauthorizedError extends AppError {
    constructor(message) {
      super(message || 'Unauthorized', 401); // Set default message to 'Unauthorized' for 401 status
    }
  }
  
  module.exports = {
    AppError,
    BadRequestError,
    NotFoundError,
    UnauthorizedError,
  };