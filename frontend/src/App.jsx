import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import HomePage from './pages/HomePage'
import AdminPage from './pages/AdminPage'
import { TimeProvider } from './context/TimeContext'
import { ResumeProvider } from './context/ResumeContext'
import './styles/modal.css'

/**
 * Main App component for CRCCF Resume Builder
 * Handles routing and global state providers
 */
function App() {
  const [isLoading, setIsLoading] = useState(true)

  // Initialize app and check dependencies
  useEffect(() => {
    const initializeApp = async () => {
      try {
        // Check if required environment variables are available
        const apiUrl = import.meta.env.VITE_API_URL
        const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD

        if (!apiUrl) {
          console.warn('VITE_API_URL not found in environment variables')
        }

        // Simulate minimum loading time for better UX
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        setIsLoading(false)
      } catch (error) {
        console.error('Error initializing app:', error)
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  // Show loading screen while app initializes
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
        <div className="text-center text-white">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-2xl font-bold mb-2">CRCCF Resume Builder</h2>
          <p className="opacity-90">Initializing application...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="App">
      <TimeProvider>
        <ResumeProvider>
          <Routes>
            {/* Main resume builder route */}
            <Route path="/" element={<HomePage />} />
            
            {/* Admin panel route */}
            <Route path="/admin" element={<AdminPage />} />
            
            {/* Catch all route - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ResumeProvider>
      </TimeProvider>
    </div>
  )
}

export default App
