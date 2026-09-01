const mongoose = require('mongoose');

const AppVersionSchema = new mongoose.Schema({
  version: {
    type: String,
    required: true,
    unique: true
  },
  buildNumber: {
    type: Number,
    required: true
  },
  releaseDate: {
    type: Date,
    default: Date.now
  },
  minRequiredVersion: {
    type: String,
    default: null
  },
  platform: {
    type: String,
    enum: ['android', 'ios', 'both'],
    default: 'both'
  },
  downloadUrl: {
    type: String,
    required: true
  },
  changeLog: [{
    type: String
  }],
  fileSize: {
    type: Number
  },
  isForceUpdate: {
    type: Boolean,
    default: false
  },
  isOptionalUpdate: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  downloadCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  publishedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('AppVersion', AppVersionSchema);
