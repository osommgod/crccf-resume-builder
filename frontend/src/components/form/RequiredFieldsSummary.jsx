import React from 'react'
import { useResume } from '../../context/ResumeContext'

/**
 * Shows required fields completion status
 * Helps users understand what they need to fill
 */
const RequiredFieldsSummary = () => {
  const { resumeData, validateResume } = useResume()
  
  const validation = validateResume()
  
  const requiredFields = [
    { key: 'fullName', label: 'Full Name', section: 'Personal Info' },
    { key: 'dateOfBirth', label: 'Date of Birth', section: 'Personal Info' },
    { key: 'email', label: 'Email', section: 'Personal Info' },
    { key: 'phone', label: 'Phone Number', section: 'Personal Info' },
    { key: 'address', label: 'Address', section: 'Personal Info' },
    { key: 'objective', label: 'Career Objective', section: 'Objective' },
    { key: 'education', label: 'Education (at least one)', section: 'Education' },
    { key: 'skills', label: 'Skills (at least one)', section: 'Skills' }
  ]

  const getFieldStatus = (field) => {
    switch (field.key) {
      case 'fullName':
        return resumeData.personalInfo.fullName.trim() ? 'completed' : 'pending'
      case 'dateOfBirth':
        return resumeData.personalInfo.dateOfBirth ? 'completed' : 'pending'
      case 'email':
        return resumeData.personalInfo.email.trim() ? 'completed' : 'pending'
      case 'phone':
        return resumeData.personalInfo.phone.trim() ? 'completed' : 'pending'
      case 'address':
        return resumeData.personalInfo.address.trim() ? 'completed' : 'pending'
      case 'objective':
        return resumeData.objective.trim() ? 'completed' : 'pending'
      case 'education':
        return resumeData.education.length > 0 ? 'completed' : 'pending'
      case 'skills':
        return resumeData.skills.length > 0 ? 'completed' : 'pending'
      default:
        return 'pending'
    }
  }

  const completedCount = requiredFields.filter(field => getFieldStatus(field) === 'completed').length
  const totalCount = requiredFields.length
  const completionPercentage = Math.round((completedCount / totalCount) * 100)

  if (validation.isValid) {
    return null // Don't show if all fields are complete
  }

  return (
    <div className="required-fields-progress">
      <h4>
        Required Fields ({completedCount}/{totalCount} complete)
      </h4>
      
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div 
          className={`h-2 rounded-full transition-all duration-300 ${
            completionPercentage >= 100 ? 'bg-green-600' : 
            completionPercentage >= 50 ? 'bg-yellow-600' : 
            'bg-red-600'
          }`}
          style={{ width: `${completionPercentage}%` }}
        ></div>
      </div>

      <div className="required-fields-list">
        {requiredFields.map((field) => {
          const status = getFieldStatus(field)
          return (
            <div 
              key={field.key} 
              className={`required-field-item ${status}`}
            >
              {field.label}
            </div>
          )
        })}
      </div>

      {!validation.isValid && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          <strong>Note:</strong> All required fields must be completed to generate PDF, send email, or print resume.
        </div>
      )}
    </div>
  )
}

export default RequiredFieldsSummary
