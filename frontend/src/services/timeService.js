import axiosInstance from '../utils/axiosInstance'

/**
 * Service for time-related API calls
 */
export const timeService = {
  /**
   * Get current time status from backend
   */
  async getTimeStatus() {
    try {
      const response = await axiosInstance.get('/api/time-status')
      return response.data
    } catch (error) {
      console.error('Error fetching time status:', error)
      throw error
    }
  },

  /**
   * Reset time status (admin only)
   */
  async resetTimeStatus(adminKey) {
    try {
      const response = await axiosInstance.post('/api/time-status/reset', { adminKey })
      return response.data
    } catch (error) {
      console.error('Error resetting time status:', error)
      throw error
    }
  },

  /**
   * Get time configuration
   */
  async getTimeConfig() {
    try {
      const response = await axiosInstance.get('/api/time-status/config')
      return response.data
    } catch (error) {
      console.error('Error fetching time config:', error)
      throw error
    }
  },

  /**
   * Check time service health
   */
  async getTimeHealth() {
    try {
      const response = await axiosInstance.get('/api/time-status/health')
      return response.data
    } catch (error) {
      console.error('Error checking time health:', error)
      throw error
    }
  }
}

export default timeService
