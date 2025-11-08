const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  rollNo: { type: String, required: true, unique: true },
  firstName: String,
  lastName: String,
  email: { type: String, unique: true },
  password: String,
  hostelStudentId: { type: String, default: null }
}, { timestamps: true });

module.exports = mongoose.model('Student', StudentSchema);
