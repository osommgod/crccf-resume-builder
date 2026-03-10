/**
 * Form field validation helper functions
 * Pure functions for validating various form inputs
 */

/**
 * Validate email format
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: 'Email is required' }
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid = emailRegex.test(email.trim())

  return {
    isValid,
    message: isValid ? '' : 'Please enter a valid email address'
  }
}

/**
 * Validate phone number (10 digits)
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, message: 'Phone number is required' }
  }

  const phoneRegex = /^[0-9]{10}$/
  const isValid = phoneRegex.test(phone.replace(/\s/g, ''))

  return {
    isValid,
    message: isValid ? '' : 'Phone number must be exactly 10 digits'
  }
}

/**
 * Validate name (letters, spaces, hyphens, apostrophes)
 */
export const validateName = (name, fieldName = 'Name') => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, message: `${fieldName} is required` }
  }

  const trimmedName = name.trim()
  if (trimmedName.length < 2) {
    return { isValid: false, message: `${fieldName} must be at least 2 characters` }
  }

  if (trimmedName.length > 100) {
    return { isValid: false, message: `${fieldName} cannot exceed 100 characters` }
  }

  const nameRegex = /^[a-zA-Z\s\-']+$/
  const isValid = nameRegex.test(trimmedName)

  return {
    isValid,
    message: isValid ? '' : `${fieldName} can only contain letters, spaces, hyphens, and apostrophes`
  }
}

/**
 * Validate date of birth (must be in the past and reasonable age)
 */
export const validateDateOfBirth = (dateOfBirth) => {
  if (!dateOfBirth) {
    return { isValid: false, message: 'Date of birth is required' }
  }

  let dob
  if (typeof dateOfBirth === 'string') {
    dob = new Date(dateOfBirth)
  } else if (dateOfBirth instanceof Date) {
    dob = dateOfBirth
  } else {
    return { isValid: false, message: 'Invalid date format' }
  }

  if (isNaN(dob.getTime())) {
    return { isValid: false, message: 'Invalid date' }
  }

  const today = new Date()
  const minDate = new Date(today.getFullYear() - 100, today.getMonth(), today.getDate())
  const maxDate = new Date(today.getFullYear() - 15, today.getMonth(), today.getDate())

  if (dob > maxDate) {
    return { isValid: false, message: 'You must be at least 15 years old' }
  }

  if (dob < minDate) {
    return { isValid: false, message: 'Please enter a valid date of birth' }
  }

  return { isValid: true, message: '' }
}

/**
 * Validate URL format
 */
export const validateURL = (url, fieldName = 'URL') => {
  if (!url || typeof url !== 'string') {
    return { isValid: true, message: '' } // URLs are optional
  }

  const trimmedUrl = url.trim()
  if (trimmedUrl.length === 0) {
    return { isValid: true, message: '' }
  }

  // Add protocol if missing
  let urlToTest = trimmedUrl
  if (!trimmedUrl.startsWith('http://') && !trimmedUrl.startsWith('https://')) {
    urlToTest = 'https://' + trimmedUrl
  }

  try {
    new URL(urlToTest)
    return { isValid: true, message: '' }
  } catch {
    return { isValid: false, message: `Please enter a valid ${fieldName}` }
  }
}

/**
 * Validate text field with min/max length
 */
export const validateText = (text, options = {}) => {
  const {
    required = false,
    minLength = 1,
    maxLength = 1000,
    fieldName = 'Field',
    allowEmpty = false
  } = options

  if (!text || typeof text !== 'string') {
    if (required) {
      return { isValid: false, message: `${fieldName} is required` }
    }
    return { isValid: true, message: '' }
  }

  const trimmedText = text.trim()

  if (!allowEmpty && trimmedText.length === 0) {
    if (required) {
      return { isValid: false, message: `${fieldName} cannot be empty` }
    }
    return { isValid: true, message: '' }
  }

  if (trimmedText.length < minLength) {
    return { isValid: false, message: `${fieldName} must be at least ${minLength} characters` }
  }

  if (trimmedText.length > maxLength) {
    return { isValid: false, message: `${fieldName} cannot exceed ${maxLength} characters` }
  }

  return { isValid: true, message: '' }
}

/**
 * Validate percentage (0-100)
 */
export const validatePercentage = (percentage, fieldName = 'Percentage') => {
  if (percentage === null || percentage === undefined) {
    return { isValid: false, message: `${fieldName} is required` }
  }

  const num = Number(percentage)

  if (isNaN(num)) {
    return { isValid: false, message: `${fieldName} must be a number` }
  }

  if (num < 0 || num > 100) {
    return { isValid: false, message: `${fieldName} must be between 0 and 100` }
  }

  return { isValid: true, message: '' }
}

/**
 * Validate year (reasonable range)
 */
export const validateYear = (year, fieldName = 'Year') => {
  if (year === null || year === undefined) {
    return { isValid: false, message: `${fieldName} is required` }
  }

  const num = Number(year)

  if (isNaN(num)) {
    return { isValid: false, message: `${fieldName} must be a number` }
  }

  const currentYear = new Date().getFullYear()
  const minYear = 1950
  const maxYear = currentYear + 10

  if (num < minYear || num > maxYear) {
    return { isValid: false, message: `${fieldName} must be between ${minYear} and ${maxYear}` }
  }

  return { isValid: true, message: '' }
}

/**
 * Validate proficiency level
 */
export const validateProficiency = (proficiency, allowedLevels = ['Beginner', 'Intermediate', 'Expert']) => {
  if (!proficiency || typeof proficiency !== 'string') {
    return { isValid: false, message: 'Proficiency level is required' }
  }

  const isValid = allowedLevels.includes(proficiency.trim())

  return {
    isValid,
    message: isValid ? '' : `Proficiency must be one of: ${allowedLevels.join(', ')}`
  }
}

/**
 * Validate address
 */
export const validateAddress = (address) => {
  if (!address || typeof address !== 'string') {
    return { isValid: false, message: 'Address is required' }
  }

  const trimmedAddress = address.trim()

  if (trimmedAddress.length < 5) {
    return { isValid: false, message: 'Address must be at least 5 characters' }
  }

  if (trimmedAddress.length > 200) {
    return { isValid: false, message: 'Address cannot exceed 200 characters' }
  }

  return { isValid: true, message: '' }
}

/**
 * Validate file (for photo upload)
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB
    allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'],
    fieldName = 'File'
  } = options

  if (!file) {
    return { isValid: true, message: '' } // Files are optional
  }

  if (!(file instanceof File)) {
    return { isValid: false, message: 'Invalid file' }
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: `${fieldName} must be JPEG or PNG` }
  }

  if (file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024))
    return { isValid: false, message: `${fieldName} size cannot exceed ${maxSizeMB}MB` }
  }

  return { isValid: true, message: '' }
}

/**
 * Validate complete personal info section
 */
export const validatePersonalInfo = (personalInfo) => {
  const errors = {}

  // Full name
  const nameValidation = validateName(personalInfo.fullName, 'Full name')
  if (!nameValidation.isValid) {
    errors.fullName = nameValidation.message
  }

  // Date of birth
  const dobValidation = validateDateOfBirth(personalInfo.dateOfBirth)
  if (!dobValidation.isValid) {
    errors.dateOfBirth = dobValidation.message
  }

  // Email
  const emailValidation = validateEmail(personalInfo.email)
  if (!emailValidation.isValid) {
    errors.email = emailValidation.message
  }

  // Phone
  const phoneValidation = validatePhone(personalInfo.phone)
  if (!phoneValidation.isValid) {
    errors.phone = phoneValidation.message
  }

  // Address
  const addressValidation = validateAddress(personalInfo.address)
  if (!addressValidation.isValid) {
    errors.address = addressValidation.message
  }

  // WhatsApp (optional)
  if (personalInfo.whatsappNumber) {
    const whatsappValidation = validatePhone(personalInfo.whatsappNumber)
    if (!whatsappValidation.isValid) {
      errors.whatsappNumber = whatsappValidation.message
    }
  }

  // LinkedIn (optional)
  if (personalInfo.linkedin) {
    const linkedinValidation = validateURL(personalInfo.linkedin, 'LinkedIn URL')
    if (!linkedinValidation.isValid) {
      errors.linkedin = linkedinValidation.message
    }
  }

  // Portfolio URL (optional)
  if (personalInfo.portfolioUrl) {
    const portfolioValidation = validateURL(personalInfo.portfolioUrl, 'Portfolio URL')
    if (!portfolioValidation.isValid) {
      errors.portfolioUrl = portfolioValidation.message
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

/**
 * Validate complete resume data
 */
export const validateResumeData = (resumeData) => {
  const errors = {}

  // Validate personal info
  const personalInfoValidation = validatePersonalInfo(resumeData.personalInfo || {})
  if (!personalInfoValidation.isValid) {
    errors.personalInfo = personalInfoValidation.errors
  }

  // Validate objective
  const objectiveValidation = validateText(resumeData.objective, {
    required: true,
    minLength: 10,
    maxLength: 500,
    fieldName: 'Objective'
  })
  if (!objectiveValidation.isValid) {
    errors.objective = objectiveValidation.message
  }

  // Validate education (at least one required)
  if (!resumeData.education || resumeData.education.length === 0) {
    errors.education = 'At least one education entry is required'
  }

  // Validate skills (at least one required)
  if (!resumeData.skills || resumeData.skills.length === 0) {
    errors.skills = 'At least one skill is required'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

export default {
  validateEmail,
  validatePhone,
  validateName,
  validateDateOfBirth,
  validateURL,
  validateText,
  validatePercentage,
  validateYear,
  validateProficiency,
  validateAddress,
  validateFile,
  validatePersonalInfo,
  validateResumeData
}
