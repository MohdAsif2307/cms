const express = require('express');
const router = express.Router();
const axios = require('axios');
const TransferToken = require('../models/TransferToken.model');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// Proxy endpoint: front-end can call /api/sso/request-hostel to obtain HMS token
// This endpoint verifies the CMS bearer token by forwarding it to HMS SSO endpoint
router.post('/request-hostel', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing token' });
    const token = auth.split(' ')[1];
    const hmsApi = process.env.HMS_API_URL;
    if (!hmsApi) return res.status(500).json({ message: 'HMS_API_URL not configured' });
    const resp = await axios.post(`${hmsApi}/api/sso/create-token`, {}, {
      headers: { Authorization: `Bearer ${token}` },
      timeout: 5000,
    });
    return res.json(resp.data);
  } catch (err) {
    console.error('request-hostel error:', err.message);
    return res.status(400).json({ message: err.message });
  }
});

// Validate and consume a transfer token (called by HMS during /accept)
router.post('/validate-transfer', async (req, res) => {
  try {
    const transfer = req.body.transfer || req.query.transfer;
    if (!transfer) return res.status(400).json({ message: 'Missing transfer token' });
    const ssoSecret = process.env.CMS_SSO_SECRET || process.env.JWT_SECRET || process.env.CMS_JWT_SECRET;
    if (!ssoSecret) return res.status(500).json({ message: 'SSO secret not configured' });
    let payload;
    try { payload = jwt.verify(transfer, ssoSecret); } catch (e) { return res.status(401).json({ message: 'Invalid transfer token' }); }

    const jti = payload.jti;
    if (!jti) return res.status(400).json({ message: 'No jti present' });
    const record = await TransferToken.findOne({ jti });
    if (!record) return res.status(404).json({ message: 'Transfer token not found' });
    
    // Special case: if token was already used but we have a matching payload in our request,
    // treat this as a success to handle redirect cases
    if (record.used) {
      console.log('[validate-transfer] token was already used:', jti);
      if (record.payload && JSON.stringify(record.payload) === JSON.stringify(payload)) {
        console.log('[validate-transfer] payload matches, allowing reuse');
        return res.json({ ok: true, payload });
      }
      return res.status(410).json({ message: 'Transfer token already used' });
    }
    
    if (record.expiresAt && record.expiresAt < new Date()) {
      return res.status(410).json({ message: 'Transfer token expired' });
    }

    // mark used and store payload
    record.used = true;
    record.payload = payload;
    await record.save();

    return res.json({ ok: true, payload });
  } catch (err) {
    console.error('validate-transfer error:', err.message);
    return res.status(500).json({ message: err.message });
  }
});

// Create a short-lived transfer token and return a redirect URL to HMS
router.post('/redirect', async (req, res) => {
  try {
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return res.status(401).json({ message: 'Missing token' });
    const token = auth.split(' ')[1];
    const cmsSecret = process.env.JWT_SECRET || process.env.CMS_JWT_SECRET;
    if (!cmsSecret) return res.status(500).json({ message: 'CMS_JWT_SECRET not configured' });
    const jwt = require('jsonwebtoken');
    let payload;
    try { payload = jwt.verify(token, cmsSecret); } catch (e) { return res.status(401).json({ message: 'Invalid token' }); }

  const ssoSecret = process.env.CMS_SSO_SECRET || cmsSecret;
  // include a unique jti so we can store/consume the token server-side
  const jti = crypto.randomUUID();
  const transferToken = jwt.sign({ 
    id: payload.id || payload._id || payload.userId,
    role: payload.role || null,
    designation: payload.designation || null,
    enrollmentNo: payload.enrollmentNo || null,
    name: payload.name || null,
    jti
  }, ssoSecret, { expiresIn: '60s' });

  // persist transfer token record
  const expiresAt = new Date(Date.now() + 60 * 1000);
  try {
    console.log('[sso.redirect] creating TransferToken', { jti, expiresAt });
    const created = await TransferToken.create({ jti, used: false, expiresAt });
    console.log('[sso.redirect] TransferToken created', { id: created._id, jti: created.jti });
  } catch (err) {
    console.error('[sso.redirect] failed to create TransferToken', err && err.message ? err.message : err);
    // continue: still return redirectUrl so client can follow; CMS /validate-transfer will fail if DB entry missing
  }

  const hmsApi = process.env.HMS_API_URL || process.env.HMS_URL || 'http://localhost:5000';
  // ensure we have backend root (no trailing /api)
  const base = hmsApi.replace(/\/api\/?$/, '');
  // If developer explicitly wants to use a local CMS-hosted mock for HMS accept
  const useLocalMock = process.env.FORCE_LOCAL_SSO_MOCK === '1' || process.env.USE_LOCAL_HMS_MOCK === '1';
  if (useLocalMock) {
    const cmsOrigin = process.env.CMS_PUBLIC_URL || process.env.CMS_ORIGIN || `http://localhost:${process.env.PORT || 4000}`;
    const redirectUrl = `${cmsOrigin.replace(/\/$/, '')}/api/sso/accept-mock?transfer=${transferToken}`;
    console.log('[sso.redirect] using local SSO accept mock ->', redirectUrl);
    return res.json({ redirectUrl });
  }

  const redirectUrl = `${base.replace(/\/$/, '')}/api/sso/accept?transfer=${transferToken}`;
  console.log('[sso.redirect] using external HMS accept ->', redirectUrl);
  return res.json({ redirectUrl });
  } catch (err) {
    console.error('sso redirect error:', err.message);
    return res.status(400).json({ message: err.message });
  }
});

// Local dev accept-mock endpoint: emulate HMS /api/sso/accept so devs can test SSO
// without running a separate HMS service. This consumes the transfer token and
// returns a tiny HTML page with a link back to the frontend (or auto-redirect).
router.get('/accept-mock', async (req, res) => {
  try {
    const transfer = req.query.transfer;
    if (!transfer) return res.status(400).send('<h3>Missing transfer token</h3>');
    const ssoSecret = process.env.CMS_SSO_SECRET || process.env.JWT_SECRET || process.env.CMS_JWT_SECRET;
    if (!ssoSecret) return res.status(500).send('<h3>SSO secret not configured on CMS</h3>');
    let payload;
    try { payload = jwt.verify(transfer, ssoSecret); } catch (e) { return res.status(401).send('<h3>Invalid transfer token</h3>'); }

    const jti = payload.jti;
    if (!jti) return res.status(400).send('<h3>Transfer token missing jti</h3>');
    const record = await TransferToken.findOne({ jti });
    if (!record) return res.status(404).send('<h3>Transfer token not found</h3>');

    if (record.expiresAt && record.expiresAt < new Date()) return res.status(410).send('<h3>Transfer token expired</h3>');

    // mark used and store payload (emulate HMS consuming the token)
    if (!record.used) {
      record.used = true;
      record.payload = payload;
      await record.save();
    }

    // Build a small HTML page to finish the SSO flow in the browser. Developers
    // can set FRONTEND_URL to point to their Vite dev server (e.g. http://localhost:5173).
    const frontendUrl = process.env.FRONTEND_URL || process.env.FRONTEND_API_LINK || 'http://localhost:5173';
    const redirectBack = `${frontendUrl.replace(/\/$/, '')}/hostel?transfer=${encodeURIComponent(transfer)}`;

    return res.send(`<!doctype html>
      <html>
        <head><meta charset="utf-8"><title>SSO Accept (Mock)</title></head>
        <body style="font-family:sans-serif; padding:24px;">
          <h2>SSO Accepted (Mock)</h2>
          <p>The transfer token has been validated and consumed by the CMS mock SSO accept endpoint.</p>
          <p><a href="${redirectBack}">Continue to Hostel UI</a></p>
          <script>setTimeout(()=>{ window.location.href = "${redirectBack}"; }, 800);</script>
        </body>
      </html>`);
  } catch (err) {
    console.error('accept-mock error:', err && err.message ? err.message : err);
    return res.status(500).send('<h3>Internal Server Error</h3>');
  }
});

module.exports = router;
