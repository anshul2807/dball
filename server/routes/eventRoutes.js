const express = require('express');
const router = express.Router();
const {
  getUpcomingEvents,
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent,
  getEventRegistrations,
} = require('../controllers/eventController');
const {
  protect,
  authorizeRoles,
  optionalAuth,
} = require('../middleware/authMiddleware');

router.get('/upcoming', getUpcomingEvents);
router.get('/', getAllEvents);
router.get('/:id', optionalAuth, getEventById);

// Admin only routes
router.post('/', protect, authorizeRoles('Admin'), createEvent);
router.put('/:id', protect, authorizeRoles('Admin'), updateEvent);
router.delete('/:id', protect, authorizeRoles('Admin'), deleteEvent);
router.get(
  '/:id/registrations',
  protect,
  authorizeRoles('Admin'),
  getEventRegistrations
);

module.exports = router;
