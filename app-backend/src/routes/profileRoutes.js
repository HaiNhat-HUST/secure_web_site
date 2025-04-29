// src/routes/profileRoutes.js
const express = require('express');
const profileController = require('../controllers/profileController');
const { authenticateJWT } = require('../middleware/authMiddleware');

const router = express.Router();

router.get(
  '/:userId',
  authenticateJWT,
  profileController.getUserProfile
);

// PATCH profile (for partial updates)
router.patch(
    '/:userId',
    authenticateJWT,
    profileController.updateUserProfile
);

// Ví dụ route chỉ dành cho Recruiter
// const { hasRole } = require('../middleware/auth.middleware');
// router.post('/recruiter-action', verifyToken, hasRole(['Recruiter']), recruiterController.doSomething);

module.exports = router;