const express = require('express');
const router = express.Router();

// Admin dashboard data 
router.get('/dashboard', (req, res) => {
  res.success({
    stats: {
      users: 150,
      jobs: 75,
      applications: 425
    },
    recentActivities: [
      { type: 'new_job', date: new Date(), details: { title: 'Frontend Developer' } },
      { type: 'new_user', date: new Date(), details: { role: 'Recruiter' } }
    ]
  });
});

// Admin user management
router.get('/users', (req, res) => {
  // To be implemented with actual database queries
  res.success({
    users: []
  });
});

module.exports = router; 