import React from 'react'
import { useResume } from '../../context/ResumeContext'

const ProjectsForm = ({ disabled = false }) => {
  const { resumeData, addProject, updateProject, removeProject } = useResume()

  const handleFieldChange = (index, field, value) => {
    updateProject(index, { ...resumeData.projects[index], [field]: value })
  }

  const handleAddProject = () => {
    addProject({
      name: '',
      techStack: '',
      description: '',
      liveUrl: '',
      githubUrl: ''
    })
  }

  const handleRemoveProject = (index) => {
    removeProject(index)
  }

  return (
    <div className="space-y-6">
      {resumeData.projects.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-code text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 mb-4">No projects added yet (Optional)</p>
          <button
            type="button"
            onClick={handleAddProject}
            disabled={disabled}
            className="btn btn-outline"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Project
          </button>
        </div>
      ) : (
        <>
          {resumeData.projects.map((project, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Project {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => handleRemoveProject(index)}
                  disabled={disabled}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
                  <input
                    type="text"
                    value={project.name}
                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                    placeholder="My Awesome Project"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    disabled={disabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tech Stack</label>
                  <input
                    type="text"
                    value={project.techStack}
                    onChange={(e) => handleFieldChange(index, 'techStack', e.target.value)}
                    placeholder="React, Node.js, MongoDB"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    disabled={disabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Live URL</label>
                  <input
                    type="url"
                    value={project.liveUrl}
                    onChange={(e) => handleFieldChange(index, 'liveUrl', e.target.value)}
                    placeholder="https://myproject.com"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    disabled={disabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
                  <input
                    type="url"
                    value={project.githubUrl}
                    onChange={(e) => handleFieldChange(index, 'githubUrl', e.target.value)}
                    placeholder="https://github.com/user/project"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    disabled={disabled}
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={project.description}
                    onChange={(e) => handleFieldChange(index, 'description', e.target.value)}
                    placeholder="Describe your project and its features..."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    disabled={disabled}
                  />
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAddProject}
              disabled={disabled}
              className="btn btn-outline"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Another Project
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ProjectsForm
