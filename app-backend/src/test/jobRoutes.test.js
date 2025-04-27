const request = require('supertest');
const express = require('express');
const jobRoutes = require('../routes/jobRoutes');

// Mock the jobController
jest.mock('../controllers/ManageJobPostingController', () => ({
  createJob: (req, res) => res.status(201).json({ message: 'Job created' }),
  getRecruiterJobs: (req, res) => res.status(200).json([{ id: 1, title: 'Software Engineer' }]),
  updateJob: (req, res) => res.status(200).json({ message: 'Job updated' }),
  closeJob: (req, res) => res.status(200).json({ message: 'Job closed' }),
}));

const app = express();
app.use(express.json());
app.use('/api', jobRoutes);

describe('Job Routes', () => {
  it('should create a new job', async () => {
    const res = await request(app).post('/api/jobs').send({
      title: 'Software Engineer',
      description: 'Develop and maintain web applications.',
    });
    expect(res.statusCode).toBe(201);
    expect(res.body.message).toBe('Job created');
  });

  it('should get recruiter job postings', async () => {
    const res = await request(app).get('/api/recruiter/job-postings');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveLength(1);
    expect(res.body[0].title).toBe('Software Engineer');
  });

  it('should update a specific job posting', async () => {
    const res = await request(app).put('/api/recruiter/job-postings/12345').send({
      title: 'Senior Software Engineer',
    });
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Job updated');
  });

  it('should close a specific job posting', async () => {
    const res = await request(app).delete('/api/recruiter/job-postings/12345/close');
    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe('Job closed');
  });
});