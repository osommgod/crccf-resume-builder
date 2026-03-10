import React, { useState } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'
import { generatePDF } from '../utils/generatePDF'
import { generatePassword } from '../utils/passwordUtils'

/**
 * EmailModal component - Send resume via email with password-protected PDF
 * Includes email validation and sending functionality
 */
const EmailModal = ({ onClose, resumeData }) => {
  const [recipientEmail, setRecipientEmail] = useState(resumeData.personalInfo.email || '')
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)

  // API base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  /**
   * Validate email format
   */
  const validateEmail = (email) => {
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
    return emailRegex.test(email)
  }

  /**
   * Handle email submission
   */
  const handleSendEmail = async () => {
    // Validate email
    if (!recipientEmail.trim()) {
      toast.error('Please enter recipient email address')
      return
    }

    if (!validateEmail(recipientEmail)) {
      toast.error('Please enter a valid email address')
      return
    }

    setIsSending(true)

    try {
      // Generate password
      const password = generatePassword(
        resumeData.personalInfo.fullName,
        resumeData.personalInfo.dateOfBirth
      )

      // Generate PDF
      const pdfBase64 = await generatePDF(resumeData, password, false) // Don't download, just get base64

      // Send email via backend
      const response = await axios.post(`${API_URL}/api/email/send-email`, {
        resumeBase64: pdfBase64,
        password: password,
        recipientEmail: recipientEmail,
        userName: resumeData.personalInfo.fullName
      })

      if (response.data.success) {
        setEmailSent(true)
        toast.success(`Resume sent successfully to ${recipientEmail}`)
      } else {
        throw new Error(response.data.error || 'Failed to send email')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      
      if (error.response) {
        // Backend error
        const errorMessage = error.response.data?.error || error.response.data?.message || 'Server error'
        toast.error(`Failed to send email: ${errorMessage}`)
      } else if (error.request) {
        // Network error
        toast.error('Network error. Please check your connection and try again.')
      } else {
        // Other error
        toast.error('Failed to send email. Please try again.')
      }
    } finally {
      setIsSending(false)
    }
  }

  /**
   * Handle modal close
   */
  const handleClose = () => {
    if (!isSending) {
      onClose()
    }
  }

  /**
   * Handle keyboard events
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !isSending) {
      handleClose()
    }
  }

  /**
   * Handle form submission
   */
  const handleSubmit = (e) => {
    e.preventDefault()
    handleSendEmail()
  }

  return (
    <div className="modal-overlay" onClick={handleClose} onKeyDown={handleKeyDown} tabIndex={-1}>
      <div 
        className="modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <i className="fas fa-envelope text-blue-600 mr-3"></i>
            Send Resume via Email
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            disabled={isSending}
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {!emailSent ? (
          <>
            {/* Email Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Recipient Email */}
              <div>
                <label className="form-label">
                  Recipient Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="john@example.com"
                  disabled={isSending}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Enter the email address where you want to receive the resume
                </p>
              </div>

              {/* Resume Preview Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Resume Summary
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Name:</span>
                    <p className="text-gray-600">{resumeData.personalInfo.fullName || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Email:</span>
                    <p className="text-gray-600">{resumeData.personalInfo.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <p className="text-gray-600">{resumeData.personalInfo.phone || 'Not provided'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Education:</span>
                    <p className="text-gray-600">{resumeData.education.length} entries</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Experience:</span>
                    <p className="text-gray-600">{resumeData.workExperience.length} entries</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Skills:</span>
                    <p className="text-gray-600">{resumeData.skills.length} entries</p>
                  </div>
                </div>
              </div>

              {/* Password Information */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-medium text-yellow-900 mb-2">
                  <i className="fas fa-lock mr-2"></i>
                  Password Protection
                </h4>
                <p className="text-sm text-yellow-800 mb-2">
                  Your resume will be sent as a password-protected PDF file.
                </p>
                <div className="bg-white rounded p-3 border border-yellow-300">
                  <p className="text-sm font-medium text-yellow-900">
                    Password: {generatePassword(resumeData.personalInfo.fullName, resumeData.personalInfo.dateOfBirth)}
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Format: FirstName-DDMMYYYY
                  </p>
                </div>
              </div>

              {/* Email Content Preview */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">
                  <i className="fas fa-info-circle mr-2"></i>
                  What will be sent:
                </h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Password-protected PDF of your resume</li>
                  <li>• Resume password for opening the PDF</li>
                  <li>• Professional email formatting</li>
                  <li>• Instructions for using the resume</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-outline"
                  disabled={isSending}
                >
                  <i className="fas fa-times mr-2"></i>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSending}
                >
                  {isSending ? (
                    <>
                      <div className="spinner w-4 h-4 mr-2"></div>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-paper-plane mr-2"></i>
                      Send Resume
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* Success State */
          <div className="text-center py-8">
            {/* Success Icon */}
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
              <i className="fas fa-check text-green-600 text-2xl"></i>
            </div>

            {/* Success Message */}
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Resume Sent Successfully!
            </h3>
            <p className="text-gray-600 mb-6">
              Your resume has been sent to <strong>{recipientEmail}</strong>
            </p>

            {/* Password Reminder */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left max-w-md mx-auto">
              <h4 className="font-medium text-yellow-900 mb-2">
                <i className="fas fa-lock mr-2"></i>
                Important: Save Your Password
              </h4>
              <div className="bg-white rounded p-3 border border-yellow-300 mb-2">
                <p className="font-mono text-center text-lg font-bold text-yellow-900">
                  {generatePassword(resumeData.personalInfo.fullName, resumeData.personalInfo.dateOfBirth)}
                </p>
              </div>
              <p className="text-sm text-yellow-800">
                You will need this password to open the PDF file. Save it in a secure location.
              </p>
            </div>

            {/* Next Steps */}
            <div className="text-sm text-gray-600 mb-6">
              <p>Check your email inbox for the resume PDF.</p>
              <p>If you don't see it within a few minutes, check your spam folder.</p>
            </div>

            {/* Close Button */}
            <button
              onClick={handleClose}
              className="btn btn-primary"
            >
              <i className="fas fa-check mr-2"></i>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailModal
