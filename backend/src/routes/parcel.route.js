const express = require('express');
const parcelController = require('../controllers/parcel.controller');
const authenticate = require('../middleware/auth.middleware');
const authorize = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');
const { parcelSchema, batchUploadSchema } = require('../utils/validators');
const { ROLES } = require('../config/constants');

const router = express.Router();

router.post(
  '/route',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.OPERATOR),
  validate(parcelSchema),
  parcelController.routeSingleParcel
);

router.post(
  '/upload',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.OPERATOR),
  validate(batchUploadSchema),
  parcelController.uploadBatchParcels
);

router.get(
  '/history',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.OPERATOR),
  parcelController.getRoutingHistory
);

module.exports = router;
