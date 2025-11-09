const mongoose = require("mongoose");

const hostelStudentSchema = new mongoose.Schema({
  // Optional reference to the CMS student id so SSO can map CMS -> HMS users
  studentId: { type: String, index: true },
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  roomNumber: { type: String },
  branch: { type: String },
  year: { type: Number },
  email: { type: String, required: true },
  phone: { type: String },
  hostelName: { type: String },
  warden: { type: String },
  status: { type: String, enum: ['active','inactive','pending'], default: 'active' },
});

module.exports = mongoose.model("HostelStudent", hostelStudentSchema);
