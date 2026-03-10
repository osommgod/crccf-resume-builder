/**
 * Frontend password gen: FirstName + DDMMYYYY
 * Pure function for password generation and validation
 */

/**
 * Generate password from full name and date of birth
 * Format: FirstName-DDMMYYYY
 */
export const generatePassword = (fullName, dateOfBirth) => {
  try {
    // Validate inputs
    if (!fullName || typeof fullName !== 'string') {
      throw new Error('Full name is required and must be a string')
    }
    
    if (!dateOfBirth) {
      throw new Error('Date of birth is required')
    }

    // Extract first name (take first word before space)
    const firstName = fullName.trim().split(' ')[0]
    
    if (!firstName || firstName.length < 2) {
      throw new Error('Invalid full name format')
    }

    // Format date of birth to DDMMYYYY
    let dob
    if (typeof dateOfBirth === 'string') {
      dob = new Date(dateOfBirth)
    } else if (dateOfBirth instanceof Date) {
      dob = dateOfBirth
    } else {
      throw new Error('Date of birth must be a valid date string or Date object')
    }

    if (isNaN(dob.getTime())) {
      throw new Error('Invalid date of birth')
    }

    const day = String(dob.getDate()).padStart(2, '0')
    const month = String(dob.getMonth() + 1).padStart(2, '0')
    const year = dob.getFullYear()

    // Combine first name and formatted date
    const password = `${firstName}-${day}${month}${year}`
    
    return password
  } catch (error) {
    console.error('Error generating password:', error.message)
    // Return a fallback password format for safety
    return 'Resume-Password'
  }
}

/**
 * Validate password format against expected pattern
 */
export const validatePasswordFormat = (password, fullName, dateOfBirth) => {
  try {
    const expectedPassword = generatePassword(fullName, dateOfBirth)
    const isValid = password === expectedPassword
    
    return {
      isValid,
      expectedPassword,
      providedPassword: password,
      message: isValid ? 'Password is valid' : 'Password does not match expected format'
    }
  } catch (error) {
    return {
      isValid: false,
      expectedPassword: null,
      providedPassword: password,
      message: `Error validating password: ${error.message}`
    }
  }
}

/**
 * Format date of birth for display
 */
export const formatDateOfBirth = (dateOfBirth) => {
  try {
    let dob
    if (typeof dateOfBirth === 'string') {
      dob = new Date(dateOfBirth)
    } else if (dateOfBirth instanceof Date) {
      dob = dateOfBirth
    } else {
      return 'Invalid Date'
    }

    if (isNaN(dob.getTime())) {
      return 'Invalid Date'
    }

    const day = String(dob.getDate()).padStart(2, '0')
    const month = String(dob.getMonth() + 1).padStart(2, '0')
    const year = dob.getFullYear()

    return `${day}/${month}/${year}`
  } catch (error) {
    return 'Invalid Date'
  }
}

/**
 * Check password strength
 */
export const checkPasswordStrength = (password) => {
  if (!password || typeof password !== 'string') {
    return { strength: 'weak', score: 0, feedback: 'Password is required' }
  }

  let score = 0
  const feedback = []

  // Length check
  if (password.length >= 8) {
    score += 1
  } else {
    feedback.push('Password should be at least 8 characters long')
  }

  // Contains uppercase letter
  if (/[A-Z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Add uppercase letters')
  }

  // Contains lowercase letter
  if (/[a-z]/.test(password)) {
    score += 1
  } else {
    feedback.push('Add lowercase letters')
  }

  // Contains number
  if (/[0-9]/.test(password)) {
    score += 1
  } else {
    feedback.push('Add numbers')
  }

  // Contains special character
  if (/[^A-Za-z0-9]/.test(password)) {
    score += 1
  } else {
    feedback.push('Add special characters')
  }

  let strength
  if (score <= 2) {
    strength = 'weak'
  } else if (score <= 3) {
    strength = 'medium'
  } else if (score <= 4) {
    strength = 'strong'
  } else {
    strength = 'very-strong'
  }

  return {
    strength,
    score,
    feedback: feedback.length > 0 ? feedback : ['Strong password']
  }
}

/**
 * Copy password to clipboard
 */
export const copyPasswordToClipboard = async (password) => {
  try {
    if (!password) {
      throw new Error('No password to copy')
    }

    // Use modern clipboard API if available
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(password)
      return { success: true, message: 'Password copied to clipboard!' }
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = password
      textArea.style.position = 'fixed'
      textArea.style.left = '-999999px'
      textArea.style.top = '-999999px'
      document.body.appendChild(textArea)
      textArea.focus()
      textArea.select()
      
      const result = document.execCommand('copy')
      document.body.removeChild(textArea)
      
      if (result) {
        return { success: true, message: 'Password copied to clipboard!' }
      } else {
        throw new Error('Failed to copy password')
      }
    }
  } catch (error) {
    console.error('Error copying password to clipboard:', error)
    return { success: false, message: 'Failed to copy password', error: error.message }
  }
}

/**
 * Generate password hint (without revealing the actual password)
 */
export const generatePasswordHint = (fullName, dateOfBirth) => {
  try {
    const firstName = fullName?.trim().split(' ')[0] || 'FirstName'
    const dob = new Date(dateOfBirth)
    
    if (isNaN(dob.getTime())) {
      return 'Password format: FirstName-DDMMYYYY'
    }
    
    const day = String(dob.getDate()).padStart(2, '0')
    const month = String(dob.getMonth() + 1).padStart(2, '0')
    const year = dob.getFullYear()
    
    return `Password format: ${firstName}-${day}${month}${year}`
  } catch (error) {
    return 'Password format: FirstName-DDMMYYYY'
  }
}

export default {
  generatePassword,
  validatePasswordFormat,
  formatDateOfBirth,
  checkPasswordStrength,
  copyPasswordToClipboard,
  generatePasswordHint
}
