const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const xlsx = require('xlsx');

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));

const PORT = 8001;

const PostModel = require('./models/PostModel');
const EventModel = require('./models/EventModel');
const TimeTableModel = require('./models/TimeTableModel');
const StudentModel = require('./models/StudentModel');

mongoose.connect('mongodb+srv://KLE:12345@atlascluster.21rtrcd.mongodb.net/your_database', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", async (req, res) => {
  const { PrintoutColor, PrintoutFormat, PrintoutType, count, file, othertxt, username,filename,printed } = req.body;

  const userfile = new StoredFileModel({
    username,
    PrintoutType,
    PrintoutFormat,
    PrintoutColor,
    othertxt,
    filename,
    count,
    file,
    printed
  });

  const savedFile = await userfile.save();
  const { _id, filename: savedFilename } = savedFile;

  // You can now send back the _id and filename in the response
  res.json({ _id, filename: savedFilename, message: 'Success' });
});

app.get("/api/v1/app/allfiles", async (req, res) => {
  try {
    const result = await StoredFileModel.find({}, { file: 0 }); // Exclude the "file" field
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

app.get("/api/v1/app/dfile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await StoredFileModel.findById(id);
    if (!result) {
      return res.status(404).send("File not found");
    }
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});

app.delete('/api/v1/app/dfile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Find the file by ID and delete it from the database
    await StoredFileModel.findByIdAndDelete(id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.delete('/api/v1/app/deleteAllFiles', async (req, res) => {
  try {
    // Delete all files from the database
    await StoredFileModel.deleteMany({});
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
});



app.delete('/api/v2/app/dfile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // Find the file by ID and delete it from the database
    await StoredFileModel.findByIdAndDelete(id);
    res.sendStatus(200);
  } catch (err) {
    res.status(500).send(err);
  }
});




app.post('/kle/api/admin/Stdent/detail/upload', upload.single('file'), async (req, res) => {
  const { batchName, branch, semester, year } = req.body;
  const fileBuffer = req.file.buffer;
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });

  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  const studentData = xlsx.utils.sheet_to_json(sheet);

  try {
    const batch = await StudentModel.create({
      batchName,
      branch,
      semester,
      year,
      students: studentData.map(student => ({
        USN: student.USN,
        firstName: student['Student First Name'],
        fatherName: student['Student Father Name'],
        lastName: student['Student Last Name'],
        gender: student.Gender,
        emailId: student['Email Id'],
        mobileNumber: student['Mobile Number'],
        dob: student.DOB,
      })),
    });

    res.status(200).json(batch);
  } catch (error) {
    console.error('Error saving data to the database:', error);
    res.status(500).send('Internal Server Error');
  }
});


// GET route to retrieve a specific batch by ID
app.get('/kle/api/admin/Stdent/detail/upload/read', async (req, res) => {
  try {
    const studentData = await StudentModel.find();
    res.status(200).json(studentData);
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).send('Internal Server Error');
  }
});

// DELETE route to delete a specific batch by ID
app.delete('/kle/api/admin/Stdent/detail/upload/:batchId', async (req, res) => {
  const batchId = req.params.batchId;

  try {
    const deletedBatch = await StudentModel.findByIdAndDelete(batchId);
    if (!deletedBatch) {
      return res.status(404).json({ message: 'Batch not found' });
    }
    res.status(200).json({ message: 'Batch deleted successfully' });
  } catch (error) {
    console.error('Error deleting batch by ID:', error);
    res.status(500).send('Internal Server Error');
  }
});





app.get('/kle/api/teacher/posts/read', async (req, res) => {
  try {
    const posts = await PostModel.find();
    res.status(200).json(posts);
    console.log(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/kle/api/teacher/posts/:postId', async (req, res) => {
  try {
    const postId = req.params.postId;
    const deletedPost = await PostModel.findByIdAndDelete(postId);
    if (!deletedPost) {
      return res.status(404).json({ error: 'Post not found' });
    }
    res.status(200).json(deletedPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/kle/api/teacher/events', async (req, res) => {
  try {
    const { title, date, color } = req.body;
    const newEvent = new EventModel({ title, date, color });
    const savedEvent = await newEvent.save();
    console.log(savedEvent);
    res.status(201).json(savedEvent);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/kle/api/teacher/events', async (req, res) => {
  try {
    const events = await EventModel.find();
    res.status(200).json(events);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
 
app.delete('/kle/api/teacher/events/:eventId', async (req, res) => {
  const { eventId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(eventId)) {
      return res.status(400).json({ message: 'Invalid Event ID' });
    }

    const deletedEvent = await EventModel.findByIdAndDelete(eventId);

    if (!deletedEvent) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ message: 'Event deleted successfully', deletedEvent });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.post('/api/teacher/timetable', async (req, res) => {
  try {
    const newEntry = new TimeTableModel(req.body);
    await newEntry.save();
    res.status(201).json(newEntry);
    console.log(newEntry);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/teacher/timetable', async (req, res) => {
  try {
    const timetableEntries = await TimeTableModel.find();
    res.status(200).json(timetableEntries);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.delete('/api/teacher/timetable/:id', async (req, res) => {
  try {
    const deletedEntry = await TimeTableModel.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedEntry);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});




app.post('/mailsent',async(req,res) => {

  const usermail = req.body.usn;
  console.log(usermail);

  var randomNum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
  console.log(randomNum); // Print the generated OTP
  
  const mailDetails = {
    from: 'johnsonnaidu03@gmail.com', // Replace with the sender's email address
    to: usermail, // Replace with the recipient's email address
    subject: 'Your OTP for Login',
    html: `<p>Dear User,</p>
    <p>Thank you for using our service. As requested, here is your One-Time Password:</p>
    <h2><strong>${randomNum}</strong></h2>
    <p>Please use this OTP within the specified time limit to complete your authentication or transaction. Do not share this OTP with anyone, as it is valid for a single use only.</p>
    <p>If you did not request this OTP or have any concerns, please contact our support team immediately.</p>
    <p>Thank you,</p>
    <p>KLEIT STUDENT CENTER</p>`
  };
  
  //send email
  transporter.sendMail(mailDetails, async(error, info) => {
    if (error) {
      res.status(400).send('Something went wrong'); // Log any error that occurs during sending the email
    } else {
      // console.log('Email sent:', info.response); // Log the response indicating the successful email delivery
      
  const mailuser = new UsermailModel({ usermail: usermail, randomNum:randomNum });
  await mailuser.save();
  res.status(200).send('Email sent successfully');
    }
  });

  });


  app.post('/validmail',async(req,res) => {

    const usermail = "johnsonnaidu03@gmail.com"
    console.log(usermail);
  
    var randomNum = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    console.log(randomNum); // Print the generated OTP
    
    const mailDetails = {
      from: 'johnsonnaidu03@gmail.com', // Replace with the sender's email address
      to: usermail, // Replace with the recipient's email address
      subject: 'Your OTP for Login',
      html: `<p>Dear User,</p>
      <p>Thank you for using our service. As requested, here is your One-Time Password:</p>
      <h2><strong>${randomNum}</strong></h2>
      <p>Please use this OTP within the specified time limit to complete your authentication or transaction. Do not share this OTP with anyone, as it is valid for a single use only.</p>
      <p>If you did not request this OTP or have any concerns, please contact our support team immediately.</p>
      <p>Thank you,</p>
      <p>KLEIT STUDENT CENTER</p>`
    };
    
    //send email
    transporter.sendMail(mailDetails, async(error, info) => {
      if (error) {
        res.status(400).send('Something went wrong'); // Log any error that occurs during sending the email
      } else {
        // console.log('Email sent:', info.response); // Log the response indicating the successful email delivery
        
    const mailuser = new UsermailModel({ usermail: usermail, randomNum:randomNum });
    await mailuser.save();
    res.status(200).send('OTP sent successfully');
      }
    });
  
    });
  

  app.post('/otpreceive',async(req,res) => {
  
  const usermail = req.body.usermail+'@kleit.ac.in';
  const crandomNum = req.body.crandomNum;

  if (usermail && crandomNum) {
    
  const users = await UsermailModel.find({ usermail: usermail, randomNum: crandomNum });

  if (users.length > 0) {
    res.sendStatus(200);
  } 
  else{
    res.sendStatus(404);
  }
} else{
    res.sendStatus(400);
  }
});



app.post('/validotp',async(req,res) => {
  
  const usermail = req.body.usermail;
  const crandomNum = req.body.crandomNum;

  if (usermail && crandomNum) {
    
  const users = await UsermailModel.find({ usermail: usermail, randomNum: crandomNum });

  if (users.length > 0) {
    res.sendStatus(200);
  } 
  else{
    res.sendStatus(404);
  }
} else{
    res.sendStatus(400);
  }
});
  

app.get("/getstatus", async (req, res) => {
  try {
    const result = await ToggleswitchModel.find();
    if (!result) {
      return res.status(404).send("Data not found");
    }
    res.send(result);
  } catch (err) {
    res.send(err);
  }
});


app.post("/api/v4/app/dfile/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await StoredFileModel.findById(id);

    if (!result) {
      return res.status(404).send("Data not found");
    }
    console.log(result.printed)
    result.printed = true;
    console.log(result.printed)
    await result.save();

    console.log(result); // Log the updated document with the "printed" field set to true

    res.status(200).send("File updated successfully");
  } catch (err) {
    res.status(500).send(err);
  }
});


app.get('/api/v5/app/dfile/:notificationid', async (req, res) => {
  try {
    const notificationid = req.params.notificationid;
    console.log(req.params)

    
  } catch (error) {
    console.error(`Error sending notification for ID: ${notificationid}`, error);
    res.sendStatus(500); // Send an error response to the client
  }
});

app.get("/hello", async (req,res) => {

  console.log("HELLO")
  
  // storeusersinfo()
  res.send("HELLO");
  })
    
  
  app.post("/api/v1/addUser", async (req,res) => {
  
      const usn = req.body.usn;
      const code = req.body.code;
  
      const user = new UserModel({ usn: usn, code: code});
      await user.save();
      res.send('Success');
  
  })

// Error handler middleware

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});