import React, { useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { validateText, validateYear, validatePercentage } from '../../utils/validators'

/**
 * Education entries with add/remove functionality
 * Dynamic form for managing education history
 */
const EducationForm = ({ disabled = false, showValidationErrors = false }) => {
  const { resumeData, addEducation, updateEducation, removeEducation } = useResume()
  const [errors, setErrors] = useState({})

  // Handle field change for education entry
  const handleFieldChange = (index, field, value) => {
    updateEducation(index, { ...resumeData.education[index], [field]: value })
    
    // Validate if showing errors
    if (showValidationErrors) {
      validateEducationField(index, field, value)
    }
  }

  // Validate individual education field
  const validateEducationField = (index, field, value) => {
    const errorKey = `${field}_${index}`
    let error = ''

    switch (field) {
      case 'degree':
        const degreeValidation = validateText(value, {
          required: true,
          minLength: 2,
          maxLength: 100,
          fieldName: 'Degree'
        })
        error = degreeValidation.message
        break
      case 'institution':
        const institutionValidation = validateText(value, {
          required: true,
          minLength: 2,
          maxLength: 150,
          fieldName: 'Institution'
        })
        error = institutionValidation.message
        break
      case 'yearFrom':
        const yearFromValidation = validateYear(value, 'Start year')
        error = yearFromValidation.message
        break
      case 'yearTo':
        const yearToValidation = validateYear(value, 'End year')
        error = yearToValidation.message
        break
      case 'percentage':
        const percentageValidation = validatePercentage(value, 'Percentage')
        error = percentageValidation.message
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

  // Add new education entry
  const handleAddEducation = () => {
    const newEducation = {
      degree: '',
      institution: '',
      yearFrom: '',
      yearTo: '',
      percentage: ''
    }
    addEducation(newEducation)
  }

  // Remove education entry
  const handleRemoveEducation = (index) => {
    removeEducation(index)
    // Clear errors for this entry
    const newErrors = { ...errors }
    Object.keys(newErrors).forEach(key => {
      if (key.endsWith(`_${index}`)) {
        delete newErrors[key]
      }
    })
    setErrors(newErrors)
  }

  // Validate year range
  const validateYearRange = (index) => {
    const education = resumeData.education[index]
    if (education.yearFrom && education.yearTo) {
      const fromYear = parseInt(education.yearFrom)
      const toYear = parseInt(education.yearTo)
      
      if (fromYear > toYear) {
        setErrors(prev => ({
          ...prev,
          [`yearTo_${index}`]: 'End year must be after start year'
        }))
        return false
      }
    }
    return true
  }

  return (
    <div className="space-y-6">
      {resumeData.education.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-graduation-cap text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 mb-4">No education entries added yet</p>
          <button
            type="button"
            onClick={handleAddEducation}
            disabled={disabled}
            className="btn btn-primary"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Education
          </button>
        </div>
      ) : (
        <>
          {resumeData.education.map((education, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Education {index + 1}
                </h3>
                {resumeData.education.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveEducation(index)}
                    disabled={disabled}
                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Degree */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Degree <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={education.degree}
                    onChange={(e) => handleFieldChange(index, 'degree', e.target.value)}
                    placeholder="Bachelor of Technology"
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
                      errors[`degree_${index}`] ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                    disabled={disabled}
                  />
                  {errors[`degree_${index}`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`degree_${index}`]}</p>
                  )}
                </div>

                {/* Institution */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Institution <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={education.institution}
                    onChange={(e) => handleFieldChange(index, 'institution', e.target.value)}
                    placeholder="University of Example"
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
                      errors[`institution_${index}`] ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                    disabled={disabled}
                  />
                  {errors[`institution_${index}`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`institution_${index}`]}</p>
                  )}
                </div>

                {/* Year From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Start Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={education.yearFrom}
                    onChange={(e) => {
                      handleFieldChange(index, 'yearFrom', e.target.value)
                      validateYearRange(index)
                    }}
                    placeholder="2019"
                    min="1950"
                    max={new Date().getFullYear()}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
                      errors[`yearFrom_${index}`] ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                    disabled={disabled}
                  />
                  {errors[`yearFrom_${index}`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`yearFrom_${index}`]}</p>
                  )}
                </div>

                {/* Year To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    End Year <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={education.yearTo}
                    onChange={(e) => {
                      handleFieldChange(index, 'yearTo', e.target.value)
                      validateYearRange(index)
                    }}
                    placeholder="2023"
                    min="1950"
                    max={new Date().getFullYear() + 5}
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
                      errors[`yearTo_${index}`] ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                    disabled={disabled}
                  />
                  {errors[`yearTo_${index}`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`yearTo_${index}`]}</p>
                  )}
                </div>

                {/* Percentage */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Percentage/CGPA <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={education.percentage}
                    onChange={(e) => handleFieldChange(index, 'percentage', e.target.value)}
                    placeholder="85"
                    min="0"
                    max="100"
                    step="0.01"
                    className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
                      errors[`percentage_${index}`] ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
                    }`}
                    disabled={disabled}
                  />
                  {errors[`percentage_${index}`] && (
                    <p className="mt-1 text-sm text-red-600">{errors[`percentage_${index}`]}</p>
                  )}
                  <p className="mt-1 text-sm text-gray-500">
                    Enter percentage (0-100) or CGPA equivalent
                  </p>
                </div>
              </div>
            </div>
          ))}

          {/* Add Education Button */}
          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAddEducation}
              disabled={disabled}
              className="btn btn-outline"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Another Education
            </button>
          </div>
        </>
      )}

      {/* Validation message */}
      {showValidationErrors && resumeData.education.length === 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <i className="fas fa-exclamation-circle text-red-400"></i>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">
                Education Required
              </h3>
              <div className="mt-2 text-sm text-red-700">
                Please add at least one education entry.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default EducationForm
