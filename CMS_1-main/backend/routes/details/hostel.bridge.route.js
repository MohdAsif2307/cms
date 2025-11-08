const express = require('express');
const router = express.Router();
const axios = require('axios');
const Student = require('../../models/student.model');

const HMS_API_URL = process.env.HMS_API_URL || 'http://localhost:5001';

router.get('/student-details/:studentId', async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId).lean();
    if (!student) return res.status(404).json({ message: 'Student not found' });
    if (!student.hostelStudentId) return res.status(404).json({ message: 'Not linked to HMS' });
    const resp = await axios.get(`${HMS_API_URL}/api/hms/students/${student.hostelStudentId}`);
    return res.json(resp.data);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching hostel data' });
  }
});

module.exports = router;
