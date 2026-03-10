const nodemailer = require('nodemailer');

/**
 * Gmail SMTP transporter setup using .env credentials
 */
const createTransporter = () => {
  // Validate required environment variables
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;
  
  if (!emailUser || !emailPass) {
    throw new Error('EMAIL_USER and EMAIL_PASS environment variables are required');
  }
  
  // Create transporter with Gmail SMTP
  const transporter = nodemailer.createTransporter({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // Use SSL
    auth: {
      user: emailUser,
      pass: emailPass
    },
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates (for development)
    },
    pool: true, // Use connection pooling
    maxConnections: 5,
    maxMessages: 100,
    rateDelta: 1000, // Rate limit: 1 message per second
    rateLimit: 5
  });
  
  return transporter;
};

/**
 * Get transporter configuration (without creating the transporter)
 */
const getTransporterConfig = () => {
  return {
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.EMAIL_USER ? process.env.EMAIL_USER.split('@')[0] + '@***.com' : null,
      pass: '***'
    }
  };
};

/**
 * Test email configuration
 */
const testEmailConfig = async () => {
  try {
    const transporter = createTransporter();
    await transporter.verify();
    
    return {
      success: true,
      message: 'Email configuration is working correctly',
      service: 'Gmail SMTP',
      user: process.env.EMAIL_USER ? process.env.EMAIL_USER.split('@')[0] + '@***.com' : null
    };
  } catch (error) {
    return {
      success: false,
      message: 'Email configuration test failed',
      error: error.message
    };
  }
};

module.exports = {
  createTransporter,
  getTransporterConfig,
  testEmailConfig
};
