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

    console.log('EncryptPDF - Input validation passed');
    console.log('EncryptPDF - PDF length:', pdfBase64.length);
    console.log('EncryptPDF - Password length:', password.length);

    // Remove data URL prefix if present
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    console.log('EncryptPDF - Base64 data length after cleanup:', base64Data.length);
    
    // Convert base64 to bytes
    const pdfBytes = Buffer.from(base64Data, 'base64');
    console.log('EncryptPDF - PDF bytes length:', pdfBytes.length);
    
    // Load the PDF document
    console.log('EncryptPDF - Loading PDF document...');
    const pdfDoc = await PDFDocument.load(pdfBytes);
    console.log('EncryptPDF - PDF loaded successfully, pages:', pdfDoc.getPageCount());
    
    // Encrypt the PDF with password
    console.log('EncryptPDF - Starting encryption...');
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
    console.log('EncryptPDF - Encryption applied');
    
    // Save the encrypted PDF
    console.log('EncryptPDF - Saving encrypted PDF...');
    const encryptedPdfBytes = await pdfDoc.save();
    console.log('EncryptPDF - Encrypted PDF saved, length:', encryptedPdfBytes.length);
    
    // Convert back to base64
    const encryptedBase64 = Buffer.from(encryptedPdfBytes).toString('base64');
    console.log('EncryptPDF - Successfully converted to base64');
    
    return encryptedBase64;
    
  } catch (error) {
    console.error('Error encrypting PDF:', error);
    console.error('Error stack:', error.stack);
    
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
    
    console.log('validatePDFFormat - base64Data length:', base64Data.length);
    
    // Check if it's a valid base64 string
    try {
      const pdfBytes = Buffer.from(base64Data, 'base64');
      console.log('validatePDFFormat - pdfBytes length:', pdfBytes.length);
      
      // Check minimum size (PDF should be at least a few hundred bytes)
      if (pdfBytes.length < 50) {
        console.log('validatePDFFormat - FAILED: too small');
        return { valid: false, error: 'PDF data is too small' };
      }
      
      // Check maximum size (10MB)
      const maxSize = 10 * 1024 * 1024;
      if (pdfBytes.length > maxSize) {
        console.log('validatePDFFormat - FAILED: too large');
        return { valid: false, error: 'PDF size exceeds 10MB limit' };
      }
      
      console.log('validatePDFFormat - PASSED');
      return { valid: true };
      
    } catch (error) {
      console.log('validatePDFFormat - FAILED: base64 decode error:', error.message);
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
