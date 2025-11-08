const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.middleware');
const { getStudentHostelDetailsController } = require('../controllers/hostel.controller');

router.get('/student/hostel-details', auth, getStudentHostelDetailsController);

module.exports = router;