const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const cors = require('cors');

const app = express();
const port = 8001;

// Connect to MongoDB Atlas
mongoose.connect('mongodb+srv://KLE:12345@atlascluster.21rtrcd.mongodb.net/your_database', { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware
app.use(express.json());
app.use(cors());

// Create a Mongoose model and schema (assuming you already have UploadModel from the previous example)
const UploadModel = require('./models/PostModel');

// Multer configuration for handling file uploads
const storage = multer.memoryStorage(); // Store files in memory
const upload = multer({ storage: storage });

// Routes
app.post('/upload', upload.array('files'), async (req, res) => {
  try {
    // Extract title, description, and file types from the request body
    const { title, description, fileTypes } = req.body;

    // Extract Base64 data from uploaded files
    const base64DataArray = req.files.map((file, index) => ({
      data: file.buffer.toString('base64'),
      type: fileTypes[index], // Add this line to get file types
    }));

    // Create a new document
    const newUpload = new UploadModel({
      title: title,
      description: description,
      base64Data: base64DataArray.map(file => file.data),
      fileTypes: base64DataArray.map(file => file.type), // Add this line to save file types
    });

    // Save the document to the database
    const savedUpload = await newUpload.save();

    res.status(201).json(savedUpload);
  } catch (error) {
    console.error('Error uploading:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/uploads', async (req, res) => {
  try {
    // Retrieve all documents from the collection
    const allUploads = await UploadModel.find();

    res.status(200).json(allUploads);
  } catch (error) {
    console.error('Error retrieving uploads:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});

// MongoDB connection events
mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
