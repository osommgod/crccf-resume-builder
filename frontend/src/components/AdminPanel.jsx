import React, { useState, useEffect } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'
import ResumeViewModal from './ResumeViewModal'
import ResumeEditModal from './ResumeEditModal'
import timeService from '../services/timeService'

/**
 * AdminPanel component - Admin dashboard for managing resumes
 * Includes CRUD operations, search, filtering, and statistics
 */
const AdminPanel = () => {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [stats, setStats] = useState(null)
  const [selectedResume, setSelectedResume] = useState(null)
  const [showViewModal, setShowViewModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [resettingTimer, setResettingTimer] = useState(false)

  // API base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  /**
   * Fetch resumes from API
   */
  const fetchResumes = async (page = 1, search = '') => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/api/resumes`, {
        params: {
          page,
          limit: 10,
          search: search || undefined
        }
      })

      if (response.data.success) {
        setResumes(response.data.data.resumes)
        setTotalPages(response.data.data.pagination.totalPages)
        setStats(response.data.data.stats)
      }
    } catch (error) {
      console.error('Error fetching resumes:', error)
      toast.error('Failed to fetch resumes')
    } finally {
      setLoading(false)
    }
  }

  /**
   * Handle search
   */
  const handleSearch = (e) => {
    e.preventDefault()
    setCurrentPage(1)
    fetchResumes(1, searchTerm)
  }

  /**
   * Handle page change
   */
  const handlePageChange = (page) => {
    setCurrentPage(page)
    fetchResumes(page, searchTerm)
  }

  /**
   * Handle view resume
   */
  const handleViewResume = (resume) => {
    setSelectedResume(resume)
    setShowViewModal(true)
  }

  /**
   * Handle edit resume
   */
  const handleEditResume = (resume) => {
    setSelectedResume(resume)
    setShowEditModal(true)
  }

  /**
   * Handle delete resume
   */
  const handleDeleteResume = async (resumeId) => {
    try {
      await axios.delete(`${API_URL}/api/resumes/${resumeId}`)
      toast.success('Resume deleted successfully')
      setDeleteConfirm(null)
      fetchResumes(currentPage, searchTerm)
    } catch (error) {
      console.error('Error deleting resume:', error)
      toast.error('Failed to delete resume')
    }
  }

  /**
   * Handle resume update
   */
  const handleResumeUpdate = () => {
    setShowEditModal(false)
    setSelectedResume(null)
    fetchResumes(currentPage, searchTerm)
  }

  /**
   * Handle reset timer (admin only)
   */
  const handleResetTimer = async () => {
    try {
      setResettingTimer(true)
      const adminKey = prompt('Enter admin key to reset timer:')
      
      if (!adminKey) {
        setResettingTimer(false)
        return
      }

      const response = await timeService.resetTimeStatus(adminKey)
      
      if (response.success) {
        toast.success('Timer reset successfully! Resume submissions are now enabled.')
      } else {
        toast.error(response.message || 'Failed to reset timer')
      }
    } catch (error) {
      console.error('Error resetting timer:', error)
      toast.error(error.response?.data?.message || 'Failed to reset timer. Check admin key.')
    } finally {
      setResettingTimer(false)
    }
  }

  // Load resumes on component mount
  useEffect(() => {
    fetchResumes()
  }, [])

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.totalResumes}</div>
              <div className="text-sm text-gray-600">Total Resumes</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-green-600">{stats.avgExperience?.toFixed(1) || 0}</div>
              <div className="text-sm text-gray-600">Avg Experience</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-purple-600">{stats.avgProjects?.toFixed(1) || 0}</div>
              <div className="text-sm text-gray-600">Avg Projects</div>
            </div>
          </div>
          
          <div className="card">
            <div className="card-body text-center">
              <div className="text-3xl font-bold text-orange-600">{stats.avgSkills?.toFixed(1) || 0}</div>
              <div className="text-sm text-gray-600">Avg Skills</div>
            </div>
          </div>
        </div>
      )}

      {/* Timer Reset Section */}
      <div className="card border-l-4 border-red-500">
        <div className="card-body">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                <i className="fas fa-clock mr-2 text-red-500"></i>
                Resume Upload Timer
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Reset the timer to enable resume submissions for another 20 minutes.
              </p>
            </div>
            
            <button
              onClick={handleResetTimer}
              disabled={resettingTimer}
              className="btn btn-danger"
            >
              {resettingTimer ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Resetting...
                </>
              ) : (
                <>
                  <i className="fas fa-redo mr-2"></i>
                  Reset Timer
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Search and Actions */}
      <div className="card">
        <div className="card-header">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              Resume Management
            </h2>
            
            <form onSubmit={handleSearch} className="flex gap-2">
              <input
                type="text"
                placeholder="Search by name or email..."
                className="form-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                <i className="fas fa-search"></i>
              </button>
            </form>
          </div>
        </div>

        <div className="card-body p-0">
          {loading ? (
            <div className="text-center py-8">
              <div className="spinner w-8 h-8 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading resumes...</p>
            </div>
          ) : resumes.length === 0 ? (
            <div className="text-center py-8">
              <i className="fas fa-file-alt text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-600">
                {searchTerm ? 'No resumes found matching your search.' : 'No resumes submitted yet.'}
              </p>
            </div>
          ) : (
            <>
              {/* Resumes Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted At
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resumes.map((resume) => (
                      <tr key={resume._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {resume.personalInfo.fullName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {resume.personalInfo.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {resume.personalInfo.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-600">
                            {formatDate(resume.createdAt)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleViewResume(resume)}
                              className="text-blue-600 hover:text-blue-900"
                              title="View Resume"
                            >
                              <i className="fas fa-eye"></i>
                            </button>
                            <button
                              onClick={() => handleEditResume(resume)}
                              className="text-green-600 hover:text-green-900"
                              title="Edit Resume"
                            >
                              <i className="fas fa-edit"></i>
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(resume._id)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete Resume"
                            >
                              <i className="fas fa-trash"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                  <div className="text-sm text-gray-700">
                    Page {currentPage} of {totalPages}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="btn btn-outline btn-sm disabled:opacity-50"
                    >
                      <i className="fas fa-chevron-left"></i>
                    </button>
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="btn btn-outline btn-sm disabled:opacity-50"
                    >
                      <i className="fas fa-chevron-right"></i>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay" onClick={() => setDeleteConfirm(null)}>
          <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Delete
              </h3>
            </div>
            
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this resume? This action cannot be undone.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteResume(deleteConfirm)}
                className="btn btn-danger"
              >
                <i className="fas fa-trash mr-2"></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {showViewModal && selectedResume && (
        <ResumeViewModal
          resume={selectedResume}
          onClose={() => {
            setShowViewModal(false)
            setSelectedResume(null)
          }}
        />
      )}

      {/* Edit Modal */}
      {showEditModal && selectedResume && (
        <ResumeEditModal
          resume={selectedResume}
          onClose={() => {
            setShowEditModal(false)
            setSelectedResume(null)
          }}
          onUpdate={handleResumeUpdate}
        />
      )}
    </div>
  )
}

export default AdminPanel
