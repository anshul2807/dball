const Event = require('../models/Event');
const Registration = require('../models/Registration');
const User = require('../models/User');

// @desc    Get Admin Dashboard Stats
// @route   GET /api/stats/admin
// @access  Private / Admin
exports.getAdminStats = async (req, res) => {
  try {
    const totalEvents = await Event.countDocuments();
    const upcomingEvents = await Event.countDocuments({ status: 'upcoming' });
    const ongoingEvents = await Event.countDocuments({ status: 'ongoing' });
    const completedEvents = await Event.countDocuments({ status: 'completed' });

    const totalRegistrations = await Registration.countDocuments();
    const confirmedRegistrations = await Registration.countDocuments({ status: 'confirmed' });
    const waitlistedRegistrations = await Registration.countDocuments({ status: 'waitlisted' });

    const totalUsers = await User.countDocuments();
    const normalUsers = await User.countDocuments({ role: 'NormalUser' });
    const adminUsers = await User.countDocuments({ role: 'Admin' });

    // Recent registrations
    const recentRegistrations = await Registration.find()
      .populate('event', 'title date venue')
      .populate('user', 'name email college')
      .sort({ createdAt: -1 })
      .limit(5);

    // Event category breakdown
    const categoryStats = await Event.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        events: {
          total: totalEvents,
          upcoming: upcomingEvents,
          ongoing: ongoingEvents,
          completed: completedEvents,
        },
        registrations: {
          total: totalRegistrations,
          confirmed: confirmedRegistrations,
          waitlisted: waitlistedRegistrations,
        },
        users: {
          total: totalUsers,
          normalUsers,
          adminUsers,
        },
        recentRegistrations,
        categoryStats,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching admin stats',
    });
  }
};

// @desc    Get Public Community Stats
// @route   GET /api/stats/public
// @access  Public
exports.getPublicStats = async (req, res) => {
  try {
    const activeEventsCount = await Event.countDocuments({
      status: { $in: ['upcoming', 'ongoing'] },
    });
    const totalRegistrations = await Registration.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        activeEvents: activeEventsCount,
        communityRegistrations: totalRegistrations,
        legacy: {
          seasons: 3,
          teams: '40+',
          liveSpectators: '25,000+',
          digitalReach: '10M+',
          collegesPlanned2026: '12+',
          collegesPlanned2027: '22+',
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching public stats',
    });
  }
};
