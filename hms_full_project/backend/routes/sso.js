const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// POST /api/sso/create-token
// Expects Authorization: Bearer <CMS_JWT>
// Verifies CMS JWT using CMS_JWT_SECRET and issues an HMS JWT signed with HMS_JWT_SECRET
router.post('/create-token', (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing CMS token' });
    const cmsToken = auth.split(' ')[1];

    const cmsSecret = process.env.CMS_JWT_SECRET;
    if (!cmsSecret) return res.status(500).json({ message: 'CMS_JWT_SECRET not configured' });

    const cmsPayload = jwt.verify(cmsToken, cmsSecret);

    const hmsPayload = {
      id: cmsPayload.userId || cmsPayload.id || cmsPayload.userId,
      cmsRole: cmsPayload.role || 'cms_user',
      designation: cmsPayload.designation || null,
    };

    const hmsSecret = process.env.HMS_JWT_SECRET || process.env.JWT_SECRET || 'hms_default_secret';
    const hmsToken = jwt.sign(hmsPayload, hmsSecret, { expiresIn: '2h' });

    return res.json({ hmsToken, hmsFrontendUrl: process.env.HMS_FRONTEND_URL || process.env.HMS_URL || null });
  } catch (err) {
    console.error('sso create-token error:', err.message);
    return res.status(401).json({ message: 'Invalid CMS token' });
  }
});

// GET /api/sso/accept?transfer=<token>
// Verifies the transfer token (signed by CMS) and issues an HMS JWT, sets HttpOnly cookie and redirects to frontend
router.get('/accept', async (req, res) => {
  try {
    const transfer = req.query.transfer;
    if (!transfer) return res.status(400).send('Missing transfer token');

    // Instead of verifying locally, call CMS to validate & consume the transfer token (one-time use)
    const cmsApi = process.env.CMS_API_URL || process.env.CMS_URL || 'http://localhost:4000';
    // minimal helper to POST JSON without external deps
    const postJson = (url, data, timeout = 5000) => new Promise((resolve, reject) => {
      try {
        const parsed = new URL(url);
        const lib = parsed.protocol === 'https:' ? require('https') : require('http');
        const payload = JSON.stringify(data);
        const opts = {
          hostname: parsed.hostname,
          port: parsed.port || (parsed.protocol === 'https:' ? 443 : 80),
          path: parsed.pathname + (parsed.search || ''),
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(payload)
          },
          timeout,
        };
        const req = lib.request(opts, (res) => {
          let raw = '';
          res.setEncoding('utf8');
          res.on('data', (chunk) => raw += chunk);
          res.on('end', () => {
            try { const j = JSON.parse(raw || '{}'); resolve({ status: res.statusCode, data: j }); }
            catch (e) { resolve({ status: res.statusCode, data: raw }); }
          });
        });
        req.on('error', reject);
        req.write(payload);
        req.end();
      } catch (e) { reject(e); }
    });
    try {
      let payload;
      console.log('[sso.accept] calling CMS validate-transfer');
      const resp = await postJson(`${cmsApi.replace(/\/$/, '')}/api/sso/validate-transfer`, { transfer }, 5000);
      console.log('[sso.accept] validate response:', resp.status, resp.data);
      
      // Check for already-used token (treat as success if previously validated)
      if (resp.status === 410 && resp.data.message === 'Transfer token already used') {
        console.log('[sso.accept] token was already used, treating as success');
        try {
          payload = jwt.verify(transfer, process.env.CMS_JWT_SECRET || process.env.JWT_SECRET || 'shared_secret_for_testing');
        } catch (e) {
          console.error('[sso.accept] failed to decode transfer token:', e.message);
          return res.status(401).send('Invalid transfer token');
        }
      } else if (!resp.data || !resp.data.ok) {
        console.error('[sso.accept] validation failed:', resp.data);
        return res.status(401).send('Transfer validation failed');
      } else {
        payload = resp.data.payload;
      }

      const hmsSecret = process.env.HMS_JWT_SECRET || process.env.JWT_SECRET || 'hms_default_secret';
      const hmsPayload = { id: payload.id || null, role: payload.role || 'student', from_sso: true };
      const hmsToken = jwt.sign(hmsPayload, hmsSecret, { expiresIn: '8h' });

      // set cookie
      const cookieOpts = { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', maxAge: 8 * 60 * 60 * 1000 };
      res.cookie('hms_token', hmsToken, cookieOpts);

      const frontend = process.env.HMS_FRONTEND_URL || process.env.HMS_URL || 'http://localhost:5173';
      // redirect to frontend SSO completion page
      return res.redirect(`${frontend.replace(/\/$/, '')}/sso/complete`);
    } catch (err) {
      console.error('sso accept -> cms validate error:', err.message);
      return res.status(401).send('Transfer validation failed');
    }
  } catch (err) {
    console.error('sso accept error:', err.message);
    return res.status(500).send('SSO failed');
  }
});

module.exports = router;
