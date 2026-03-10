import React, { useState, useRef } from 'react'
import { useResume } from '../context/ResumeContext'
import { generatePassword } from '../utils/passwordUtils'
import EmailModal from './EmailModal'

/**
 * ResumePreview component - Live A4-formatted resume preview
 * Updates in real-time as user types, supports pagination
 */
const ResumePreview = () => {
  const { resumeData } = useResume()
  const [showEmailModal, setShowEmailModal] = useState(false)
  const previewRef = useRef(null)

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  // Format year range
  const formatYearRange = (yearFrom, yearTo) => {
    if (!yearFrom || !yearTo) return ''
    return `${yearFrom} - ${yearTo}`
  }

  // Get proficiency color
  const getProficiencyColor = (proficiency) => {
    switch (proficiency) {
      case 'Expert':
        return 'text-green-600'
      case 'Intermediate':
        return 'text-blue-600'
      case 'Beginner':
        return 'text-yellow-600'
      default:
        return 'text-gray-600'
    }
  }

  // Check if resume has content
  const hasContent = () => {
    return resumeData.personalInfo.fullName || 
           resumeData.personalInfo.email ||
           resumeData.objective ||
           resumeData.education.length > 0 ||
           resumeData.workExperience.length > 0 ||
           resumeData.skills.length > 0 ||
           resumeData.projects.length > 0
  }

  // Handle WhatsApp share
  const handleWhatsAppShare = () => {
    if (!resumeData.personalInfo.whatsappNumber) {
      return
    }

    const password = generatePassword(
      resumeData.personalInfo.fullName,
      resumeData.personalInfo.dateOfBirth
    )

    // Check if already sent
    const storageKey = `whatsapp_sent_${resumeData.personalInfo.whatsappNumber}`
    const alreadySent = localStorage.getItem(storageKey)

    if (alreadySent) {
      return
    }

    // Open WhatsApp with message
    const message = `Your%20Resume%20Password%3A%20${password}%0APlease%20check%20your%20email%20for%20the%20PDF.`
    const whatsappUrl = `https://wa.me/${resumeData.personalInfo.whatsappNumber}?text=${message}`
    window.open(whatsappUrl, '_blank')

    // Mark as sent
    localStorage.setItem(storageKey, 'true')
    
    // Show email modal for sending PDF
    setShowEmailModal(true)
  }

  // Check if WhatsApp was already sent
  const wasWhatsAppSent = () => {
    if (!resumeData.personalInfo.whatsappNumber) return false
    const storageKey = `whatsapp_sent_${resumeData.personalInfo.whatsappNumber}`
    return localStorage.getItem(storageKey) === 'true'
  }

  if (!hasContent()) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <i className="fas fa-file-alt text-6xl text-gray-300 mb-4"></i>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Resume Preview
        </h3>
        <p className="text-gray-500">
          Start filling in your details to see the live preview here
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Preview Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">
            Resume Preview
          </h3>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">
              A4 Format
            </span>
            <button
              onClick={() => window.print()}
              className="btn btn-outline btn-sm no-print"
            >
              <i className="fas fa-print mr-1"></i>
              Print
            </button>
          </div>
        </div>
      </div>

      {/* Resume Content */}
      <div className="p-6">
        <div 
          ref={previewRef}
          className="resume-preview max-w-4xl mx-auto" 
          data-resume-preview="true"
          style={{ minHeight: '842px' }} // A4 height ratio
        >
          {/* Resume Header */}
          <div className="resume-header">
            <div className="flex items-start space-x-6">
              {/* Profile Photo */}
              {resumeData.personalInfo.profilePhoto && (
                <div className="flex-shrink-0">
                  <img
                    src={resumeData.personalInfo.profilePhoto}
                    alt="Profile"
                    className="w-24 h-24 rounded-full border-4 border-white shadow-lg object-cover"
                  />
                </div>
              )}
              
              {/* Name and Contact */}
              <div className="flex-1 text-white">
                <h1 className="text-3xl font-bold mb-2">
                  {resumeData.personalInfo.fullName || 'Your Name'}
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  {resumeData.personalInfo.email && (
                    <div className="flex items-center">
                      <i className="fas fa-envelope mr-2"></i>
                      {resumeData.personalInfo.email}
                    </div>
                  )}
                  
                  {resumeData.personalInfo.phone && (
                    <div className="flex items-center">
                      <i className="fas fa-phone mr-2"></i>
                      {resumeData.personalInfo.phone}
                    </div>
                  )}
                  
                  {resumeData.personalInfo.whatsappNumber && (
                    <div className="flex items-center">
                      <i className="fab fa-whatsapp mr-2"></i>
                      {resumeData.personalInfo.whatsappNumber}
                    </div>
                  )}
                  
                  {resumeData.personalInfo.address && (
                    <div className="flex items-center">
                      <i className="fas fa-map-marker-alt mr-2"></i>
                      {resumeData.personalInfo.address}
                    </div>
                  )}
                  
                  {resumeData.personalInfo.linkedin && (
                    <div className="flex items-center">
                      <i className="fab fa-linkedin mr-2"></i>
                      <a 
                        href={resumeData.personalInfo.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        LinkedIn
                      </a>
                    </div>
                  )}
                  
                  {resumeData.personalInfo.portfolioUrl && (
                    <div className="flex items-center">
                      <i className="fas fa-globe mr-2"></i>
                      <a 
                        href={resumeData.personalInfo.portfolioUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        Portfolio
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex">
            {/* Left Column - Main Content */}
            <div className="flex-1 p-6">
              {/* Objective */}
              {resumeData.objective && (
                <div className="resume-section avoid-page-break">
                  <h2 className="resume-section-title">
                    <i className="fas fa-bullseye mr-2"></i>
                    Career Objective
                  </h2>
                  <p className="text-gray-700 leading-relaxed">
                    {resumeData.objective}
                  </p>
                </div>
              )}

              {/* Education */}
              {resumeData.education.length > 0 && (
                <div className="resume-section avoid-page-break">
                  <h2 className="resume-section-title">
                    <i className="fas fa-graduation-cap mr-2"></i>
                    Education
                  </h2>
                  {resumeData.education.map((edu, index) => (
                    <div key={index} className="mb-4 timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {edu.degree}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {formatYearRange(edu.yearFrom, edu.yearTo)}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-1">{edu.institution}</p>
                      <p className="text-sm text-gray-600">
                        Percentage: {edu.percentage}%
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Work Experience */}
              {resumeData.workExperience.length > 0 && (
                <div className="resume-section avoid-page-break">
                  <h2 className="resume-section-title">
                    <i className="fas fa-briefcase mr-2"></i>
                    Work Experience
                  </h2>
                  {resumeData.workExperience.map((exp, index) => (
                    <div key={index} className="mb-4 timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-semibold text-gray-900">
                          {exp.jobTitle}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {exp.duration}
                        </span>
                      </div>
                      <p className="text-gray-700 mb-1">
                        {exp.company} • {exp.location}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {exp.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Projects */}
              {resumeData.projects.length > 0 && (
                <div className="resume-section avoid-page-break">
                  <h2 className="resume-section-title">
                    <i className="fas fa-project-diagram mr-2"></i>
                    Projects
                  </h2>
                  {resumeData.projects.map((project, index) => (
                    <div key={index} className="mb-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-gray-900">
                          {project.name}
                        </h3>
                        <div className="flex space-x-2">
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              <i className="fas fa-external-link-alt"></i>
                            </a>
                          )}
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gray-600 hover:text-gray-800 text-sm"
                            >
                              <i className="fab fa-github"></i>
                            </a>
                          )}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        <strong>Tech Stack:</strong> {project.techStack}
                      </p>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {project.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Certifications */}
              {resumeData.certifications.length > 0 && (
                <div className="resume-section avoid-page-break">
                  <h2 className="resume-section-title">
                    <i className="fas fa-certificate mr-2"></i>
                    Certifications
                  </h2>
                  {resumeData.certifications.map((cert, index) => (
                    <div key={index} className="mb-2">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-gray-900">
                          {cert.name}
                        </h3>
                        <span className="text-sm text-gray-600">
                          {cert.year}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        {cert.issuer}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* References */}
              {resumeData.references.length > 0 && (
                <div className="resume-section avoid-page-break">
                  <h2 className="resume-section-title">
                    <i className="fas fa-users mr-2"></i>
                    References
                  </h2>
                  {resumeData.references.map((ref, index) => (
                    <div key={index} className="mb-3">
                      <h3 className="font-semibold text-gray-900">
                        {ref.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {ref.designation} at {ref.company}
                      </p>
                      <p className="text-gray-600 text-sm">
                        {ref.email}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Sidebar */}
            <div className="w-80 resume-sidebar">
              {/* Skills */}
              {resumeData.skills.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">
                    <i className="fas fa-tools mr-2"></i>
                    Skills
                  </h3>
                  <div className="space-y-2">
                    {resumeData.skills.map((skill, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-700">{skill.name}</span>
                        <span className={`text-sm font-medium ${getProficiencyColor(skill.proficiency)}`}>
                          {skill.proficiency}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {resumeData.languages.length > 0 && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">
                    <i className="fas fa-language mr-2"></i>
                    Languages
                  </h3>
                  <div className="space-y-2">
                    {resumeData.languages.map((lang, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-700">{lang.language}</span>
                        <span className="text-sm text-gray-600">{lang.proficiency}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hobbies */}
              {resumeData.hobbies && (
                <div className="mb-6">
                  <h3 className="font-bold text-gray-900 mb-3 pb-2 border-b-2 border-blue-600">
                    <i className="fas fa-heart mr-2"></i>
                    Hobbies
                  </h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {resumeData.hobbies}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 no-print">
        <div className="flex flex-wrap gap-3 justify-center">
          {resumeData.personalInfo.whatsappNumber && !wasWhatsAppSent() && (
            <button
              onClick={handleWhatsAppShare}
              className="btn btn-success"
            >
              <i className="fab fa-whatsapp mr-2"></i>
              📱 Send via WhatsApp
            </button>
          )}
          
          {wasWhatsAppSent() && (
            <button
              disabled
              className="btn btn-secondary"
            >
              <i className="fas fa-check mr-2"></i>
              ✅ WhatsApp message sent
            </button>
          )}
          
          <button
            onClick={() => setShowEmailModal(true)}
            className="btn btn-primary"
          >
            <i className="fas fa-envelope mr-2"></i>
            📧 Email Resume
          </button>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <EmailModal
          onClose={() => setShowEmailModal(false)}
          resumeData={resumeData}
        />
      )}
    </div>
  )
}

export default ResumePreview
