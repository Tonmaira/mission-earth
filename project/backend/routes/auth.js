const express = require('express');
const router = express.Router();
const authController = require('../middleware/authController');
console.log('auth route file loaded');

router.post('/', authController.handleLogin);

module.exports = router;