const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { v4: uuidv4 } = require('uuid');
const QRCode = require('qrcode');

router.get('/qr', authenticateToken, async (req, res) => {
  try {
    const QRCodeModel = require('../models/QRCode');
    let qrCode = await QRCodeModel.findOne({ userId: req.user.id });
    
    if (!qrCode) {
      const profileId = uuidv4();
      const qrData = `https://timebook.app/u/${profileId}`;
      qrCode = new QRCodeModel({
        userId: req.user.id,
        profileId,
        qrData
      });
      await qrCode.save();
    }
    
    const qrImage = await QRCode.toDataURL(qrCode.qrData);
    res.json({
      success: true,
      qrCode: qrCode.qrData,
      qrImage,
      profileId: qrCode.profileId
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error generating QR code' });
  }
});

router.post('/scan', authenticateToken, async (req, res) => {
  try {
    const { profileId } = req.body;
    const QRCodeModel = require('../models/QRCode');
    const User = require('../models/User');
    
    const qrCode = await QRCodeModel.findOne({ profileId });
    if (!qrCode) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }
    
    const profile = await User.findById(qrCode.userId).select('-passwordHash');
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Error scanning QR code' });
  }
});

module.exports = router;
