const express = require('express');
const router = express.Router();
const {
  registerForEvent,
  getMyRegistrations,
  cancelRegistration,
  getAllRegistrations,
  updateRegistrationStatus,
} = require('../controllers/registrationController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// Normal users & Admins can register and see their own registrations
router.post('/', protect, registerForEvent);
router.get('/my', protect, getMyRegistrations);
router.delete('/:id', protect, cancelRegistration);

// Admin only routes
router.get('/', protect, authorizeRoles('Admin'), getAllRegistrations);
router.patch(
  '/:id/status',
  protect,
  authorizeRoles('Admin'),
  updateRegistrationStatus
);

module.exports = router;
