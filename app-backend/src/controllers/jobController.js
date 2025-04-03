const { createJob, getAllJobs } = require("../models/jobModel");

const createJobPost = async (req, res) => {
  const { title, description, company, salary } = req.body;
  const job = await createJob(title, description, company, salary);
  res.json(job);
};

const getJobs = async (req, res) => {
  const jobs = await getAllJobs();
  res.json(jobs);
};

module.exports = { createJobPost, getJobs };
