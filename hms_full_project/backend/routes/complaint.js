const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { requireAuth, requireRole } = require('../middleware/auth');

// STUDENT: create complaint
router.post('/', requireAuth, async (req, res) => {
  const { title, description } = req.body;
  const c = await Complaint.create({
    student: req.user._id,
    title,
    description,
  });
  res.status(201).json(c);
});

// STUDENT: view own complaints
router.get('/mine', requireAuth, async (req, res) => {
  const list = await Complaint.find({ student: req.user._id }).sort({ createdAt: -1 });
  res.json(list);
});

// ADMIN: view all complaints
router.get('/all', requireAuth, requireRole('admin'), async (req, res) => {
  const list = await Complaint.find()
    .populate('student', 'name email')
    .sort({ createdAt: -1 });
  res.json(list);
});

// ADMIN: update complaint status
router.put('/:id/status', requireAuth, requireRole('admin'), async (req, res) => {
  const { status, adminComment } = req.body;
  const allowed = ['pending', 'sorted', 'rejected'];
  if (!allowed.includes(status))
    return res.status(400).json({ message: 'Invalid status' });
  const c = await Complaint.findByIdAndUpdate(
    req.params.id,
    { status, adminComment },
    { new: true }
  );
  res.json(c);
});

module.exports = router;
