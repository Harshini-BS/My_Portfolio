const express = require('express');
const router = express.Router();
const { analyticsController } = require('../controller/controllers');
const { protect } = require('../middleware/auth');

// Public - track visit
router.post('/track', analyticsController.trackVisit);

// Public - get total visitor count only (no sensitive data)
router.get('/visitors', async (req, res) => {
  try {
    const { Analytics } = require('../models/index');
    const analytics = await Analytics.find();
    const totalVisitors = analytics.reduce((sum, a) => sum + a.visitors, 0);
    res.json({ success: true, totalVisitors });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Protected - full stats for admin dashboard
router.get('/stats', protect, analyticsController.getStats);

module.exports = router;