import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { timeService } from '../services/timeService'

/**
 * Time context for managing time-related state
 * Provides time status and countdown functionality
 */

// Initial state
const initialState = {
  isAllowed: true,
  remainingSeconds: 0,
  isExpired: false,
  lastChecked: null,
  isLoading: false,
  error: null
}

// Action types
const TIME_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_TIME_STATUS: 'SET_TIME_STATUS',
  SET_ERROR: 'SET_ERROR',
  RESET_TIME: 'RESET_TIME',
  UPDATE_REMAINING: 'UPDATE_REMAINING'
}

// Reducer function
const timeReducer = (state, action) => {
  switch (action.type) {
    case TIME_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload
      }
    
    case TIME_ACTIONS.SET_TIME_STATUS:
      return {
        ...state,
        isAllowed: action.payload.isAllowed,
        remainingSeconds: action.payload.remainingSeconds,
        isExpired: !action.payload.isAllowed && action.payload.remainingSeconds <= 0,
        lastChecked: new Date(),
        error: null,
        isLoading: false
      }
    
    case TIME_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false
      }
    
    case TIME_ACTIONS.RESET_TIME:
      return {
        ...state,
        isAllowed: true,
        remainingSeconds: action.payload || 3600, // Default 1 hour
        isExpired: false,
        error: null,
        lastChecked: new Date()
      }
    
    case TIME_ACTIONS.UPDATE_REMAINING:
      const newRemaining = Math.max(0, state.remainingSeconds - 1)
      return {
        ...state,
        remainingSeconds: newRemaining,
        isExpired: newRemaining === 0 && state.isAllowed,
        isAllowed: newRemaining > 0
      }
    
    default:
      return state
  }
}

// Create context
const TimeContext = createContext()

// Provider component
export const TimeProvider = ({ children }) => {
  const [state, dispatch] = useReducer(timeReducer, initialState)

  // Action creators
  const actions = {
    setLoading: (loading) => {
      dispatch({ type: TIME_ACTIONS.SET_LOADING, payload: loading })
    },
    
    setTimeStatus: (status) => {
      dispatch({ type: TIME_ACTIONS.SET_TIME_STATUS, payload: status })
    },
    
    setError: (error) => {
      dispatch({ type: TIME_ACTIONS.SET_ERROR, payload: error })
    },
    
    resetTime: (remainingSeconds) => {
      dispatch({ type: TIME_ACTIONS.RESET_TIME, payload: remainingSeconds })
    },
    
    updateRemaining: () => {
      dispatch({ type: TIME_ACTIONS.UPDATE_REMAINING })
    },

    // Fetch time status from backend
    fetchTimeStatus: async () => {
      try {
        dispatch({ type: TIME_ACTIONS.SET_LOADING, payload: true })
        const response = await timeService.getTimeStatus()
        
        if (response.success) {
          dispatch({
            type: TIME_ACTIONS.SET_TIME_STATUS,
            payload: {
              isAllowed: response.data.isAllowed,
              remainingSeconds: response.data.remainingSeconds
            }
          })
        } else {
          dispatch({ type: TIME_ACTIONS.SET_ERROR, payload: response.error })
        }
      } catch (error) {
        console.error('Failed to fetch time status:', error)
        dispatch({ 
          type: TIME_ACTIONS.SET_ERROR, 
          payload: 'Failed to fetch time status from server' 
        })
      }
    },

    // Reset time status (admin only)
    resetTimeStatus: async (adminKey) => {
      try {
        const response = await timeService.resetTimeStatus(adminKey)
        if (response.success) {
          // Fetch updated time status after reset
          await actions.fetchTimeStatus()
          return response
        } else {
          throw new Error(response.error)
        }
      } catch (error) {
        console.error('Failed to reset time status:', error)
        throw error
      }
    }
  }

  // Fetch time status on component mount
  useEffect(() => {
    actions.fetchTimeStatus()
    
    // Set up periodic refresh to sync with server time
    const interval = setInterval(() => {
      actions.fetchTimeStatus()
    }, 30000) // Refresh every 30 seconds

    return () => clearInterval(interval)
  }, [])

  // Countdown timer effect
  React.useEffect(() => {
    if (state.remainingSeconds > 0 && state.isAllowed) {
      const timer = setInterval(() => {
        actions.updateRemaining()
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [state.remainingSeconds, state.isAllowed])

  const value = {
    ...state,
    ...actions
  }

  return (
    <TimeContext.Provider value={value}>
      {children}
    </TimeContext.Provider>
  )
}

// Hook for using time context
export const useTime = () => {
  const context = useContext(TimeContext)
  
  if (!context) {
    throw new Error('useTime must be used within a TimeProvider')
  }
  
  return context
}

// Format remaining time for display
export const formatTime = (seconds) => {
  if (seconds <= 0) return '00:00'
  
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  
  return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
}

// Get status color based on time remaining
export const getTimeStatusColor = (remainingSeconds) => {
  if (remainingSeconds <= 0) return 'red'
  if (remainingSeconds <= 300) return 'yellow' // Less than 5 minutes
  if (remainingSeconds <= 900) return 'orange' // Less than 15 minutes
  return 'green'
}

export default TimeContext
