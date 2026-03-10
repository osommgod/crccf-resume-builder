const express = require('express');
const router = express.Router();

// Import controllers
const {
  getTimeStatus,
  resetTimeStatus,
  getTimeConfig,
  getTimeHealth
} = require('../controllers/timeStatusController');

// Routes
/**
 * GET /api/time-status
 * Check if resume submission is still allowed based on deployment timestamp
 */
router.get('/time-status', getTimeStatus);

/**
 * POST /api/time-status/reset
 * Reset deployment timestamp (admin only)
 */
router.post('/time-status/reset', resetTimeStatus);

/**
 * GET /api/time-status/config
 * Get time limit configuration
 */
router.get('/time-status/config', getTimeConfig);

/**
 * GET /api/time-status/health
 * Health check for time status service
 */
router.get('/time-status/health', getTimeHealth);

module.exports = router;
