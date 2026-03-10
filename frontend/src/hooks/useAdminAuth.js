import { useState, useEffect, useCallback } from 'react'
import toast from 'react-hot-toast'

/**
 * Checks VITE_ADMIN_PASSWORD against input
 * Handles admin authentication state and persistence
 */
export const useAdminAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [authTime, setAuthTime] = useState(null)

  // Check authentication status on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const authStatus = localStorage.getItem('admin_authenticated')
        const authTimestamp = localStorage.getItem('admin_auth_time')
        
        if (authStatus === 'true' && authTimestamp) {
          const timestamp = parseInt(authTimestamp)
          const currentTime = Date.now()
          
          // Auto-logout after 2 hours (7200000 ms)
          const sessionDuration = 2 * 60 * 60 * 1000
          
          if (currentTime - timestamp < sessionDuration) {
            setIsAuthenticated(true)
            setAuthTime(new Date(timestamp))
          } else {
            // Clear expired authentication
            clearAuthData()
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error)
        clearAuthData()
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  // Clear authentication data
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('admin_authenticated')
    localStorage.removeItem('admin_auth_time')
    setIsAuthenticated(false)
    setAuthTime(null)
    setError(null)
  }, [])

  // Login function
  const login = useCallback(async (password) => {
    try {
      setError(null)
      
      const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD
      
      if (!adminPassword) {
        throw new Error('Admin password not configured')
      }
      
      if (password === adminPassword) {
        const currentTime = Date.now()
        
        // Save authentication state
        localStorage.setItem('admin_authenticated', 'true')
        localStorage.setItem('admin_auth_time', currentTime.toString())
        
        setIsAuthenticated(true)
        setAuthTime(new Date(currentTime))
        
        toast.success('Login successful')
        return true
      } else {
        throw new Error('Invalid password')
      }
    } catch (error) {
      const errorMessage = error.message || 'Login failed'
      setError(errorMessage)
      toast.error(errorMessage)
      return false
    }
  }, [])

  // Logout function
  const logout = useCallback(() => {
    clearAuthData()
    toast.success('Logged out successfully')
  }, [clearAuthData])

  // Check if session is about to expire
  const getSessionTimeRemaining = useCallback(() => {
    if (!isAuthenticated || !authTime) return 0
    
    const sessionDuration = 2 * 60 * 60 * 1000 // 2 hours
    const elapsed = Date.now() - authTime.getTime()
    const remaining = sessionDuration - elapsed
    
    return Math.max(0, remaining)
  }, [isAuthenticated, authTime])

  // Format session time remaining
  const formatSessionTimeRemaining = useCallback(() => {
    const remaining = getSessionTimeRemaining()
    
    if (remaining === 0) return 'Session expired'
    
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`
    } else {
      return `${minutes}m remaining`
    }
  }, [getSessionTimeRemaining])

  // Check if session is about to expire (less than 15 minutes)
  const isSessionExpiringSoon = useCallback(() => {
    const remaining = getSessionTimeRemaining()
    return remaining > 0 && remaining < 15 * 60 * 1000 // 15 minutes
  }, [getSessionTimeRemaining])

  // Refresh session (extend authentication)
  const refreshSession = useCallback(() => {
    if (isAuthenticated) {
      const currentTime = Date.now()
      localStorage.setItem('admin_auth_time', currentTime.toString())
      setAuthTime(new Date(currentTime))
      toast.success('Session refreshed')
    }
  }, [isAuthenticated])

  // Validate admin password without login
  const validatePassword = useCallback((password) => {
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD
    return password === adminPassword
  }, [])

  return {
    // State
    isAuthenticated,
    isLoading,
    error,
    authTime,
    
    // Computed values
    sessionTimeRemaining: formatSessionTimeRemaining(),
    isSessionExpiringSoon: isSessionExpiringSoon(),
    
    // Actions
    login,
    logout,
    refreshSession,
    validatePassword,
    
    // Utilities
    clearAuthData
  }
}
