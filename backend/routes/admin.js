const express = require('express');
const router = express.Router();
const { authenticateAdmin } = require('../middleware/auth');

router.get('/users', authenticateAdmin, async (req, res) => {
  try {
    const User = require('../models/User');
    const users = await User.find().select('-passwordHash').limit(100);
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching users' });
  }
});

router.post('/suspend-user', authenticateAdmin, async (req, res) => {
  try {
    const { userId, reason, duration } = req.body;
    const User = require('../models/User');
    const AdminLog = require('../models/AdminLog');
    
    const suspendedUntil = new Date(Date.now() + duration * 1000);
    await User.findByIdAndUpdate(userId, { suspendedUntil });
    
    await AdminLog.create({
      adminId: req.admin._id,
      action: 'user_suspend',
      targetUserId: userId,
      reason,
      details: { suspendedUntil },
      ipAddress: req.ip,
      userAgent: req.get('user-agent')
    });
    
    res.json({ success: true, message: 'User suspended' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error suspending user' });
  }
});

router.get('/reports', authenticateAdmin, async (req, res) => {
  try {
    const Report = require('../models/Report');
    const reports = await Report.find().limit(50).sort({ createdAt: -1 });
    res.json({ success: true, reports });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching reports' });
  }
});

router.get('/logs', authenticateAdmin, async (req, res) => {
  try {
    const AdminLog = require('../models/AdminLog');
    const logs = await AdminLog.find()
      .populate('adminId', 'name')
      .populate('targetUserId', 'name')
      .limit(100)
      .sort({ timestamp: -1 });
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error fetching logs' });
  }
});

module.exports = router;
