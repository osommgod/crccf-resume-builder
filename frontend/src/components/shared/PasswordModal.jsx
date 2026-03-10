import React, { useState } from 'react'
import { copyPasswordToClipboard } from '../../utils/generatePassword'

/**
 * Shows generated password + Copy button
 * Modal for displaying PDF password to user
 */
const PasswordModal = ({ 
  isOpen, 
  onClose, 
  password, 
  userName, 
  fileName = '',
  onDownloadComplete = null 
}) => {
  const [copied, setCopied] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  // Handle copy password to clipboard
  const handleCopyPassword = async () => {
    try {
      const result = await copyPasswordToClipboard(password)
      if (result.success) {
        setCopied(true)
        setTimeout(() => setCopied(false), 3000)
      }
    } catch (error) {
      console.error('Failed to copy password:', error)
    }
  }

  // Handle download complete
  const handleDownloadComplete = () => {
    if (onDownloadComplete) {
      onDownloadComplete()
    }
  }

  // Handle modal close
  const handleClose = () => {
    setCopied(false)
    setIsDownloading(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={handleClose}
        ></div>

        {/* Modal panel */}
        <div className="relative inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle">
          {/* Modal header */}
          <div className="bg-blue-600 px-4 pb-4 pt-5 sm:px-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-white">
                  Your Resume Password
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-blue-100">
                    Your resume has been password-protected for security. Please save this password.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal body */}
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            {/* User info */}
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Name:</span> {userName}
              </p>
              {fileName && (
                <p className="text-sm text-gray-600">
                  <span className="font-medium">File:</span> {fileName}
                </p>
              )}
            </div>

            {/* Password display */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    PDF Password:
                  </label>
                  <div className="font-mono text-lg font-bold text-yellow-800 bg-yellow-100 px-3 py-2 rounded border border-yellow-300">
                    {password}
                  </div>
                  <p className="text-xs text-yellow-600 mt-1">
                    Format: FirstName-DDMMYYYY
                  </p>
                </div>
                <div className="ml-4">
                  <button
                    onClick={handleCopyPassword}
                    className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm transition-colors ${
                      copied
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {copied ? (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Copied!
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-900 mb-2">
                <i className="fas fa-info-circle mr-1"></i>
                Important Instructions:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Save this password in a secure location</li>
                <li>• You will need this password to open your PDF</li>
                <li>• Do not share this password with unauthorized individuals</li>
                <li>• Keep a backup of both the PDF and password</li>
              </ul>
            </div>
          </div>

          {/* Modal footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleClose}
            >
              Got it, Thanks!
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleDownloadComplete}
            >
              Download Again
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PasswordModal
