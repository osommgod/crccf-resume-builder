const express = require('express');
const { generateSimplePDFController } = require('../controllers/simplePDFController');

const router = express.Router();

// Simple PDF generation route (like working project)
router.post('/generate-simple-pdf', generateSimplePDFController);

module.exports = router;
