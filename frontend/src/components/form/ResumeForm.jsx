import React, { useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import PersonalInfoForm from './PersonalInfoForm'
import EducationForm from './EducationForm'
import WorkExperienceForm from './WorkExperienceForm'
import SkillsForm from './SkillsForm'
import ProjectsForm from './ProjectsForm'
import CertificationsForm from './CertificationsForm'
import LanguagesForm from './LanguagesForm'
import HobbiesForm from './HobbiesForm'
import ReferencesForm from './ReferencesForm'
import FormActions from './FormActions'

/**
 * Dynamic multi-section resume form with add/remove entries
 * Main form container that manages all resume sections
 */
const ResumeForm = ({ disabled = false, showPreview = false, onTogglePreview }) => {
  const { resumeData, validateResume, getCompletionPercentage } = useResume()
  const [activeSection, setActiveSection] = useState('personal')
  const [showValidationErrors, setShowValidationErrors] = useState(false)

  // Form sections configuration
  const sections = [
    { id: 'personal', title: 'Personal Information', icon: 'fas fa-user', required: true },
    { id: 'objective', title: 'Objective', icon: 'fas fa-bullseye', required: true },
    { id: 'education', title: 'Education', icon: 'fas fa-graduation-cap', required: true },
    { id: 'experience', title: 'Work Experience', icon: 'fas fa-briefcase', required: false },
    { id: 'skills', title: 'Skills', icon: 'fas fa-tools', required: true },
    { id: 'projects', title: 'Projects', icon: 'fas fa-code', required: false },
    { id: 'certifications', title: 'Certifications', icon: 'fas fa-certificate', required: false },
    { id: 'languages', title: 'Languages', icon: 'fas fa-language', required: false },
    { id: 'hobbies', title: 'Hobbies', icon: 'fas fa-heart', required: false },
    { id: 'references', title: 'References', icon: 'fas fa-users', required: false }
  ]

  // Handle section navigation
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId)
  }

  // Handle form validation
  const handleValidate = () => {
    const validation = validateResume()
    setShowValidationErrors(true)
    
    if (!validation.isValid) {
      // Find first section with errors and navigate to it
      const firstErrorSection = Object.keys(validation.errors)[0]
      if (firstErrorSection) {
        const sectionMap = {
          personalInfo: 'personal',
          objective: 'objective',
          education: 'education',
          skills: 'skills'
        }
        setActiveSection(sectionMap[firstErrorSection] || 'personal')
      }
    }
    
    return validation
  }

  // Get section completion status
  const getSectionStatus = (sectionId) => {
    switch (sectionId) {
      case 'personal':
        return resumeData.personalInfo.fullName && 
               resumeData.personalInfo.email && 
               resumeData.personalInfo.phone ? 'complete' : 'incomplete'
      case 'objective':
        return resumeData.objective ? 'complete' : 'incomplete'
      case 'education':
        return resumeData.education.length > 0 ? 'complete' : 'incomplete'
      case 'skills':
        return resumeData.skills.length > 0 ? 'complete' : 'incomplete'
      case 'experience':
        return resumeData.workExperience.length > 0 ? 'complete' : 'optional'
      case 'projects':
        return resumeData.projects.length > 0 ? 'complete' : 'optional'
      case 'certifications':
        return resumeData.certifications.length > 0 ? 'complete' : 'optional'
      case 'languages':
        return resumeData.languages.length > 0 ? 'complete' : 'optional'
      case 'hobbies':
        return resumeData.hobbies ? 'complete' : 'optional'
      case 'references':
        return resumeData.references.length > 0 ? 'complete' : 'optional'
      default:
        return 'incomplete'
    }
  }

  // Get status color for section
  const getStatusColor = (status) => {
    switch (status) {
      case 'complete':
        return 'text-green-600 bg-green-50 border-green-200'
      case 'incomplete':
        return 'text-red-600 bg-red-50 border-red-200'
      case 'optional':
        return 'text-gray-600 bg-gray-50 border-gray-200'
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  // Get status icon
  const getStatusIcon = (status) => {
    switch (status) {
      case 'complete':
        return 'fas fa-check-circle'
      case 'incomplete':
        return 'fas fa-exclamation-circle'
      case 'optional':
        return 'fas fa-circle'
      default:
        return 'fas fa-circle'
    }
  }

  const completionPercentage = getCompletionPercentage()

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Form Header */}
      <div className="border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Resume Details</h2>
            <p className="text-sm text-gray-600 mt-1">
              Complete all required sections to generate your resume
            </p>
          </div>
          
          {/* Progress indicator */}
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {completionPercentage}% Complete
            </div>
            <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Navigation */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8 px-6 overflow-x-auto" aria-label="Sections">
          {sections.map((section) => {
            const status = getSectionStatus(section.id)
            const statusColor = getStatusColor(status)
            const statusIcon = getStatusIcon(status)
            const isActive = activeSection === section.id
            
            return (
              <button
                key={section.id}
                onClick={() => handleSectionChange(section.id)}
                disabled={disabled}
                className={`
                  flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap
                  ${isActive 
                    ? 'border-blue-500 text-blue-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                  transition-colors duration-200
                `}
              >
                <i className={`${section.icon} ${isActive ? 'text-blue-600' : 'text-gray-400'}`}></i>
                <span>{section.title}</span>
                {section.required && (
                  <span className="text-red-500 ml-1">*</span>
                )}
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${statusColor}`}>
                  <i className={`${statusIcon} text-xs`}></i>
                </div>
              </button>
            )
          })}
        </nav>
      </div>

      {/* Form Content */}
      <div className="px-6 py-6">
        {disabled && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <i className="fas fa-exclamation-triangle text-yellow-400"></i>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Form Disabled
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  Resume submission is currently disabled. Please check the time status.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Render active section */}
        <div className="min-h-[400px]">
          {activeSection === 'personal' && (
            <PersonalInfoForm 
              disabled={disabled}
              showValidationErrors={showValidationErrors}
            />
          )}
          {activeSection === 'objective' && (
            <ObjectiveForm 
              disabled={disabled}
              showValidationErrors={showValidationErrors}
            />
          )}
          {activeSection === 'education' && (
            <EducationForm 
              disabled={disabled}
              showValidationErrors={showValidationErrors}
            />
          )}
          {activeSection === 'experience' && (
            <WorkExperienceForm 
              disabled={disabled}
            />
          )}
          {activeSection === 'skills' && (
            <SkillsForm 
              disabled={disabled}
              showValidationErrors={showValidationErrors}
            />
          )}
          {activeSection === 'projects' && (
            <ProjectsForm 
              disabled={disabled}
            />
          )}
          {activeSection === 'certifications' && (
            <CertificationsForm 
              disabled={disabled}
            />
          )}
          {activeSection === 'languages' && (
            <LanguagesForm 
              disabled={disabled}
            />
          )}
          {activeSection === 'hobbies' && (
            <HobbiesForm 
              disabled={disabled}
            />
          )}
          {activeSection === 'references' && (
            <ReferencesForm 
              disabled={disabled}
            />
          )}
        </div>
      </div>

      {/* Form Actions */}
      <FormActions 
        disabled={disabled}
        showPreview={showPreview}
        onTogglePreview={onTogglePreview}
        onValidate={handleValidate}
        completionPercentage={completionPercentage}
      />
    </div>
  )
}

// Objective form component (inline since it's simple)
const ObjectiveForm = ({ disabled, showValidationErrors }) => {
  const { resumeData, setObjective } = useResume()
  const [error, setError] = useState('')

  const handleChange = (value) => {
    setObjective(value)
    
    // Validate
    if (showValidationErrors && !value.trim()) {
      setError('Objective is required')
    } else if (value.trim().length < 10) {
      setError('Objective must be at least 10 characters')
    } else {
      setError('')
    }
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Career Objective <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={6}
          value={resumeData.objective}
          onChange={(e) => handleChange(e.target.value)}
          placeholder="Describe your career goals and what you aim to achieve..."
          className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
            error ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
          }`}
          disabled={disabled}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600">{error}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          {resumeData.objective.length}/500 characters
        </p>
      </div>
    </div>
  )
}

export default ResumeForm
