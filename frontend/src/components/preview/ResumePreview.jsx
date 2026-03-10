import React from 'react'
import { useResume } from '../../context/ResumeContext'
import '../../styles/resume.css'

/**
 * A4 page-preview with conditional rendering
 * Live preview of the resume with proper formatting
 */
const ResumePreview = () => {
  const { resumeData } = useResume()

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short' 
    })
  }

  // Format full date range
  const formatDateRange = (yearFrom, yearTo) => {
    if (!yearFrom) return ''
    if (!yearTo) return `${yearFrom} - Present`
    return `${yearFrom} - ${yearTo}`
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Preview Header */}
      <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <i className="fas fa-file-pdf"></i>
          <span className="text-sm font-medium">Resume Preview</span>
        </div>
        <div className="text-xs text-gray-300">
          A4 Format • Print Ready
        </div>
      </div>

      {/* Resume Preview Container */}
      <div className="p-4 bg-gray-100">
        <div 
          id="resume-preview" 
          className="resume-preview mx-auto"
          style={{ maxWidth: '100%', height: 'auto' }}
        >
          {/* Personal Information Header */}
          <div className="resume-header">
            {resumeData.personalInfo.profilePhoto && (
              <img 
                src={resumeData.personalInfo.profilePhoto} 
                alt="Profile" 
                className="resume-photo"
              />
            )}
            <div className="resume-contact-info">
              <h1 className="resume-name">
                {resumeData.personalInfo.fullName || 'Your Name'}
              </h1>
              <div className="resume-contact-details">
                {resumeData.personalInfo.email && (
                  <div className="resume-contact-item">
                    <i className="fas fa-envelope"></i>
                    <span>{resumeData.personalInfo.email}</span>
                  </div>
                )}
                {resumeData.personalInfo.phone && (
                  <div className="resume-contact-item">
                    <i className="fas fa-phone"></i>
                    <span>{resumeData.personalInfo.phone}</span>
                  </div>
                )}
                {resumeData.personalInfo.whatsappNumber && (
                  <div className="resume-contact-item">
                    <i className="fab fa-whatsapp"></i>
                    <span>{resumeData.personalInfo.whatsappNumber}</span>
                  </div>
                )}
                {resumeData.personalInfo.address && (
                  <div className="resume-contact-item">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{resumeData.personalInfo.address}</span>
                  </div>
                )}
                {resumeData.personalInfo.linkedin && (
                  <div className="resume-contact-item">
                    <i className="fab fa-linkedin"></i>
                    <span>LinkedIn</span>
                  </div>
                )}
                {resumeData.personalInfo.portfolioUrl && (
                  <div className="resume-contact-item">
                    <i className="fas fa-globe"></i>
                    <span>Portfolio</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Objective Section */}
          {resumeData.objective && (
            <div className="resume-section">
              <h2 className="resume-section-title">Objective</h2>
              <p className="resume-objective">
                {resumeData.objective}
              </p>
            </div>
          )}

          {/* Education Section */}
          {resumeData.education && resumeData.education.length > 0 && (
            <div className="resume-section">
              <h2 className="resume-section-title">Education</h2>
              {resumeData.education.map((edu, index) => (
                <div key={index} className="resume-entry">
                  <div className="resume-entry-header">
                    <div className="resume-entry-title">{edu.degree}</div>
                    <div className="resume-entry-period">
                      {formatDateRange(edu.yearFrom, edu.yearTo)}
                    </div>
                  </div>
                  <div className="resume-entry-subtitle">{edu.institution}</div>
                  {edu.percentage && (
                    <div className="resume-entry-description">
                      Percentage: {edu.percentage}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Work Experience Section */}
          {resumeData.workExperience && resumeData.workExperience.length > 0 && (
            <div className="resume-section">
              <h2 className="resume-section-title">Work Experience</h2>
              {resumeData.workExperience.map((exp, index) => (
                <div key={index} className="resume-entry">
                  <div className="resume-entry-header">
                    <div className="resume-entry-title">{exp.jobTitle}</div>
                    <div className="resume-entry-period">{exp.duration}</div>
                  </div>
                  <div className="resume-entry-subtitle">
                    {exp.company} {exp.location && `• ${exp.location}`}
                  </div>
                  {exp.description && (
                    <div className="resume-entry-description">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Skills Section */}
          {resumeData.skills && resumeData.skills.length > 0 && (
            <div className="resume-section">
              <h2 className="resume-section-title">Skills</h2>
              <div className="resume-skills-grid">
                {resumeData.skills.map((skill, index) => (
                  <div key={index} className="resume-skill-item">
                    <span className="resume-skill-name">{skill.name}</span>
                    <span className="resume-skill-level">{skill.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Projects Section */}
          {resumeData.projects && resumeData.projects.length > 0 && (
            <div className="resume-section">
              <h2 className="resume-section-title">Projects</h2>
              {resumeData.projects.map((project, index) => (
                <div key={index} className="resume-project">
                  <div className="resume-project-title">{project.name}</div>
                  {project.techStack && (
                    <div className="resume-project-tech">
                      Tech Stack: {project.techStack}
                    </div>
                  )}
                  {project.description && (
                    <div className="resume-project-description">
                      {project.description}
                    </div>
                  )}
                  <div className="resume-project-links">
                    {project.liveUrl && (
                      <a href={project.liveUrl} className="resume-project-link" target="_blank" rel="noopener noreferrer">
                        <i className="fas fa-external-link-alt"></i> Live Demo
                      </a>
                    )}
                    {project.githubUrl && (
                      <a href={project.githubUrl} className="resume-project-link" target="_blank" rel="noopener noreferrer">
                        <i className="fab fa-github"></i> GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Certifications Section */}
          {resumeData.certifications && resumeData.certifications.length > 0 && (
            <div className="resume-section">
              <h2 className="resume-section-title">Certifications</h2>
              {resumeData.certifications.map((cert, index) => (
                <div key={index} className="resume-entry">
                  <div className="resume-entry-header">
                    <div className="resume-entry-title">{cert.name}</div>
                    <div className="resume-entry-period">{cert.year}</div>
                  </div>
                  <div className="resume-entry-subtitle">{cert.issuer}</div>
                </div>
              ))}
            </div>
          )}

          {/* Languages Section */}
          {resumeData.languages && resumeData.languages.length > 0 && (
            <div className="resume-section">
              <h2 className="resume-section-title">Languages</h2>
              <div className="resume-languages-grid">
                {resumeData.languages.map((lang, index) => (
                  <div key={index} className="resume-language-item">
                    <span className="resume-language-name">{lang.name}</span>
                    <span className="resume-language-level">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hobbies Section */}
          {resumeData.hobbies && (
            <div className="resume-section">
              <h2 className="resume-section-title">Hobbies</h2>
              <p className="resume-hobbies">
                {resumeData.hobbies}
              </p>
            </div>
          )}

          {/* References Section */}
          {resumeData.references && resumeData.references.length > 0 && (
            <div className="resume-section">
              <h2 className="resume-section-title">References</h2>
              {resumeData.references.map((ref, index) => (
                <div key={index} className="resume-reference">
                  <div className="resume-reference-name">{ref.name}</div>
                  <div className="resume-reference-title">{ref.title}</div>
                  <div className="resume-reference-company">{ref.company}</div>
                  {ref.email && (
                    <div className="resume-reference-email">{ref.email}</div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Empty State */}
          {(!resumeData.personalInfo.fullName && !resumeData.objective && resumeData.education.length === 0) && (
            <div className="text-center py-12">
              <i className="fas fa-file-alt text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Your Resume Preview</h3>
              <p className="text-gray-600">
                Start filling in your details to see your resume come to life
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Preview Footer */}
      <div className="bg-gray-800 text-white px-4 py-2 text-xs text-center">
        <span className="opacity-75">
          This is a preview. Download PDF for high-quality output.
        </span>
      </div>
    </div>
  )
}

export default ResumePreview
