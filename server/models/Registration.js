const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema(
  {
    event: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    teamName: {
      type: String,
      trim: true,
      default: '',
    },
    captainName: {
      type: String,
      required: [true, 'Captain / Registrant name is required'],
      trim: true,
    },
    collegeName: {
      type: String,
      required: [true, 'College / Institution name is required'],
      trim: true,
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
    },
    teamMembers: [
      {
        name: { type: String, trim: true },
        jerseyNumber: { type: String, trim: true },
        position: { type: String, trim: true },
        phone: { type: String, trim: true },
      },
    ],
    status: {
      type: String,
      enum: ['confirmed', 'waitlisted', 'cancelled'],
      default: 'confirmed',
    },
    ticketCode: {
      type: String,
      unique: true,
      required: true,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate active registration for the same event by the same user
registrationSchema.index({ event: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Registration', registrationSchema);
