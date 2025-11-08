const mongoose = require("mongoose");

const hostelStudentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  rollNo: { type: String, required: true, unique: true },
  roomNumber: { type: String },
  branch: { type: String },
  year: { type: Number },
  email: { type: String, required: true },
  phone: { type: String },
});

module.exports = mongoose.model("HostelStudent", hostelStudentSchema);
