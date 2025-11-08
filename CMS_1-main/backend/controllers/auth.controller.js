const { Faculty } = require('../models/faculty.model');
const Student = require('../models/student.model');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.registerFaculty = async (req, res) => {
  try {
    const { firstName, lastName, email, password, designation } = req.body;
    let user = await Faculty.findOne({ email });
    if (user) return res.status(400).json({ message: 'Faculty already exists' });
    user = new Faculty({ firstName, lastName, email, password, designation });
  await user.save();
  // created
  res.status(201).json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginFaculty = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Faculty.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    const token = jwt.sign({ userId: user._id, designation: user.designation }, process.env.JWT_SECRET || 'secret123', { expiresIn: '6h' });
    const sanitized = { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, designation: user.designation };
    res.json({ success: true, data: { token, user: sanitized } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.registerStudent = async (req, res) => {
  try {
    const { rollNo, firstName, lastName, email, password } = req.body;
    let user = await Student.findOne({ email });
    if (user) return res.status(400).json({ message: 'Student already exists' });
    user = new Student({ rollNo, firstName, lastName, email, password });
  await user.save();
  // created
  res.status(201).json({ success: true, data: user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.loginStudent = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Student.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.password) {
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user._id, role: 'student' }, process.env.JWT_SECRET || 'secret123', { expiresIn: '6h' });
    const sanitized = { _id: user._id, firstName: user.firstName, lastName: user.lastName, email: user.email, hostelStudentId: user.hostelStudentId };
    res.json({ success: true, data: { token, user: sanitized } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
