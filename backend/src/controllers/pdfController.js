const { PDFDocument } = require('pdf-lib');
const { encryptPDF, validatePDFFormat } = require('../utils/encryptPDF');

/**
 * Generate password-protected PDF from base64 image
 */
const generateProtectedPDF = async (req, res) => {
  try {
    const { pdfBase64, password } = req.body;

    // Debug logging
    console.log('PDF Generation Request:', {
      hasPdfBase64: !!pdfBase64,
      pdfBase64Length: pdfBase64 ? pdfBase64.length : 0,
      hasPassword: !!password,
      passwordLength: password ? password.length : 0,
      pdfBase64Preview: pdfBase64 ? pdfBase64.substring(0, 100) : 'N/A'
    });

    // Validate input
    if (!pdfBase64 || !password) {
      console.error('Missing fields:', { pdfBase64: !!pdfBase64, password: !!password });
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: pdfBase64 and password'
      });
    }

    // Validate pdfBase64 is not empty
    if (typeof pdfBase64 !== 'string' || pdfBase64.length < 100) {
      console.error('Invalid pdfBase64 length:', pdfBase64.length);
      return res.status(400).json({
        success: false,
        error: 'Invalid PDF data - too short or not a string'
      });
    }

    // Validate password format
    if (typeof password !== 'string' || password.length < 4) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 4 characters long'
      });
    }

    // Validate PDF format before encrypting
    const validation = validatePDFFormat(pdfBase64);
    if (!validation.valid) {
      console.error('PDF validation failed:', validation.error);
      return res.status(400).json({
        success: false,
        error: `PDF validation failed: ${validation.error}`
      });
    }

    // Encrypt the PDF
    console.log('Starting PDF encryption...');
    const encryptedBase64 = await encryptPDF(pdfBase64, password);
    console.log('PDF encryption successful');

    res.json({
      success: true,
      data: {
        pdfBase64: encryptedBase64,
        password: password
      },
      message: 'PDF encrypted successfully'
    });

  } catch (error) {
    console.error('Error generating PDF:', error);
    
    if (error.message.includes('Invalid PDF')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid PDF data provided'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to generate PDF',
      message: error.message
    });
  }
};

/**
 * Create PDF from image base64 data
 */
const createPDFFromImage = async (req, res) => {
  try {
    const { imageBase64, options = {} } = req.body;

    if (!imageBase64) {
      return res.status(400).json({
        success: false,
        error: 'Missing required field: imageBase64'
      });
    }

    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    
    // Remove data URL prefix if present
    const base64Data = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
    const imageBytes = Buffer.from(base64Data, 'base64');

    // Determine image format and embed
    let image;
    if (imageBase64.includes('image/png')) {
      image = await pdfDoc.embedPng(imageBytes);
    } else if (imageBase64.includes('image/jpeg') || imageBase64.includes('image/jpg')) {
      image = await pdfDoc.embedJpeg(imageBytes);
    } else {
      return res.status(400).json({
        success: false,
        error: 'Unsupported image format. Please use PNG or JPEG.'
      });
    }

    // Get image dimensions
    const { width, height } = image;
    
    // Create a page with A4 dimensions (595.28 x 841.89 points)
    const page = pdfDoc.addPage([595.28, 841.89]);
    
    // Calculate scaling to fit image in A4 page with margins
    const margin = 50;
    const pageWidth = 595.28 - (margin * 2);
    const pageHeight = 841.89 - (margin * 2);
    
    const scaleX = pageWidth / width;
    const scaleY = pageHeight / height;
    const scale = Math.min(scaleX, scaleY);
    
    const scaledWidth = width * scale;
    const scaledHeight = height * scale;
    
    // Center the image on the page
    const x = (595.28 - scaledWidth) / 2;
    const y = (841.89 - scaledHeight) / 2;
    
    // Draw the image
    page.drawImage(image, {
      x,
      y,
      width: scaledWidth,
      height: scaledHeight
    });

    // Apply password protection if provided
    if (options.password) {
      pdfDoc.encrypt({
        userPassword: options.password,
        ownerPassword: options.password,
        permissions: {
          print: true,
          modify: false,
          copy: false,
          annotate: false,
          fillForms: false,
          assemble: false,
          extractContent: false
        }
      });
    }

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    
    // Convert to base64 for response
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

    res.json({
      success: true,
      data: {
        pdfBase64,
        width: scaledWidth,
        height: scaledHeight
      },
      message: 'PDF created successfully from image'
    });

  } catch (error) {
    console.error('Error creating PDF from image:', error);
    
    if (error.message.includes('Invalid image')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image data provided'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Failed to create PDF from image',
      message: error.message
    });
  }
};

/**
 * Validate PDF password format
 */
const validatePasswordFormat = (req, res) => {
  try {
    const { password, firstName, dateOfBirth } = req.body;

    if (!password || !firstName || !dateOfBirth) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: password, firstName, dateOfBirth'
      });
    }

    // Format date of birth to DDMMYYYY
    const dob = new Date(dateOfBirth);
    const day = String(dob.getDate()).padStart(2, '0');
    const month = String(dob.getMonth() + 1).padStart(2, '0');
    const year = dob.getFullYear();
    const expectedPassword = `${firstName}-${day}${month}${year}`;

    const isValid = password === expectedPassword;

    res.json({
      success: true,
      data: {
        isValid,
        expectedPassword,
        providedPassword: password
      },
      message: isValid ? 'Password is valid' : 'Password does not match expected format'
    });

  } catch (error) {
    console.error('Error validating password:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to validate password',
      message: error.message
    });
  }
};

/**
 * Get PDF processing information and capabilities
 */
const getPDFInfo = (req, res) => {
  res.json({
    success: true,
    data: {
      supportedFormats: ['PNG', 'JPEG', 'JPG'],
      maxFileSize: '10MB',
      pageSize: 'A4',
      encryption: {
        supported: true,
        algorithms: ['AES-128'],
        permissions: ['print', 'modify', 'copy', 'annotate', 'fillForms', 'assemble', 'extractContent']
      },
      features: [
        'Password protection',
        'Image to PDF conversion',
        'PDF encryption',
        'Custom permissions'
      ]
    },
    message: 'PDF processing information'
  });
};

module.exports = {
  generateProtectedPDF,
  createPDFFromImage,
  validatePasswordFormat,
  getPDFInfo
};
