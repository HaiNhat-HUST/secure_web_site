// utils/logger.js
const winston = require('winston');
const { format } = winston;

// Define log format
const logFormat = format.combine(
  format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  format.errors({ stack: true }),
  format.splat(),
  format.json()
);

// Create the logger
const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  format: logFormat,
  defaultMeta: { service: 'job-portal-api' },
  transports: [
    // Write logs to console during development
    new winston.transports.Console({
      format: format.combine(
        format.colorize(),
        format.printf(
          info => `${info.timestamp} ${info.level}: ${info.message}${info.stack ? `\n${info.stack}` : ''}`
        )
      )
    })
  ]
});

// In production, add file transport
if (process.env.NODE_ENV === 'production') {
  logger.add(new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    maxsize: 10485760, // 10MB
    maxFiles: 5,
  }));
  
  logger.add(new winston.transports.File({
    filename: 'logs/combined.log',
    maxsize: 10485760, // 10MB
    maxFiles: 5,
  }));
}

// Sanitize sensitive data before logging
const sanitizeData = (data) => {
  if (!data) return data;
  
  // Deep clone to avoid mutating original data
  const sanitized = JSON.parse(JSON.stringify(data));
  
  // List of fields to redact
  const sensitiveFields = [
    'password', 'token', 'auth', 'authorization', 'cookie',
    'secret', 'credit_card', 'cardNumber', 'cvv', 'ssn'
  ];
  
  // Recursive function to scrub objects
  const scrubObject = (obj) => {
    if (!obj || typeof obj !== 'object') return;
    
    Object.keys(obj).forEach(key => {
      // Check if this is a sensitive field
      if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
        obj[key] = '[REDACTED]';
      } else if (typeof obj[key] === 'object') {
        // Recursively scrub nested objects
        scrubObject(obj[key]);
      }
    });
  };
  
  scrubObject(sanitized);
  return sanitized;
};

// Wrap logger methods to sanitize data
const secureLogger = {
  error: (message, data) => logger.error(message, sanitizeData(data)),
  warn: (message, data) => logger.warn(message, sanitizeData(data)),
  info: (message, data) => logger.info(message, sanitizeData(data)),
  debug: (message, data) => logger.debug(message, sanitizeData(data)),
};

module.exports = secureLogger;