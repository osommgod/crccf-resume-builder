import React, { useState } from 'react'
import toast from 'react-hot-toast'

/**
 * PasswordModal component - Shows resume password with copy functionality
 * Appears after successful PDF download
 */
const PasswordModal = ({ onClose, password }) => {
  const [copied, setCopied] = useState(false)

  /**
   * Copy password to clipboard
   */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(password)
      setCopied(true)
      toast.success('Password copied to clipboard!')
      
      // Reset copied state after 3 seconds
      setTimeout(() => setCopied(false), 3000)
    } catch (error) {
      console.error('Failed to copy password:', error)
      toast.error('Failed to copy password')
    }
  }

  /**
   * Handle modal close
   */
  const handleClose = () => {
    onClose()
  }

  /**
   * Handle keyboard events
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleClose} onKeyDown={handleKeyDown} tabIndex={-1}>
      <div 
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <i className="fas fa-lock text-green-600 mr-2"></i>
            Your Resume Password
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Modal Body */}
        <div className="text-center">
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <i className="fas fa-check text-green-600 text-xl"></i>
          </div>

          {/* Success Message */}
          <p className="text-gray-700 mb-6">
            Your resume has been downloaded successfully! Use the password below to open your password-protected PDF file.
          </p>

          {/* Password Display */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-yellow-800 mb-2 font-medium">
              🔐 Your Resume Password:
            </p>
            <div className="flex items-center justify-center space-x-3">
              <code className="text-2xl font-bold text-yellow-900 bg-white px-4 py-2 rounded border border-yellow-300">
                {password}
              </code>
              <button
                onClick={copyToClipboard}
                className={`btn ${copied ? 'btn-success' : 'btn-outline'} btn-sm`}
                title={copied ? 'Copied!' : 'Copy password'}
              >
                <i className={`fas ${copied ? 'fa-check' : 'fa-copy'}`}></i>
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-medium text-blue-900 mb-2">
              <i className="fas fa-info-circle mr-2"></i>
              Important Instructions:
            </h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Save this password in a secure location</li>
              <li>• You will need this password to open your resume PDF</li>
              <li>• Do not share this password with unauthorized individuals</li>
              <li>• The password is generated using your name and date of birth</li>
            </ul>
          </div>

          {/* Password Format Info */}
          <div className="text-sm text-gray-600 mb-6">
            <p>
              <strong>Password Format:</strong> FirstName-DDMMYYYY
            </p>
            <p className="mt-1">
              Example: If your name is John and DOB is 01/01/1995, your password will be <strong>John-01011995</strong>
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={copyToClipboard}
            className={`btn ${copied ? 'btn-success' : 'btn-outline'}`}
          >
            <i className={`fas ${copied ? 'fa-check' : 'fa-copy'} mr-2`}></i>
            {copied ? 'Copied!' : 'Copy Password'}
          </button>
          <button
            onClick={handleClose}
            className="btn btn-primary"
          >
            <i className="fas fa-times mr-2"></i>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default PasswordModal
