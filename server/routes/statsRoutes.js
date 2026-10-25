const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getPublicStats,
} = require('../controllers/statsController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

router.get('/public', getPublicStats);
router.get('/admin', protect, authorizeRoles('Admin'), getAdminStats);

module.exports = router;
