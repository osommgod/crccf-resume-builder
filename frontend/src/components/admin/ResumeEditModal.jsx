import React, { useState } from 'react'
import axiosInstance from '../../utils/axiosInstance'
import toast from 'react-hot-toast'

/**
 * Editable resume form with save/delete
 * Modal for editing resume details in admin panel
 */
const ResumeEditModal = ({ isOpen, onClose, resume, onUpdate }) => {
  const [editedResume, setEditedResume] = useState(null)
  const [isSaving, setIsSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('personal')

  // Initialize edited resume when modal opens
  React.useEffect(() => {
    if (isOpen && resume) {
      setEditedResume(JSON.parse(JSON.stringify(resume)))
    }
  }, [isOpen, resume])

  if (!isOpen || !editedResume) return null

  // Handle field change
  const handleFieldChange = (section, field, value) => {
    setEditedResume(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }))
  }

  // Handle array field change (education, skills, etc.)
  const handleArrayFieldChange = (section, index, field, value) => {
    setEditedResume(prev => ({
      ...prev,
      [section]: prev[section].map((item, i) => 
        i === index ? { ...item, [field]: value } : item
      )
    }))
  }

  // Add new item to array
  const handleAddArrayItem = (section, newItem) => {
    setEditedResume(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }))
  }

  // Remove item from array
  const handleRemoveArrayItem = (section, index) => {
    setEditedResume(prev => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index)
    }))
  }

  // Save changes
  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await axiosInstance.put(`/resumes/${resume._id}`, editedResume)
      
      if (response.data.success) {
        toast.success('Resume updated successfully')
        onUpdate()
      }
    } catch (error) {
      console.error('Error updating resume:', error)
      toast.error('Failed to update resume')
    } finally {
      setIsSaving(false)
    }
  }

  // Sections for navigation
  const sections = [
    { id: 'personal', title: 'Personal Info', icon: 'fas fa-user' },
    { id: 'objective', title: 'Objective', icon: 'fas fa-bullseye' },
    { id: 'education', title: 'Education', icon: 'fas fa-graduation-cap' },
    { id: 'experience', title: 'Experience', icon: 'fas fa-briefcase' },
    { id: 'skills', title: 'Skills', icon: 'fas fa-tools' },
    { id: 'projects', title: 'Projects', icon: 'fas fa-code' },
    { id: 'certifications', title: 'Certifications', icon: 'fas fa-certificate' },
    { id: 'languages', title: 'Languages', icon: 'fas fa-language' },
    { id: 'hobbies', title: 'Hobbies', icon: 'fas fa-heart' },
    { id: 'references', title: 'References', icon: 'fas fa-users' }
  ]

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="relative inline-block w-full max-w-6xl max-h-[90vh] transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle">
          {/* Modal header */}
          <div className="bg-green-600 px-4 pb-4 pt-5 sm:px-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <i className="fas fa-edit text-green-600"></i>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-white">
                  Edit Resume
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-green-100">
                    {editedResume.personalInfo.fullName}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6 overflow-x-auto">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeSection === section.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <i className={`${section.icon} ${activeSection === section.id ? 'text-green-600' : 'text-gray-400'}`}></i>
                  <span>{section.title}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Modal body */}
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Personal Information */}
              {activeSection === 'personal' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Personal Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editedResume.personalInfo.fullName}
                        onChange={(e) => handleFieldChange('personalInfo', 'fullName', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editedResume.personalInfo.email}
                        onChange={(e) => handleFieldChange('personalInfo', 'email', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input
                        type="tel"
                        value={editedResume.personalInfo.phone}
                        onChange={(e) => handleFieldChange('personalInfo', 'phone', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        type="date"
                        value={editedResume.personalInfo.dateOfBirth}
                        onChange={(e) => handleFieldChange('personalInfo', 'dateOfBirth', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                      <input
                        type="text"
                        value={editedResume.personalInfo.address}
                        onChange={(e) => handleFieldChange('personalInfo', 'address', e.target.value)}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Objective */}
              {activeSection === 'objective' && (
                <div className="space-y-4">
                  <h4 className="text-lg font-semibold text-gray-900">Objective</h4>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Career Objective</label>
                    <textarea
                      rows={4}
                      value={editedResume.objective}
                      onChange={(e) => handleFieldChange('objective', e.target.value)}
                      className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                    />
                  </div>
                </div>
              )}

              {/* Education */}
              {activeSection === 'education' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">Education</h4>
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem('education', {
                        degree: '',
                        institution: '',
                        yearFrom: '',
                        yearTo: '',
                        percentage: ''
                      })}
                      className="btn btn-outline btn-sm"
                    >
                      <i className="fas fa-plus mr-1"></i> Add
                    </button>
                  </div>
                  {editedResume.education.map((edu, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">Education {index + 1}</h5>
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem('education', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => handleArrayFieldChange('education', index, 'degree', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => handleArrayFieldChange('education', index, 'institution', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">From Year</label>
                          <input
                            type="number"
                            value={edu.yearFrom}
                            onChange={(e) => handleArrayFieldChange('education', index, 'yearFrom', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">To Year</label>
                          <input
                            type="number"
                            value={edu.yearTo}
                            onChange={(e) => handleArrayFieldChange('education', index, 'yearTo', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Percentage</label>
                          <input
                            type="number"
                            value={edu.percentage}
                            onChange={(e) => handleArrayFieldChange('education', index, 'percentage', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {activeSection === 'skills' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-lg font-semibold text-gray-900">Skills</h4>
                    <button
                      type="button"
                      onClick={() => handleAddArrayItem('skills', {
                        name: '',
                        proficiency: 'Beginner'
                      })}
                      className="btn btn-outline btn-sm"
                    >
                      <i className="fas fa-plus mr-1"></i> Add
                    </button>
                  </div>
                  {editedResume.skills.map((skill, index) => (
                    <div key={index} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">Skill {index + 1}</h5>
                        <button
                          type="button"
                          onClick={() => handleRemoveArrayItem('skills', index)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name</label>
                          <input
                            type="text"
                            value={skill.name}
                            onChange={(e) => handleArrayFieldChange('skills', index, 'name', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency</label>
                          <select
                            value={skill.proficiency}
                            onChange={(e) => handleArrayFieldChange('skills', index, 'proficiency', e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 sm:text-sm"
                          >
                            <option value="Beginner">Beginner</option>
                            <option value="Intermediate">Intermediate</option>
                            <option value="Expert">Expert</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Other sections would be implemented similarly... */}
              {activeSection !== 'personal' && activeSection !== 'objective' && activeSection !== 'education' && activeSection !== 'skills' && (
                <div className="text-center py-8">
                  <i className="fas fa-tools text-4xl text-gray-300 mb-4"></i>
                  <p className="text-gray-600">This section is under development</p>
                </div>
              )}
            </div>
          </div>

          {/* Modal footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeEditModal
