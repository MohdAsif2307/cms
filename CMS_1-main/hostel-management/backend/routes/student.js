const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const HostelStudent = require('../../models/HostelStudent');

router.get('/student/:studentId', verifyJWT, async (req, res) => {
  try {
    const student = await HostelStudent.findOne({ studentId: req.params.studentId });
    if (!student) return res.status(404).json({ message: 'Not found' });
    res.json({ hostelName: student.hostelName, roomNumber: student.roomNumber, warden: student.warden, status: student.status });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
