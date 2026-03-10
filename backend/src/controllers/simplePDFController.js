const generateSimplePDF = require('../services/simplePDFService');

/**
 * Simple PDF generation controller (like working project)
 * Direct PDF download without base64 corruption
 */
const generateSimplePDFController = async (req, res) => {
  try {
    console.log('🟢 Simple PDF controller received request')
    console.log('📋 Request body:', req.body)
    
    const { resumeData, password } = req.body;
    
    // Validate input
    if (!resumeData || !password) {
      console.log('❌ Missing required fields')
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: resumeData and password'
      });
    }
    
    console.log('🔑 Password received:', password)
    
    // Generate PDF
    console.log('📄 Generating PDF...')
    const pdfBytes = await generateSimplePDF(resumeData, password);
    
    console.log('✅ PDF generated successfully, size:', pdfBytes.length, 'bytes')
    
    // Send PDF directly (like working project)
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
    
    return res.send(Buffer.from(pdfBytes));
    
  } catch (error) {
    console.error('❌ Error in simple PDF controller:', error);
    return res.status(500).json({
      success: false,
      error: 'Failed to generate PDF'
    });
  }
};

module.exports = {
  generateSimplePDFController
};
