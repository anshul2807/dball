const Event = require('../models/Event');
const Registration = require('../models/Registration');

// @desc    Get upcoming events (Public)
// @route   GET /api/events/upcoming
// @access  Public
exports.getUpcomingEvents = async (req, res) => {
  try {
    const upcomingEvents = await Event.find({
      status: { $in: ['upcoming', 'ongoing'] },
    }).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: upcomingEvents.length,
      data: upcomingEvents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching upcoming events',
    });
  }
};

// @desc    Get all events with filters (Public / Admin)
// @route   GET /api/events
// @access  Public
exports.getAllEvents = async (req, res) => {
  try {
    const { status, category, search } = req.query;
    let query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { venue: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
      ];
    }

    const events = await Event.find(query).sort({ date: 1 });

    res.status(200).json({
      success: true,
      count: events.length,
      data: events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching events',
    });
  }
};

// @desc    Get single event by ID
// @route   GET /api/events/:id
// @access  Public (with optional user context)
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    let isUserRegistered = false;
    let userRegistration = null;

    if (req.user) {
      userRegistration = await Registration.findOne({
        event: event._id,
        user: req.user.id,
      });
      isUserRegistered = !!userRegistration;
    }

    res.status(200).json({
      success: true,
      data: event,
      isUserRegistered,
      userRegistration,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Server error fetching event details',
    });
  }
};

// @desc    Create new event (Admin only)
// @route   POST /api/events
// @access  Private / Admin
exports.createEvent = async (req, res) => {
  try {
    const eventData = {
      ...req.body,
      createdBy: req.user.id,
    };

    // If rules is passed as a string or comma-separated, normalize to array
    if (typeof eventData.rules === 'string') {
      eventData.rules = eventData.rules
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);
    }

    const event = await Event.create(eventData);

    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error creating event',
    });
  }
};

// @desc    Update an event (Admin only)
// @route   PUT /api/events/:id
// @access  Private / Admin
exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const updateData = { ...req.body };

    // Format rules array if passed as string
    if (typeof updateData.rules === 'string') {
      updateData.rules = updateData.rules
        .split('\n')
        .map((r) => r.trim())
        .filter(Boolean);
    }

    event = await Event.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      message: 'Event updated successfully',
      data: event,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message || 'Error updating event',
    });
  }
};

// @desc    Delete an event (Admin only)
// @route   DELETE /api/events/:id
// @access  Private / Admin
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    // Delete all registrations for this event
    await Registration.deleteMany({ event: event._id });

    // Delete event
    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Event and related registrations removed successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error deleting event',
    });
  }
};

// @desc    Get all registrations for a specific event (Admin only)
// @route   GET /api/events/:id/registrations
// @access  Private / Admin
exports.getEventRegistrations = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found',
      });
    }

    const registrations = await Registration.find({ event: req.params.id })
      .populate('user', 'name email phone college')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: registrations.length,
      event: {
        id: event._id,
        title: event.title,
        date: event.date,
        venue: event.venue,
        maxParticipants: event.maxParticipants,
        registeredCount: event.registeredCount,
      },
      data: registrations,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching event registrations',
    });
  }
};
