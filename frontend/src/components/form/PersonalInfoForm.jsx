import React, { useState } from 'react'
import { useResume } from '../../context/ResumeContext'
import { validateName, validateEmail, validatePhone, validateAddress, validateURL, validateDateOfBirth, validateFile } from '../../utils/validators'

/**
 * Personal Information form with photo upload
 * Handles all personal details with validation
 */
const PersonalInfoForm = ({ disabled = false, showValidationErrors = false }) => {
  const { resumeData, updatePersonalInfo } = useResume()
  const [errors, setErrors] = useState({})
  const [photoPreview, setPhotoPreview] = useState(resumeData.personalInfo.profilePhoto)

  // Handle field change with validation
  const handleFieldChange = (field, value) => {
    updatePersonalInfo(field, value)
    
    // Validate field if showing errors
    if (showValidationErrors) {
      validateField(field, value)
    }
  }

  // Validate individual field
  const validateField = (field, value) => {
    let error = ''
    
    switch (field) {
      case 'fullName':
        const nameValidation = validateName(value, 'Full name')
        error = nameValidation.message
        break
      case 'dateOfBirth':
        const dobValidation = validateDateOfBirth(value)
        error = dobValidation.message
        break
      case 'email':
        const emailValidation = validateEmail(value)
        error = emailValidation.message
        break
      case 'phone':
        const phoneValidation = validatePhone(value)
        error = phoneValidation.message
        break
      case 'whatsappNumber':
        if (value) {
          const whatsappValidation = validatePhone(value)
          error = whatsappValidation.message
        }
        break
      case 'address':
        const addressValidation = validateAddress(value)
        error = addressValidation.message
        break
      case 'linkedin':
        if (value) {
          const linkedinValidation = validateURL(value, 'LinkedIn URL')
          error = linkedinValidation.message
        }
        break
      case 'portfolioUrl':
        if (value) {
          const portfolioValidation = validateURL(value, 'Portfolio URL')
          error = portfolioValidation.message
        }
        break
      default:
        break
    }
    
    setErrors(prev => ({
      ...prev,
      [field]: error
    }))
    
    return !error
  }

  // Handle photo upload
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file
    const validation = validateFile(file, {
      maxSize: 5 * 1024 * 1024, // 5MB
      allowedTypes: ['image/jpeg', 'image/jpg', 'image/png'],
      fieldName: 'Profile photo'
    })

    if (!validation.isValid) {
      setErrors(prev => ({
        ...prev,
        profilePhoto: validation.message
      }))
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const photoData = e.target.result
      setPhotoPreview(photoData)
      updatePersonalInfo('profilePhoto', photoData)
      setErrors(prev => ({
        ...prev,
        profilePhoto: ''
      }))
    }
    reader.readAsDataURL(file)
  }

  // Remove photo
  const handleRemovePhoto = () => {
    setPhotoPreview('')
    updatePersonalInfo('profilePhoto', '')
    setErrors(prev => ({
      ...prev,
      profilePhoto: ''
    }))
  }

  // Format phone number input
  const formatPhoneNumber = (value) => {
    // Remove all non-digit characters
    const cleaned = value.replace(/\D/g, '')
    // Limit to 10 digits
    return cleaned.slice(0, 10)
  }

  return (
    <div className="space-y-6">
      {/* Profile Photo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Profile Photo (Optional)
        </label>
        <div className="flex items-center space-x-6">
          <div className="shrink-0">
            {photoPreview ? (
              <div className="relative">
                <img
                  className="h-24 w-24 object-cover rounded-full border-2 border-gray-300"
                  src={photoPreview}
                  alt="Profile preview"
                />
                <button
                  type="button"
                  onClick={handleRemovePhoto}
                  disabled={disabled}
                  className="absolute -top-2 -right-2 h-6 w-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 disabled:opacity-50"
                >
                  <i className="fas fa-times text-xs"></i>
                </button>
              </div>
            ) : (
              <div className="h-24 w-24 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-300">
                <i className="fas fa-user text-gray-400 text-2xl"></i>
              </div>
            )}
          </div>
          <div className="flex-1">
            <input
              type="file"
              id="profilePhoto"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handlePhotoUpload}
              disabled={disabled}
              className="hidden"
            />
            <label
              htmlFor="profilePhoto"
              className={`cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                disabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <i className="fas fa-upload mr-2"></i>
              Choose Photo
            </label>
            <p className="mt-1 text-sm text-gray-500">
              JPEG or PNG, max 5MB. Recommended: 400x400px
            </p>
            {errors.profilePhoto && (
              <p className="mt-1 text-sm text-red-600">{errors.profilePhoto}</p>
            )}
          </div>
        </div>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={resumeData.personalInfo.fullName}
            onChange={(e) => handleFieldChange('fullName', e.target.value)}
            placeholder="John Doe"
            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
              errors.fullName ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
            disabled={disabled}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date of Birth <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={resumeData.personalInfo.dateOfBirth}
            onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
            max={new Date().toISOString().split('T')[0]}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
              errors.dateOfBirth ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
            disabled={disabled}
          />
          {errors.dateOfBirth && (
            <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
          )}
        </div>
      </div>

      {/* Contact Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            value={resumeData.personalInfo.email}
            onChange={(e) => handleFieldChange('email', e.target.value)}
            placeholder="john.doe@example.com"
            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
              errors.email ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
            disabled={disabled}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={resumeData.personalInfo.phone}
            onChange={(e) => handleFieldChange('phone', formatPhoneNumber(e.target.value))}
            placeholder="1234567890"
            maxLength={10}
            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
              errors.phone ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
            disabled={disabled}
          />
          {errors.phone && (
            <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
          )}
        </div>
      </div>

      {/* WhatsApp Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          WhatsApp Number (Optional)
        </label>
        <input
          type="tel"
          value={resumeData.personalInfo.whatsappNumber}
          onChange={(e) => handleFieldChange('whatsappNumber', formatPhoneNumber(e.target.value))}
          placeholder="1234567890"
          maxLength={10}
          className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
            errors.whatsappNumber ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
          }`}
          disabled={disabled}
        />
        {errors.whatsappNumber && (
          <p className="mt-1 text-sm text-red-600">{errors.whatsappNumber}</p>
        )}
        <p className="mt-1 text-sm text-gray-500">
          If different from phone number
        </p>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Address <span className="text-red-500">*</span>
        </label>
        <textarea
          rows={3}
          value={resumeData.personalInfo.address}
          onChange={(e) => handleFieldChange('address', e.target.value)}
          placeholder="123 Main St, City, State 12345"
          className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
            errors.address ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
          }`}
          disabled={disabled}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      {/* Online Presence */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            LinkedIn Profile (Optional)
          </label>
          <input
            type="url"
            value={resumeData.personalInfo.linkedin}
            onChange={(e) => handleFieldChange('linkedin', e.target.value)}
            placeholder="https://linkedin.com/in/johndoe"
            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
              errors.linkedin ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
            disabled={disabled}
          />
          {errors.linkedin && (
            <p className="mt-1 text-sm text-red-600">{errors.linkedin}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Portfolio Website (Optional)
          </label>
          <input
            type="url"
            value={resumeData.personalInfo.portfolioUrl}
            onChange={(e) => handleFieldChange('portfolioUrl', e.target.value)}
            placeholder="https://johndoe.com"
            className={`block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm ${
              errors.portfolioUrl ? 'border-red-300 text-red-900 placeholder-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300'
            }`}
            disabled={disabled}
          />
          {errors.portfolioUrl && (
            <p className="mt-1 text-sm text-red-600">{errors.portfolioUrl}</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default PersonalInfoForm
