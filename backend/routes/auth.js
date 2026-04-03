// --- routes/auth.js ---

const express = require('express');
const router = express.Router();
const { registerAndLogin } = require('../controllers/authController');

// @route   POST /api/auth/login
// @desc    Register or Login a user and return token
// @access  Public
router.post('/login', registerAndLogin);

module.exports = router;