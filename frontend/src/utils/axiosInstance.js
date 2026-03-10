import axios from 'axios'
import toast from 'react-hot-toast'

/**
 * Axios instance with VITE_API_URL as baseURL
 * All API calls in frontend must go through this instance only
 */
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add request timestamp for debugging
    config.metadata = { startTime: new Date() }
    
    // Log request in development
    if (import.meta.env.DEV) {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        params: config.params
      })
    }
    
    return config
  },
  (error) => {
    console.error('❌ Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    // Calculate response time
    const endTime = new Date()
    const duration = endTime - response.config.metadata.startTime
    
    // Log response in development
    if (import.meta.env.DEV) {
      console.log(`✅ API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        duration: `${duration}ms`,
        data: response.data
      })
    }
    
    return response
  },
  (error) => {
    // Calculate response time
    const endTime = new Date()
    const duration = error.config?.metadata ? endTime - error.config.metadata.startTime : 0
    
    // Log error in development
    if (import.meta.env.DEV) {
      console.error(`❌ API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
        status: error.response?.status,
        duration: `${duration}ms`,
        message: error.message,
        data: error.response?.data
      })
    }
    
    // Handle specific error cases
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          toast.error(data.error || 'Bad request')
          break
        case 401:
          toast.error('Authentication required')
          // Clear admin auth if unauthorized
          if (error.config.url?.includes('/admin') || error.config.headers?.['X-Admin-Key']) {
            localStorage.removeItem('admin_authenticated')
            localStorage.removeItem('admin_auth_time')
            window.location.href = '/admin'
          }
          break
        case 403:
          toast.error('Access forbidden')
          break
        case 404:
          toast.error('Resource not found')
          break
        case 429:
          toast.error('Too many requests. Please try again later.')
          break
        case 500:
          toast.error('Server error. Please try again later.')
          break
        default:
          toast.error(data.error || `Request failed with status ${status}`)
      }
    } else if (error.request) {
      // Request was made but no response received
      toast.error('Network error. Please check your connection.')
    } else {
      // Something else happened
      toast.error('Request failed. Please try again.')
    }
    
    return Promise.reject(error)
  }
)

// Utility methods for common API calls
const api = {
  // GET request
  get: (url, config = {}) => axiosInstance.get(url, config),
  
  // POST request
  post: (url, data = {}, config = {}) => axiosInstance.post(url, data, config),
  
  // PUT request
  put: (url, data = {}, config = {}) => axiosInstance.put(url, data, config),
  
  // DELETE request
  delete: (url, config = {}) => axiosInstance.delete(url, config),
  
  // PATCH request
  patch: (url, data = {}, config = {}) => axiosInstance.patch(url, data, config),
  
  // Upload file (multipart/form-data)
  upload: (url, formData, config = {}) => {
    return axiosInstance.post(url, formData, {
      ...config,
      headers: {
        'Content-Type': 'multipart/form-data',
        ...config.headers
      }
    })
  },
  
  // Download file
  download: async (url, filename, config = {}) => {
    const response = await axiosInstance.get(url, {
      ...config,
      responseType: 'blob'
    })
    
    // Create download link
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
    
    return response
  }
}

// Export both the instance and utility methods
export default axiosInstance
export { api }
