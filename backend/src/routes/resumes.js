const express = require('express');
const router = express.Router();

// Import controllers
const {
  createResume,
  getResumes,
  getResumeById,
  updateResume,
  deleteResume,
  getResumeStats
} = require('../controllers/resumeController');

// Import middleware
const validateResume = require('../middlewares/validateResume');

// Routes
/**
 * POST /api/resumes
 * Create a new resume
 */
router.post('/', validateResume, createResume);

/**
 * GET /api/resumes
 * Get all resumes (admin functionality)
 * Query params: page, limit, search, sortBy
 */
router.get('/', getResumes);

/**
 * GET /api/resumes/stats
 * Get resume statistics
 */
router.get('/stats', getResumeStats);

/**
 * GET /api/resumes/:id
 * Get a single resume by ID
 */
router.get('/:id', getResumeById);

/**
 * PUT /api/resumes/:id
 * Update a resume by ID
 */
router.put('/:id', validateResume, updateResume);

/**
 * DELETE /api/resumes/:id
 * Delete a resume by ID
 */
router.delete('/:id', deleteResume);

module.exports = router;
