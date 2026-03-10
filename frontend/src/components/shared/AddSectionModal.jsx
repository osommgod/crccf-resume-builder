import React, { useState } from 'react'
import { useResume } from '../../context/ResumeContext'

const AddSectionModal = ({ isOpen, onClose, sectionType }) => {
  const { addEntry } = useResume()
  const [formData, setFormData] = useState({})

  // Reset form when modal opens or section type changes
  React.useEffect(() => {
    if (isOpen) {
      setFormData(getInitialFormData(sectionType))
    }
  }, [isOpen, sectionType])

  const getInitialFormData = (section) => {
    switch (section) {
      case 'education':
        return {
          degree: '',
          institution: '',
          yearFrom: '',
          yearTo: '',
          percentage: ''
        }
      case 'experience':
        return {
          jobTitle: '',
          company: '',
          location: '',
          duration: '',
          description: ''
        }
      case 'skills':
        return {
          name: '',
          proficiency: 'Beginner'
        }
      case 'projects':
        return {
          name: '',
          techStack: '',
          description: '',
          liveUrl: '',
          githubUrl: ''
        }
      case 'certifications':
        return {
          name: '',
          issuer: '',
          year: ''
        }
      case 'languages':
        return {
          language: '',
          proficiency: ''
        }
      default:
        return {}
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    addEntry(sectionType, formData)
    onClose()
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isOpen) return null

  const renderFormFields = () => {
    switch (sectionType) {
      case 'education':
        return (
          <>
            <div>
              <label className="form-label">Degree <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="form-input"
                value={formData.degree}
                onChange={(e) => handleInputChange('degree', e.target.value)}
                placeholder="B.Tech Computer Science"
                required
              />
            </div>
            <div>
              <label className="form-label">Institution <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="form-input"
                value={formData.institution}
                onChange={(e) => handleInputChange('institution', e.target.value)}
                placeholder="University Name"
                required
              />
            </div>
            <div>
              <label className="form-label">Start Year <span className="text-red-500">*</span></label>
              <input
                type="number"
                className="form-input"
                value={formData.yearFrom}
                onChange={(e) => handleInputChange('yearFrom', e.target.value)}
                min="1950"
                max={new Date().getFullYear()}
                required
              />
            </div>
            <div>
              <label className="form-label">End Year <span className="text-red-500">*</span></label>
              <input
                type="number"
                className="form-input"
                value={formData.yearTo}
                onChange={(e) => handleInputChange('yearTo', e.target.value)}
                min="1950"
                max={new Date().getFullYear() + 10}
                required
              />
            </div>
            <div>
              <label className="form-label">Percentage/CGPA <span className="text-red-500">*</span></label>
              <input
                type="number"
                className="form-input"
                value={formData.percentage}
                onChange={(e) => handleInputChange('percentage', e.target.value)}
                min="0"
                max="100"
                step="0.01"
                placeholder="85.5"
                required
              />
            </div>
          </>
        )

      case 'experience':
        return (
          <>
            <div>
              <label className="form-label">Job Title</label>
              <input
                type="text"
                className="form-input"
                value={formData.jobTitle}
                onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                placeholder="Software Engineer"
              />
            </div>
            <div>
              <label className="form-label">Company</label>
              <input
                type="text"
                className="form-input"
                value={formData.company}
                onChange={(e) => handleInputChange('company', e.target.value)}
                placeholder="Tech Company Inc."
              />
            </div>
            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="New York, NY"
              />
            </div>
            <div>
              <label className="form-label">Duration</label>
              <input
                type="text"
                className="form-input"
                value={formData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="Jan 2020 - Present"
              />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your responsibilities and achievements..."
              />
            </div>
          </>
        )

      case 'skills':
        return (
          <>
            <div>
              <label className="form-label">Skill Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="JavaScript, React, Python, etc."
                required
              />
            </div>
            <div>
              <label className="form-label">Proficiency <span className="text-red-500">*</span></label>
              <select
                className="form-input"
                value={formData.proficiency}
                onChange={(e) => handleInputChange('proficiency', e.target.value)}
                required
              >
                <option value="">Select Proficiency</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </>
        )

      case 'projects':
        return (
          <>
            <div>
              <label className="form-label">Project Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="E-commerce Platform"
              />
            </div>
            <div>
              <label className="form-label">Tech Stack</label>
              <input
                type="text"
                className="form-input"
                value={formData.techStack}
                onChange={(e) => handleInputChange('techStack', e.target.value)}
                placeholder="React, Node.js, MongoDB"
              />
            </div>
            <div>
              <label className="form-label">Live URL</label>
              <input
                type="url"
                className="form-input"
                value={formData.liveUrl}
                onChange={(e) => handleInputChange('liveUrl', e.target.value)}
                placeholder="https://project-demo.com"
              />
            </div>
            <div>
              <label className="form-label">GitHub URL</label>
              <input
                type="url"
                className="form-input"
                value={formData.githubUrl}
                onChange={(e) => handleInputChange('githubUrl', e.target.value)}
                placeholder="https://github.com/username/project"
              />
            </div>
            <div className="md:col-span-2">
              <label className="form-label">Description</label>
              <textarea
                className="form-input"
                rows={3}
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe the project, your role, and key features..."
              />
            </div>
          </>
        )

      case 'certifications':
        return (
          <>
            <div>
              <label className="form-label">Certification Name</label>
              <input
                type="text"
                className="form-input"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="AWS Certified Developer"
              />
            </div>
            <div>
              <label className="form-label">Issuer</label>
              <input
                type="text"
                className="form-input"
                value={formData.issuer}
                onChange={(e) => handleInputChange('issuer', e.target.value)}
                placeholder="Amazon Web Services"
              />
            </div>
            <div>
              <label className="form-label">Year</label>
              <input
                type="number"
                className="form-input"
                value={formData.year}
                onChange={(e) => handleInputChange('year', e.target.value)}
                min="1950"
                max={new Date().getFullYear()}
                placeholder="2023"
              />
            </div>
          </>
        )

      case 'languages':
        return (
          <>
            <div>
              <label className="form-label">Language</label>
              <input
                type="text"
                className="form-input"
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
                placeholder="English"
              />
            </div>
            <div>
              <label className="form-label">Proficiency</label>
              <input
                type="text"
                className="form-input"
                value={formData.proficiency}
                onChange={(e) => handleInputChange('proficiency', e.target.value)}
                placeholder="Native, Fluent, Intermediate"
              />
            </div>
          </>
        )

      default:
        return null
    }
  }

  const getSectionTitle = () => {
    switch (sectionType) {
      case 'education': return 'Add Education'
      case 'experience': return 'Add Work Experience'
      case 'skills': return 'Add Skill'
      case 'projects': return 'Add Project'
      case 'certifications': return 'Add Certification'
      case 'languages': return 'Add Language'
      default: return 'Add Item'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {getSectionTitle()}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
            >
              ×
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {renderFormFields()}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
              >
                Add {sectionType === 'experience' ? 'Experience' : 
                     sectionType === 'education' ? 'Education' :
                     sectionType.slice(0, -1).charAt(0).toUpperCase() + sectionType.slice(0, -1).slice(1)}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AddSectionModal
