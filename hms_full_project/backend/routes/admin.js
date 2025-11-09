const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const HostelStudent = require('../models/HostelStudent');

router.get('/students', verifyJWT, async (req, res) => {
  try {
    // allow faculty members whose designation indicates hostel administration
    const des = req.user && req.user.designation ? String(req.user.designation).toLowerCase() : '';
    const isHostelAdmin = req.user && req.user.role === 'faculty' && des.includes('hostel') && (des.includes('admin') || des.includes('administrator'));
    if (!isHostelAdmin) return res.status(403).json({ message: 'Forbidden' });
    const students = await HostelStudent.find({}).limit(100).lean();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
