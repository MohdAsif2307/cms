const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../../models/User'); // adjust path as needed

// POST /api/auth/login - Issues JWT for SSO
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = user.password === password || (user.comparePassword && await user.comparePassword(password));
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user._id, role: user.role, designation: user.designation, email: user.email };
    const token = jwt.sign(payload, process.env.JWT_SECRET || 'supersecret', { expiresIn: '7d' });

    const response = { success: true, token, user: payload };
    if (user.role === 'faculty' && user.designation === 'hostel_admin') response.redirectTo = '/hostel-admin';
    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
