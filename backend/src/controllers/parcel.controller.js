const { parcelModel } = require('../models/post.model');
const { routeParcel } = require('../services/routing.service');
const logger = require('../utils/logger');

async function routeSingleParcel(req, res) {
  const { weight, value, destinationCountry } = req.body;
  const userId = req.user.id;

  try {
    const routingDecision = routeParcel({ weight, value, destinationCountry });

    const parcel = await parcelModel.create({
      weight,
      value,
      destinationCountry,
      department: routingDecision.department,
      insuranceRequired: routingDecision.insuranceRequired,
      routingReason: routingDecision.reason,
      routedBy: userId,
    });

    logger.info('Parcel routed successfully', { 
      parcelId: parcel._id, 
      userId, 
      department: routingDecision.department 
    });

    return res.status(200).json({
      message: 'Parcel routed successfully',
      parcel: {
        id: parcel._id,
        weight: parcel.weight,
        value: parcel.value,
        destinationCountry: parcel.destinationCountry,
        department: parcel.department,
        insuranceRequired: parcel.insuranceRequired,
        routingReason: parcel.routingReason,
        createdAt: parcel.createdAt,
      },
    });
  } catch (error) {
    logger.error('Parcel routing error', { error: error.message, userId });
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

async function uploadBatchParcels(req, res) {
  const { parcels } = req.body;
  const userId = req.user.id;

  try {
    const results = {
      processed: parcels.length,
      successful: 0,
      failed: 0,
      details: [],
    };

    for (const parcelData of parcels) {
      try {
        const routingDecision = routeParcel(parcelData);

        const parcel = await parcelModel.create({
          weight: parcelData.weight,
          value: parcelData.value,
          destinationCountry: parcelData.destinationCountry,
          department: routingDecision.department,
          insuranceRequired: routingDecision.insuranceRequired,
          routingReason: routingDecision.reason,
          routedBy: userId,
        });

        results.successful++;
        results.details.push({
          index: results.details.length,
          status: 'success',
          parcelId: parcel._id,
          department: parcel.department,
        });
      } catch (error) {
        results.failed++;
        results.details.push({
          index: results.details.length,
          status: 'failed',
          error: error.message,
        });
      }
    }

    logger.info('Batch upload completed', { 
      userId, 
      processed: results.processed,
      successful: results.successful,
      failed: results.failed 
    });

    return res.status(200).json({
      message: 'Batch upload completed',
      summary: results,
    });
  } catch (error) {
    logger.error('Batch upload error', { error: error.message, userId });
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

async function getRoutingHistory(req, res) {
  const userId = req.user.id;
  const userRole = req.user.role;

  try {
    const filter = userRole === 'admin' ? {} : { routedBy: userId };
    const history = await parcelModel.find(filter).sort({ createdAt: -1 }).limit(100);

    logger.info('Routing history retrieved', { userId, count: history.length });

    return res.status(200).json({
      message: 'Routing history retrieved successfully',
      history: history.map((parcel) => ({
        id: parcel._id,
        weight: parcel.weight,
        value: parcel.value,
        destinationCountry: parcel.destinationCountry,
        department: parcel.department,
        insuranceRequired: parcel.insuranceRequired,
        routingReason: parcel.routingReason,
        createdAt: parcel.createdAt,
      })),
    });
  } catch (error) {
    logger.error('Routing history retrieval error', { error: error.message, userId });
    return res.status(500).json({
      message: 'Internal server error',
    });
  }
}

module.exports = {
  routeSingleParcel,
  uploadBatchParcels,
  getRoutingHistory,
};
