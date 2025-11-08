const express = require('express');
const router = express.Router();
const verifyJWT = require('../middleware/verifyJWT');
const HostelStudent = require('../../models/HostelStudent');

router.get('/admin/students', verifyJWT, async (req, res) => {
  try {
    if (!(req.user && req.user.role === 'faculty' && req.user.designation === 'hostel_admin'))
      return res.status(403).json({ message: 'Forbidden' });
    const students = await HostelStudent.find({}).limit(100).lean();
    res.json(students);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
module.exports = router;
