// models/Post.js

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  files: {
    type: [String],
    required: true,
  },
});

const PostModel = mongoose.model('Post', postSchema);

module.exports = PostModel;
