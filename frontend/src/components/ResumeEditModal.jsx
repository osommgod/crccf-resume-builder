import React, { useState } from 'react'
import axios from 'axios'
import toast from 'react-hot-toast'

/**
 * ResumeEditModal component - Edit resume details in admin panel
 * Provides form fields for editing all resume sections
 */
const ResumeEditModal = ({ resume, onClose, onUpdate }) => {
  const [editData, setEditData] = useState(JSON.parse(JSON.stringify(resume)))
  const [isSaving, setIsSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('personal')

  // API base URL
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  // Form sections
  const sections = [
    { id: 'personal', title: 'Personal Info', icon: 'fas fa-user' },
    { id: 'objective', title: 'Objective', icon: 'fas fa-bullseye' },
    { id: 'education', title: 'Education', icon: 'fas fa-graduation-cap' },
    { id: 'experience', title: 'Work Experience', icon: 'fas fa-briefcase' },
    { id: 'skills', title: 'Skills', icon: 'fas fa-tools' },
    { id: 'projects', title: 'Projects', icon: 'fas fa-project-diagram' },
    { id: 'certifications', title: 'Certifications', icon: 'fas fa-certificate' },
    { id: 'languages', title: 'Languages', icon: 'fas fa-language' },
    { id: 'hobbies', title: 'Hobbies', icon: 'fas fa-heart' },
    { id: 'references', title: 'References', icon: 'fas fa-users' }
  ]

  /**
   * Update personal info field
   */
  const updatePersonalInfo = (field, value) => {
    setEditData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
  }

  /**
   * Update simple field
   */
  const updateField = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  /**
   * Add new entry to array field
   */
  const addEntry = (field) => {
    let newEntry
    
    switch (field) {
      case 'education':
        newEntry = {
          degree: '',
          institution: '',
          yearFrom: '',
          yearTo: '',
          percentage: ''
        }
        break
      case 'workExperience':
        newEntry = {
          jobTitle: '',
          company: '',
          location: '',
          duration: '',
          description: ''
        }
        break
      case 'skills':
        newEntry = {
          name: '',
          proficiency: 'Beginner'
        }
        break
      case 'projects':
        newEntry = {
          name: '',
          techStack: '',
          description: '',
          liveUrl: '',
          githubUrl: ''
        }
        break
      case 'certifications':
        newEntry = {
          name: '',
          issuer: '',
          year: ''
        }
        break
      case 'languages':
        newEntry = {
          language: '',
          proficiency: ''
        }
        break
      case 'references':
        newEntry = {
          name: '',
          designation: '',
          company: '',
          email: ''
        }
        break
      default:
        return
    }
    
    setEditData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), newEntry]
    }))
  }

  /**
   * Update entry in array field
   */
  const updateEntry = (field, index, entry) => {
    setEditData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? entry : item)
    }))
  }

  /**
   * Remove entry from array field
   */
  const removeEntry = (field, index) => {
    setEditData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  /**
   * Save changes
   */
  const handleSave = async () => {
    setIsSaving(true)
    
    try {
      const response = await axios.put(`${API_URL}/api/resumes/${resume._id}`, editData)
      
      if (response.data.success) {
        toast.success('Resume updated successfully')
        onUpdate()
      } else {
        throw new Error(response.data.error || 'Failed to update resume')
      }
    } catch (error) {
      console.error('Error updating resume:', error)
      toast.error('Failed to update resume')
    } finally {
      setIsSaving(false)
    }
  }

  /**
   * Handle modal close
   */
  const handleClose = () => {
    if (!isSaving) {
      onClose()
    }
  }

  /**
   * Handle keyboard events
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Escape' && !isSaving) {
      handleClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleClose} onKeyDown={handleKeyDown} tabIndex={-1}>
      <div 
        className="modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <i className="fas fa-edit text-blue-600 mr-3"></i>
            Edit Resume
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50"
            disabled={isSaving}
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Section Navigation */}
        <div className="flex flex-wrap gap-2 mb-6">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={isSaving}
            >
              <i className={`${section.icon} mr-1`}></i>
              {section.title}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="max-h-96 overflow-y-auto space-y-6">
          {/* Personal Information */}
          {activeSection === 'personal' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Personal Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editData.personalInfo.fullName}
                    onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="form-label">Date of Birth</label>
                  <input
                    type="date"
                    className="form-input"
                    value={editData.personalInfo.dateOfBirth}
                    onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={editData.personalInfo.email}
                    onChange={(e) => updatePersonalInfo('email', e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="form-label">Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={editData.personalInfo.phone}
                    onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="form-label">WhatsApp</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={editData.personalInfo.whatsappNumber}
                    onChange={(e) => updatePersonalInfo('whatsappNumber', e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-input"
                    value={editData.personalInfo.address}
                    onChange={(e) => updatePersonalInfo('address', e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="form-label">LinkedIn</label>
                  <input
                    type="url"
                    className="form-input"
                    value={editData.personalInfo.linkedin}
                    onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                    disabled={isSaving}
                  />
                </div>
                <div>
                  <label className="form-label">Portfolio</label>
                  <input
                    type="url"
                    className="form-input"
                    value={editData.personalInfo.portfolioUrl}
                    onChange={(e) => updatePersonalInfo('portfolioUrl', e.target.value)}
                    disabled={isSaving}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Objective */}
          {activeSection === 'objective' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Career Objective</h4>
              <div>
                <label className="form-label">Objective</label>
                <textarea
                  className="form-input"
                  rows={6}
                  value={editData.objective}
                  onChange={(e) => updateField('objective', e.target.value)}
                  disabled={isSaving}
                />
              </div>
            </div>
          )}

          {/* Education */}
          {activeSection === 'education' && (
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-900">Education</h4>
                <button
                  onClick={() => addEntry('education')}
                  className="btn btn-primary btn-sm"
                  disabled={isSaving}
                >
                  <i className="fas fa-plus mr-1"></i>
                  Add
                </button>
              </div>
              
              {editData.education.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-medium text-gray-900">Education {index + 1}</h5>
                    <button
                      onClick={() => removeEntry('education', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={isSaving}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Degree</label>
                      <input
                        type="text"
                        className="form-input"
                        value={edu.degree}
                        onChange={(e) => updateEntry('education', index, { ...edu, degree: e.target.value })}
                        disabled={isSaving}
                      />
                    </div>
                    <div>
                      <label className="form-label">Institution</label>
                      <input
                        type="text"
                        className="form-input"
                        value={edu.institution}
                        onChange={(e) => updateEntry('education', index, { ...edu, institution: e.target.value })}
                        disabled={isSaving}
                      />
                    </div>
                    <div>
                      <label className="form-label">Start Year</label>
                      <input
                        type="number"
                        className="form-input"
                        value={edu.yearFrom}
                        onChange={(e) => updateEntry('education', index, { ...edu, yearFrom: parseInt(e.target.value) })}
                        disabled={isSaving}
                      />
                    </div>
                    <div>
                      <label className="form-label">End Year</label>
                      <input
                        type="number"
                        className="form-input"
                        value={edu.yearTo}
                        onChange={(e) => updateEntry('education', index, { ...edu, yearTo: parseInt(e.target.value) })}
                        disabled={isSaving}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="form-label">Percentage</label>
                      <input
                        type="number"
                        className="form-input"
                        value={edu.percentage}
                        onChange={(e) => updateEntry('education', index, { ...edu, percentage: parseFloat(e.target.value) })}
                        disabled={isSaving}
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
              <div className="flex justify-between items-center">
                <h4 className="font-semibold text-gray-900">Skills</h4>
                <button
                  onClick={() => addEntry('skills')}
                  className="btn btn-primary btn-sm"
                  disabled={isSaving}
                >
                  <i className="fas fa-plus mr-1"></i>
                  Add
                </button>
              </div>
              
              {editData.skills.map((skill, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h5 className="font-medium text-gray-900">Skill {index + 1}</h5>
                    <button
                      onClick={() => removeEntry('skills', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={isSaving}
                    >
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Skill Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={skill.name}
                        onChange={(e) => updateEntry('skills', index, { ...skill, name: e.target.value })}
                        disabled={isSaving}
                      />
                    </div>
                    <div>
                      <label className="form-label">Proficiency</label>
                      <select
                        className="form-input"
                        value={skill.proficiency}
                        onChange={(e) => updateEntry('skills', index, { ...skill, proficiency: e.target.value })}
                        disabled={isSaving}
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

          {/* Hobbies */}
          {activeSection === 'hobbies' && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Hobbies</h4>
              <div>
                <label className="form-label">Hobbies & Interests</label>
                <input
                  type="text"
                  className="form-input"
                  value={editData.hobbies}
                  onChange={(e) => updateField('hobbies', e.target.value)}
                  disabled={isSaving}
                  placeholder="Reading, Traveling, Photography"
                />
              </div>
            </div>
          )}

          {/* Other sections would follow similar patterns... */}
          {activeSection !== 'personal' && activeSection !== 'objective' && activeSection !== 'education' && activeSection !== 'skills' && activeSection !== 'hobbies' && (
            <div className="text-center py-8">
              <p className="text-gray-600">
                Edit functionality for {sections.find(s => s.id === activeSection)?.title} coming soon.
              </p>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="btn btn-outline"
            disabled={isSaving}
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="btn btn-primary"
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <div className="spinner w-4 h-4 mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save mr-2"></i>
                Save Changes
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResumeEditModal
