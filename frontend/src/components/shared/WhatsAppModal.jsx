import React, { useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import toast from 'react-hot-toast'

/**
 * WhatsApp Modal - Email PDF first, then share password via WhatsApp
 */
const WhatsAppModal = ({ 
  isOpen, 
  onClose, 
  resumeData, 
  password,
  resumeBase64
}) => {
  const [isSending, setIsSending] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [whatsappOpened, setWhatsappOpened] = useState(false)
  
  const userName = resumeData?.personalInfo?.fullName || 'User'
  const userEmail = resumeData?.personalInfo?.email || ''
  const whatsappNumber = resumeData?.personalInfo?.whatsappNumber || resumeData?.personalInfo?.phone || ''

  const handleEmailAndShare = async () => {
    if (!userEmail) {
      toast.error('Please provide an email address in your resume')
      return
    }

    setIsSending(true)
    
    try {
      // Step 1: Email PDF to user first
      toast.loading('Sending PDF to your email...', { id: 'whatsapp-email' })
      
      const emailResponse = await axiosInstance.post('/api/email/send-email', {
        resumeBase64,
        password,
        recipientEmail: userEmail,
        userName: userName
      })

      if (!emailResponse.data.success) {
        throw new Error(emailResponse.data.message || 'Failed to send email')
      }

      setEmailSent(true)
      toast.success('PDF sent to your email!', { id: 'whatsapp-email' })

      // Step 2: Construct WhatsApp message with password
      const cleanNumber = whatsappNumber.replace(/\D/g, '')
      const message = encodeURIComponent(
        `🎓 My Professional Resume\n\n` +
        `Hi! I'm sharing my professional resume with you.\n\n` +
        `📄 The resume PDF has been sent to my email: ${userEmail}\n\n` +
        `🔐 Password to open the PDF:\n${password}\n\n` +
        `Format: FirstName-DDMMYYYY\n\n` +
        `Generated using CRCCF Resume Builder`
      )

      // Step 3: Open WhatsApp with pre-filled message
      const whatsappURL = cleanNumber 
        ? `https://wa.me/${cleanNumber}?text=${message}`
        : `https://wa.me/?text=${message}`

      window.open(whatsappURL, '_blank')
      setWhatsappOpened(true)

      // Step 4: Store in localStorage to track sent status
      const sentData = {
        sent: true,
        timestamp: Date.now(),
        email: userEmail,
        phone: whatsappNumber
      }
      localStorage.setItem(`whatsapp_sent_${whatsappNumber || 'general'}`, JSON.stringify(sentData))

      toast.success('WhatsApp opened! Complete the send there.')
      
    } catch (error) {
      console.error('Error in WhatsApp share flow:', error)
      toast.error(error.message || 'Failed to complete WhatsApp sharing')
    } finally {
      setIsSending(false)
    }
  }

  const handleCopyMessage = () => {
    const message = `🎓 My Professional Resume

Hi! I'm sharing my professional resume with you.

📄 The resume PDF has been sent to my email: ${userEmail}

🔐 Password to open the PDF:
${password}

Format: FirstName-DDMMYYYY

Generated using CRCCF Resume Builder`

    navigator.clipboard.writeText(message)
      .then(() => toast.success('Message copied to clipboard!'))
      .catch(() => toast.error('Failed to copy message'))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[99999] overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="relative inline-block w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle">
          
          {/* Header */}
          <div className="bg-green-500 px-4 pb-4 pt-5 sm:px-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <i className="fab fa-whatsapp text-green-600 text-2xl"></i>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-white">
                  Share via WhatsApp
                </h3>
                <p className="mt-2 text-sm text-green-100">
                  PDF will be emailed first, then password shared via WhatsApp
                </p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="space-y-4">
              {/* Flow Steps */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="text-sm font-medium text-gray-900 mb-3">
                  <i className="fas fa-list-ol mr-2"></i>
                  How it works:
                </h4>
                <ol className="text-sm text-gray-700 space-y-2">
                  <li className="flex items-start">
                    <span className="font-medium mr-2">1.</span>
                    <span>PDF sent to your email: <strong>{userEmail || 'Not provided'}</strong></span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">2.</span>
                    <span>WhatsApp opens with password message</span>
                  </li>
                  <li className="flex items-start">
                    <span className="font-medium mr-2">3.</span>
                    <span>You complete sending in WhatsApp</span>
                  </li>
                </ol>
              </div>

              {/* Password Display */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  PDF Password (will be shared via WhatsApp):
                </label>
                <div className="font-mono text-lg font-bold text-yellow-800 bg-yellow-100 px-3 py-2 rounded border border-yellow-300">
                  {password}
                </div>
                <p className="text-xs text-yellow-600 mt-1">
                  Format: FirstName-DDMMYYYY
                </p>
              </div>

              {/* Status Messages */}
              {emailSent && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-sm text-blue-700">
                    <i className="fas fa-check-circle mr-1"></i>
                    ✅ PDF sent to your email
                  </p>
                </div>
              )}

              {whatsappOpened && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700">
                    <i className="fas fa-external-link-alt mr-1"></i>
                    ✅ WhatsApp opened - complete send there
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              disabled={isSending || !userEmail}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-500 text-base font-medium text-white hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleEmailAndShare}
            >
              {isSending ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Sending...
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane mr-2"></i>
                  Email PDF & Open WhatsApp
                </>
              )}
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleCopyMessage}
            >
              <i className="fas fa-copy mr-2"></i>
              Copy Message
            </button>
            <button
              type="button"
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WhatsAppModal
