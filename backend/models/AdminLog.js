const mongoose = require('mongoose');

const AdminLogSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  action: {
    type: String,
    required: true,
    enum: ['user_suspend', 'user_unsuspend', 'user_delete', 'report_resolve', 'group_moderate', 'content_remove', 'warning_issued']
  },
  targetUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  targetGroupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Chat',
    default: null
  },
  reason: {
    type: String,
    default: ''
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['success', 'failed'],
    default: 'success'
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

AdminLogSchema.index({ adminId: 1, timestamp: -1 });
AdminLogSchema.index({ targetUserId: 1 });
AdminLogSchema.index({ action: 1 });

module.exports = mongoose.model('AdminLog', AdminLogSchema);
