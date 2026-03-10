import React from 'react'

/**
 * Read-only detailed resume view modal
 * Modal for viewing complete resume details in admin panel
 */
const ResumeViewModal = ({ isOpen, onClose, resume }) => {
  if (!isOpen || !resume) return null

  const formatDOB = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="relative inline-block w-full max-w-4xl max-h-[90vh] transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:align-middle">
          {/* Modal header */}
          <div className="bg-blue-600 px-4 pb-4 pt-5 sm:px-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <i className="fas fa-user text-blue-600"></i>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg font-medium leading-6 text-white">
                  Resume Details
                </h3>
                <div className="mt-2">
                  <p className="text-sm text-blue-100">
                    {resume.personalInfo.fullName} • Submitted {formatDate(resume.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Modal body */}
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div className="max-h-[60vh] overflow-y-auto custom-scrollbar">
              {/* Personal Information */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                  Personal Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Full Name:</span>
                    <p className="text-gray-900">{resume.personalInfo.fullName}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Date of Birth:</span>
                    <p className="text-gray-900">{formatDOB(resume.personalInfo.dateOfBirth)}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <p className="text-gray-900">{resume.personalInfo.email}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Phone:</span>
                    <p className="text-gray-900">{resume.personalInfo.phone}</p>
                  </div>
                  {resume.personalInfo.whatsappNumber && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">WhatsApp:</span>
                      <p className="text-gray-900">{resume.personalInfo.whatsappNumber}</p>
                    </div>
                  )}
                  {resume.personalInfo.address && (
                    <div className="md:col-span-2">
                      <span className="text-sm font-medium text-gray-500">Address:</span>
                      <p className="text-gray-900">{resume.personalInfo.address}</p>
                    </div>
                  )}
                  {resume.personalInfo.linkedin && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">LinkedIn:</span>
                      <p className="text-gray-900">{resume.personalInfo.linkedin}</p>
                    </div>
                  )}
                  {resume.personalInfo.portfolioUrl && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Portfolio:</span>
                      <p className="text-gray-900">{resume.personalInfo.portfolioUrl}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Objective */}
              {resume.objective && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Objective
                  </h4>
                  <p className="text-gray-900">{resume.objective}</p>
                </div>
              )}

              {/* Education */}
              {resume.education && resume.education.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Education
                  </h4>
                  <div className="space-y-3">
                    {resume.education.map((edu, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{edu.degree}</p>
                            <p className="text-gray-600">{edu.institution}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-gray-500">
                              {edu.yearFrom} - {edu.yearTo}
                            </p>
                            <p className="text-sm font-medium text-gray-900">
                              {edu.percentage}%
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Work Experience */}
              {resume.workExperience && resume.workExperience.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Work Experience
                  </h4>
                  <div className="space-y-3">
                    {resume.workExperience.map((exp, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-gray-900">{exp.jobTitle}</p>
                            <p className="text-gray-600">{exp.company}</p>
                            {exp.location && <p className="text-sm text-gray-500">{exp.location}</p>}
                            {exp.description && <p className="text-sm text-gray-700 mt-1">{exp.description}</p>}
                          </div>
                          <p className="text-sm text-gray-500">{exp.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Skills */}
              {resume.skills && resume.skills.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Skills
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {resume.skills.map((skill, index) => (
                      <div key={index} className="bg-blue-50 text-blue-800 px-3 py-1 rounded text-sm">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-blue-600 ml-1">({skill.proficiency})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {resume.projects && resume.projects.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Projects
                  </h4>
                  <div className="space-y-3">
                    {resume.projects.map((project, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium text-gray-900">{project.name}</p>
                        {project.techStack && <p className="text-sm text-gray-600">Tech: {project.techStack}</p>}
                        {project.description && <p className="text-sm text-gray-700 mt-1">{project.description}</p>}
                        <div className="flex space-x-4 mt-2">
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                              <i className="fas fa-external-link-alt mr-1"></i>Live Demo
                            </a>
                          )}
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">
                              <i className="fab fa-github mr-1"></i>GitHub
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Certifications */}
              {resume.certifications && resume.certifications.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Certifications
                  </h4>
                  <div className="space-y-2">
                    {resume.certifications.map((cert, index) => (
                      <div key={index} className="flex justify-between items-center bg-gray-50 p-2 rounded">
                        <div>
                          <p className="font-medium text-gray-900">{cert.name}</p>
                          <p className="text-sm text-gray-600">{cert.issuer}</p>
                        </div>
                        <p className="text-sm text-gray-500">{cert.year}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Languages */}
              {resume.languages && resume.languages.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Languages
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {resume.languages.map((lang, index) => (
                      <div key={index} className="bg-green-50 text-green-800 px-3 py-1 rounded text-sm">
                        <span className="font-medium">{lang.name}</span>
                        <span className="text-green-600 ml-1">({lang.proficiency})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Hobbies */}
              {resume.hobbies && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    Hobbies
                  </h4>
                  <p className="text-gray-900">{resume.hobbies}</p>
                </div>
              )}

              {/* References */}
              {resume.references && resume.references.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4 border-b pb-2">
                    References
                  </h4>
                  <div className="space-y-3">
                    {resume.references.map((ref, index) => (
                      <div key={index} className="bg-gray-50 p-3 rounded">
                        <p className="font-medium text-gray-900">{ref.name}</p>
                        <p className="text-gray-600">{ref.title}</p>
                        <p className="text-sm text-gray-600">{ref.company}</p>
                        {ref.email && <p className="text-sm text-blue-600">{ref.email}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ResumeViewModal
