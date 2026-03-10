import axiosInstance from './axiosInstance'
import toast from 'react-hot-toast'

/**
 * Simple PDF generation (like working project)
 * Direct backend PDF generation without base64 corruption
 */
export const generateSimplePDF = async (resumeData) => {
  try {
    console.log('🟢 Simple PDF generation started')
    console.log('📋 Resume data:', resumeData)
    
    // Generate password
    const firstName = resumeData.personalInfo?.fullName?.split(' ')[0] || 'User'
    const dob = resumeData.personalInfo?.dateOfBirth || new Date().toISOString().split('T')[0]
    const date = new Date(dob)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const password = `${firstName}-${day}${month}${year}`
    
    console.log('🔑 Generated password:', password)
    
    toast.loading('Generating PDF...', { id: 'pdf-generation' })
    
    // Call simple PDF endpoint
    console.log('📡 Making API call to /api/simple-pdf/generate-simple-pdf')
    const response = await axiosInstance.post('/api/simple-pdf/generate-simple-pdf', {
      resumeData,
      password
    }, {
      responseType: 'blob' // Important: Get PDF as blob
    })
    
    console.log('✅ API response received:', response.status)
    console.log('📄 Response type:', response.data.type)
    
    // Create download link
    const blob = new Blob([response.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${resumeData.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_Protected.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    toast.success('PDF downloaded successfully!', { id: 'pdf-generation' })
    
    return {
      password: password,
      fileName: `${resumeData.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_Protected.pdf`
    }
    
  } catch (error) {
    console.error('❌ Error generating simple PDF:', error)
    toast.error('Failed to generate PDF. Please try again.', { id: 'pdf-generation' })
    throw error
  }
}

/**
 * Generate PDF for email (returns blob instead of downloading)
 */
export const generatePDFForEmail = async (resumeData) => {
  try {
    console.log('🟢 Generating PDF for email')
    
    // Generate password
    const firstName = resumeData.personalInfo?.fullName?.split(' ')[0] || 'User'
    const dob = resumeData.personalInfo?.dateOfBirth || new Date().toISOString().split('T')[0]
    const date = new Date(dob)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    const password = `${firstName}-${day}${month}${year}`
    
    // Call simple PDF endpoint
    const response = await axiosInstance.post('/api/simple-pdf/generate-simple-pdf', {
      resumeData,
      password
    }, {
      responseType: 'blob' // Important: Get PDF as blob
    })
    
    // Create blob and return
    const blob = new Blob([response.data], { type: 'application/pdf' })
    
    return {
      blob,
      password,
      fileName: `${resumeData.personalInfo?.fullName?.replace(/\s+/g, '_') || 'Resume'}_Protected.pdf`
    }
    
  } catch (error) {
    console.error('❌ Error generating PDF for email:', error)
    throw error
  }
}

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
