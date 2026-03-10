import { PDFDocument } from 'pdf-lib'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import toast from 'react-hot-toast'

/**
 * Generate password-protected PDF entirely on client-side using pdf-lib
 * No backend encryption needed - avoids base64 transfer issues
 */

/**
 * Generate PDF from resume preview and encrypt with password
 * @param {Object} resumeData - Resume data object
 * @param {string} previewElementId - ID of the resume preview element
 * @param {boolean} download - Whether to download the PDF
 * @returns {Promise<Object>} - Object with pdfBase64, password, and fileName
 */
export const generateProtectedPDFClient = async (resumeData, previewElementId = 'resume-preview', download = true) => {
  try {
    console.log('🟢 CLIENT-SIDE PDF generation started')
    toast.loading('Generating PDF...', { id: 'pdf-generation' })

    // Get the resume preview element
    const resumeElement = document.getElementById(previewElementId) || 
                         document.querySelector('.resume-preview') ||
                         document.querySelector('[data-resume-preview]')

    if (!resumeElement) {
      throw new Error('Resume preview element not found')
    }

    // Capture resume as image using html2canvas
    const canvas = await html2canvas(resumeElement, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false
    })

    // Convert canvas to image data
    const imgData = canvas.toDataURL('image/png')

    // Create PDF using jsPDF
    const pdf = new jsPDF('p', 'mm', 'a4')
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = pdf.internal.pageSize.getHeight()

    // Calculate image dimensions to fit PDF
    const imgProps = pdf.getImageProperties(imgData)
    const ratio = Math.min(pdfWidth / imgProps.width, pdfHeight / imgProps.height)
    const imgX = (pdfWidth - imgProps.width * ratio) / 2
    const imgY = 0

    // Add image to PDF
    pdf.addImage(imgData, 'PNG', imgX, imgY, imgProps.width * ratio, imgProps.height * ratio)

    // Get PDF as array buffer (not base64)
    const pdfBytes = pdf.output('arraybuffer')

    // Generate password
    const firstName = resumeData.personalInfo?.fullName?.split(' ')[0] || 'User'
    const dob = resumeData.personalInfo?.dateOfBirth || new Date().toISOString().split('T')[0]
    const date = new Date(dob)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const password = `${firstName}-${day}${month}${year}`

    // Encrypt PDF using pdf-lib (client-side)
    toast.loading('Encrypting PDF...', { id: 'pdf-generation' })

    const pdfDoc = await PDFDocument.load(pdfBytes)
    
    // Apply password protection
    pdfDoc.encrypt({
      userPassword: password,
      ownerPassword: password,
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: false,
        fillingForms: false,
        contentAccessibility: false,
        documentAssembly: false
      }
    })

    // Save encrypted PDF
    const encryptedPdfBytes = await pdfDoc.save()
    
    // Convert to base64 for storage/transmission
    const encryptedPdfBase64 = btoa(
      new Uint8Array(encryptedPdfBytes).reduce((data, byte) => data + String.fromCharCode(byte), '')
    )

    // Download if requested
    if (download) {
      const fileName = `${resumeData.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_Protected.pdf`
      
      // Create download link
      const blob = new Blob([encryptedPdfBytes], { type: 'application/pdf' })
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)

      toast.success('PDF downloaded successfully!', { id: 'pdf-generation' })
    }

    return {
      pdfBase64: encryptedPdfBase64,
      password: password,
      fileName: `${resumeData.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_Protected.pdf`,
      pdfBytes: encryptedPdfBytes // Raw bytes for direct upload
    }

  } catch (error) {
    console.error('Error generating protected PDF:', error)
    toast.error(`Failed to generate PDF: ${error.message}`, { id: 'pdf-generation' })
    throw error
  }
}

/**
 * Generate password from user data
 * @param {string} fullName - User's full name
 * @param {string} dateOfBirth - User's date of birth (YYYY-MM-DD)
 * @returns {string} - Password in format FirstName-DDMMYYYY
 */
export const generatePassword = (fullName, dateOfBirth) => {
  const firstName = fullName?.split(' ')[0] || 'User'
  
  if (!dateOfBirth) {
    const today = new Date()
    const day = String(today.getDate()).padStart(2, '0')
    const month = String(today.getMonth() + 1).padStart(2, '0')
    const year = today.getFullYear()
    return `${firstName}-${day}${month}${year}`
  }

  const date = new Date(dateOfBirth)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  
  return `${firstName}-${day}${month}${year}`
}

/**
 * Fallback method: Generate simple PDF if html2canvas fails
 * @param {Object} resumeData - Resume data object
 * @param {string} password - Password for encryption
 * @returns {Promise<Object>} - Object with pdfBase64, password, and fileName
 */
export const generateSimplePDF = async (resumeData, password) => {
  try {
    toast.loading('Generating PDF (simple method)...', { id: 'pdf-generation' })

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    let yPosition = 20

    // Helper to add text
    const addText = (text, x, y, fontSize = 12, fontStyle = 'normal') => {
      pdf.setFontSize(fontSize)
      pdf.setFont('helvetica', fontStyle)
      const lines = pdf.splitTextToSize(text, pageWidth - 40)
      lines.forEach(line => {
        if (y > 280) {
          pdf.addPage()
          y = 20
        }
        pdf.text(line, x, y)
        y += fontSize * 0.5 + 2
      })
      return y
    }

    // Add content
    if (resumeData.personalInfo?.fullName) {
      yPosition = addText(resumeData.personalInfo.fullName, 20, yPosition, 20, 'bold')
    }
    
    if (resumeData.personalInfo?.email) {
      yPosition = addText(`Email: ${resumeData.personalInfo.email}`, 20, yPosition, 10)
    }
    
    if (resumeData.personalInfo?.phone) {
      yPosition = addText(`Phone: ${resumeData.personalInfo.phone}`, 20, yPosition, 10)
    }

    yPosition += 10

    // Add sections
    if (resumeData.objective) {
      yPosition = addText('OBJECTIVE', 20, yPosition, 14, 'bold')
      yPosition = addText(resumeData.objective, 20, yPosition, 11)
      yPosition += 5
    }

    if (resumeData.education?.length > 0) {
      yPosition = addText('EDUCATION', 20, yPosition, 14, 'bold')
      resumeData.education.forEach(edu => {
        yPosition = addText(`${edu.degree} - ${edu.institution}`, 20, yPosition, 11, 'bold')
        yPosition = addText(`${edu.yearFrom} - ${edu.yearTo}`, 20, yPosition, 10)
        yPosition += 3
      })
      yPosition += 5
    }

    if (resumeData.workExperience?.length > 0) {
      yPosition = addText('WORK EXPERIENCE', 20, yPosition, 14, 'bold')
      resumeData.workExperience.forEach(exp => {
        yPosition = addText(`${exp.jobTitle} - ${exp.company}`, 20, yPosition, 11, 'bold')
        if (exp.duration) yPosition = addText(`Duration: ${exp.duration}`, 20, yPosition, 10)
        if (exp.description) yPosition = addText(exp.description, 20, yPosition, 10)
        yPosition += 3
      })
      yPosition += 5
    }

    if (resumeData.skills?.length > 0) {
      yPosition = addText('SKILLS', 20, yPosition, 14, 'bold')
      const skillsText = resumeData.skills.map(s => s.name).join(', ')
      yPosition = addText(skillsText, 20, yPosition, 11)
    }

    // Get PDF bytes
    const pdfBytes = pdf.output('arraybuffer')

    // Encrypt with pdf-lib
    const pdfDoc = await PDFDocument.load(pdfBytes)
    pdfDoc.encrypt({
      userPassword: password,
      ownerPassword: password,
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: false
      }
    })

    const encryptedPdfBytes = await pdfDoc.save()
    const encryptedPdfBase64 = btoa(
      new Uint8Array(encryptedPdfBytes).reduce((data, byte) => data + String.fromCharCode(byte), '')
    )

    // Download
    const fileName = `${resumeData.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_Protected.pdf`
    const blob = new Blob([encryptedPdfBytes], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)

    toast.success('PDF generated successfully!', { id: 'pdf-generation' })

    return {
      pdfBase64: encryptedPdfBase64,
      password: password,
      fileName: fileName,
      pdfBytes: encryptedPdfBytes
    }

  } catch (error) {
    console.error('Error in simple PDF generation:', error)
    toast.error(`Failed to generate PDF: ${error.message}`, { id: 'pdf-generation' })
    throw error
  }
}
