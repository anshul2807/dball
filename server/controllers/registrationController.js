const Registration = require('../models/Registration');
const Event = require('../models/Event');
const crypto = require('crypto');

// Generate unique ticket code
const generateTicketCode = () => {
  const randomStr = crypto.randomBytes(3).toString('hex').toUpperCase();
  const timestamp = Date.now().toString().slice(-4);
  return `DBALL-2026-${randomStr}-${timestamp}`;
};

// @desc    Register for an event
// @route   POST /api/registrations
// @access  Private (NormalUser or Admin)
exports.registerForEvent = async (req, res) => {
  try {
    const {
      eventId,
      teamName,
      captainName,
      collegeName,
      contactPhone,
      contactEmail,
      teamMembers,
      notes,
    } = req.body;

    if (!eventId) {
      return res.status(400).json({
        success: false,
        message: 'Event ID is required',
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    if (event.status === 'completed' || event.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        message: `Cannot register: Event is already ${event.status}`,
      });
    }

    // Check if user already registered
    const existingReg = await Registration.findOne({
      event: eventId,
      user: req.user.id,
    });

    if (existingReg) {
      return res.status(400).json({
        success: false,
        message: 'You have already registered for this event',
        ticketCode: existingReg.ticketCode,
      });
    }

    // Check if slots are full
    if (event.registeredCount >= event.maxParticipants) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, this event has reached full capacity!',
      });
    }

    const ticketCode = generateTicketCode();

    const registration = await Registration.create({
      event: eventId,
      user: req.user.id,
      teamName: teamName || `${req.user.name}'s Team`,
      captainName: captainName || req.user.name,
      collegeName: collegeName || req.user.college || 'Delhi University',
      contactPhone: contactPhone || req.user.phone || '9999999999',
      contactEmail: contactEmail || req.user.email,
      teamMembers: Array.isArray(teamMembers) ? teamMembers : [],
      notes: notes || '',
      ticketCode,
      status: 'confirmed',
    });

    // Increment registeredCount on the event
    await Event.findByIdAndUpdate(eventId, {
      $inc: { registeredCount: 1 },
    });

    const populatedReg = await Registration.findById(registration._id)
      .populate('event', 'title date venue time category bannerImage location')
      .populate('user', 'name email phone college');

    res.status(201).json({
      success: true,
      message: 'Registration successful! See you on the court!',
      data: populatedReg,
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Error completing registration',
    });
  }
};

// @desc    Get logged in user's registrations
// @route   GET /api/registrations/my
// @access  Private (NormalUser / Admin)
exports.getMyRegistrations = async (req, res) => {
  try {
    const registrations = await Registration.find({ user: req.user.id })
      .populate('event')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching user registrations',
    });
  }
};

// @desc    Cancel user registration
// @route   DELETE /api/registrations/:id
// @access  Private (Owner or Admin)
exports.cancelRegistration = async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id);

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    // Check ownership unless Admin
    if (
      registration.user.toString() !== req.user.id &&
      req.user.role !== 'Admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this registration',
      });
    }

    const eventId = registration.event;

    await registration.deleteOne();

    // Decrement event registeredCount
    await Event.findByIdAndUpdate(eventId, {
      $inc: { registeredCount: -1 },
    });

    res.status(200).json({
      success: true,
      message: 'Registration cancelled successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error cancelling registration',
    });
  }
};

// @desc    Get all registrations (Admin only)
// @route   GET /api/registrations
// @access  Private / Admin
exports.getAllRegistrations = async (req, res) => {
  try {
    const { eventId, status, search } = req.query;
    let query = {};

    if (eventId && eventId !== 'all') {
      query.event = eventId;
    }

    if (status && status !== 'all') {
      query.status = status;
    }

    let registrations = await Registration.find(query)
      .populate('event', 'title date venue category')
      .populate('user', 'name email phone college role')
      .sort({ createdAt: -1 });

    if (search) {
      const s = search.toLowerCase();
      registrations = registrations.filter(
        (reg) =>
          (reg.teamName && reg.teamName.toLowerCase().includes(s)) ||
          (reg.captainName && reg.captainName.toLowerCase().includes(s)) ||
          (reg.collegeName && reg.collegeName.toLowerCase().includes(s)) ||
          (reg.contactEmail && reg.contactEmail.toLowerCase().includes(s)) ||
          (reg.ticketCode && reg.ticketCode.toLowerCase().includes(s)) ||
          (reg.user?.name && reg.user.name.toLowerCase().includes(s))
      );
    }

    res.status(200).json({
      success: true,
      count: registrations.length,
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching registrations',
    });
  }
};

// @desc    Update registration status (Admin only)
// @route   PATCH /api/registrations/:id/status
// @access  Private / Admin
exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['confirmed', 'waitlisted', 'cancelled'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status value',
      });
    }

    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    )
      .populate('event', 'title date venue')
      .populate('user', 'name email');

    if (!registration) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found',
      });
    }

    res.status(200).json({
      success: true,
      message: `Registration status updated to ${status}`,
      data: registration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error updating status',
    });
  }
};
