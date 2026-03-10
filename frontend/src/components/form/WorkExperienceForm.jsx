import React, { useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { validateText } from '../../utils/validators'

/**
 * Work experience entries with add/remove functionality
 * Dynamic form for managing work history
 */
const WorkExperienceForm = ({ disabled = false }) => {
  const { resumeData, addExperience, updateExperience, removeExperience } = useResume()
  const [errors, setErrors] = useState({})

  // Handle field change for experience entry
  const handleFieldChange = (index, field, value) => {
    updateExperience(index, { ...resumeData.workExperience[index], [field]: value })
  }

  // Add new experience entry
  const handleAddExperience = () => {
    const newExperience = {
      jobTitle: '',
      company: '',
      location: '',
      duration: '',
      description: ''
    }
    addExperience(newExperience)
  }

  // Remove experience entry
  const handleRemoveExperience = (index) => {
    removeExperience(index)
  }

  return (
    <div className="space-y-6">
      {resumeData.workExperience.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-briefcase text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 mb-4">No work experience added yet (Optional)</p>
          <button
            type="button"
            onClick={handleAddExperience}
            disabled={disabled}
            className="btn btn-outline"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Work Experience
          </button>
        </div>
      ) : (
        <>
          {resumeData.workExperience.map((experience, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Work Experience {index + 1}
                </h3>
                <button
                  type="button"
                  onClick={() => handleRemoveExperience(index)}
                  disabled={disabled}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title
                  </label>
                  <input
                    type="text"
                    value={experience.jobTitle}
                    onChange={(e) => handleFieldChange(index, 'jobTitle', e.target.value)}
                    placeholder="Software Engineer"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    disabled={disabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    value={experience.company}
                    onChange={(e) => handleFieldChange(index, 'company', e.target.value)}
                    placeholder="Tech Company Inc."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    disabled={disabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={experience.location}
                    onChange={(e) => handleFieldChange(index, 'location', e.target.value)}
                    placeholder="New York, NY"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    disabled={disabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Duration
                  </label>
                  <input
                    type="text"
                    value={experience.duration}
                    onChange={(e) => handleFieldChange(index, 'duration', e.target.value)}
                    placeholder="Jan 2020 - Present"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    disabled={disabled}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <textarea
                    rows={3}
                    value={experience.description}
                    onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                    placeholder="Describe your responsibilities and achievements..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    disabled={disabled}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAddExperience}
              disabled={disabled}
              className="btn btn-outline"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Another Experience
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default WorkExperienceForm
