import React, { useState } from 'react'
import { validateEmail } from '../../utils/validators'
import axiosInstance from '../../utils/axiosInstance'

const EmailModal = ({ 
  isOpen, 
  onClose, 
  resumeData, 
  resumeBase64, 
  password,
  onEmailSent = null 
}) => {
  const [email, setEmail] = useState('')
  const [isSending, setIsSending] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [isSent, setIsSent] = useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setEmail(resumeData?.personalInfo?.email || '')
      setEmailError('')
      setIsSent(false)
    }
  }, [isOpen, resumeData])

  const handleEmailChange = (e) => {
    const value = e.target.value
    setEmail(value)
    if (value.trim()) {
      const validation = validateEmail(value)
      setEmailError(validation.message)
    } else {
      setEmailError('')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validation = validateEmail(email)
    if (!validation.isValid) {
      setEmailError(validation.message)
      return
    }

    setIsSending(true)
    setEmailError('')

    try {
      const response = await axiosInstance.post('/email/send-email', {
        resumeBase64,
        password,
        recipientEmail: email.trim(),
        userName: resumeData.personalInfo.fullName
      })

      if (response.data.success) {
        setIsSent(true)
        if (onEmailSent) onEmailSent(email.trim())
        setTimeout(() => handleClose(), 3000)
      }
    } catch (error) {
      console.error('Error sending email:', error)
      setEmailError('Failed to send email. Please try again.')
    } finally {
      setIsSending(false)
    }
  }

  const handleClose = () => {
    setEmail('')
    setEmailError('')
    setIsSent(false)
    setIsSending(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        ></div>

        <div className="relative inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle">
          
          {/* Header */}
          <div className="bg-green-600 px-4 pb-4 pt-5 sm:px-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-white">Send Resume via Email</h3>
                <p className="mt-2 text-sm text-green-100">
                  Your password-protected resume will be sent to the specified email address.
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            {!isSent ? (
              <form id="email-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">From:</span> {resumeData?.personalInfo?.fullName}
                  </p>
                  <p className="text-sm text-gray-600">
                    <span className="font-medium">Password:</span> {password}
                  </p>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    placeholder="Enter email address"
                    disabled={isSending}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:text-sm ${
                      emailError
                        ? 'border-red-300 text-red-900 focus:ring-red-500 focus:border-red-500'
                        : 'border-gray-300'
                    }`}
                  />
                  {emailError && (
                    <p className="mt-1 text-sm text-red-600">{emailError}</p>
                  )}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <h4 className="text-sm font-medium text-blue-900 mb-1">What will be sent:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Password-protected PDF resume</li>
                    <li>• Password for opening the PDF</li>
                    <li>• Professional email template</li>
                  </ul>
                </div>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                  <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Email Sent Successfully!</h3>
                <p className="text-sm text-gray-600">
                  Your resume has been sent to <span className="font-medium">{email}</span>
                </p>
                <p className="text-xs text-gray-500 mt-2">Closing this window automatically...</p>
              </div>
            )}
          </div>

          {/* Footer */}
          {!isSent && (
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                form="email-form"
                disabled={isSending || !!emailError}
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Email
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleClose}
                disabled={isSending}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default EmailModal
