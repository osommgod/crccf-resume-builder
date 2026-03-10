/**
 * 404 handler for unmatched routes
 */
const notFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    availableRoutes: [
      'GET /health',
      'GET /api/time-status',
      'GET /api/time-status/config',
      'GET /api/time-status/health',
      'POST /api/time-status/reset',
      'GET /api/resumes',
      'GET /api/resumes/stats',
      'GET /api/resumes/:id',
      'POST /api/resumes',
      'PUT /api/resumes/:id',
      'DELETE /api/resumes/:id',
      'POST /api/pdf/generate-pdf',
      'POST /api/pdf/create-from-image',
      'POST /api/pdf/validate-password',
      'GET /api/pdf/info',
      'POST /api/email/send-email',
      'POST /api/email/send-whatsapp-notification',
      'GET /api/email/status'
    ]
  });
};

module.exports = notFound;
