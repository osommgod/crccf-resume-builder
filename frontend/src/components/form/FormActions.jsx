import React, { useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { generateProtectedPDF } from '../../utils/generatePDF'
import { generatePassword } from '../../utils/generatePassword'
import PasswordModal from '../shared/PasswordModal'
import EmailModal from '../shared/EmailModal'
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
  const [generatedPDF, setGeneratedPDF] = useState(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Handle PDF generation
  const handleGeneratePDF = async () => {
    // Validate form first
    const validation = onValidate ? onValidate() : validateResume()
    if (!validation.isValid) {
      toast.error('Please complete all required fields before generating PDF')
      return
    }

    setIsGenerating(true)
    
    try {
      const result = await generateProtectedPDF(resumeData, 'resume-preview')
      setGeneratedPDF(result)
      setShowPasswordModal(true)
    } catch (error) {
      console.error('Error generating PDF:', error)
      toast.error('Failed to generate PDF. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  // Handle email sending
  const handleSendEmail = async () => {
    // Validate form first
    const validation = onValidate ? onValidate() : validateResume()
    if (!validation.isValid) {
      toast.error('Please complete all required fields before sending email')
      return
    }

    // Generate PDF if not already generated
    if (!generatedPDF) {
      setIsGenerating(true)
      try {
        const result = await generateProtectedPDF(resumeData, 'resume-preview')
        setGeneratedPDF(result)
        setShowEmailModal(true)
      } catch (error) {
        console.error('Error generating PDF:', error)
        toast.error('Failed to generate PDF. Please try again.')
      } finally {
        setIsGenerating(false)
      }
    } else {
      setShowEmailModal(true)
    }
  }

  // Handle print
  const handlePrint = () => {
    // Validate form first
    const validation = onValidate ? onValidate() : validateResume()
    if (!validation.isValid) {
      toast.error('Please complete all required fields before printing')
      return
    }

    // Print the resume preview
    const printWindow = window.open('', '_blank')
    if (!printWindow) {
      toast.error('Please allow popups for this website to use print feature')
      return
    }

    const resumeElement = document.getElementById('resume-preview')
    if (!resumeElement) {
      toast.error('Resume preview not found')
      return
    }

    const resumeHTML = resumeElement.outerHTML
    
    printWindow.document.write(`
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
    `)
    
    printWindow.document.close()
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print()
        printWindow.close()
      }, 500)
    }

    toast.success('Print dialog opened')
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
              Complete at least 75% of the form to enable PDF download and email features
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
        resumeBase64={generatedPDF?.pdfBase64}
        password={getPassword()}
        onEmailSent={(email) => {
          handleEmailModalClose()
          toast.success(`Resume sent to ${email}!`)
        }}
      />
    </>
  )
}

export default FormActions
