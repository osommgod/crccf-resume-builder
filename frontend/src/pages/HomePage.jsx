import React, { useState, useEffect } from 'react'
import ResumeForm from '../components/ResumeForm'
import ResumePreview from '../components/ResumePreview'
import CountdownTimer from '../components/CountdownTimer'
import { useTime } from '../context/TimeContext'
import { useResume } from '../context/ResumeContext'

/**
 * HomePage component - Main resume builder interface
 * Shows the form and preview side by side with time controls
 */
const HomePage = () => {
  const { isAllowed, remainingSeconds, isExpired } = useTime()
  const { getCompletionPercentage } = useResume()
  const [showPreview, setShowPreview] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Show preview when form has some content
  useEffect(() => {
    const completion = getCompletionPercentage()
    if (completion > 10 && !showPreview) {
      setShowPreview(true)
    }
  }, [getCompletionPercentage, showPreview])

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with countdown timer */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                CRCCF Resume Builder
              </h1>
              <span className="badge badge-primary">Beta</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <CountdownTimer />
              
              {/* Completion indicator */}
              <div className="hidden sm:block">
                <div className="text-sm text-gray-600">
                  Completion: {getCompletionPercentage()}%
                </div>
                <div className="w-32 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${getCompletionPercentage()}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Time expired banner */}
      {!isAllowed && (
        <div className="bg-red-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center">
              <span className="text-lg font-medium">⏰ Resume submission time has expired.</span>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-info-circle text-blue-400 text-lg"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">
                Welcome to CRCCF Resume Builder
              </h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Fill in your details to create a professional resume. Your resume will be available for download as a password-protected PDF.</p>
                <p className="mt-1">
                  <strong>Password format:</strong> FirstName-DDMMYYYY (e.g., John-01011995)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Form and Preview Container */}
        <div className={`${isMobile || !showPreview ? 'block' : 'grid grid-cols-1 lg:grid-cols-2 gap-8'}`}>
          {/* Resume Form */}
          <div className={`${showPreview && !isMobile ? 'lg:sticky lg:top-4 lg:h-fit' : ''}`}>
            <ResumeForm 
              disabled={!isAllowed}
              showPreview={showPreview}
              onTogglePreview={() => setShowPreview(!showPreview)}
            />
          </div>

          {/* Resume Preview */}
          {showPreview && (
            <div className="fade-in">
              <ResumePreview />
            </div>
          )}
        </div>

        {/* Mobile preview toggle */}
        {isMobile && (
          <div className="mt-6 text-center">
            <button
              onClick={() => setShowPreview(!showPreview)}
              className="btn btn-outline"
              disabled={!isAllowed}
            >
              {showPreview ? '📝 Edit Resume' : '👁 Preview Resume'}
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2024 CRCCF Resume Builder. All rights reserved.</p>
            <p className="mt-1">
              Built with ❤️ for professional resume creation
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default HomePage
