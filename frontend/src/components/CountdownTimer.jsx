import React from 'react'
import { useTime } from '../context/TimeContext'

/**
 * CountdownTimer component - Displays remaining time with visual indicators
 * Shows different colors based on time remaining
 */
const CountdownTimer = () => {
  const { isLoading, isAllowed, remainingSeconds } = useTime()

  // Don't show timer if loading
  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="spinner w-4 h-4"></div>
        <span className="text-sm text-gray-600">Loading...</span>
      </div>
    )
  }

  // Don't show timer if time has expired
  if (!isAllowed) {
    return (
      <div className="flex items-center space-x-2">
        <i className="fas fa-clock text-red-600"></i>
        <span className="text-sm font-medium text-red-600">Time Expired</span>
      </div>
    )
  }

  // Format time for display
  const formatTime = (seconds) => {
    if (seconds <= 0) return '00:00'
    const minutes = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Get color based on time remaining
  const getTimeColor = () => {
    if (remainingSeconds <= 0) return 'text-red-600'
    if (remainingSeconds <= 300) return 'text-yellow-600' // Less than 5 minutes
    if (remainingSeconds <= 900) return 'text-orange-600' // Less than 15 minutes
    return 'text-green-600'
  }

  const timeColor = getTimeColor()
  const formattedTime = formatTime(remainingSeconds)
  const totalSeconds = 3600 // Default 1 hour

  return (
    <div className="flex items-center space-x-3">
      {/* Clock icon with animation */}
      <div className="relative">
        <i className={`fas fa-clock ${timeColor} text-lg`}></i>
        {remainingSeconds < 60 && (
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-600 rounded-full animate-pulse"></span>
        )}
      </div>
      
      {/* Time display */}
      <div className="flex flex-col">
        <span className={`text-sm font-medium ${timeColor}`}>
          {formattedTime}
        </span>
        <span className="text-xs text-gray-500">
          {remainingSeconds < 60 ? 'Hurry up!' : 'Remaining'}
        </span>
      </div>
      
      {/* Circular progress indicator */}
      <div className="relative w-8 h-8">
        <svg className="transform -rotate-90 w-8 h-8">
          {/* Background circle */}
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="16"
            cy="16"
            r="14"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            strokeDasharray={`${2 * Math.PI * 14}`}
            strokeDashoffset={`${2 * Math.PI * 14 * (1 - remainingSeconds / totalSeconds)}`}
            className={timeColor.replace('text', 'stroke')}
            strokeLinecap="round"
          />
        </svg>
        
        {/* Warning indicator for low time */}
        {remainingSeconds < 300 && remainingSeconds > 0 && (
          <div className="absolute inset-0 flex items-center justify-center">
            <i className={`fas fa-exclamation-triangle ${timeColor} text-xs`}></i>
          </div>
        )}
      </div>
      
      {/* Mobile-friendly time display */}
      <div className="sm:hidden">
        <span className={`text-xs font-medium ${timeColor}`}>
          {Math.floor(remainingSeconds / 60)}m {remainingSeconds % 60}s
        </span>
      </div>
    </div>
  )
}

export default CountdownTimer
