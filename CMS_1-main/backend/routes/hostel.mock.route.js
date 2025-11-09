const express = require('express');
const router = express.Router();
const ApiResponse = require('../utils/ApiResponse');

// Simple mock endpoints for local development when HMS isn't available.
// GET /api/hostel/student/hostel-details
router.get('/student/hostel-details', (req, res) => {
  try {
    // If no auth header, return 401 to mimic real behaviour
    const auth = req.headers.authorization || '';
    if (!auth.startsWith('Bearer ')) return ApiResponse.error('Unauthorized', 401).send(res);

    // Return a small mock payload
    const data = {
      hostelName: 'Default Hostel',
      roomNumber: 'A-101',
      warden: 'Warden Name',
      status: 'active',
    };

    return ApiResponse.success(data, 'Hostel details').send(res);
  } catch (err) {
    return ApiResponse.error(err.message).send(res);
  }
});

module.exports = router;
