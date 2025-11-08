const express = require('express');
const router = express.Router();
const EntryExit = require('../models/EntryExit');
const { requireAuth, requireRole } = require('../middleware/auth');

// STUDENT: mark entry/exit
router.post('/', requireAuth, async (req, res) => {
  if (req.user.role === 'admin')
    return res.status(403).json({ message: 'Admins cannot mark entry/exit' });

  const { type, lat, lng } = req.body;
  const entry = await EntryExit.create({
    student: req.user._id,
    type,
    location: { lat, lng },
  });
  res.status(201).json(entry);
});

// STUDENT: view personal history
router.get('/me', requireAuth, async (req, res) => {
  const entries = await EntryExit.find({ student: req.user._id })
    .sort({ timestamp: -1 })
    .limit(50);
  res.json(entries);
});

// ADMIN: view all students' entries
router.get('/all', requireAuth, requireRole('admin'), async (req, res) => {
  const { type, start, end } = req.query;
  const filter = {};
  if (type) filter.type = type;
  if (start && end)
    filter.timestamp = { $gte: new Date(start), $lte: new Date(end) };

  const data = await EntryExit.find(filter)
    .populate('student', 'name email')
    .sort({ timestamp: -1 });
  res.json(data);
});

module.exports = router;
