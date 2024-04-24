const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    maxlength: 80,
  },
  date: {
    type: String, // Change the type to String
    required: true,
  },
  color: {
    type: String,
    enum: ['blue', 'red', 'green'],
    required: true,
  },
});

// Add a pre-save hook to format the date before saving
eventSchema.pre('save', function (next) {
  // Format the date to the desired format
  this.date = new Date(this.date).toISOString().split('T')[0];
  next();
});

const EventModel = mongoose.model('Event', eventSchema);

module.exports = EventModel;