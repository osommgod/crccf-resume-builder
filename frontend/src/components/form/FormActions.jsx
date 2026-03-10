import React, { useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { generateSimplePDF, generatePassword } from '../../utils/simplePDF'
import PasswordModal from '../shared/PasswordModal'
import EmailModal from '../shared/EmailModal'
import WhatsAppModal from '../shared/WhatsAppModal'
import RequiredFieldsSummary from './RequiredFieldsSummary'
import toast from 'react-hot-toast'

/**
 * PDF Download, Email, Print buttons + validation
 * Handles all form actions and modal states
 */
const FormActions = ({ 
  disabled = false, 
  showPreview = false, 
  onTogglePreview, 
  onValidate,
  completionPercentage 
}) => {
  const { resumeData, validateResume, resetResume } = useResume()
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showWhatsAppModal, setShowWhatsAppModal] = useState(false)
  const [generatedPDF, setGeneratedPDF] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Handle PDF generation - Client-side encryption
  const handleGeneratePDF = async () => {
    // Validate form first
    const validation = onValidate ? onValidate() : validateResume()
    if (!validation.isValid) {
      // Show detailed error messages
      const errorMessages = validation.errors.slice(0, 3) // Show first 3 errors
      const errorMessage = errorMessages.length > 1 
        ? `Please complete these required fields:\n• ${errorMessages.join('\n• ')}`
        : `Please complete this required field: ${errorMessages[0]}`
      
      toast.error(errorMessage, {
        duration: 5000,
        style: {
          maxWidth: '500px',
          whiteSpace: 'pre-line'
        }
      })
      return
    }

    setIsGenerating(true)
    
    try {
      // Use simple PDF generation (like working project)
      console.log('🟢 FormActions: Calling simple PDF generation')
      const result = await generateSimplePDF(resumeData)
      setGeneratedPDF(result)
      setShowPasswordModal(true)
      toast.success('PDF generated and downloaded successfully!')
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle email sending - Client-side PDF generation
  const handleSendEmail = async () => {
    // Validate form first
    const validation = onValidate ? onValidate() : validateResume()
    if (!validation.isValid) {
      // Show detailed error messages
      const errorMessages = validation.errors.slice(0, 3) // Show first 3 errors
      const errorMessage = errorMessages.length > 1 
        ? `Please complete these required fields before sending email:\n• ${errorMessages.join('\n• ')}`
        : `Please complete this required field before sending email: ${errorMessages[0]}`
      
      toast.error(errorMessage, {
        duration: 5000,
        style: {
          maxWidth: '500px',
          whiteSpace: 'pre-line'
        }
      })
      return
    }

    setShowEmailModal(true)
  }

  // Handle print - improved version with print-only CSS
  const handlePrint = () => {
    // Validate form first
    const validation = onValidate ? onValidate() : validateResume()
    if (!validation.isValid) {
      // Show detailed error messages
      const errorMessages = validation.errors.slice(0, 3) // Show first 3 errors
      const errorMessage = errorMessages.length > 1 
        ? `Please complete these required fields before printing:\n• ${errorMessages.join('\n• ')}`
        : `Please complete this required field before printing: ${errorMessages[0]}`
      
      toast.error(errorMessage, {
        duration: 5000,
        style: {
          maxWidth: '500px',
          whiteSpace: 'pre-line'
        }
      })
      return
    }

    // Add print-only class to body for CSS targeting
    document.body.classList.add('printing-resume')
    
    // Trigger print
    window.print()
    
    // Remove class after print dialog closes
    setTimeout(() => {
      document.body.classList.remove('printing-resume')
    }, 1000)

    toast.success('Print dialog opened - only resume will be printed')
  }

  // Handle WhatsApp sharing
  const handleWhatsAppShare = async () => {
    // Validate form first
    const validation = onValidate ? onValidate() : validateResume()
    if (!validation.isValid) {
      // Show detailed error messages
      const errorMessages = validation.errors.slice(0, 3) // Show first 3 errors
      const errorMessage = errorMessages.length > 1 
        ? `Please complete these required fields before sharing:\n• ${errorMessages.join('\n• ')}`
        : `Please complete this required field before sharing: ${errorMessages[0]}`
      
      toast.error(errorMessage, {
        duration: 5000,
        style: {
          maxWidth: '500px',
          whiteSpace: 'pre-line'
        }
      })
      return
    }

    setShowWhatsAppModal(true)
  }

  // Handle reset form
  const handleResetForm = () => {
    if (window.confirm('Are you sure you want to reset all form data? This action cannot be undone.')) {
      resetResume()
      setGeneratedPDF(null)
      toast.success('Form reset successfully')
    }
  }

  // Handle password modal close
  const handlePasswordModalClose = () => {
    setShowPasswordModal(false)
  }

  // Handle email modal close
  const handleEmailModalClose = () => {
    setShowEmailModal(false)
  }

  // Handle WhatsApp modal close
  const handleWhatsAppModalClose = () => {
    setShowWhatsAppModal(false)
  }

  // Get password for display
  const getPassword = () => {
    if (generatedPDF) {
      return generatedPDF.password
    }
    return generatePassword(resumeData.personalInfo.fullName, resumeData.personalInfo.dateOfBirth)
  }

  const isFormValid = completionPercentage >= 75 // Consider valid at 75% completion

  return (
    <>
      <div className="border-t border-gray-200 px-6 py-4 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          {/* Left side - Preview toggle */}
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={onTogglePreview}
              className="btn btn-outline"
              disabled={disabled}
            >
              <i className={`fas ${showPreview ? 'fa-edit' : 'fa-eye'} mr-2`}></i>
              {showPreview ? 'Edit Mode' : 'Preview Mode'}
            </button>
            
            <button
              type="button"
              onClick={handleResetForm}
              className="btn btn-ghost text-red-600 hover:text-red-700 hover:bg-red-50"
              disabled={disabled}
            >
              <i className="fas fa-redo mr-2"></i>
              Reset
            </button>
          </div>

          {/* Right side - Action buttons */}
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={handlePrint}
              disabled={disabled || !isFormValid}
              className="btn btn-secondary"
              title="Print resume"
            >
              <i className="fas fa-print mr-2"></i>
              Print
            </button>

            <button
              type="button"
              onClick={handleSendEmail}
              disabled={disabled || !isFormValid || isGenerating}
              className="btn btn-success"
              title="Send via email"
            >
              <i className="fas fa-envelope mr-2"></i>
              Email
            </button>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              disabled={disabled || !isFormValid || isGenerating}
              className="btn btn-whatsapp"
              title="Share via WhatsApp"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              WhatsApp
            </button>

            <button
              type="button"
              onClick={handleGeneratePDF}
              disabled={disabled || !isFormValid || isGenerating}
              className="btn btn-primary"
              title="Download password-protected PDF"
            >
              {isGenerating ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                <>
                  <i className="fas fa-download mr-2"></i>
                  Download PDF
                </>
              )}
            </button>
          </div>
        </div>

        {/* Required Fields Summary */}
        <RequiredFieldsSummary />

        {/* Progress indicator */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Form Completion</span>
            <span className="text-sm font-medium text-gray-900">{completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-300 ${
                completionPercentage >= 75 ? 'bg-green-600' : 
                completionPercentage >= 50 ? 'bg-yellow-600' : 
                'bg-red-600'
              }`}
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>
          {completionPercentage < 75 && (
            <p className="mt-1 text-xs text-gray-500">
              Complete all required fields to enable PDF download, email, and print features
            </p>
          )}
        </div>
      </div>

      {/* Password Modal */}
      <PasswordModal
        isOpen={showPasswordModal}
        onClose={handlePasswordModalClose}
        password={getPassword()}
        userName={resumeData.personalInfo.fullName}
        fileName={generatedPDF?.fileName}
        onDownloadComplete={() => {
          handlePasswordModalClose()
          toast.success('PDF downloaded successfully!')
        }}
      />

      {/* Email Modal */}
      <EmailModal
        isOpen={showEmailModal}
        onClose={handleEmailModalClose}
        resumeData={resumeData}
        password={getPassword()}
        onEmailSent={(email) => {
          handleEmailModalClose()
          toast.success(`Resume sent to ${email}!`)
        }}
      />

      {/* WhatsApp Modal */}
      <WhatsAppModal
        isOpen={showWhatsAppModal}
        onClose={handleWhatsAppModalClose}
        resumeData={resumeData}
        password={getPassword()}
        resumeBase64={generatedPDF?.pdfBase64}
      />
    </>
  )
}

export default FormActions
