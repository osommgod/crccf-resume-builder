import React from 'react'

/**
 * Live MM:SS countdown using remainingSeconds
 * Shows time remaining for resume submission
 */
const CountdownTimer = ({ remainingSeconds, isExpired = false, className = '' }) => {
  // Format seconds to MM:SS
  const formatTime = (seconds) => {
    if (seconds <= 0) return '00:00'
    
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Get color based on time remaining
  const getTimeColor = () => {
    if (isExpired || remainingSeconds <= 0) return 'text-red-600 bg-red-50'
    if (remainingSeconds <= 300) return 'text-yellow-600 bg-yellow-50' // Less than 5 minutes
    if (remainingSeconds <= 900) return 'text-orange-600 bg-orange-50' // Less than 15 minutes
    return 'text-green-600 bg-green-50'
  }

  // Get status message
  const getStatusMessage = () => {
    if (isExpired || remainingSeconds <= 0) return 'Time Expired'
    if (remainingSeconds <= 60) return `${remainingSeconds}s left`
    return formatTime(remainingSeconds)
  }

  // Get icon based on status
  const getStatusIcon = () => {
    if (isExpired || remainingSeconds <= 0) {
      return '⏰'
    }
    if (remainingSeconds <= 300) {
      return '⚠️'
    }
    return '⏱️'
  }

  const timeColor = getTimeColor()
  const statusMessage = getStatusMessage()
  const statusIcon = getStatusIcon()

  return (
    <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg border ${timeColor} ${className}`}>
      <span className="text-lg">{statusIcon}</span>
      <div className="flex flex-col">
        <span className="text-xs font-medium uppercase tracking-wide">
          {isExpired || remainingSeconds <= 0 ? 'Closed' : 'Time Left'}
        </span>
        <span className="text-sm font-bold">
          {statusMessage}
        </span>
      </div>
    </div>
  )
}

export default CountdownTimer
