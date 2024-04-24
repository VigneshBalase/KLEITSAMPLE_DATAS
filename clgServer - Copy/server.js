// server.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 8001;

// MongoDB Connection
mongoose.connect('mongodb+srv://KLE:12345@atlascluster.21rtrcd.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

// Define the Post model and other necessary models
const Post = require('./models/PostModel');

// Routes

// POST: Create a new post
app.post('/api/posts', async (req, res) => {
  try {
    const { title, description, files } = req.body;

    // Create a new post
    const newPost = new Post({
      title,
      description,
      files,
    });

    // Save the post to the database
    await newPost.save();

    res.status(201).json({ message: 'Post created successfully', post: newPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET: Retrieve all posts
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await Post.find();
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// DELETE: Delete a post by ID
app.delete('/api/posts/:postId', async (req, res) => {
  try {
    const { postId } = req.params;

    // Find and delete the post by ID
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }

    res.status(200).json({ message: 'Post deleted successfully', post: deletedPost });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
