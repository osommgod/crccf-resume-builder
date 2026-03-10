import { useState, useEffect, useCallback } from 'react'
import axiosInstance from '../utils/axiosInstance'
import toast from 'react-hot-toast'

/**
 * Fetches /api/time-status on load + every 30s
 * Provides time status information for resume submission control
 */
export const useTimeStatus = () => {
  const [isAllowed, setIsAllowed] = useState(true)
  const [remainingSeconds, setRemainingSeconds] = useState(0)
  const [isExpired, setIsExpired] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastChecked, setLastChecked] = useState(null)

  // Fetch time status from API
  const fetchTimeStatus = useCallback(async () => {
    try {
      setError(null)
      const response = await axiosInstance.get('/time-status')
      
      const { data } = response.data
      setIsAllowed(data.isAllowed)
      setRemainingSeconds(data.remainingSeconds)
      setIsExpired(!data.isAllowed && data.remainingSeconds <= 0)
      setLastChecked(new Date())
      
      return data
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to check time status'
      setError(errorMessage)
      
      // Don't show toast for every failure, only for critical errors
      if (err.response?.status !== 404) {
        console.error('Time status check failed:', errorMessage)
      }
      
      // Default to allowed if API fails (fail-safe approach)
      setIsAllowed(true)
      setRemainingSeconds(0)
      setIsExpired(false)
      
      return null
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Reset time status (admin function)
  const resetTimeStatus = useCallback(async () => {
    try {
      const adminKey = import.meta.env.VITE_ADMIN_PASSWORD
      if (!adminKey) {
        throw new Error('Admin credentials not available')
      }

      const response = await axiosInstance.post('/time-status/reset', {}, {
        headers: {
          'X-Admin-Key': adminKey
        }
      })
      
      toast.success('Time status reset successfully')
      
      // Refetch time status after reset
      await fetchTimeStatus()
      
      return response.data
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'Failed to reset time status'
      toast.error(errorMessage)
      throw err
    }
  }, [fetchTimeStatus])

  // Get time configuration
  const getTimeConfig = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/time-status/config')
      return response.data.data
    } catch (err) {
      console.error('Failed to get time config:', err)
      return null
    }
  }, [])

  // Check time status on mount
  useEffect(() => {
    fetchTimeStatus()
  }, [fetchTimeStatus])

  // Set up periodic check every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTimeStatus()
    }, 30000) // 30 seconds

    return () => clearInterval(interval)
  }, [fetchTimeStatus])

  // Update remaining seconds countdown
  useEffect(() => {
    if (remainingSeconds > 0 && isAllowed) {
      const timer = setTimeout(() => {
        setRemainingSeconds(prev => Math.max(0, prev - 1))
      }, 1000)

      return () => clearTimeout(timer)
    } else if (remainingSeconds === 0 && isAllowed) {
      // Time just expired
      setIsExpired(true)
      setIsAllowed(false)
      toast.error('Resume submission time has expired!')
    }
  }, [remainingSeconds, isAllowed])

  // Format remaining time for display
  const formatRemainingTime = useCallback(() => {
    if (remainingSeconds <= 0) return '00:00'
    
    const minutes = Math.floor(remainingSeconds / 60)
    const seconds = remainingSeconds % 60
    
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
  }, [remainingSeconds])

  // Get time status message
  const getStatusMessage = useCallback(() => {
    if (isLoading) return 'Checking time status...'
    if (error) return 'Unable to verify time status'
    if (isExpired) return 'Time expired - submissions disabled'
    if (isAllowed) return `Time remaining: ${formatRemainingTime()}`
    return 'Submissions currently disabled'
  }, [isLoading, error, isExpired, isAllowed, formatRemainingTime])

  // Get status color for UI
  const getStatusColor = useCallback(() => {
    if (isExpired) return 'red'
    if (remainingSeconds <= 300) return 'yellow' // Less than 5 minutes
    if (isAllowed) return 'green'
    return 'gray'
  }, [isExpired, remainingSeconds, isAllowed])

  return {
    // State
    isAllowed,
    remainingSeconds,
    isExpired,
    isLoading,
    error,
    lastChecked,
    
    // Computed values
    formattedTime: formatRemainingTime(),
    statusMessage: getStatusMessage(),
    statusColor: getStatusColor(),
    
    // Actions
    refetch: fetchTimeStatus,
    reset: resetTimeStatus,
    getConfig: getTimeConfig
  }
}
