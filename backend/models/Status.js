const mongoose = require('mongoose');

const StatusSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    default: ''
  },
  mediaUrl: {
    type: String,
    default: null
  },
  mediaType: {
    type: String,
    enum: ['text', 'photo', 'video', 'voice'],
    default: 'text'
  },
  privacyLevel: {
    type: String,
    enum: ['everyone', 'contacts', 'nobody'],
    default: 'everyone'
  },
  viewers: [{
    userId: mongoose.Schema.Types.ObjectId,
    viewedAt: { type: Date, default: Date.now }
  }],
  anonymousViews: {
    type: Number,
    default: 0
  },
  replies: [{
    userId: mongoose.Schema.Types.ObjectId,
    message: String,
    replyAt: { type: Date, default: Date.now }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    default: () => new Date(Date.now() + 24 * 60 * 60 * 1000)
  }
});

StatusSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('Status', StatusSchema);
