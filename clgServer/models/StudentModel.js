// models/StudentModel.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  batchName: String,
  branch: String,
  semester: String,
  year: String,
  students: [
    {
      USN: String,
      firstName: String,
      fatherName: String,
      lastName: String,
      gender: String,
      emailId: String,
      mobileNumber: String,
      dob: String,
    },
  ],
});

const StudentModel = mongoose.model('Student', studentSchema);

module.exports = StudentModel;
