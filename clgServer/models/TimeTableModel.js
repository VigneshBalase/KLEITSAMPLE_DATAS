const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
  },
  time: {
    type: String,
    required: true,
  },
  period: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  moduleno: {
    type: String,
    required: true,
  },
  description: String,
  color: String,
});

const lightThemeColors = [
  '#F5F5F5',
  '#F0F8FF',
  '#FAFAD2',
  '#FFE4B5',
  '#98FB98',
  '#FFDAB9',
  '#E6E6FA',
  '#FFFAF0',
  '#D3D3D3',
  '#C0C0C0',
];

timetableSchema.pre('save', function (next) {
  const randomColor = lightThemeColors[Math.floor(Math.random() * lightThemeColors.length)];
  this.color = randomColor;
  next();
});

const TimeTableModel = mongoose.model('Timetable', timetableSchema);

module.exports = TimeTableModel;
