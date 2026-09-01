const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
  res.json({ success: true, message: 'Status feed' });
});

router.post('/', authenticateToken, async (req, res) => {
  res.json({ success: true, message: 'Status created' });
});

module.exports = router;
