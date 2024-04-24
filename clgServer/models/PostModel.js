// models/PostModel.js

const mongoose = require('mongoose');

const UploadSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  base64Data: {
    type: [String],
    required: true,
  },
  fileTypes: {
    type: [String], // Adjust the data type according to your requirements
    required: true,
  },
});

const UploadModel = mongoose.model('Upload', UploadSchema);

module.exports = UploadModel;
