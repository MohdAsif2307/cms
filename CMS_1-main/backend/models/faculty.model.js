const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const DESIGNATIONS = [
  "Principal","Vice Principal","Head of Department (HOD)","Professor",
  "Associate Professor","Assistant Professor","Lecturer","Lab Assistant",
  "Office Administrator","Librarian","Hostel Administrator"
];

const FacultySchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  designation: { type: String, enum: DESIGNATIONS, default: 'Lecturer' },
  profile: { type: String }
}, { timestamps: true });

FacultySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = { Faculty: mongoose.model('Faculty', FacultySchema), DESIGNATIONS };
