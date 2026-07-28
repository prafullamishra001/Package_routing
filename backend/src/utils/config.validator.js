const logger = require('./logger');

const validateConfig = () => {
  const errors = [];

  // Validate weight limits (optional - only validate if set)
  if (process.env.MAIL_MAX_KG && (isNaN(process.env.MAIL_MAX_KG) || process.env.MAIL_MAX_KG <= 0)) {
    errors.push('MAIL_MAX_KG must be a positive number');
  }

  if (process.env.REGULAR_MAX_KG && (isNaN(process.env.REGULAR_MAX_KG) || process.env.REGULAR_MAX_KG <= 0)) {
    errors.push('REGULAR_MAX_KG must be a positive number');
  }

  // Validate weight limit hierarchy (only if both are set)
  if (process.env.MAIL_MAX_KG && process.env.REGULAR_MAX_KG) {
    if (parseFloat(process.env.MAIL_MAX_KG) >= parseFloat(process.env.REGULAR_MAX_KG)) {
      errors.push('MAIL_MAX_KG must be less than REGULAR_MAX_KG');
    }
  }

  // Validate value threshold (optional - only validate if set)
  if (process.env.VALUE_THRESHOLD_EUR && (isNaN(process.env.VALUE_THRESHOLD_EUR) || process.env.VALUE_THRESHOLD_EUR <= 0)) {
    errors.push('VALUE_THRESHOLD_EUR must be a positive number');
  }

  // Validate JWT secret (required)
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET must be at least 32 characters long');
  }

  // Validate MongoDB URI (required)
  if (!process.env.MONGO_URI) {
    errors.push('MONGO_URI is required');
  }

  if (errors.length > 0) {
    logger.error('Configuration validation failed', { errors });
    throw new Error(`Invalid configuration: ${errors.join(', ')}`);
  }

  logger.info('Configuration validation passed');
  return true;
};

module.exports = { validateConfig };
