const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'devsecret';

router.post('/register', async (req,res) => {
  const { name, email, password, role } = req.body;
  if(!email || !password || !name) return res.status(400).json({message:'Missing fields'});
  const existing = await User.findOne({email});
  if(existing) return res.status(400).json({message:'Email exists'});
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, passwordHash: hash, role: role || 'student' });
  res.status(201).json({ id: user._id, email: user.email });
});

router.post('/login', async (req,res) => {
  const { email, password } = req.body;
  if(!email || !password) return res.status(400).json({message:'Missing'});
  const user = await User.findOne({email});
  if(!user) return res.status(400).json({message:'Invalid'});
  const ok = await bcrypt.compare(password, user.passwordHash);
  if(!ok) return res.status(400).json({message:'Invalid'});
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, user: { id:user._id, name: user.name, role: user.role }});
});

// GET /api/auth/me - return current user based on Authorization header or hms_token cookie
router.get('/me', (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    const cookieHeader = req.headers.cookie || '';
    let token = null;
    if (auth.startsWith('Bearer ')) token = auth.split(' ')[1];
    else if (cookieHeader) {
      const match = cookieHeader.split(';').map(s=>s.trim()).find(s=>s.startsWith('hms_token='));
      if (match) token = match.split('=')[1];
    }
    if (!token) return res.status(401).json({ message: 'Not authenticated' });
    const jwt = require('jsonwebtoken');
    const secret = process.env.JWT_SECRET || process.env.HMS_JWT_SECRET || 'hms_default_secret';
    const payload = jwt.verify(token, secret);
    return res.json({ user: { id: payload.id || null, role: payload.role || 'student' } });
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

module.exports = router;
