const jwt = require('jsonwebtoken');
module.exports = function(req, res, next) {
  try {
    let token = null;
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer ')) token = auth.split(' ')[1];

    // fallback: check for hms_token cookie in Cookie header
    if (!token && req.headers && req.headers.cookie) {
      const parts = req.headers.cookie.split(';').map(s => s.trim());
      const match = parts.find(p => p.startsWith('hms_token='));
      if (match) token = match.split('=')[1];
    }

    if (!token) return res.status(401).json({ message: 'Missing token' });
    req.user = jwt.verify(token, process.env.JWT_SECRET || 'supersecret');
    next();
  } catch (e) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};
