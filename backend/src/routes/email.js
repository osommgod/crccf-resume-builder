const express = require('express');
const router = express.Router();

// Import controllers
const {
  sendResumeEmail,
  sendWhatsAppNotification,
  getEmailStatus
} = require('../controllers/emailController');

// Routes
/**
 * POST /api/email/send-email
 * Send resume via email with password-protected PDF attachment
 */
router.post('/send-email', sendResumeEmail);

/**
 * POST /api/email/send-whatsapp-notification
 * Send email for WhatsApp feature (sends PDF to user's email)
 */
router.post('/send-whatsapp-notification', sendWhatsAppNotification);

/**
 * GET /api/email/status
 * Check email service status
 */
router.get('/status', getEmailStatus);

module.exports = router;
