/**
 * Pure function: generate password from name + DOB
 * Format: FirstName-DDMMYYYY
 */
const generatePassword = (fullName, dateOfBirth) => {
  try {
    // Validate inputs
    if (!fullName || typeof fullName !== 'string') {
      throw new Error('Full name is required and must be a string');
    }
    
    if (!dateOfBirth) {
      throw new Error('Date of birth is required');
    }

    // Extract first name (take first word before space)
    const firstName = fullName.trim().split(' ')[0];
    
    if (!firstName || firstName.length < 2) {
      throw new Error('Invalid full name format');
    }

    // Format date of birth to DDMMYYYY
    let dob;
    if (typeof dateOfBirth === 'string') {
      dob = new Date(dateOfBirth);
    } else if (dateOfBirth instanceof Date) {
      dob = dateOfBirth;
    } else {
      throw new Error('Date of birth must be a valid date string or Date object');
    }

    if (isNaN(dob.getTime())) {
      throw new Error('Invalid date of birth');
    }

    const day = String(dob.getDate()).padStart(2, '0');
    const month = String(dob.getMonth() + 1).padStart(2, '0');
    const year = dob.getFullYear();

    // Combine first name and formatted date
    const password = `${firstName}-${day}${month}${year}`;
    
    return password;
  } catch (error) {
    console.error('Error generating password:', error.message);
    // Return a fallback password format for safety
    return 'Resume-Password';
  }
};

/**
 * Validate password format against expected pattern
 */
const validatePasswordFormat = (password, fullName, dateOfBirth) => {
  try {
    const expectedPassword = generatePassword(fullName, dateOfBirth);
    const isValid = password === expectedPassword;
    
    return {
      isValid,
      expectedPassword,
      providedPassword: password,
      message: isValid ? 'Password is valid' : 'Password does not match expected format'
    };
  } catch (error) {
    return {
      isValid: false,
      expectedPassword: null,
      providedPassword: password,
      message: `Error validating password: ${error.message}`
    };
  }
};

/**
 * Format date of birth for display
 */
const formatDateOfBirth = (dateOfBirth) => {
  try {
    let dob;
    if (typeof dateOfBirth === 'string') {
      dob = new Date(dateOfBirth);
    } else if (dateOfBirth instanceof Date) {
      dob = dateOfBirth;
    } else {
      return 'Invalid Date';
    }

    if (isNaN(dob.getTime())) {
      return 'Invalid Date';
    }

    const day = String(dob.getDate()).padStart(2, '0');
    const month = String(dob.getMonth() + 1).padStart(2, '0');
    const year = dob.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    return 'Invalid Date';
  }
};

module.exports = {
  generatePassword,
  validatePasswordFormat,
  formatDateOfBirth
};
