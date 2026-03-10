const { PDFDocument } = require('pdf-lib');

/**
 * pdf-lib logic to encrypt PDF with password
 */
const encryptPDF = async (pdfBase64, password) => {
  try {
    // Validate inputs
    if (!pdfBase64 || typeof pdfBase64 !== 'string') {
      throw new Error('PDF base64 data is required');
    }
    
    if (!password || typeof password !== 'string') {
      throw new Error('Password is required and must be a string');
    }

    // Remove data URL prefix if present
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    
    // Convert base64 to bytes
    const pdfBytes = Buffer.from(base64Data, 'base64');
    
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    // Encrypt the PDF with password
    pdfDoc.encrypt({
      userPassword: password,
      ownerPassword: password, // Same password for both user and owner
      permissions: {
        print: true,           // Allow printing
        modify: false,         // Prevent modification
        copy: false,           // Prevent copying
        annotate: false,       // Prevent annotations
        fillForms: false,      // Prevent filling forms
        assemble: false,       // Prevent assembling
        extractContent: false  // Prevent content extraction
      }
    });
    
    // Save the encrypted PDF
    const encryptedPdfBytes = await pdfDoc.save();
    
    // Convert back to base64
    const encryptedBase64 = Buffer.from(encryptedPdfBytes).toString('base64');
    
    return encryptedBase64;
    
  } catch (error) {
    console.error('Error encrypting PDF:', error);
    
    // Handle specific pdf-lib errors
    if (error.message.includes('Invalid PDF')) {
      throw new Error('Invalid PDF data provided');
    }
    
    if (error.message.includes('Password')) {
      throw new Error('Invalid password format');
    }
    
    // Re-throw with more context
    throw new Error(`Failed to encrypt PDF: ${error.message}`);
  }
};

/**
 * Validate PDF format before encryption
 */
const validatePDFFormat = (pdfBase64) => {
  try {
    if (!pdfBase64 || typeof pdfBase64 !== 'string') {
      return { valid: false, error: 'PDF data is required' };
    }

    // Remove data URL prefix if present
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    
    // Check if it's a valid base64 string
    try {
      const pdfBytes = Buffer.from(base64Data, 'base64');
      
      // Check minimum size (PDF should be at least a few hundred bytes)
      if (pdfBytes.length < 100) {
        return { valid: false, error: 'PDF data is too small' };
      }
      
      // Check if it starts with PDF signature
      const header = pdfBytes.slice(0, 5).toString();
      if (header !== '%PDF-') {
        return { valid: false, error: 'Invalid PDF format - missing PDF header' };
      }
      
      // Check maximum size (10MB)
      const maxSize = 10 * 1024 * 1024;
      if (pdfBytes.length > maxSize) {
        return { valid: false, error: 'PDF size exceeds 10MB limit' };
      }
      
      return { valid: true };
      
    } catch (error) {
      return { valid: false, error: 'Invalid base64 data' };
    }
    
  } catch (error) {
    return { valid: false, error: `Validation error: ${error.message}` };
  }
};

/**
 * Get PDF metadata without loading the entire document
 */
const getPDFMetadata = async (pdfBase64) => {
  try {
    // Validate first
    const validation = validatePDFFormat(pdfBase64);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    const pdfBytes = Buffer.from(base64Data, 'base64');
    
    const pdfDoc = await PDFDocument.load(pdfBytes);
    
    const metadata = {
      pageCount: pdfDoc.getPageCount(),
      title: pdfDoc.getTitle(),
      author: pdfDoc.getAuthor(),
      subject: pdfDoc.getSubject(),
      creator: pdfDoc.getCreator(),
      producer: pdfDoc.getProducer(),
      creationDate: pdfDoc.getCreationDate(),
      modificationDate: pdfDoc.getModificationDate(),
      isEncrypted: pdfDoc.isEncrypted()
    };
    
    return metadata;
    
  } catch (error) {
    console.error('Error getting PDF metadata:', error);
    throw new Error(`Failed to get PDF metadata: ${error.message}`);
  }
};

module.exports = {
  encryptPDF,
  validatePDFFormat,
  getPDFMetadata
};
