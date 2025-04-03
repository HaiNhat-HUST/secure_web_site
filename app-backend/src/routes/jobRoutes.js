const express = require("express");
const { createJobPost, getJobs } = require("../controllers/jobController");

const router = express.Router();

router.post("/", createJobPost);
router.get("/", getJobs);

module.exports = router;
