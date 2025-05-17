const express = require('express');
const passwordRecoveryController = require('../controllers/passwordRecoveryController');

const router = express.Router();

router.post('/forgot-password', passwordRecoveryController.forgotPassword);

router.post('/reset-password', passwordRecoveryController.resetPassword);

module.exports = router; 