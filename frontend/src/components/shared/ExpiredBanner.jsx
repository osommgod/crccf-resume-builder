import React from 'react'

/**
 * Red banner shown when time has expired
 * Displays warning message when resume submission is disabled
 */
const ExpiredBanner = ({ message = 'Resume submission time has expired', className = '' }) => {
  return (
    <div className={`bg-red-600 text-white ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-center space-x-3">
          <div className="flex-shrink-0">
            <svg
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <div className="flex-1 text-center">
            <h3 className="text-lg font-medium">
              ⏰ {message}
            </h3>
            <p className="text-sm text-red-100 mt-1">
              The resume submission window has closed. Please contact the administrator if you need assistance.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ExpiredBanner
