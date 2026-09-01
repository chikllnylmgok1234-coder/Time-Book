const mongoose = require('mongoose');

const QRCodeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  profileId: {
    type: String,
    unique: true,
    required: true
  },
  qrData: {
    type: String,
    required: true
  },
  qrUrl: {
    type: String,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
  }
});

module.exports = mongoose.model('QRCode', QRCodeSchema);
