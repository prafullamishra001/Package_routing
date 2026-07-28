const logger = require('../utils/logger');
const alerting = require('../utils/alerting');

const errorHandler = (err, req, res, next) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err.name === 'MongoError' || err.name === 'MongooseError') {
    alerting.alertDatabaseConnectionFailure();
  }

  if (process.env.NODE_ENV === 'production') {
    return res.status(500).json({
      message: 'Internal server error',
    });
  }

  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
};

const notFoundHandler = (req, res) => {
  logger.warn('Route not found', { path: req.path, method: req.method });
  res.status(404).json({
    message: 'Route not found',
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
};
