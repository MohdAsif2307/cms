const express = require('express');
const router = express.Router();
const authController = require('../../controllers/auth.controller');

router.post('/faculty/register', authController.registerFaculty);
router.post('/faculty/login', authController.loginFaculty);
router.post('/student/register', authController.registerStudent);
router.post('/student/login', authController.loginStudent);

module.exports = router;
