const { ROLES } = require('../config/constants');
const logger = require('../utils/logger');

const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn('Authorization failed: No user in request');
      return res.status(401).json({ message: 'Unauthorized: No user authenticated' });
    }

    const userRole = req.user.role || 'operator';

    if (!allowedRoles.includes(userRole)) {
      logger.warn('Authorization failed: Insufficient permissions', {
        userRole,
        requiredRoles: allowedRoles,
      });
      return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
    }

    next();
  };
};

module.exports = authorize;
