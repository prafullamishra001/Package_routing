const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  email: {
    type: String,
    unique: true,
  },
  password: String,
  role: {
    type: String,
    enum: ['admin', 'operator'],
    default: 'operator',
  },
});

const parcelSchema = new mongoose.Schema({
  weight: {
    type: Number,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  destinationCountry: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  insuranceRequired: {
    type: Boolean,
    required: true,
  },
  routingReason: {
    type: [String],
    required: true,
  },
  routedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
}, {
  timestamps: true,
});

const userModel = mongoose.model('user', userSchema);
const parcelModel = mongoose.model('parcel', parcelSchema);

module.exports = {
  userModel,
  parcelModel,
};