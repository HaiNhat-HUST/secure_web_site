const fs = require('fs').promises;
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const db = require('../config/database');
const { BadRequestError, NotFoundError, InternalServerError } = require('../utils/errors');

// Allowed file types and size
// Security: Define strict allowlists for file types (MIME) and extensions.
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

const ALLOWED_EXTENSIONS = ['.pdf', '.doc', '.docx'];
// Security: Limit file size to prevent Denial of Service (DoS) attacks
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Multer storage configuration with security measures
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../../uploads');
    // Security: Ensure upload directory is configured securely
    try {
      await fs.mkdir(uploadDir, { recursive: true });
      cb(null, uploadDir);
    } catch (err) {
      console.error('Upload directory creation failed:', err);
      cb(new InternalServerError('File upload system error'));
    }
  },
  filename: (req, file, cb) => {
    // Security: Generate unique, non-guessable filename
    const ext = path.extname(file.originalname).toLowerCase();
    const randomName = crypto.randomBytes(16).toString('hex');
    cb(null, `${Date.now()}_${randomName}${ext}`);
  }
});

const checkMagicBytes = async (filePath, ext) => {
  const fd = await fs.open(filePath, 'r');
  const buffer = Buffer.alloc(4);
  await fd.read(buffer, 0, 4, 0);
  await fd.close();

  if (ext === '.pdf') return buffer.toString() === '%PDF';
  if (ext === '.docx') return buffer[0] === 0x50 && buffer[1] === 0x4B; // PK..
  if (ext === '.doc') return buffer.equals(Buffer.from([0xD0, 0xCF, 0x11, 0xE0]));
  return false;
};

// Controller function to handle job application submission
exports.applyForJob = async (req, res, next) => {
  // Security: Configure multer with strict limits and validation
  const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      if (ALLOWED_MIME_TYPES.includes(file.mimetype) && ALLOWED_EXTENSIONS.includes(ext)) {
        cb(null, true);
      } else {
        cb(new BadRequestError('Invalid file type. Only PDF, DOC, DOCX allowed.'));
      }
    }
  }).single('resume');

  // Handle file upload with transaction support
  upload(req, res, async (err) => {
    let trx;
    try {
      // Handle multer errors
      if (err instanceof multer.MulterError) {
        throw new BadRequestError(err.message);
      } else if (err) {
        throw err;
      }

      // Security: Validate file upload
      if (!req.file) {
        throw new BadRequestError('Resume file is required');
      }

      const { jobId } = req.params;
      const userId = req.user?.user_id;

      // Security: Validate user authentication
      if (!userId) {
        throw new BadRequestError('Authentication required');
      }

      // Start transaction for data consistency
      trx = await db.transaction();

      // Security: Verify job status and existence
      const job = await trx('job_postings')
        .where({ 
          job_posting_id: jobId, 
          status: 'Open' 
        })
        .first();

      if (!job) {
        throw new NotFoundError('Job not found or closed');
      }

      // Security: Prevent duplicate applications
      const existing = await trx('applications')
        .where({ 
          job_seeker_id: userId, 
          job_posting_id: jobId 
        })
        .first();

      if (existing) {
        throw new BadRequestError('You have already applied to this job');
      }

      // Create application with sanitized data
      const [application] = await trx('applications')
        .insert({
          job_seeker_id: userId,
          job_posting_id: jobId,
          resume_snapshot: req.file.filename,
          status: 'New',
          submission_date: new Date(),
          created_at: new Date(),
          updated_at: new Date()
        })
        .returning('*');

      await trx.commit();

      res.status(201).json({
        message: 'Application submitted successfully',
        applicationId: application.application_id
      });

    } catch (error) {
      // Security: Clean up on error
      if (trx) await trx.rollback();
      if (req.file) {
        await fs.unlink(req.file.path).catch(console.error);
      }

      // Error handling with appropriate responses
      if (error instanceof BadRequestError || error instanceof NotFoundError) {
        next(error);
      } else {
        console.error('Application submission error:', error);
        next(new InternalServerError('Application submission failed'));
      }
    }
  });
};