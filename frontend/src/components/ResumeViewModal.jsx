import React from 'react'

/**
 * ResumeViewModal component - Display resume details in a formatted modal
 * Shows all resume sections in a read-only format
 */
const ResumeViewModal = ({ resume, onClose }) => {
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

  // Handle modal close
  const handleClose = () => {
    onClose()
  }

  // Handle keyboard events
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      handleClose()
    }
  }

  return (
    <div className="modal-overlay" onClick={handleClose} onKeyDown={handleKeyDown} tabIndex={-1}>
      <div 
        className="modal-large"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900 flex items-center">
            <i className="fas fa-user text-blue-600 mr-3"></i>
            Resume Details
          </h3>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Resume Content */}
        <div className="max-h-96 overflow-y-auto space-y-6">
          {/* Personal Information */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <i className="fas fa-user mr-2 text-blue-600"></i>
              Personal Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Full Name:</span>
                <p className="text-gray-600">{resume.personalInfo.fullName || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Date of Birth:</span>
                <p className="text-gray-600">{formatDate(resume.personalInfo.dateOfBirth) || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Email:</span>
                <p className="text-gray-600">{resume.personalInfo.email || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Phone:</span>
                <p className="text-gray-600">{resume.personalInfo.phone || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">WhatsApp:</span>
                <p className="text-gray-600">{resume.personalInfo.whatsappNumber || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Address:</span>
                <p className="text-gray-600">{resume.personalInfo.address || 'N/A'}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">LinkedIn:</span>
                <p className="text-gray-600">
                  {resume.personalInfo.linkedin ? (
                    <a href={resume.personalInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      View Profile
                    </a>
                  ) : 'N/A'}
                </p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Portfolio:</span>
                <p className="text-gray-600">
                  {resume.personalInfo.portfolioUrl ? (
                    <a href={resume.personalInfo.portfolioUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                      Visit Portfolio
                    </a>
                  ) : 'N/A'}
                </p>
              </div>
            </div>
            
            {/* Profile Photo */}
            {resume.personalInfo.profilePhoto && (
              <div className="mt-4">
                <span className="font-medium text-gray-700">Profile Photo:</span>
                <div className="mt-2">
                  <img
                    src={resume.personalInfo.profilePhoto}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover border-2 border-gray-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Objective */}
          {resume.objective && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fas fa-bullseye mr-2 text-blue-600"></i>
                Career Objective
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {resume.objective}
              </p>
            </div>
          )}

          {/* Education */}
          {resume.education && resume.education.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fas fa-graduation-cap mr-2 text-blue-600"></i>
                Education
              </h4>
              <div className="space-y-3">
                {resume.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-blue-300 pl-4">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="font-medium text-gray-900">{edu.degree}</h5>
                      <span className="text-sm text-gray-600">
                        {formatYearRange(edu.yearFrom, edu.yearTo)}
                      </span>
                    </div>
                    <p className="text-gray-700 text-sm mb-1">{edu.institution}</p>
                    <p className="text-gray-600 text-sm">
                      Percentage: {edu.percentage}%
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Work Experience */}
          {resume.workExperience && resume.workExperience.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fas fa-briefcase mr-2 text-blue-600"></i>
                Work Experience
              </h4>
              <div className="space-y-3">
                {resume.workExperience.map((exp, index) => (
                  <div key={index} className="border-l-2 border-blue-300 pl-4">
                    <div className="flex justify-between items-start mb-1">
                      <h5 className="font-medium text-gray-900">{exp.jobTitle}</h5>
                      <span className="text-sm text-gray-600">{exp.duration}</span>
                    </div>
                    <p className="text-gray-700 text-sm mb-1">
                      {exp.company} • {exp.location}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Skills */}
          {resume.skills && resume.skills.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fas fa-tools mr-2 text-blue-600"></i>
                Skills
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {resume.skills.map((skill, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{skill.name}</span>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      skill.proficiency === 'Expert' ? 'bg-green-100 text-green-800' :
                      skill.proficiency === 'Intermediate' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {skill.proficiency}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects */}
          {resume.projects && resume.projects.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fas fa-project-diagram mr-2 text-blue-600"></i>
                Projects
              </h4>
              <div className="space-y-3">
                {resume.projects.map((project, index) => (
                  <div key={index} className="border-l-2 border-blue-300 pl-4">
                    <div className="flex justify-between items-start mb-2">
                      <h5 className="font-medium text-gray-900">{project.name}</h5>
                      <div className="flex space-x-2">
                        {project.liveUrl && (
                          <a
                            href={project.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 text-sm"
                            title="View Live"
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
                            title="View GitHub"
                          >
                            <i className="fab fa-github"></i>
                          </a>
                        )}
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm mb-2">
                      <strong>Tech Stack:</strong> {project.techStack}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {project.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {resume.certifications && resume.certifications.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fas fa-certificate mr-2 text-blue-600"></i>
                Certifications
              </h4>
              <div className="space-y-2">
                {resume.certifications.map((cert, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <div>
                      <span className="font-medium text-gray-900">{cert.name}</span>
                      <span className="text-gray-600 ml-2">• {cert.issuer}</span>
                    </div>
                    <span className="text-gray-600">{cert.year}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Languages */}
          {resume.languages && resume.languages.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fas fa-language mr-2 text-blue-600"></i>
                Languages
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {resume.languages.map((lang, index) => (
                  <div key={index} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">{lang.language}</span>
                    <span className="text-gray-600">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies */}
          {resume.hobbies && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fas fa-heart mr-2 text-blue-600"></i>
                Hobbies
              </h4>
              <p className="text-gray-700 text-sm leading-relaxed">
                {resume.hobbies}
              </p>
            </div>
          )}

          {/* References */}
          {resume.references && resume.references.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                <i className="fas fa-users mr-2 text-blue-600"></i>
                References
              </h4>
              <div className="space-y-3">
                {resume.references.map((ref, index) => (
                  <div key={index} className="border-l-2 border-blue-300 pl-4">
                    <h5 className="font-medium text-gray-900">{ref.name}</h5>
                    <p className="text-gray-700 text-sm">
                      {ref.designation} at {ref.company}
                    </p>
                    <p className="text-gray-600 text-sm">{ref.email}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
              <i className="fas fa-info-circle mr-2 text-blue-600"></i>
              Submission Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="font-medium text-gray-700">Submitted At:</span>
                <p className="text-gray-600">{formatDate(resume.createdAt)}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Last Updated:</span>
                <p className="text-gray-600">{formatDate(resume.updatedAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="btn btn-primary"
          >
            <i className="fas fa-times mr-2"></i>
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResumeViewModal
