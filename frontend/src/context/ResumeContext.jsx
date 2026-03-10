import React, { createContext, useContext, useReducer, useEffect, useState } from 'react'

/**
 * Global state for resume form data via useContext
 * Manages all resume form state and operations
 */

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

// Action types for resume state management
const RESUME_ACTIONS = {
  SET_PERSONAL_INFO: 'SET_PERSONAL_INFO',
  UPDATE_PERSONAL_INFO: 'UPDATE_PERSONAL_INFO',
  SET_OBJECTIVE: 'SET_OBJECTIVE',
  ADD_EDUCATION: 'ADD_EDUCATION',
  UPDATE_EDUCATION: 'UPDATE_EDUCATION',
  REMOVE_EDUCATION: 'REMOVE_EDUCATION',
  ADD_EXPERIENCE: 'ADD_EXPERIENCE',
  UPDATE_EXPERIENCE: 'UPDATE_EXPERIENCE',
  REMOVE_EXPERIENCE: 'REMOVE_EXPERIENCE',
  ADD_SKILL: 'ADD_SKILL',
  UPDATE_SKILL: 'UPDATE_SKILL',
  REMOVE_SKILL: 'REMOVE_SKILL',
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  REMOVE_PROJECT: 'REMOVE_PROJECT',
  ADD_CERTIFICATION: 'ADD_CERTIFICATION',
  UPDATE_CERTIFICATION: 'UPDATE_CERTIFICATION',
  REMOVE_CERTIFICATION: 'REMOVE_CERTIFICATION',
  ADD_LANGUAGE: 'ADD_LANGUAGE',
  UPDATE_LANGUAGE: 'UPDATE_LANGUAGE',
  REMOVE_LANGUAGE: 'REMOVE_LANGUAGE',
  SET_HOBBIES: 'SET_HOBBIES',
  ADD_REFERENCE: 'ADD_REFERENCE',
  UPDATE_REFERENCE: 'UPDATE_REFERENCE',
  REMOVE_REFERENCE: 'REMOVE_REFERENCE',
  RESET_RESUME: 'RESET_RESUME',
  LOAD_RESUME: 'LOAD_RESUME'
}

// Resume reducer function
const resumeReducer = (state, action) => {
  switch (action.type) {
    case RESUME_ACTIONS.SET_PERSONAL_INFO:
      return {
        ...state,
        personalInfo: { ...state.personalInfo, ...action.payload }
      }

    case RESUME_ACTIONS.UPDATE_PERSONAL_INFO:
      return {
        ...state,
        personalInfo: {
          ...state.personalInfo,
          [action.payload.field]: action.payload.value
        }
      }

    case RESUME_ACTIONS.SET_OBJECTIVE:
      return {
        ...state,
        objective: action.payload
      }

    case RESUME_ACTIONS.ADD_EDUCATION:
      return {
        ...state,
        education: [...state.education, action.payload]
      }

    case RESUME_ACTIONS.UPDATE_EDUCATION:
      return {
        ...state,
        education: state.education.map((edu, index) =>
          index === action.payload.index ? action.payload.data : edu
        )
      }

    case RESUME_ACTIONS.REMOVE_EDUCATION:
      return {
        ...state,
        education: state.education.filter((_, index) => index !== action.payload)
      }

    case RESUME_ACTIONS.ADD_EXPERIENCE:
      return {
        ...state,
        workExperience: [...state.workExperience, action.payload]
      }

    case RESUME_ACTIONS.UPDATE_EXPERIENCE:
      return {
        ...state,
        workExperience: state.workExperience.map((exp, index) =>
          index === action.payload.index ? action.payload.data : exp
        )
      }

    case RESUME_ACTIONS.REMOVE_EXPERIENCE:
      return {
        ...state,
        workExperience: state.workExperience.filter((_, index) => index !== action.payload)
      }

    case RESUME_ACTIONS.ADD_SKILL:
      return {
        ...state,
        skills: [...state.skills, action.payload]
      }

    case RESUME_ACTIONS.UPDATE_SKILL:
      return {
        ...state,
        skills: state.skills.map((skill, index) =>
          index === action.payload.index ? action.payload.data : skill
        )
      }

    case RESUME_ACTIONS.REMOVE_SKILL:
      return {
        ...state,
        skills: state.skills.filter((_, index) => index !== action.payload)
      }

    case RESUME_ACTIONS.ADD_PROJECT:
      return {
        ...state,
        projects: [...state.projects, action.payload]
      }

    case RESUME_ACTIONS.UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map((project, index) =>
          index === action.payload.index ? action.payload.data : project
        )
      }

    case RESUME_ACTIONS.REMOVE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter((_, index) => index !== action.payload)
      }

    case RESUME_ACTIONS.ADD_CERTIFICATION:
      return {
        ...state,
        certifications: [...state.certifications, action.payload]
      }

    case RESUME_ACTIONS.UPDATE_CERTIFICATION:
      return {
        ...state,
        certifications: state.certifications.map((cert, index) =>
          index === action.payload.index ? action.payload.data : cert
        )
      }

    case RESUME_ACTIONS.REMOVE_CERTIFICATION:
      return {
        ...state,
        certifications: state.certifications.filter((_, index) => index !== action.payload)
      }

    case RESUME_ACTIONS.ADD_LANGUAGE:
      return {
        ...state,
        languages: [...state.languages, action.payload]
      }

    case RESUME_ACTIONS.UPDATE_LANGUAGE:
      return {
        ...state,
        languages: state.languages.map((lang, index) =>
          index === action.payload.index ? action.payload.data : lang
        )
      }

    case RESUME_ACTIONS.REMOVE_LANGUAGE:
      return {
        ...state,
        languages: state.languages.filter((_, index) => index !== action.payload)
      }

    case RESUME_ACTIONS.SET_HOBBIES:
      return {
        ...state,
        hobbies: action.payload
      }

    case RESUME_ACTIONS.ADD_REFERENCE:
      return {
        ...state,
        references: [...state.references, action.payload]
      }

    case RESUME_ACTIONS.UPDATE_REFERENCE:
      return {
        ...state,
        references: state.references.map((ref, index) =>
          index === action.payload.index ? action.payload.data : ref
        )
      }

    case RESUME_ACTIONS.REMOVE_REFERENCE:
      return {
        ...state,
        references: state.references.filter((_, index) => index !== action.payload)
      }

    case RESUME_ACTIONS.RESET_RESUME:
      return initialResumeData

    case RESUME_ACTIONS.LOAD_RESUME:
      return action.payload

    default:
      return state
  }
}

// Create context
const ResumeContext = createContext()

// Resume Provider component
export const ResumeProvider = ({ children }) => {
  const [resumeData, dispatch] = useReducer(resumeReducer, initialResumeData)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Load saved resume from localStorage on mount
  useEffect(() => {
    const savedResume = localStorage.getItem('resumeDraft')
    if (savedResume) {
      try {
        const parsedResume = JSON.parse(savedResume)
        dispatch({ type: RESUME_ACTIONS.LOAD_RESUME, payload: parsedResume })
      } catch (error) {
        console.error('Error loading saved resume:', error)
      }
    }
  }, [])

  // Save resume to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('resumeDraft', JSON.stringify(resumeData))
  }, [resumeData])

  // Action creators
  const updatePersonalInfo = (field, value) => {
    dispatch({
      type: RESUME_ACTIONS.UPDATE_PERSONAL_INFO,
      payload: { field, value }
    })
  }

  const setPersonalInfo = (data) => {
    dispatch({
      type: RESUME_ACTIONS.SET_PERSONAL_INFO,
      payload: data
    })
  }

  const setObjective = (objective) => {
    dispatch({
      type: RESUME_ACTIONS.SET_OBJECTIVE,
      payload: objective
    })
  }

  const addEducation = (education) => {
    dispatch({
      type: RESUME_ACTIONS.ADD_EDUCATION,
      payload: education
    })
  }

  const updateEducation = (index, data) => {
    dispatch({
      type: RESUME_ACTIONS.UPDATE_EDUCATION,
      payload: { index, data }
    })
  }

  const removeEducation = (index) => {
    dispatch({
      type: RESUME_ACTIONS.REMOVE_EDUCATION,
      payload: index
    })
  }

  const addExperience = (experience) => {
    dispatch({
      type: RESUME_ACTIONS.ADD_EXPERIENCE,
      payload: experience
    })
  }

  const updateExperience = (index, data) => {
    dispatch({
      type: RESUME_ACTIONS.UPDATE_EXPERIENCE,
      payload: { index, data }
    })
  }

  const removeExperience = (index) => {
    dispatch({
      type: RESUME_ACTIONS.REMOVE_EXPERIENCE,
      payload: index
    })
  }

  const addSkill = (skill) => {
    dispatch({
      type: RESUME_ACTIONS.ADD_SKILL,
      payload: skill
    })
  }

  const updateSkill = (index, data) => {
    dispatch({
      type: RESUME_ACTIONS.UPDATE_SKILL,
      payload: { index, data }
    })
  }

  const removeSkill = (index) => {
    dispatch({
      type: RESUME_ACTIONS.REMOVE_SKILL,
      payload: index
    })
  }

  const addProject = (project) => {
    dispatch({
      type: RESUME_ACTIONS.ADD_PROJECT,
      payload: project
    })
  }

  const updateProject = (index, data) => {
    dispatch({
      type: RESUME_ACTIONS.UPDATE_PROJECT,
      payload: { index, data }
    })
  }

  const removeProject = (index) => {
    dispatch({
      type: RESUME_ACTIONS.REMOVE_PROJECT,
      payload: index
    })
  }

  const addCertification = (certification) => {
    dispatch({
      type: RESUME_ACTIONS.ADD_CERTIFICATION,
      payload: certification
    })
  }

  const updateCertification = (index, data) => {
    dispatch({
      type: RESUME_ACTIONS.UPDATE_CERTIFICATION,
      payload: { index, data }
    })
  }

  const removeCertification = (index) => {
    dispatch({
      type: RESUME_ACTIONS.REMOVE_CERTIFICATION,
      payload: index
    })
  }

  const addLanguage = (language) => {
    dispatch({
      type: RESUME_ACTIONS.ADD_LANGUAGE,
      payload: language
    })
  }

  const updateLanguage = (index, data) => {
    dispatch({
      type: RESUME_ACTIONS.UPDATE_LANGUAGE,
      payload: { index, data }
    })
  }

  const removeLanguage = (index) => {
    dispatch({
      type: RESUME_ACTIONS.REMOVE_LANGUAGE,
      payload: index
    })
  }

  const setHobbies = (hobbies) => {
    dispatch({
      type: RESUME_ACTIONS.SET_HOBBIES,
      payload: hobbies
    })
  }

  const addReference = (reference) => {
    dispatch({
      type: RESUME_ACTIONS.ADD_REFERENCE,
      payload: reference
    })
  }

  const updateReference = (index, data) => {
    dispatch({
      type: RESUME_ACTIONS.UPDATE_REFERENCE,
      payload: { index, data }
    })
  }

  const removeReference = (index) => {
    dispatch({
      type: RESUME_ACTIONS.REMOVE_REFERENCE,
      payload: index
    })
  }

  const resetResume = () => {
    dispatch({ type: RESUME_ACTIONS.RESET_RESUME })
    localStorage.removeItem('resumeDraft')
  }

  const loadResume = (data) => {
    dispatch({ type: RESUME_ACTIONS.LOAD_RESUME, payload: data })
  }

  // Validation function
  const validateResume = () => {
    const errors = []

    // Validate personal info
    if (!resumeData.personalInfo.fullName.trim()) {
      errors.push('Full name is required')
    }
    if (!resumeData.personalInfo.dateOfBirth) {
      errors.push('Date of birth is required')
    }
    if (!resumeData.personalInfo.email.trim()) {
      errors.push('Email is required')
    }
    if (!resumeData.personalInfo.phone.trim()) {
      errors.push('Phone number is required')
    }
    if (!resumeData.personalInfo.address.trim()) {
      errors.push('Address is required')
    }

    // Validate objective
    if (!resumeData.objective.trim()) {
      errors.push('Objective is required')
    }

    // Validate education
    if (resumeData.education.length === 0) {
      errors.push('At least one education entry is required')
    } else {
      resumeData.education.forEach((edu, index) => {
        if (!edu.degree.trim()) {
          errors.push(`Education ${index + 1}: Degree is required`)
        }
        if (!edu.institution.trim()) {
          errors.push(`Education ${index + 1}: Institution is required`)
        }
        if (!edu.yearFrom || !edu.yearTo) {
          errors.push(`Education ${index + 1}: Years are required`)
        }
        if (edu.percentage === undefined || edu.percentage === null) {
          errors.push(`Education ${index + 1}: Percentage is required`)
        }
      })
    }

    // Validate skills
    if (resumeData.skills.length === 0) {
      errors.push('At least one skill is required')
    } else {
      resumeData.skills.forEach((skill, index) => {
        if (!skill.name.trim()) {
          errors.push(`Skill ${index + 1}: Skill name is required`)
        }
        if (!skill.proficiency) {
          errors.push(`Skill ${index + 1}: Proficiency is required`)
        }
      })
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  // Calculate completion percentage
  const getCompletionPercentage = () => {
    let completedFields = 0
    let totalFields = 0

    // Personal info (8 fields)
    totalFields += 8
    if (resumeData.personalInfo.fullName.trim()) completedFields++
    if (resumeData.personalInfo.dateOfBirth) completedFields++
    if (resumeData.personalInfo.email.trim()) completedFields++
    if (resumeData.personalInfo.phone.trim()) completedFields++
    if (resumeData.personalInfo.address.trim()) completedFields++
    if (resumeData.personalInfo.linkedin.trim()) completedFields++
    if (resumeData.personalInfo.portfolioUrl.trim()) completedFields++
    if (resumeData.personalInfo.profilePhoto.trim()) completedFields++

    // Objective (1 field)
    totalFields += 1
    if (resumeData.objective.trim()) completedFields++

    // Education (at least 1 entry)
    totalFields += 1
    if (resumeData.education.length > 0) completedFields++

    // Skills (at least 1 entry)
    totalFields += 1
    if (resumeData.skills.length > 0) completedFields++

    // Optional sections
    totalFields += 5
    if (resumeData.workExperience.length > 0) completedFields++
    if (resumeData.projects.length > 0) completedFields++
    if (resumeData.certifications.length > 0) completedFields++
    if (resumeData.languages.length > 0) completedFields++
    if (resumeData.hobbies.trim()) completedFields++

    return Math.round((completedFields / totalFields) * 100)
  }

  const value = {
    // State
    resumeData,
    isLoading,
    error,
    
    // Personal info actions
    updatePersonalInfo,
    setPersonalInfo,
    
    // Objective
    setObjective,
    
    // Education actions
    addEducation,
    updateEducation,
    removeEducation,
    
    // Experience actions
    addExperience,
    updateExperience,
    removeExperience,
    
    // Skills actions
    addSkill,
    updateSkill,
    removeSkill,
    
    // Projects actions
    addProject,
    updateProject,
    removeProject,
    
    // Certifications actions
    addCertification,
    updateCertification,
    removeCertification,
    
    // Languages actions
    addLanguage,
    updateLanguage,
    removeLanguage,
    
    // Hobbies
    setHobbies,
    
    // References actions
    addReference,
    updateReference,
    removeReference,
    
    // Utility actions
    resetResume,
    loadResume,
    
    // Validation and completion
    validateResume,
    getCompletionPercentage
  }

  return (
    <ResumeContext.Provider value={value}>
      {children}
    </ResumeContext.Provider>
  )
}

// Custom hook to use resume context
export const useResume = () => {
  const context = useContext(ResumeContext)
  if (!context) {
    throw new Error('useResume must be used within a ResumeProvider')
  }
  return context
}

export default ResumeContext
