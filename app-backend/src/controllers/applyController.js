const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const db = require('../config/database');
const { BadRequestError, NotFoundError } = require('../utils/errors');

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}_${Math.round(Math.random() * 1e9)}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    if (ALLOWED_EXTENSIONS.includes(path.extname(file.originalname).toLowerCase())) {
      cb(null, true);
    } else {
      cb(new BadRequestError("Invalid file type. Only PDF, DOC, DOCX are allowed."));
    }
  }
});

exports.uploadResume = upload.single('resume');

exports.applyForJob = async (req, res, next) => {
  let trx;
  try {
    const { jobId } = req.params;
    const { userId } = req.user;
    const resume = req.file;

    if (!resume) {
      return next(new BadRequestError('Resume file is required and must be PDF, DOC, or DOCX'));
    }
    
    if (!ALLOWED_EXTENSIONS.includes(path.extname(resume.originalname).toLowerCase())) {
      await fs.unlink(resume.path).catch(() => {});
      return next(new BadRequestError("Invalid file type."));
    }

    trx = await db.transaction();

    // Check job exists and is open
    const job = await trx('job_postings').where({ job_posting_id: jobId, status: 'Open' }).first();
    if (!job) {
      await fs.unlink(resume.path).catch(() => {});
      await trx.rollback();
      return next(new NotFoundError('Job posting not found or not open for applications'));
    }

    // Check for duplicate application
    const alreadyApplied = await trx('applications')
      .where({ job_seeker_id: userId, job_posting_id: jobId })
      .first();
      
    if (alreadyApplied) {
      await fs.unlink(resume.path).catch(() => {});
      await trx.rollback();
      return next(new BadRequestError('You have already applied for this job.'));
    }

    // Insert application
    await trx('applications').insert({
      job_seeker_id: userId,
      job_posting_id: jobId,
      resume_snapshot: resume.filename,
      status: 'New',
      submission_date: new Date(),
      created_at: new Date(),
      updated_at: new Date(),
    });

    await trx.commit();
    res.status(201).json({ message: 'Application submitted successfully' });
  } catch (error) {
    if (trx) await trx.rollback().catch(() => {});
    if (req.file && req.file.path) await fs.unlink(req.file.path).catch(() => {});
    next(new BadRequestError('Invalid job posting ID, unable to apply, or file error'));
  }
};
