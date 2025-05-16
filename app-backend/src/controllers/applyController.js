const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const db = require('../config/database');
const { BadRequestError, NotFoundError } = require('../utils/errors');

// Allowed file types and size
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Multer storage config
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      cb(new BadRequestError('Failed to create upload directory'), null);
    }
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}_${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

// Multer file filter
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext)) {
    cb(null, true);
  } else {
    cb(new BadRequestError('Invalid file type. Only PDF, DOC, DOCX are allowed.'));
  }
};

// Multer upload middleware
const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter
});

exports.uploadResume = upload.single('resume');

// Main application logic
exports.applyForJob = async (req, res, next) => {
  let trx;
  try {
    const { jobId } = req.params;
    const { userId } = req.user;
    const resume = req.file;

    if (!resume) {
      console.error('[ApplyForJob] No resume file uploaded');
      return next(new BadRequestError('Resume file is required and must be PDF, DOC, or DOCX'));
    }

    const ext = path.extname(resume.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.includes(ext) || !ALLOWED_MIME_TYPES.includes(resume.mimetype)) {
      console.error(`[ApplyForJob] Invalid file type: ${resume.originalname} (${resume.mimetype})`);
      await fs.unlink(resume.path).catch(() => {});
      return next(new BadRequestError('Invalid file type. Only PDF, DOC, DOCX are allowed.'));
    }

    trx = await db.transaction();

    // Check job exists and is open
    const job = await trx('job_postings')
      .where({ job_posting_id: jobId, status: 'Open' })
      .first();
    if (!job) {
      console.error(`[ApplyForJob] Job not found or not open: jobId=${jobId}`);
      await fs.unlink(resume.path).catch(() => {});
      await trx.rollback();
      return next(new NotFoundError('Job posting not found or not open for applications'));
    }

    // Check for duplicate application
    const alreadyApplied = await trx('applications')
      .where({ job_seeker_id: userId, job_posting_id: jobId })
      .first();
    if (alreadyApplied) {
      console.warn(`[ApplyForJob] Duplicate application: userId=${userId}, jobId=${jobId}`);
      await fs.unlink(resume.path).catch(() => {});
      await trx.rollback();
      return next(new BadRequestError('You have already applied for this job.'));
    }

    // Insert application
    const [application] = await trx('applications')
      .insert({
        job_seeker_id: userId,
        job_posting_id: jobId,
        resume_snapshot: resume.filename,
        status: 'New',
        submission_date: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      })
      .returning('*');

    await trx.commit();
    console.info(`[ApplyForJob] Application submitted: userId=${userId}, jobId=${jobId}, applicationId=${application.application_id}`);
    res.status(201).json({ message: 'Application submitted successfully', applicationId: application.application_id });
  } catch (error) {
    if (trx) await trx.rollback().catch(() => {});
    if (req.file && req.file.path) await fs.unlink(req.file.path).catch(() => {});
    console.error('[ApplyForJob] Error:', error);
    next(new BadRequestError('Invalid job posting ID, unable to apply, or file error: ' + error.message));
  }
};