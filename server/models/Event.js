const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add an event title'],
      trim: true,
    },
    subtitle: {
      type: String,
      default: '',
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add an event description'],
    },
    category: {
      type: String,
      required: true,
      enum: [
        'Inter-College Championship',
        'Pan-City League',
        'Slam Dunk Contest',
        '3-Point Battle',
        'All-Star Weekend',
        'Grassroots Camp',
        'Skill Challenge',
      ],
      default: 'Inter-College Championship',
    },
    date: {
      type: Date,
      required: [true, 'Please provide the event date'],
    },
    time: {
      type: String,
      default: '10:00 AM - 6:00 PM',
    },
    venue: {
      type: String,
      required: [true, 'Please provide the venue name'],
    },
    location: {
      type: String,
      default: 'Delhi, India',
    },
    entryFee: {
      type: Number,
      default: 0,
    },
    prizePool: {
      type: String,
      default: 'Trophy, Medals & Certificates',
    },
    maxParticipants: {
      type: Number,
      default: 16,
    },
    registeredCount: {
      type: Number,
      default: 0,
    },
    teamType: {
      type: String,
      enum: ['Team (5v5)', 'Team (3v3)', 'Individual (1v1)', 'Solo Participant'],
      default: 'Team (5v5)',
    },
    minTeamMembers: {
      type: Number,
      default: 5,
    },
    maxTeamMembers: {
      type: Number,
      default: 12,
    },
    rules: {
      type: [String],
      default: [],
    },
    eligibility: {
      type: String,
      default: 'Open to college students & youth athletes aged 16-28 with valid ID.',
    },
    bannerImage: {
      type: String,
      default: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=1200&q=80',
    },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Virtual for spots left
eventSchema.virtual('spotsLeft').get(function () {
  return Math.max(0, this.maxParticipants - this.registeredCount);
});

// Enable virtuals in JSON
eventSchema.set('toJSON', { virtuals: true });
eventSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Event', eventSchema);
