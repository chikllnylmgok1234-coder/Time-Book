const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  reporterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reportedUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  reportedMessageId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
    default: null
  },
  reportedGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    default: null
  },
  reason: {
    type: String,
    enum: ['spam', 'harassment', 'fake_account', 'inappropriate_content', 'abuse', 'scam', 'other'],
    required: true
  },
  description: {
    type: String,
    default: ''
  },
  evidence: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['new', 'under_review', 'resolved', 'rejected'],
    default: 'new'
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  resolution: {
    type: String,
    default: ''
  },
  resolvedAt: {
    type: Date,
    default: null
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

ReportSchema.index({ reporterId: 1, createdAt: -1 });
ReportSchema.index({ status: 1 });

module.exports = mongoose.model('Report', ReportSchema);
