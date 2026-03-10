import React, { useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { validateText, validateProficiency } from '../../utils/validators'

/**
 * Skills entries with add/remove functionality
 * Dynamic form for managing technical skills
 */
const SkillsForm = ({ disabled = false, showValidationErrors = false }) => {
  const { resumeData, addSkill, updateSkill, removeSkill } = useResume()
  const [errors, setErrors] = useState({})

  // Proficiency levels
  const proficiencyLevels = ['Beginner', 'Intermediate', 'Expert']

  // Handle field change for skill entry
  const handleFieldChange = (index, field, value) => {
    updateSkill(index, { ...resumeData.skills[index], [field]: value })
    
    // Validate if showing errors
    if (showValidationErrors) {
      validateSkillField(index, field, value)
    }
  }

  // Validate individual skill field
  const validateSkillField = (index, field, value) => {
    const errorKey = `${field}_${index}`
    let error = ''

    switch (field) {
      case 'name':
        const nameValidation = validateText(value, {
          required: true,
          minLength: 1,
          maxLength: 50,
          fieldName: 'Skill name'
        })
        error = nameValidation.message
        break
      case 'proficiency':
        const proficiencyValidation = validateProficiency(value, proficiencyLevels)
        error = proficiencyValidation.message
        break
      default:
        break
    }

    setErrors(prev => ({
      ...prev,
      [errorKey]: error
    }))

    return !error
  }

  // Add new skill entry
  const handleAddSkill = () => {
    const newSkill = {
      name: '',
      proficiency: 'Beginner'
    }
    addSkill(newSkill)
  }

  // Remove skill entry
  const handleRemoveSkill = (index) => {
    removeSkill(index)
    // Clear errors for this entry
    const newErrors = { ...errors }
    Object.keys(newErrors).forEach(key => {
      if (key.endsWith(`_${index}`)) {
        delete newErrors[key]
      }
    })
    setErrors(newErrors)
  }

  // Get proficiency color
  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case 'Expert':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'Intermediate':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Beginner':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {resumeData.skills.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-tools text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 mb-4">No skills added yet</p>
          <button
            type="button"
            onClick={handleAddSkill}
            disabled={disabled}
            className="btn btn-primary"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Skill
          </button>
        </div>
      ) : (
        <>
          {resumeData.skills.map((skill, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Skill {index + 1}
                </h3>
                {resumeData.skills.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(index)}
                    disabled={disabled}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Skill Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Skill Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                    placeholder="JavaScript, React, Python, etc."
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
                      errors[`name_${index}`] ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                    disabled={disabled}
                  />
                  {errors[`name_${index}`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`name_${index}`]}</p>
                  )}
                </div>

                {/* Proficiency */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proficiency Level <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={skill.proficiency}
                    onChange={(e) => handleFieldChange(index, 'proficiency', e.target.value)}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
                      errors[`proficiency_${index}`] ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                    disabled={disabled}
                  >
                    {proficiencyLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                  {errors[`proficiency_${index}`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`proficiency_${index}`]}</p>
                  )}
                  
                  {/* Proficiency Preview */}
                  {skill.name && (
                    <div className="mt-2">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getProficiencyColor(skill.proficiency)}`}>
                        {skill.name} - {skill.proficiency}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add Skill Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAddSkill}
              disabled={disabled}
              className="btn btn-outline"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Another Skill
            </button>
          </div>

          {/* Skills Preview */}
          {resumeData.skills.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Skills Preview:</h4>
              <div className="flex flex-wrap gap-2">
                {resumeData.skills.map((skill, index) => (
                  <span
                    key={index}
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getProficiencyColor(skill.proficiency)}`}
                  >
                    {skill.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Validation message */}
      {showValidationErrors && resumeData.skills.length === 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Skills Required
              </h3>
              <div className="mt-2 text-sm text-red-700">
                Please add at least one skill.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Skill Suggestions */}
      {resumeData.skills.length < 10 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-900 mb-2">
            <i className="fas fa-lightbulb mr-1"></i>
            Popular Skills to Consider:
          </h4>
          <div className="flex flex-wrap gap-2">
            {['JavaScript', 'React', 'Python', 'Java', 'SQL', 'Git', 'Docker', 'AWS', 'Node.js', 'TypeScript'].map(skill => (
              <button
                key={skill}
                type="button"
                onClick={() => {
                  const existingSkill = resumeData.skills.find(s => s.name.toLowerCase() === skill.toLowerCase())
                  if (!existingSkill) {
                    addSkill({ name: skill, proficiency: 'Intermediate' })
                  }
                }}
                disabled={disabled}
                className="text-xs bg-white border border-blue-300 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 disabled:opacity-50"
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default SkillsForm
