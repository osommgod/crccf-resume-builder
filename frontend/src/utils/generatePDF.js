import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import axiosInstance from './axiosInstance'
import toast from 'react-hot-toast'

/**
 * Generate PDF from resume preview with password protection
 * Uses html2canvas to capture DOM and jsPDF to create PDF
 * Sends to backend for password encryption
 */

// API base URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

/**
 * Generate PDF from resume data
 * @param {Object} resumeData - Resume data object
 * @param {string} password - Password for PDF protection
 * @param {boolean} download - Whether to download the PDF or return base64
 * @returns {Promise<string>} - Base64 string of the encrypted PDF
 */
export const generatePDF = async (resumeData, password, download = true) => {
  try {
    // Get the resume preview element - try multiple selectors
    let resumeElement = document.querySelector('.resume-preview')
    
    if (!resumeElement) {
      // Fallback to other possible selectors
      resumeElement = document.querySelector('[data-resume-preview]') ||
                     document.querySelector('.resume-container') ||
                     document.querySelector('#resume-preview')
    }
    
    if (!resumeElement) {
      console.error('Resume preview element not found. Available elements:', 
        document.querySelectorAll('[class*="resume"]'))
      throw new Error('Resume preview element not found. Please ensure the resume preview is visible.')
    }

    // Show loading state
    toast.loading('Generating PDF...', { id: 'pdf-generation' })

    // Ensure element is visible
    const originalDisplay = resumeElement.style.display
    const originalVisibility = resumeElement.style.visibility
    resumeElement.style.display = 'block'
    resumeElement.style.visibility = 'visible'

    try {
      // Configure html2canvas options for high quality
      const canvas = await html2canvas(resumeElement, {
        scale: 2, // Higher scale for better quality
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: resumeElement.scrollWidth,
        height: resumeElement.scrollHeight,
        windowWidth: resumeElement.scrollWidth,
        windowHeight: resumeElement.scrollHeight,
        onclone: (clonedDoc) => {
          // Ensure styles are applied in cloned document
          const clonedElement = clonedDoc.querySelector('.resume-preview')
          if (clonedElement) {
            clonedElement.style.display = 'block'
            clonedElement.style.visibility = 'visible'
          }
        }
      })

    // Create PDF from canvas
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    // A4 dimensions in mm
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()
    
    // Calculate image dimensions to fit A4
    const imgWidth = canvas.width
    const imgHeight = canvas.height
    const ratio = Math.min(pdfWidth / (imgWidth * 0.264583), pdfHeight / (imgHeight * 0.264583))
    const imgX = (pdfWidth - imgWidth * ratio * 0.264583) / 2
    const imgY = 0
    
    // Add image to PDF
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio * 0.264583, imgHeight * ratio * 0.264583)
    
    // Get PDF as base64
    const pdfBase64 = pdf.output('datauristring')
    
    // Remove data URL prefix for backend
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '')
    
    // Send to backend for password protection
    const response = await axiosInstance.post('/pdf/generate-pdf', {
      pdfBase64: base64Data,
      password: password
    })

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to encrypt PDF')
    }

    const encryptedBase64 = response.data.data.pdfBase64
    
    // Download if requested
    if (download) {
      const link = document.createElement('a')
      link.href = `data:application/pdf;base64,${encryptedBase64}`
      link.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }

    // Show success message
    toast.success('PDF generated successfully!', { id: 'pdf-generation' })
    
    // Restore original element styles
    resumeElement.style.display = originalDisplay
    resumeElement.style.visibility = originalVisibility
    
    return encryptedBase64
    
    } catch (canvasError) {
      // Restore original element styles on canvas error
      resumeElement.style.display = originalDisplay
      resumeElement.style.visibility = originalVisibility
      throw canvasError
    }

  } catch (error) {
    console.error('Error generating PDF:', error)
    toast.error(`Failed to generate PDF: ${error.message}`, { id: 'pdf-generation' })
    throw error
  }
}

/**
 * Generate PDF from image (alternative method)
 * @param {string} imageBase64 - Base64 image data
 * @param {string} password - Password for PDF protection
 * @param {string} fileName - Name for the downloaded file
 * @returns {Promise<string>} - Base64 string of the encrypted PDF
 */
export const generatePDFFromImage = async (imageBase64, password, fileName = 'resume') => {
  try {
    toast.loading('Creating PDF from image...', { id: 'pdf-generation' })

    // Send to backend for PDF creation and encryption
    const response = await axiosInstance.post('/pdf/create-from-image', {
      imageBase64: imageBase64,
      password: password
    })

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to create PDF')
    }

    const encryptedBase64 = response.data.data.pdfBase64
    
    // Download the PDF
    const link = document.createElement('a')
    link.href = `data:application/pdf;base64,${encryptedBase64}`
    link.download = `${fileName.replace(/\s+/g, '_')}_Resume.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('PDF created successfully!', { id: 'pdf-generation' })
    
    return encryptedBase64

  } catch (error) {
    console.error('Error creating PDF from image:', error)
    toast.error(`Failed to create PDF: ${error.message}`, { id: 'pdf-generation' })
    throw error
  }
}

/**
 * Validate PDF format and size
 * @param {string} pdfBase64 - Base64 PDF data
 * @returns {Object} - Validation result
 */
export const validatePDF = (pdfBase64) => {
  try {
    // Check if it's a valid base64 string
    if (!pdfBase64 || typeof pdfBase64 !== 'string') {
      return { valid: false, error: 'Invalid PDF data' }
    }

    // Check if it starts with PDF signature
    const pdfData = atob(pdfBase64)
    if (!pdfData.startsWith('%PDF-')) {
      return { valid: false, error: 'Invalid PDF format' }
    }

    // Check size (limit to 10MB)
    const sizeInBytes = pdfBase64.length * 0.75 // Approximate size
    const maxSizeInBytes = 10 * 1024 * 1024 // 10MB
    
    if (sizeInBytes > maxSizeInBytes) {
      return { valid: false, error: 'PDF size exceeds 10MB limit' }
    }

    return { valid: true }
  } catch (error) {
    return { valid: false, error: 'Failed to validate PDF' }
  }
}

/**
 * Get PDF info from backend
 * @returns {Promise<Object>} - PDF processing information
 */
export const getPDFInfo = async () => {
  try {
    const response = await axiosInstance.get('/pdf/info')
    
    if (response.data.success) {
      return response.data.data
    } else {
      throw new Error(response.data.error || 'Failed to get PDF info')
    }
  } catch (error) {
    console.error('Error getting PDF info:', error)
    throw error
  }
}

/**
 * Print resume directly (alternative to PDF download)
 * @param {Object} resumeData - Resume data object
 */
export const printResume = (resumeData) => {
  try {
    // Create a new window for printing
    const printWindow = window.open('', '_blank')
    
    if (!printWindow) {
      throw new Error('Failed to open print window. Please allow popups.')
    }

    // Get the resume HTML
    const resumeElement = document.querySelector('.resume-preview')
    if (!resumeElement) {
      throw new Error('Resume preview not found')
    }

    // Clone the resume content
    const resumeHTML = resumeElement.outerHTML
    
    // Create print-friendly HTML
    const printHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Resume - ${resumeData.personalInfo.fullName}</title>
        <style>
          body { margin: 0; padding: 20px; font-family: 'Roboto', sans-serif; }
          .no-print { display: none !important; }
          @media print {
            body { margin: 0; padding: 0; }
            .page-break { page-break-before: always; }
          }
        </style>
      </head>
      <body>
        ${resumeHTML}
      </body>
      </html>
    `
    
    // Write to print window
    printWindow.document.write(printHTML)
    printWindow.document.close()
    
    // Wait for content to load, then print
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }

    toast.success('Print dialog opened')
    
  } catch (error) {
    console.error('Error printing resume:', error)
    toast.error(`Failed to print: ${error.message}`)
  }
}

export default {
  generatePDF,
  generatePDFFromImage,
  validatePDF,
  getPDFInfo,
  printResume
}
