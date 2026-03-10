import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import AdminPanel from '../components/AdminPanel'
import toast from 'react-hot-toast'

/**
 * AdminPage component - Protected admin interface
 * Handles admin authentication and shows the admin panel
 */
const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  // Check if already authenticated on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('admin_authenticated')
    const authTime = localStorage.getItem('admin_auth_time')
    
    if (authStatus === 'true' && authTime) {
      const authTimestamp = parseInt(authTime)
      const currentTime = Date.now()
      
      // Auto-logout after 2 hours
      if (currentTime - authTimestamp < 2 * 60 * 60 * 1000) {
        setIsAuthenticated(true)
      } else {
        // Clear expired authentication
        localStorage.removeItem('admin_authenticated')
        localStorage.removeItem('admin_auth_time')
      }
    }
    
    setIsLoading(false)
  }, [])

  /**
   * Handle admin login
   */
  const handleLogin = (e) => {
    e.preventDefault()
    
    const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD
    
    if (!adminPassword) {
      toast.error('Admin password not configured')
      return
    }
    
    if (password === adminPassword) {
      setIsAuthenticated(true)
      localStorage.setItem('admin_authenticated', 'true')
      localStorage.setItem('admin_auth_time', Date.now().toString())
      toast.success('Login successful')
    } else {
      toast.error('Invalid password')
      setPassword('')
    }
  }

  /**
   * Handle admin logout
   */
  const handleLogout = () => {
    setIsAuthenticated(false)
    localStorage.removeItem('admin_authenticated')
    localStorage.removeItem('admin_auth_time')
    setPassword('')
    toast.success('Logged out successfully')
  }

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <div>
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
              <i className="fas fa-lock text-blue-600 text-xl"></i>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              CRCCF Resume Builder Admin Panel
            </p>
          </div>
          
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="password" className="sr-only">
                  Admin Password
                </label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="show-password"
                  name="show-password"
                  type="checkbox"
                  checked={showPassword}
                  onChange={(e) => setShowPassword(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="show-password" className="ml-2 block text-sm text-gray-900">
                  Show password
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <i className="fas fa-sign-in-alt text-blue-500 group-hover:text-blue-400"></i>
                </span>
                Sign in
              </button>
            </div>
          </form>
          
          <div className="text-center">
            <a
              href="/"
              className="text-blue-600 hover:text-blue-500 text-sm"
            >
              ← Back to Resume Builder
            </a>
          </div>
        </div>
      </div>
    )
  }

  // Show admin panel if authenticated
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Admin Panel
              </h1>
              <span className="badge badge-success">Authenticated</span>
            </div>
            
            <div className="flex items-center space-x-4">
              <a
                href="/"
                className="btn btn-outline btn-sm"
              >
                <i className="fas fa-home mr-2"></i>
                Resume Builder
              </a>
              <button
                onClick={handleLogout}
                className="btn btn-danger btn-sm"
              >
                <i className="fas fa-sign-out-alt mr-2"></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AdminPanel />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            <p>&copy; 2024 CRCCF Resume Builder Admin Panel</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default AdminPage
