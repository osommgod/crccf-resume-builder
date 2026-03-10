import jsPDF from 'jspdf'
import axiosInstance from './axiosInstance'
import toast from 'react-hot-toast'

/**
 * Fallback PDF generation method that creates PDF from data directly
 * Used when DOM-based generation fails
 */
export const generatePDFFallback = async (resumeData, password) => {
  try {
    toast.loading('Generating PDF (fallback method)...', { id: 'pdf-generation' })

    const pdf = new jsPDF('p', 'mm', 'a4')
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    let yPosition = 20

    // Helper function to add text with word wrap
    const addText = (text, x, y, fontSize = 12, fontStyle = 'normal') => {
      pdf.setFontSize(fontSize)
      pdf.setFont('helvetica', fontStyle)
      const lines = pdf.splitTextToSize(text, pageWidth - 40)
      lines.forEach(line => {
        if (y > pageHeight - 20) {
          pdf.addPage()
          y = 20
        }
        pdf.text(line, x, y)
        y += fontSize * 0.5 + 2
      })
      return y
    }

    // Add personal information
    if (resumeData.personalInfo.fullName) {
      yPosition = addText(resumeData.personalInfo.fullName, 20, yPosition, 20, 'bold')
    }
    
    if (resumeData.personalInfo.email) {
      yPosition = addText(`Email: ${resumeData.personalInfo.email}`, 20, yPosition, 10)
    }
    
    if (resumeData.personalInfo.phone) {
      yPosition = addText(`Phone: ${resumeData.personalInfo.phone}`, 20, yPosition, 10)
    }
    
    if (resumeData.personalInfo.address) {
      yPosition = addText(`Address: ${resumeData.personalInfo.address}`, 20, yPosition, 10)
    }

    yPosition += 10

    // Add objective
    if (resumeData.objective) {
      yPosition = addText('OBJECTIVE', 20, yPosition, 14, 'bold')
      yPosition = addText(resumeData.objective, 20, yPosition, 11)
      yPosition += 5
    }

    // Add education
    if (resumeData.education && resumeData.education.length > 0) {
      yPosition = addText('EDUCATION', 20, yPosition, 14, 'bold')
      resumeData.education.forEach(edu => {
        yPosition = addText(`${edu.degree} - ${edu.institution}`, 20, yPosition, 11, 'bold')
        yPosition = addText(`${edu.yearFrom} - ${edu.yearTo} | Percentage: ${edu.percentage}%`, 20, yPosition, 10)
        yPosition += 3
      })
      yPosition += 5
    }

    // Add work experience
    if (resumeData.workExperience && resumeData.workExperience.length > 0) {
      yPosition = addText('WORK EXPERIENCE', 20, yPosition, 14, 'bold')
      resumeData.workExperience.forEach(exp => {
        yPosition = addText(`${exp.jobTitle} - ${exp.company}`, 20, yPosition, 11, 'bold')
        if (exp.duration) {
          yPosition = addText(`Duration: ${exp.duration}`, 20, yPosition, 10)
        }
        if (exp.description) {
          yPosition = addText(exp.description, 20, yPosition, 10)
        }
        yPosition += 3
      })
      yPosition += 5
    }

    // Add skills
    if (resumeData.skills && resumeData.skills.length > 0) {
      yPosition = addText('SKILLS', 20, yPosition, 14, 'bold')
      const skillsText = resumeData.skills.map(skill => `${skill.name} (${skill.proficiency})`).join(', ')
      yPosition = addText(skillsText, 20, yPosition, 11)
      yPosition += 5
    }

    // Add projects
    if (resumeData.projects && resumeData.projects.length > 0) {
      yPosition = addText('PROJECTS', 20, yPosition, 14, 'bold')
      resumeData.projects.forEach(project => {
        yPosition = addText(project.name, 20, yPosition, 11, 'bold')
        if (project.techStack) {
          yPosition = addText(`Tech Stack: ${project.techStack}`, 20, yPosition, 10)
        }
        if (project.description) {
          yPosition = addText(project.description, 20, yPosition, 10)
        }
        yPosition += 3
      })
      yPosition += 5
    }

    // Add certifications
    if (resumeData.certifications && resumeData.certifications.length > 0) {
      yPosition = addText('CERTIFICATIONS', 20, yPosition, 14, 'bold')
      resumeData.certifications.forEach(cert => {
        yPosition = addText(`${cert.name} - ${cert.issuer}`, 20, yPosition, 11)
        if (cert.year) {
          yPosition = addText(`Year: ${cert.year}`, 20, yPosition, 10)
        }
        yPosition += 3
      })
      yPosition += 5
    }

    // Add languages
    if (resumeData.languages && resumeData.languages.length > 0) {
      yPosition = addText('LANGUAGES', 20, yPosition, 14, 'bold')
      const languagesText = resumeData.languages.map(lang => `${lang.language} (${lang.proficiency})`).join(', ')
      yPosition = addText(languagesText, 20, yPosition, 11)
      yPosition += 5
    }

    // Add hobbies
    if (resumeData.hobbies) {
      yPosition = addText('HOBBIES', 20, yPosition, 14, 'bold')
      yPosition = addText(resumeData.hobbies, 20, yPosition, 11)
    }

    // Get PDF as base64
    const pdfBase64 = pdf.output('datauristring')
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '')

    // Send to backend for password protection
    const response = await axiosInstance.post('/api/pdf/generate-pdf', {
      pdfBase64: base64Data,
      password: password
    })

    if (!response.data.success) {
      throw new Error(response.data.error || 'Failed to encrypt PDF')
    }

    const encryptedBase64 = response.data.data.pdfBase64

    // Download the PDF
    const link = document.createElement('a')
    link.href = `data:application/pdf;base64,${encryptedBase64}`
    link.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast.success('PDF generated successfully using fallback method!', { id: 'pdf-generation' })
    return encryptedBase64

  } catch (error) {
    console.error('Error in fallback PDF generation:', error)
    toast.error(`Failed to generate PDF: ${error.message}`, { id: 'pdf-generation' })
    throw error
  }
}

export default generatePDFFallback
