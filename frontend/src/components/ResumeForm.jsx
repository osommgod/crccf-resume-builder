import React, { useState } from 'react'
import { useResume } from '../context/ResumeContext'
import PasswordModal from './PasswordModal'
import EmailModal from './EmailModal'
import AddSectionModal from './shared/AddSectionModal'
import toast from 'react-hot-toast'
import { generatePDF } from '../utils/generatePDF'
import { generatePassword } from '../utils/passwordUtils'

/**
 * ResumeForm component - Dynamic multi-section resume form
 * Supports add/remove entries for dynamic sections
 */
const ResumeForm = ({ disabled, showPreview, onTogglePreview }) => {
  const { 
    resumeData, 
    updatePersonalInfo, 
    updateObjective, 
    addEntry, 
    updateEntry, 
    removeEntry, 
    updateHobbies,
    validateResume,
    getCompletionPercentage
  } = useResume()

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showAddModal, setShowAddModal] = useState(false)
  const [modalSection, setModalSection] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [activeSection, setActiveSection] = useState('personal')

  // Form sections configuration
  const sections = [
    { id: 'personal', title: 'Personal Info', icon: 'fas fa-user', required: true },
    { id: 'objective', title: 'Objective', icon: 'fas fa-bullseye', required: true },
    { id: 'education', title: 'Education', icon: 'fas fa-graduation-cap', required: true },
    { id: 'experience', title: 'Work Experience', icon: 'fas fa-briefcase', required: false },
    { id: 'skills', title: 'Skills', icon: 'fas fa-tools', required: true },
    { id: 'projects', title: 'Projects', icon: 'fas fa-project-diagram', required: false },
    { id: 'certifications', title: 'Certifications', icon: 'fas fa-certificate', required: false },
    { id: 'languages', title: 'Languages', icon: 'fas fa-language', required: false },
    { id: 'hobbies', title: 'Hobbies', icon: 'fas fa-heart', required: false },
    { id: 'references', title: 'References', icon: 'fas fa-users', required: false }
  ]

  /**
   * Handle file upload for profile photo
   */
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Photo size must be less than 5MB')
        return
      }
      
      const reader = new FileReader()
      reader.onloadend = () => {
        updatePersonalInfo('profilePhoto', reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  /**
   * Add new entry to dynamic section
   */
  const handleAddEntry = (section) => {
    // For references, keep the old behavior (inline form)
    if (section === 'references') {
      const newEntry = {
        name: '',
        designation: '',
        company: '',
        email: ''
      }
      addEntry(section, newEntry)
      return
    }
    
    // For other sections, open the modal
    setModalSection(section)
    setShowAddModal(true)
  }

  /**
   * Handle download resume
   */
  const handleDownloadResume = async () => {
    if (!validateResume()) {
      toast.error('Please fill in all required fields correctly')
      return
    }

    setIsSubmitting(true)
    
    try {
      const password = generatePassword(
        resumeData.personalInfo.fullName,
        resumeData.personalInfo.dateOfBirth
      )
      
      await generatePDF(resumeData, password)
      
      setShowPasswordModal(true)
      toast.success('Resume downloaded successfully!')
    } catch (error) {
      console.error('Error downloading resume:', error)
      toast.error('Failed to download resume. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  /**
   * Handle print resume
   */
  const handlePrintResume = () => {
    if (!validateResume()) {
      toast.error('Please fill in all required fields correctly')
      return
    }

    window.print()
  }

  /**
   * Handle email resume
   */
  const handleEmailResume = () => {
    if (!validateResume()) {
      toast.error('Please fill in all required fields correctly')
      return
    }

    setShowEmailModal(true)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg">
      {/* Form Header */}
      <div className="card-header">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">
            Resume Details
          </h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">
              {getCompletionPercentage()}% Complete
            </span>
            <button
              onClick={onTogglePreview}
              className="btn btn-outline btn-sm"
              disabled={disabled}
            >
              {showPreview ? '📝 Edit' : '👁 Preview'}
            </button>
          </div>
        </div>
        
        {/* Section Navigation */}
        <div className="mt-4 flex flex-wrap gap-2">
          {sections.map(section => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                activeSection === section.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              disabled={disabled}
            >
              <i className={`${section.icon} mr-1`}></i>
              {section.title}
              {section.required && <span className="ml-1 text-red-500">*</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Form Body */}
      <div className="card-body max-h-96 overflow-y-auto">
        {/* Personal Information Section */}
        {activeSection === 'personal' && (
          <div className="space-y-4 fade-in">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <i className="fas fa-user mr-2 text-blue-600"></i>
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="form-label">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={resumeData.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                  disabled={disabled}
                  placeholder="John Doe"
                />
              </div>
              
              <div>
                <label className="form-label">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  className="form-input"
                  value={resumeData.personalInfo.dateOfBirth}
                  onChange={(e) => updatePersonalInfo('dateOfBirth', e.target.value)}
                  disabled={disabled}
                />
              </div>
              
              <div>
                <label className="form-label">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  className="form-input"
                  value={resumeData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo('email', e.target.value)}
                  disabled={disabled}
                  placeholder="john@example.com"
                />
              </div>
              
              <div>
                <label className="form-label">
                  Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  className="form-input"
                  value={resumeData.personalInfo.phone}
                  onChange={(e) => updatePersonalInfo('phone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  disabled={disabled}
                  placeholder="1234567890"
                  maxLength={10}
                />
              </div>
              
              <div>
                <label className="form-label">WhatsApp Number</label>
                <input
                  type="tel"
                  className="form-input"
                  value={resumeData.personalInfo.whatsappNumber}
                  onChange={(e) => updatePersonalInfo('whatsappNumber', e.target.value.replace(/\D/g, '').slice(0, 10))}
                  disabled={disabled}
                  placeholder="1234567890"
                  maxLength={10}
                />
              </div>
              
              <div>
                <label className="form-label">
                  Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="form-input"
                  value={resumeData.personalInfo.address}
                  onChange={(e) => updatePersonalInfo('address', e.target.value)}
                  disabled={disabled}
                  placeholder="123 Main St, City, State"
                />
              </div>
              
              <div>
                <label className="form-label">LinkedIn URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={resumeData.personalInfo.linkedin}
                  onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                  disabled={disabled}
                  placeholder="https://linkedin.com/in/johndoe"
                />
              </div>
              
              <div>
                <label className="form-label">Portfolio URL</label>
                <input
                  type="url"
                  className="form-input"
                  value={resumeData.personalInfo.portfolioUrl}
                  onChange={(e) => updatePersonalInfo('portfolioUrl', e.target.value)}
                  disabled={disabled}
                  placeholder="https://johndoe.dev"
                />
              </div>
            </div>
            
            <div>
              <label className="form-label">Profile Photo</label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                disabled={disabled}
                className="form-input"
              />
              {resumeData.personalInfo.profilePhoto && (
                <div className="mt-2">
                  <img
                    src={resumeData.personalInfo.profilePhoto}
                    alt="Profile"
                    className="h-20 w-20 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>
        )}

        {/* Objective Section */}
        {activeSection === 'objective' && (
          <div className="space-y-4 fade-in">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <i className="fas fa-bullseye mr-2 text-blue-600"></i>
              Objective / Summary
            </h3>
            
            <div>
              <label className="form-label">
                Career Objective <span className="text-red-500">*</span>
              </label>
              <textarea
                className="form-input"
                rows={6}
                value={resumeData.objective}
                onChange={(e) => updateObjective(e.target.value)}
                disabled={disabled}
                placeholder="Describe your career goals and what you bring to the table..."
              />
              <p className="text-sm text-gray-500 mt-1">
                {resumeData.objective.length}/500 characters
              </p>
            </div>
          </div>
        )}

        {/* Education Section */}
        {activeSection === 'education' && (
          <div className="space-y-4 fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <i className="fas fa-graduation-cap mr-2 text-blue-600"></i>
                Education <span className="text-red-500">*</span>
              </h3>
              <button
                onClick={() => handleAddEntry('education')}
                className="btn btn-primary btn-sm"
                disabled={disabled}
              >
                <i className="fas fa-plus mr-1"></i>
                Add Education
              </button>
            </div>
            
            {resumeData.education.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No education entries added. Click "Add Education" to get started.
              </p>
            ) : (
              resumeData.education.map((edu, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Education {index + 1}</h4>
                    <button
                      onClick={() => removeEntry('education', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={disabled}
                    >
                      <i className="fas fa-trash"></i> Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Degree <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className="form-input"
                        value={edu.degree}
                        onChange={(e) => updateEntry('education', index, { ...edu, degree: e.target.value })}
                        disabled={disabled}
                        placeholder="B.Tech Computer Science"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Institution <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className="form-input"
                        value={edu.institution}
                        onChange={(e) => updateEntry('education', index, { ...edu, institution: e.target.value })}
                        disabled={disabled}
                        placeholder="University Name"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Start Year <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className="form-input"
                        value={edu.yearFrom}
                        onChange={(e) => updateEntry('education', index, { ...edu, yearFrom: parseInt(e.target.value) })}
                        disabled={disabled}
                        min="1950"
                        max={new Date().getFullYear()}
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">End Year <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className="form-input"
                        value={edu.yearTo}
                        onChange={(e) => updateEntry('education', index, { ...edu, yearTo: parseInt(e.target.value) })}
                        disabled={disabled}
                        min="1950"
                        max={new Date().getFullYear() + 10}
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="form-label">Percentage/CGPA <span className="text-red-500">*</span></label>
                      <input
                        type="number"
                        className="form-input"
                        value={edu.percentage}
                        onChange={(e) => updateEntry('education', index, { ...edu, percentage: parseFloat(e.target.value) })}
                        disabled={disabled}
                        min="0"
                        max="100"
                        step="0.01"
                        placeholder="85.5"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Skills Section */}
        {activeSection === 'skills' && (
          <div className="space-y-4 fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <i className="fas fa-tools mr-2 text-blue-600"></i>
                Skills <span className="text-red-500">*</span>
              </h3>
              <button
                onClick={() => handleAddEntry('skills')}
                className="btn btn-primary btn-sm"
                disabled={disabled}
              >
                <i className="fas fa-plus mr-1"></i>
                Add Skill
              </button>
            </div>
            
            {resumeData.skills.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No skills added. Click "Add Skill" to get started.
              </p>
            ) : (
              resumeData.skills.map((skill, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Skill {index + 1}</h4>
                    <button
                      onClick={() => removeEntry('skills', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={disabled}
                    >
                      <i className="fas fa-trash"></i> Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Skill Name <span className="text-red-500">*</span></label>
                      <input
                        type="text"
                        className="form-input"
                        value={skill.name}
                        onChange={(e) => updateEntry('skills', index, { ...skill, name: e.target.value })}
                        disabled={disabled}
                        placeholder="JavaScript, React, Python, etc."
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Proficiency <span className="text-red-500">*</span></label>
                      <select
                        className="form-input"
                        value={skill.proficiency}
                        onChange={(e) => updateEntry('skills', index, { ...skill, proficiency: e.target.value })}
                        disabled={disabled}
                      >
                        <option value="">Select Proficiency</option>
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Expert">Expert</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Work Experience Section */}
        {activeSection === 'experience' && (
          <div className="space-y-4 fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <i className="fas fa-briefcase mr-2 text-blue-600"></i>
                Work Experience
              </h3>
              <button
                onClick={() => handleAddEntry('experience')}
                className="btn btn-primary btn-sm"
                disabled={disabled}
              >
                <i className="fas fa-plus mr-1"></i>
                Add Experience
              </button>
            </div>
            
            {resumeData.workExperience.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No work experience added. Click "Add Experience" to get started.
              </p>
            ) : (
              resumeData.workExperience.map((exp, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Experience {index + 1}</h4>
                    <button
                      onClick={() => removeEntry('workExperience', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={disabled}
                    >
                      <i className="fas fa-trash"></i> Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Job Title</label>
                      <input
                        type="text"
                        className="form-input"
                        value={exp.jobTitle}
                        onChange={(e) => updateEntry('workExperience', index, { ...exp, jobTitle: e.target.value })}
                        disabled={disabled}
                        placeholder="Software Engineer"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Company</label>
                      <input
                        type="text"
                        className="form-input"
                        value={exp.company}
                        onChange={(e) => updateEntry('workExperience', index, { ...exp, company: e.target.value })}
                        disabled={disabled}
                        placeholder="Tech Company Inc."
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Location</label>
                      <input
                        type="text"
                        className="form-input"
                        value={exp.location}
                        onChange={(e) => updateEntry('workExperience', index, { ...exp, location: e.target.value })}
                        disabled={disabled}
                        placeholder="New York, NY"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Duration</label>
                      <input
                        type="text"
                        className="form-input"
                        value={exp.duration}
                        onChange={(e) => updateEntry('workExperience', index, { ...exp, duration: e.target.value })}
                        disabled={disabled}
                        placeholder="Jan 2020 - Present"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-input"
                        rows={3}
                        value={exp.description}
                        onChange={(e) => updateEntry('workExperience', index, { ...exp, description: e.target.value })}
                        disabled={disabled}
                        placeholder="Describe your responsibilities and achievements..."
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Projects Section */}
        {activeSection === 'projects' && (
          <div className="space-y-4 fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <i className="fas fa-project-diagram mr-2 text-blue-600"></i>
                Projects
              </h3>
              <button
                onClick={() => handleAddEntry('projects')}
                className="btn btn-primary btn-sm"
                disabled={disabled}
              >
                <i className="fas fa-plus mr-1"></i>
                Add Project
              </button>
            </div>
            
            {resumeData.projects.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No projects added. Click "Add Project" to get started.
              </p>
            ) : (
              resumeData.projects.map((project, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Project {index + 1}</h4>
                    <button
                      onClick={() => removeEntry('projects', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={disabled}
                    >
                      <i className="fas fa-trash"></i> Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Project Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={project.name}
                        onChange={(e) => updateEntry('projects', index, { ...project, name: e.target.value })}
                        disabled={disabled}
                        placeholder="E-commerce Platform"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Tech Stack</label>
                      <input
                        type="text"
                        className="form-input"
                        value={project.techStack}
                        onChange={(e) => updateEntry('projects', index, { ...project, techStack: e.target.value })}
                        disabled={disabled}
                        placeholder="React, Node.js, MongoDB"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Live URL</label>
                      <input
                        type="url"
                        className="form-input"
                        value={project.liveUrl}
                        onChange={(e) => updateEntry('projects', index, { ...project, liveUrl: e.target.value })}
                        disabled={disabled}
                        placeholder="https://project-demo.com"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">GitHub URL</label>
                      <input
                        type="url"
                        className="form-input"
                        value={project.githubUrl}
                        onChange={(e) => updateEntry('projects', index, { ...project, githubUrl: e.target.value })}
                        disabled={disabled}
                        placeholder="https://github.com/username/project"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-input"
                        rows={3}
                        value={project.description}
                        onChange={(e) => updateEntry('projects', index, { ...project, description: e.target.value })}
                        disabled={disabled}
                        placeholder="Describe the project, your role, and key features..."
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Certifications Section */}
        {activeSection === 'certifications' && (
          <div className="space-y-4 fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <i className="fas fa-certificate mr-2 text-blue-600"></i>
                Certifications
              </h3>
              <button
                onClick={() => handleAddEntry('certifications')}
                className="btn btn-primary btn-sm"
                disabled={disabled}
              >
                <i className="fas fa-plus mr-1"></i>
                Add Certification
              </button>
            </div>
            
            {resumeData.certifications.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No certifications added. Click "Add Certification" to get started.
              </p>
            ) : (
              resumeData.certifications.map((cert, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Certification {index + 1}</h4>
                    <button
                      onClick={() => removeEntry('certifications', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={disabled}
                    >
                      <i className="fas fa-trash"></i> Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Certificate Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cert.name}
                        onChange={(e) => updateEntry('certifications', index, { ...cert, name: e.target.value })}
                        disabled={disabled}
                        placeholder="AWS Certified Developer"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Issuer</label>
                      <input
                        type="text"
                        className="form-input"
                        value={cert.issuer}
                        onChange={(e) => updateEntry('certifications', index, { ...cert, issuer: e.target.value })}
                        disabled={disabled}
                        placeholder="Amazon Web Services"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Year</label>
                      <input
                        type="number"
                        className="form-input"
                        value={cert.year}
                        onChange={(e) => updateEntry('certifications', index, { ...cert, year: parseInt(e.target.value) })}
                        disabled={disabled}
                        min="1950"
                        max={new Date().getFullYear()}
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Languages Section */}
        {activeSection === 'languages' && (
          <div className="space-y-4 fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <i className="fas fa-language mr-2 text-blue-600"></i>
                Languages
              </h3>
              <button
                onClick={() => handleAddEntry('languages')}
                className="btn btn-primary btn-sm"
                disabled={disabled}
              >
                <i className="fas fa-plus mr-1"></i>
                Add Language
              </button>
            </div>
            
            {resumeData.languages.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No languages added. Click "Add Language" to get started.
              </p>
            ) : (
              resumeData.languages.map((lang, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Language {index + 1}</h4>
                    <button
                      onClick={() => removeEntry('languages', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={disabled}
                    >
                      <i className="fas fa-trash"></i> Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Language</label>
                      <input
                        type="text"
                        className="form-input"
                        value={lang.language}
                        onChange={(e) => updateEntry('languages', index, { ...lang, language: e.target.value })}
                        disabled={disabled}
                        placeholder="English"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Proficiency</label>
                      <input
                        type="text"
                        className="form-input"
                        value={lang.proficiency}
                        onChange={(e) => updateEntry('languages', index, { ...lang, proficiency: e.target.value })}
                        disabled={disabled}
                        placeholder="Native, Fluent, Intermediate"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Hobbies Section */}
        {activeSection === 'hobbies' && (
          <div className="space-y-4 fade-in">
            <h3 className="text-lg font-medium text-gray-900 flex items-center">
              <i className="fas fa-heart mr-2 text-blue-600"></i>
              Hobbies
            </h3>
            
            <div>
              <label className="form-label">Hobbies & Interests</label>
              <input
                type="text"
                className="form-input"
                value={resumeData.hobbies}
                onChange={(e) => updateHobbies(e.target.value)}
                disabled={disabled}
                placeholder="Reading, Traveling, Photography, Cooking (comma-separated)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Enter your hobbies separated by commas
              </p>
            </div>
          </div>
        )}

        {/* References Section */}
        {activeSection === 'references' && (
          <div className="space-y-4 fade-in">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <i className="fas fa-users mr-2 text-blue-600"></i>
                References
              </h3>
              <button
                onClick={() => handleAddEntry('references')}
                className="btn btn-primary btn-sm"
                disabled={disabled}
              >
                <i className="fas fa-plus mr-1"></i>
                Add Reference
              </button>
            </div>
            
            {resumeData.references.length === 0 ? (
              <p className="text-gray-500 text-center py-4">
                No references added. Click "Add Reference" to get started.
              </p>
            ) : (
              resumeData.references.map((ref, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-medium text-gray-900">Reference {index + 1}</h4>
                    <button
                      onClick={() => removeEntry('references', index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                      disabled={disabled}
                    >
                      <i className="fas fa-trash"></i> Remove
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="form-label">Name</label>
                      <input
                        type="text"
                        className="form-input"
                        value={ref.name}
                        onChange={(e) => updateEntry('references', index, { ...ref, name: e.target.value })}
                        disabled={disabled}
                        placeholder="Jane Smith"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Designation</label>
                      <input
                        type="text"
                        className="form-input"
                        value={ref.designation}
                        onChange={(e) => updateEntry('references', index, { ...ref, designation: e.target.value })}
                        disabled={disabled}
                        placeholder="Senior Manager"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Company</label>
                      <input
                        type="text"
                        className="form-input"
                        value={ref.company}
                        onChange={(e) => updateEntry('references', index, { ...ref, company: e.target.value })}
                        disabled={disabled}
                        placeholder="Tech Corp"
                      />
                    </div>
                    
                    <div>
                      <label className="form-label">Email</label>
                      <input
                        type="email"
                        className="form-input"
                        value={ref.email}
                        onChange={(e) => updateEntry('references', index, { ...ref, email: e.target.value })}
                        disabled={disabled}
                        placeholder="jane@example.com"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      {/* Form Footer with Action Buttons */}
      <div className="card-footer">
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={handleDownloadResume}
            disabled={disabled || isSubmitting}
            className="btn btn-primary"
          >
            <i className="fas fa-download mr-2"></i>
            {isSubmitting ? 'Generating...' : '📥 Download Resume'}
          </button>
          
          <button
            onClick={handlePrintResume}
            disabled={disabled}
            className="btn btn-secondary"
          >
            <i className="fas fa-print mr-2"></i>
            🖨️ Print Resume
          </button>
          
          <button
            onClick={handleEmailResume}
            disabled={disabled}
            className="btn btn-success"
          >
            <i className="fas fa-envelope mr-2"></i>
            📧 Email Resume
          </button>
        </div>
        
        {disabled && (
          <p className="text-center text-red-600 text-sm mt-3">
            ⏰ Resume submission time has expired. Actions are disabled.
          </p>
        )}
      </div>

      {/* Modals */}
      {showPasswordModal && (
        <PasswordModal
          onClose={() => setShowPasswordModal(false)}
          password={generatePassword(
            resumeData.personalInfo.fullName,
            resumeData.personalInfo.dateOfBirth
          )}
        />
      )}
      
      {showEmailModal && (
        <EmailModal
          onClose={() => setShowEmailModal(false)}
          resumeData={resumeData}
        />
      )}
      
      {showAddModal && (
        <AddSectionModal
          isOpen={showAddModal}
          onClose={() => setShowAddModal(false)}
          sectionType={modalSection}
        />
      )}
    </div>
  )
}

export default ResumeForm
