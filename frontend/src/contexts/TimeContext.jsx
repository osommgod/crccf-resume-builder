import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'
import axios from 'axios'

/**
 * Time Context for managing time-controlled resume submission
 * Handles countdown timer and time status checks
 */

const TimeContext = createContext()

export const useTime = () => {
  const context = useContext(TimeContext)
  if (!context) {
    throw new Error('useTime must be used within a TimeProvider')
  }
  return context
}

export const TimeProvider = ({ children }) => {
  const [timeStatus, setTimeStatus] = useState({
    allowed: true,
    remainingSeconds: 1200, // 20 minutes
    totalSeconds: 1200,
    isLoading: true
  })

  const [lastCheck, setLastCheck] = useState(null)

  // API base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  /**
   * Check time status from backend
   */
  const checkTimeStatus = useCallback(async () => {
    try {
      const response = await axios.get(`${API_URL}/api/time-status`)
      
      if (response.data.success) {
        const { allowed, remainingSeconds, totalSeconds } = response.data.data
        
        setTimeStatus({
          allowed,
          remainingSeconds,
          totalSeconds,
          isLoading: false
        })

        setLastCheck(new Date())

        // Show warning if time is running out (less than 1 minute)
        if (allowed && remainingSeconds < 60 && remainingSeconds > 0) {
          toast.error(`⏰ Only ${Math.ceil(remainingSeconds / 60)} minute(s) remaining!`, {
            duration: 5000,
            icon: '⚠️'
          })
        }

        // Show notification if time just expired
        if (!allowed && timeStatus.allowed) {
          toast.error('⏰ Resume submission time has expired!', {
            duration: 10000,
            icon: '🚫'
          })
        }

        return response.data.data
      }
    } catch (error) {
      console.error('Error checking time status:', error)
      
      // Set default values if API fails
      setTimeStatus(prev => ({
        ...prev,
        isLoading: false
      }))
      
      toast.error('Failed to check time status. Please refresh the page.', {
        duration: 5000
      })
    }
  }, [API_URL, timeStatus.allowed])

  /**
   * Format remaining time as MM:SS
   */
  const formatTime = (seconds) => {
    if (seconds <= 0) return '00:00'
    
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  /**
   * Get time remaining percentage
   */
  const getTimePercentage = () => {
    if (timeStatus.totalSeconds === 0) return 0
    return (timeStatus.remainingSeconds / timeStatus.totalSeconds) * 100
  }

  /**
   * Get time status color based on remaining time
   */
  const getTimeColor = () => {
    if (!timeStatus.allowed) return 'text-red-600'
    if (timeStatus.remainingSeconds < 60) return 'text-red-600'
    if (timeStatus.remainingSeconds < 300) return 'text-yellow-600'
    return 'text-green-600'
  }

  /**
   * Get progress bar color based on remaining time
   */
  const getProgressColor = () => {
    if (!timeStatus.allowed) return 'bg-red-600'
    if (timeStatus.remainingSeconds < 60) return 'bg-red-600'
    if (timeStatus.remainingSeconds < 300) return 'bg-yellow-600'
    return 'bg-green-600'
  }

  // Check time status on component mount
  useEffect(() => {
    checkTimeStatus()
  }, [checkTimeStatus])

  // Set up interval to check time status every 30 seconds
  useEffect(() => {
    if (!timeStatus.allowed) return // Don't poll if time has expired

    const interval = setInterval(() => {
      checkTimeStatus()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [checkTimeStatus, timeStatus.allowed])

  // Update remaining seconds locally for real-time countdown
  useEffect(() => {
    if (!timeStatus.allowed || timeStatus.remainingSeconds <= 0) return

    const interval = setInterval(() => {
      setTimeStatus(prev => {
        if (prev.remainingSeconds <= 1) {
          // Time just expired
          return {
            ...prev,
            allowed: false,
            remainingSeconds: 0
          }
        }
        
        return {
          ...prev,
          remainingSeconds: prev.remainingSeconds - 1
        }
      })
    }, 1000) // Update every second

    return () => clearInterval(interval)
  }, [timeStatus.allowed, timeStatus.remainingSeconds])

  const value = {
    timeStatus,
    checkTimeStatus,
    formatTime,
    getTimePercentage,
    getTimeColor,
    getProgressColor,
    lastCheck
  }

  return (
    <TimeContext.Provider value={value}>
      {children}
    </TimeContext.Provider>
  )
}
