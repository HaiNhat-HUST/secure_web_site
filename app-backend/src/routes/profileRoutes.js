// src/routes/profileRoutes.js
const express = require('express');
const profileController = require('../controllers/profileController');

const router = express.Router();

// // Update profile (yêu cầu đăng nhập và là chủ sở hữu)
// router.put(
//   '/:userId',
//   verifyToken,           // 1. Xác thực token, gắn req.user = { userId, role }
//   checkProfileOwnership, // 2. Kiểm tra req.user.userId === req.params.userId
//   profileController.updateUserProfile
// );

router.get(
  '/:userId',
  profileController.getUserProfile
);

router.put(
    '/:userId',
    verifyToken, // Yêu cầu đăng nhập
    profileController.updateUserProfile // Gọi hàm controller xử lý update
);

// Ví dụ route chỉ dành cho Recruiter
// const { hasRole } = require('../middleware/auth.middleware');
// router.post('/recruiter-action', verifyToken, hasRole(['Recruiter']), recruiterController.doSomething);

module.exports = router;