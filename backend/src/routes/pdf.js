const express = require('express');
const router = express.Router();

// Import controllers
const {
  generateProtectedPDF,
  createPDFFromImage,
  validatePasswordFormat,
  getPDFInfo
} = require('../controllers/pdfController');

// Routes
/**
 * POST /api/pdf/generate-pdf
 * Generate password-protected PDF from base64 image
 */
router.post('/generate-pdf', generateProtectedPDF);

/**
 * POST /api/pdf/create-from-image
 * Create PDF from image base64 data
 */
router.post('/create-from-image', createPDFFromImage);

/**
 * POST /api/pdf/validate-password
 * Validate PDF password format
 */
router.post('/validate-password', validatePasswordFormat);

/**
 * GET /api/pdf/info
 * Get PDF processing information and capabilities
 */
router.get('/info', getPDFInfo);

module.exports = router;
