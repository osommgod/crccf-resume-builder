import React, { useState, useEffect } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import toast from 'react-hot-toast'
import AdminPanel from './AdminPanel'

/**
 * Admin dashboard with stats and management
 * Main admin interface with overview and controls
 */
const AdminDashboard = ({ onLogout }) => {
  const [stats, setStats] = useState({
    totalResumes: 0,
    todayResumes: 0,
    thisWeekResumes: 0,
    thisMonthResumes: 0
  })
  const [timeStatus, setTimeStatus] = useState({
    isAllowed: true,
    remainingSeconds: 0,
    deploymentTime: null
  })
  const [isLoading, setIsLoading] = useState(true)

  // Fetch dashboard statistics
  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get('/resumes/stats')
      if (response.data.success) {
        setStats(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
      toast.error('Failed to load statistics')
    }
  }

  // Fetch time status
  const fetchTimeStatus = async () => {
    try {
      const response = await axiosInstance.get('/time-status')
      if (response.data.success) {
        setTimeStatus(response.data.data)
      }
    } catch (error) {
      console.error('Error fetching time status:', error)
    }
  }

  // Reset time status
  const handleResetTime = async () => {
    if (!window.confirm('Are you sure you want to reset the submission timer? This will allow new resume submissions.')) {
      return
    }

    try {
      const adminKey = import.meta.env.VITE_ADMIN_PASSWORD
      const response = await axiosInstance.post('/time-status/reset', {}, {
        headers: {
          'X-Admin-Key': adminKey
        }
      })

      if (response.data.success) {
        toast.success('Time status reset successfully')
        await fetchTimeStatus()
      }
    } catch (error) {
      console.error('Error resetting time:', error)
      toast.error('Failed to reset time status')
    }
  }

  // Load data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true)
      await Promise.all([
        fetchStats(),
        fetchTimeStatus()
      ])
      setIsLoading(false)
    }

    loadData()
  }, [])

  // Format time remaining
  const formatTimeRemaining = (seconds) => {
    if (seconds <= 0) return 'Expired'
    
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`
    } else {
      return `${secs}s`
    }
  }

  // Get status color
  const getStatusColor = (isAllowed, remainingSeconds) => {
    if (!isAllowed || remainingSeconds <= 0) return 'text-red-600 bg-red-50 border-red-200'
    if (remainingSeconds <= 300) return 'text-yellow-600 bg-yellow-50 border-yellow-200'
    return 'text-green-600 bg-green-50 border-green-200'
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600">Manage resumes and system settings</p>
          </div>
          <button
            onClick={onLogout}
            className="btn btn-danger"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-file-alt text-blue-600 text-2xl"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-blue-900">Total Resumes</p>
                <p className="text-2xl font-bold text-blue-600">{stats.totalResumes}</p>
              </div>
            </div>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-calendar-day text-green-600 text-2xl"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-900">Today</p>
                <p className="text-2xl font-bold text-green-600">{stats.todayResumes}</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-calendar-week text-yellow-600 text-2xl"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-yellow-900">This Week</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.thisWeekResumes}</p>
              </div>
            </div>
          </div>

          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <i className="fas fa-calendar-alt text-purple-600 text-2xl"></i>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-purple-900">This Month</p>
                <p className="text-2xl font-bold text-purple-600">{stats.thisMonthResumes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Time Status */}
        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-gray-900">Submission Status</h3>
              <p className="text-sm text-gray-600">
                {timeStatus.isAllowed 
                  ? 'Resume submissions are currently open'
                  : 'Resume submissions are currently closed'
                }
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className={`px-4 py-2 rounded-lg border ${getStatusColor(timeStatus.isAllowed, timeStatus.remainingSeconds)}`}>
                <div className="text-sm font-medium">
                  {timeStatus.isAllowed ? 'Open' : 'Closed'}
                </div>
                <div className="text-xs">
                  {formatTimeRemaining(timeStatus.remainingSeconds)}
                </div>
              </div>
              <button
                onClick={handleResetTime}
                className="btn btn-warning"
              >
                <i className="fas fa-redo mr-2"></i>
                Reset Timer
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Panel */}
      <AdminPanel />
    </div>
  )
}

export default AdminDashboard
