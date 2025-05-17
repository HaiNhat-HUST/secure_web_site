// src/routes/profileRoutes.js
const express = require('express');
const profileController = require('../controllers/profileController');
const { authenticateJWT } = require('../middleware/authMiddleware'); // Assuming this sets req.user

const router = express.Router();

console.log('profileRoutes.js loaded');

// GET full user profile (user_core, profile_details, education_history)
// This can replace the old GET /:userId or be a new endpoint e.g. /:userId/full
router.get(
  '/:userId', // Or '/:userId/full' if you want to keep old one separate
  authenticateJWT, // Or remove if public profiles are allowed (controller needs to handle)
  profileController.getUserFullProfile // New controller method
);

// PATCH profile details (user_profiles table)
router.patch(
  '/:userId/details', // Specific endpoint for details
  authenticateJWT,    // User must be logged in
  profileController.updateUserProfileDetails // New controller method
);


// --- Education Routes ---
// POST a new education entry
router.post(
  '/:userId/education',
  authenticateJWT,
  profileController.addEducationEntry
);

// PUT (update) an existing education entry
router.put(
  '/:userId/education/:educationId',
  authenticateJWT,
  profileController.updateEducationEntry
);

// DELETE an education entry
router.delete(
  '/:userId/education/:educationId',
  authenticateJWT,
  profileController.deleteEducationEntry
);


// The old PATCH /:userId route that updated the 'users' table directly
// can be kept if still used elsewhere, or deprecated if updateUserProfileDetails covers all needs.
// For now, let's assume it's deprecated in favor of the more specific /details endpoint.
// If you still need it:
// router.patch(
//     '/:userId',
//     authenticateJWT,
//     profileController.updateUserCoreProfile // You might rename the old updateUserProfile method
// );


module.exports = router;