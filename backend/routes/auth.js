const express = require('express');
const { registerUser,loginUser } = require('../controller/authController');

const router = express.Router();

// Register route
router.post('/signup', registerUser);

// Login route
router.post('/login', loginUser);

module.exports = router;
