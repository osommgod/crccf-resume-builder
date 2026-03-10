const nodemailer = require('nodemailer');
const nodemailerConfig = require('../config/nodemailerConfig');

/**
 * Nodemailer transporter config + sendMail utility
 */
const sendEmail = async (emailOptions) => {
  try {
    // Validate required options
    const { to, subject, html, text, attachments } = emailOptions;
    
    if (!to || !subject) {
      throw new Error('Email "to" and "subject" are required');
    }
    
    // Create transporter
    const transporter = nodemailerConfig.createTransporter();
    
    // Prepare email options
    const mailOptions = {
      from: {
        name: process.env.FROM_NAME || 'CRCCF Resume Builder',
        address: process.env.FROM_EMAIL || process.env.EMAIL_USER
      },
      to: Array.isArray(to) ? to.join(', ') : to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ''), // Strip HTML if text not provided
      html,
      attachments: attachments || []
    };
    
    // Send email
    const result = await transporter.sendMail(mailOptions);
    
    console.log('Email sent successfully:', {
      messageId: result.messageId,
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    return {
      success: true,
      messageId: result.messageId,
      response: result
    };
    
  } catch (error) {
    console.error('Error sending email:', error);
    
    // Handle specific nodemailer errors
    if (error.code === 'EAUTH') {
      throw new Error('Email authentication failed. Please check email credentials.');
    }
    
    if (error.code === 'ECONNECTION') {
      throw new Error('Failed to connect to email server. Please check network connectivity.');
    }
    
    if (error.code === 'EENVELOPE') {
      throw new Error('Invalid email address format.');
    }
    
    if (error.code === 'EMESSAGE') {
      throw new Error('Message format is invalid.');
    }
    
    // Re-throw with context
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send a simple text email
 */
const sendTextEmail = async (to, subject, text) => {
  return sendEmail({
    to,
    subject,
    text
  });
};

/**
 * Send email with template
 */
const sendTemplateEmail = async (to, subject, templateData, templateName = 'default') => {
  // This could be extended to use actual email templates
  const html = generateEmailTemplate(templateName, templateData);
  
  return sendEmail({
    to,
    subject,
    html
  });
};

/**
 * Generate email HTML template (basic implementation)
 */
const generateEmailTemplate = (templateName, data) => {
  const templates = {
    default: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title || 'Email from CRCCF Resume Builder'}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .container {
            background-color: #ffffff;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }
          .header {
            text-align: center;
            border-bottom: 3px solid #007bff;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1 style="color: #007bff; margin: 0;">CRCCF Resume Builder</h1>
          </div>
          
          ${data.content || '<p>No content provided</p>'}
          
          <div class="footer">
            <p>© 2024 CRCCF Resume Builder. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    
    notification: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${data.title || 'Notification'}</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
          }
          .notification {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="notification">
            <h3>🔔 Notification</h3>
            ${data.content || '<p>No notification content</p>'}
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  return templates[templateName] || templates.default;
};

/**
 * Verify email configuration
 */
const verifyEmailConfig = async () => {
  try {
    const transporter = nodemailerConfig.createTransporter();
    await transporter.verify();
    return { success: true, message: 'Email configuration is valid' };
  } catch (error) {
    return { 
      success: false, 
      message: 'Email configuration is invalid', 
      error: error.message 
    };
  }
};

module.exports = {
  sendEmail,
  sendTextEmail,
  sendTemplateEmail,
  generateEmailTemplate,
  verifyEmailConfig
};
