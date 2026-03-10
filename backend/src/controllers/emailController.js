const sendEmail = require('../utils/sendEmail');

/**
 * Send resume via email with password-protected PDF attachment
 */
const sendResumeEmail = async (req, res) => {
  try {
    const { resumeBase64, password, recipientEmail, userName } = req.body;

    // Validate required fields
    if (!resumeBase64 || !password || !recipientEmail || !userName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: resumeBase64, password, recipientEmail, userName'
      });
    }

    // Validate email format
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(recipientEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid recipient email format'
      });
    }

    // Prepare email content
    const emailSubject = `Your Resume from CRCCF Resume Builder`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Resume from CRCCF Resume Builder</title>
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
          .header h1 {
            color: #007bff;
            margin: 0;
            font-size: 28px;
          }
          .password-box {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
          }
          .password-box h3 {
            color: #856404;
            margin: 0 0 10px 0;
          }
          .password {
            font-size: 18px;
            font-weight: bold;
            color: #d63031;
            background-color: #fff;
            padding: 10px 15px;
            border-radius: 5px;
            border: 2px solid #d63031;
            display: inline-block;
            margin: 10px 0;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #666;
            font-size: 14px;
          }
          .logo {
            font-size: 24px;
            font-weight: bold;
            color: #007bff;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="logo">CRCCF Resume Builder</div>
            <h1>Your Professional Resume</h1>
          </div>
          
          <p>Dear <strong>${userName}</strong>,</p>
          
          <p>Thank you for using CRCCF Resume Builder! Your professional resume has been generated and is attached to this email.</p>
          
          <div class="password-box">
            <h3>🔐 Important: Resume Password</h3>
            <p>Your resume is password-protected for security. Please use the following password to open your PDF:</p>
            <div class="password">${password}</div>
            <p><small>Keep this password safe and do not share it with unauthorized individuals.</small></p>
          </div>
          
          <p><strong>What's included in your resume:</strong></p>
          <ul>
            <li>Professional formatting optimized for printing</li>
            <li>All your personal information and achievements</li>
            <li>Skills, experience, and project details</li>
            <li>Password protection for document security</li>
          </ul>
          
          <p>If you have any questions or need assistance, feel free to contact our support team.</p>
          
          <div class="footer">
            <p>This resume was generated using <strong>CRCCF Resume Builder</strong></p>
            <p>© 2024 CRCCF Resume Builder. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send email
    const result = await sendEmail({
      to: recipientEmail,
      subject: emailSubject,
      html: emailHtml,
      attachments: [
        {
          filename: `${userName.replace(/\s+/g, '_')}_Resume.pdf`,
          content: Buffer.from(resumeBase64.replace(/^data:application\/pdf;base64,/, ''), 'base64'),
          contentType: 'application/pdf'
        }
      ]
    });

    res.json({
      success: true,
      data: {
        messageId: result.messageId,
        recipient: recipientEmail,
        subject: emailSubject
      },
      message: `Resume sent successfully to ${recipientEmail}`
    });

  } catch (error) {
    console.error('Error sending email:', error);

    // Handle specific email errors
    if (error.code === 'EAUTH') {
      return res.status(500).json({
        success: false,
        error: 'Email authentication failed. Please check email credentials.',
        message: 'Server configuration error'
      });
    }

    if (error.code === 'ECONNECTION') {
      return res.status(500).json({
        success: false,
        error: 'Failed to connect to email server. Please try again later.',
        message: 'Connection error'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to send email',
      message: error.message
    });
  }
};

/**
 * Send email for WhatsApp feature (sends PDF to user's email)
 */
const sendWhatsAppNotification = async (req, res) => {
  try {
    const { resumeBase64, password, recipientEmail, userName, whatsappNumber } = req.body;

    // Validate required fields
    if (!resumeBase64 || !password || !recipientEmail || !userName || !whatsappNumber) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields for WhatsApp notification'
      });
    }

    // Send email using the same logic as send-email
    const emailSubject = `Your Resume from CRCCF Resume Builder (WhatsApp Request)`;
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Resume from CRCCF Resume Builder</title>
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
          .whatsapp-badge {
            background-color: #25D366;
            color: white;
            padding: 5px 10px;
            border-radius: 5px;
            font-size: 12px;
            display: inline-block;
            margin-bottom: 10px;
          }
          .password-box {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
          }
          .password {
            font-size: 18px;
            font-weight: bold;
            color: #d63031;
            background-color: #fff;
            padding: 10px 15px;
            border-radius: 5px;
            border: 2px solid #d63031;
            display: inline-block;
            margin: 10px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="whatsapp-badge">📱 WhatsApp Request</div>
          <h2>Your Resume from CRCCF Resume Builder</h2>
          
          <p>Dear <strong>${userName}</strong>,</p>
          
          <p>You requested your resume via WhatsApp. Your resume has been sent to your email and the password has been shared on WhatsApp.</p>
          
          <div class="password-box">
            <h3>🔐 Resume Password</h3>
            <p>Password to open your PDF:</p>
            <div class="password">${password}</div>
          </div>
          
          <p>Your resume is attached to this email. Please use the password provided to open the PDF document.</p>
          
          <p>Thank you for using CRCCF Resume Builder!</p>
        </div>
      </body>
      </html>
    `;

    const result = await sendEmail({
      to: recipientEmail,
      subject: emailSubject,
      html: emailHtml,
      attachments: [
        {
          filename: `${userName.replace(/\s+/g, '_')}_Resume.pdf`,
          content: Buffer.from(resumeBase64.replace(/^data:application\/pdf;base64,/, ''), 'base64'),
          contentType: 'application/pdf'
        }
      ]
    });

    res.json({
      success: true,
      data: {
        messageId: result.messageId,
        whatsappNumber: whatsappNumber,
        password: password
      },
      message: 'Email sent for WhatsApp notification successfully'
    });

  } catch (error) {
    console.error('Error sending WhatsApp notification email:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send WhatsApp notification email',
      message: error.message
    });
  }
};

/**
 * Check email service status
 */
const getEmailStatus = async (req, res) => {
  try {
    const nodemailerConfig = require('../config/nodemailerConfig');
    const transporter = nodemailerConfig.createTransporter();
    
    // Verify transporter connection
    await transporter.verify();

    res.json({
      success: true,
      data: {
        emailService: 'gmail',
        status: 'connected',
        user: process.env.EMAIL_USER ? process.env.EMAIL_USER.split('@')[0] + '@***.com' : null
      },
      message: 'Email service is operational'
    });

  } catch (error) {
    console.error('Email service status check failed:', error);
    res.status(500).json({
      success: false,
      error: 'Email service is not operational',
      message: error.message
    });
  }
};

module.exports = {
  sendResumeEmail,
  sendWhatsAppNotification,
  getEmailStatus
};
