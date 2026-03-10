/**
 * Password utilities for CRCCF Resume Builder
 * Handles password generation, validation, and formatting
 */

/**
 * Generate password from user's name and date of birth
 * Format: FirstName-DDMMYYYY
 * @param {string} fullName - User's full name
 * @param {string} dateOfBirth - Date of birth (ISO string or date string)
 * @returns {string} - Generated password
 */
export const generatePassword = (fullName, dateOfBirth) => {
  try {
    // Handle empty or undefined values
    if (!fullName || typeof fullName !== 'string' || fullName.trim() === '') {
      console.warn('Full name is empty or invalid')
      return 'Resume-Password'
    }
    
    if (!dateOfBirth || typeof dateOfBirth !== 'string') {
      console.warn('Date of birth is empty or invalid')
      return 'Resume-Password'
    }

    // Extract first name (take first word before space)
    const firstName = fullName.trim().split(' ')[0]
    
    if (!firstName || firstName.length === 0) {
      console.warn('Invalid full name format')
      return 'Resume-Password'
    }

    // Format date of birth to DDMMYYYY
    const dob = new Date(dateOfBirth)
    if (isNaN(dob.getTime())) {
      console.warn('Invalid date of birth format')
      return 'Resume-Password'
    }

    const day = String(dob.getDate()).padStart(2, '0')
    const month = String(dob.getMonth() + 1).padStart(2, '0')
    const year = dob.getFullYear()

    // Combine first name and formatted date
    const password = `${firstName}-${day}${month}${year}`
    
    return password
  } catch (error) {
    console.error('Error generating password:', error)
    // Return a fallback password format
    return 'Resume-Password'
  }
}

/**
 * Validate password format
 * @param {string} password - Password to validate
 * @param {string} fullName - User's full name for comparison
 * @param {string} dateOfBirth - Date of birth for comparison
 * @returns {Object} - Validation result with isValid and expectedPassword
 */
export const validatePassword = (password, fullName, dateOfBirth) => {
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
 * @param {string} dateOfBirth - Date of birth (ISO string or date string)
 * @returns {string} - Formatted date (DD/MM/YYYY)
 */
export const formatDateOfBirth = (dateOfBirth) => {
  try {
    const dob = new Date(dateOfBirth)
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
 * Get password strength indicator
 * @param {string} password - Password to check
 * @returns {Object} - Strength assessment
 */
export const getPasswordStrength = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      strength: 'weak',
      score: 0,
      message: 'Password is required'
    }
  }

  let score = 0
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    numbers: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  }

  // Calculate score
  Object.values(checks).forEach(passed => {
    if (passed) score++
  })

  // Determine strength
  let strength = 'weak'
  let message = 'Weak password'

  if (score >= 4) {
    strength = 'strong'
    message = 'Strong password'
  } else if (score >= 2) {
    strength = 'medium'
    message = 'Medium strength password'
  }

  return {
    strength,
    score,
    message,
    checks
  }
}

/**
 * Copy password to clipboard
 * @param {string} password - Password to copy
 * @returns {Promise<boolean>} - True if successful
 */
export const copyPasswordToClipboard = async (password) => {
  try {
    if (!password) {
      throw new Error('No password to copy')
    }

    await navigator.clipboard.writeText(password)
    return true
  } catch (error) {
    console.error('Failed to copy password:', error)
    
    // Fallback for older browsers
    try {
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
      
      return result
    } catch (fallbackError) {
      console.error('Fallback copy failed:', fallbackError)
      return false
    }
  }
}

/**
 * Generate a random password (for testing or admin purposes)
 * @param {number} length - Password length (default: 12)
 * @param {Object} options - Options for character types
 * @returns {string} - Random password
 */
export const generateRandomPassword = (length = 12, options = {}) => {
  const defaults = {
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true
  }
  
  const opts = { ...defaults, ...options }
  let charset = ''
  
  if (opts.uppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (opts.lowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
  if (opts.numbers) charset += '0123456789'
  if (opts.symbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'
  
  if (!charset) {
    throw new Error('At least one character type must be selected')
  }
  
  let password = ''
  for (let i = 0; i < length; i++) {
    password += charset.charAt(Math.floor(Math.random() * charset.length))
  }
  
  return password
}

/**
 * Check if password follows the expected pattern
 * @param {string} password - Password to check
 * @returns {Object} - Pattern analysis
 */
export const analyzePasswordPattern = (password) => {
  if (!password || typeof password !== 'string') {
    return {
      isValidPattern: false,
      pattern: null,
      name: null,
      date: null,
      message: 'Invalid password'
    }
  }

  // Check for pattern: Name-DDMMYYYY
  const pattern = /^([A-Za-z]+)-(\d{2})(\d{2})(\d{4})$/
  const match = password.match(pattern)
  
  if (!match) {
    return {
      isValidPattern: false,
      pattern: null,
      name: null,
      date: null,
      message: 'Password does not follow the expected pattern (Name-DDMMYYYY)'
    }
  }

  const [, name, day, month, year] = match
  
  // Validate date components
  const dayNum = parseInt(day)
  const monthNum = parseInt(month)
  const yearNum = parseInt(year)
  
  const isValidDate = dayNum >= 1 && dayNum <= 31 && 
                     monthNum >= 1 && monthNum <= 12 && 
                     yearNum >= 1900 && yearNum <= new Date().getFullYear()
  
  if (!isValidDate) {
    return {
      isValidPattern: false,
      pattern: 'Name-DDMMYYYY',
      name,
      date: null,
      message: 'Invalid date in password'
    }
  }

  return {
    isValidPattern: true,
    pattern: 'Name-DDMMYYYY',
    name,
    date: `${day}/${month}/${year}`,
    formattedDate: new Date(yearNum, monthNum - 1, dayNum).toLocaleDateString(),
    message: 'Password follows the expected pattern'
  }
}

/**
 * Get password instructions for user
 * @returns {string} - Formatted instructions
 */
export const getPasswordInstructions = () => {
  return `
Password Format: FirstName-DDMMYYYY

Example: If your name is John and date of birth is 01/01/1995,
your password will be: John-01011995

Instructions:
• Use your first name (as written in the form)
• Use your date of birth in DDMMYYYY format
• Separate name and date with a hyphen (-)
• Keep this password secure to open your resume PDF
  `.trim()
}

export default {
  generatePassword,
  validatePassword,
  formatDateOfBirth,
  getPasswordStrength,
  copyPasswordToClipboard,
  generateRandomPassword,
  analyzePasswordPattern,
  getPasswordInstructions
}
