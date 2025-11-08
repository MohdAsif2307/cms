const express = require('express');
const router = express.Router();
const Notice = require('../models/Notice');
const { requireAuth, requireRole } = require('../middleware/auth');

// ADMIN: create a new notice
router.post('/', requireAuth, requireRole('admin'), async (req, res) => {
  const { title, body } = req.body;
  if (!title || !body)
    return res.status(400).json({ message: 'Title and body required' });
  const n = await Notice.create({
    title,
    body,
    author: req.user._id,
    visibleTo: 'all',
  });
  res.status(201).json(n);
});

// ADMIN: view all notices
router.get('/all', requireAuth, requireRole('admin'), async (req, res) => {
  const list = await Notice.find().populate('author', 'name email role');
  res.json(list);
});

// STUDENT: view notices (everyone sees same list)
router.get('/', requireAuth, async (req, res) => {
  const list = await Notice.find().sort({ postedAt: -1 });
  res.json(list);
});

module.exports = router;
