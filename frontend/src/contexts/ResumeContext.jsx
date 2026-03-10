import React, { createContext, useContext, useState, useCallback } from 'react'
import toast from 'react-hot-toast'

/**
 * Resume Context for managing resume form data
 * Handles form state, validation, and data management
 */

const ResumeContext = createContext()

export const useResume = () => {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider')
  }
  return context
}

// Initial resume data structure
const initialResumeData = {
  personalInfo: {
    fullName: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    address: '',
    linkedin: '',
    portfolioUrl: '',
    profilePhoto: ''
  },
  objective: '',
  education: [],
  workExperience: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  hobbies: '',
  references: []
}

export const ResumeProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState(initialResumeData)
  const [isDirty, setIsDirty] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})

  /**
   * Update personal info
   */
  const updatePersonalInfo = useCallback((field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }))
    setIsDirty(true)
    
    // Clear validation error for this field
    if (validationErrors[`personalInfo.${field}`]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[`personalInfo.${field}`]
        return newErrors
      })
    }
  }, [validationErrors])

  /**
   * Update objective
   */
  const updateObjective = useCallback((value) => {
    setResumeData(prev => ({
      ...prev,
      objective: value
    }))
    setIsDirty(true)
    
    // Clear validation error
    if (validationErrors.objective) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors.objective
        return newErrors
      })
    }
  }, [validationErrors])

  /**
   * Add new entry to an array field
   */
  const addEntry = useCallback((field, entry) => {
    setResumeData(prev => ({
      ...prev,
      [field]: [...prev[field], entry]
    }))
    setIsDirty(true)
  }, [])

  /**
   * Update entry in an array field
   */
  const updateEntry = useCallback((field, index, entry) => {
    setResumeData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? entry : item)
    }))
    setIsDirty(true)
  }, [])

  /**
   * Remove entry from an array field
   */
  const removeEntry = useCallback((field, index) => {
    setResumeData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
    setIsDirty(true)
  }, [])

  /**
   * Update hobbies
   */
  const updateHobbies = useCallback((value) => {
    setResumeData(prev => ({
      ...prev,
      hobbies: value
    }))
    setIsDirty(true)
  }, [])

  /**
   * Validate resume data
   */
  const validateResume = useCallback(() => {
    const errors = {}
    
    // Personal Info validation
    if (!resumeData.personalInfo.fullName.trim()) {
      errors['personalInfo.fullName'] = 'Full name is required'
    }
    
    if (!resumeData.personalInfo.dateOfBirth) {
      errors['personalInfo.dateOfBirth'] = 'Date of birth is required'
    }
    
    if (!resumeData.personalInfo.email.trim()) {
      errors['personalInfo.email'] = 'Email is required'
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(resumeData.personalInfo.email)) {
      errors['personalInfo.email'] = 'Please enter a valid email address'
    }
    
    if (!resumeData.personalInfo.phone.trim()) {
      errors['personalInfo.phone'] = 'Phone number is required'
    } else if (!/^[0-9]{10}$/.test(resumeData.personalInfo.phone)) {
      errors['personalInfo.phone'] = 'Phone number must be exactly 10 digits'
    }
    
    if (!resumeData.personalInfo.address.trim()) {
      errors['personalInfo.address'] = 'Address is required'
    }
    
    if (resumeData.personalInfo.whatsappNumber && !/^[0-9]{10}$/.test(resumeData.personalInfo.whatsappNumber)) {
      errors['personalInfo.whatsappNumber'] = 'WhatsApp number must be exactly 10 digits'
    }
    
    // Objective validation
    if (!resumeData.objective.trim()) {
      errors.objective = 'Objective is required'
    } else if (resumeData.objective.trim().length < 10) {
      errors.objective = 'Objective must be at least 10 characters'
    }
    
    // Education validation
    if (resumeData.education.length === 0) {
      errors.education = 'At least one education entry is required'
    } else {
      resumeData.education.forEach((edu, index) => {
        if (!edu.degree.trim()) {
          errors[`education.${index}.degree`] = 'Degree is required'
        }
        if (!edu.institution.trim()) {
          errors[`education.${index}.institution`] = 'Institution is required'
        }
        if (!edu.yearFrom) {
          errors[`education.${index}.yearFrom`] = 'Start year is required'
        }
        if (!edu.yearTo) {
          errors[`education.${index}.yearTo`] = 'End year is required'
        }
        if (edu.yearTo < edu.yearFrom) {
          errors[`education.${index}.yearTo`] = 'End year must be greater than start year'
        }
        if (edu.percentage < 0 || edu.percentage > 100) {
          errors[`education.${index}.percentage`] = 'Percentage must be between 0 and 100'
        }
      })
    }
    
    // Skills validation
    if (resumeData.skills.length === 0) {
      errors.skills = 'At least one skill is required'
    } else {
      resumeData.skills.forEach((skill, index) => {
        if (!skill.name.trim()) {
          errors[`skills.${index}.name`] = 'Skill name is required'
        }
        if (!skill.proficiency) {
          errors[`skills.${index}.proficiency`] = 'Proficiency level is required'
        }
      })
    }
    
    // Work Experience validation (if any entries)
    resumeData.workExperience.forEach((exp, index) => {
      if (!exp.jobTitle.trim()) {
        errors[`workExperience.${index}.jobTitle`] = 'Job title is required'
      }
      if (!exp.company.trim()) {
        errors[`workExperience.${index}.company`] = 'Company is required'
      }
      if (!exp.location.trim()) {
        errors[`workExperience.${index}.location`] = 'Location is required'
      }
      if (!exp.duration.trim()) {
        errors[`workExperience.${index}.duration`] = 'Duration is required'
      }
      if (!exp.description.trim()) {
        errors[`workExperience.${index}.description`] = 'Description is required'
      }
    })
    
    // Projects validation (if any entries)
    resumeData.projects.forEach((project, index) => {
      if (!project.name.trim()) {
        errors[`projects.${index}.name`] = 'Project name is required'
      }
      if (!project.techStack.trim()) {
        errors[`projects.${index}.techStack`] = 'Tech stack is required'
      }
      if (!project.description.trim()) {
        errors[`projects.${index}.description`] = 'Description is required'
      }
    })
    
    // References validation (if any entries)
    resumeData.references.forEach((ref, index) => {
      if (!ref.name.trim()) {
        errors[`references.${index}.name`] = 'Reference name is required'
      }
      if (!ref.designation.trim()) {
        errors[`references.${index}.designation`] = 'Designation is required'
      }
      if (!ref.company.trim()) {
        errors[`references.${index}.company`] = 'Company is required'
      }
      if (!ref.email.trim()) {
        errors[`references.${index}.email`] = 'Email is required'
      } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(ref.email)) {
        errors[`references.${index}.email`] = 'Please enter a valid email address'
      }
    })
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }, [resumeData])

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setResumeData(initialResumeData)
    setIsDirty(false)
    setValidationErrors({})
    toast.success('Form reset successfully')
  }, [])

  /**
   * Load resume data (for editing)
   */
  const loadResumeData = useCallback((data) => {
    setResumeData(data)
    setIsDirty(false)
    setValidationErrors({})
  }, [])

  /**
   * Get form completion percentage
   */
  const getCompletionPercentage = useCallback(() => {
    let completedFields = 0
    let totalFields = 0
    
    // Personal info (8 fields)
    const personalFields = ['fullName', 'dateOfBirth', 'email', 'phone', 'address']
    personalFields.forEach(field => {
      totalFields++
      if (resumeData.personalInfo[field]) completedFields++
    })
    
    // Optional personal fields
    const optionalPersonalFields = ['whatsappNumber', 'linkedin', 'portfolioUrl', 'profilePhoto']
    optionalPersonalFields.forEach(field => {
      totalFields++
      if (resumeData.personalInfo[field]) completedFields++
    })
    
    // Objective
    totalFields++
    if (resumeData.objective.trim()) completedFields++
    
    // Education (at least one required)
    totalFields++
    if (resumeData.education.length > 0) completedFields++
    
    // Skills (at least one required)
    totalFields++
    if (resumeData.skills.length > 0) completedFields++
    
    // Optional sections
    const optionalSections = ['workExperience', 'projects', 'certifications', 'languages', 'references']
    optionalSections.forEach(section => {
      totalFields++
      if (resumeData[section].length > 0) completedFields++
    })
    
    // Hobbies
    totalFields++
    if (resumeData.hobbies.trim()) completedFields++
    
    return totalFields > 0 ? Math.round((completedFields / totalFields) * 100) : 0
  }, [resumeData])

  const value = {
    resumeData,
    isDirty,
    validationErrors,
    updatePersonalInfo,
    updateObjective,
    addEntry,
    updateEntry,
    removeEntry,
    updateHobbies,
    validateResume,
    resetForm,
    loadResumeData,
    getCompletionPercentage
  }

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  )
}
