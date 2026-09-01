const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, async (req, res) => {
  res.json({ success: true, message: 'Contacts endpoint' });
});

module.exports = router;
