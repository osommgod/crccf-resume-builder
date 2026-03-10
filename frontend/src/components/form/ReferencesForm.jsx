import React from 'react'
import { useResume } from '../../context/ResumeContext'

const ReferencesForm = ({ disabled = false }) => {
  const { resumeData, addReference, updateReference, removeReference } = useResume()

  const handleFieldChange = (index, field, value) => {
    updateReference(index, { ...resumeData.references[index], [field]: value })
  }

  const handleAddReference = () => {
    addReference({
      name: '',
      title: '',
      company: '',
      email: ''
    })
  }

  const handleRemoveReference = (index) => {
    removeReference(index)
  }

  return (
    <div className="space-y-6">
      {resumeData.references.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-users text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 mb-4">No references added yet (Optional)</p>
          <button
            type="button"
            onClick={handleAddReference}
            disabled={disabled}
            className="btn btn-outline"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Reference
          </button>
        </div>
      ) : (
        <>
          {resumeData.references.map((reference, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Reference {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => handleRemoveReference(index)}
                  disabled={disabled}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reference Name</label>
                  <input
                    type="text"
                    value={reference.name}
                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                    placeholder="John Smith"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    disabled={disabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input
                    type="text"
                    value={reference.title}
                    onChange={(e) => handleFieldChange(index, 'title', e.target.value)}
                    placeholder="Senior Manager"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    disabled={disabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                  <input
                    type="text"
                    value={reference.company}
                    onChange={(e) => handleFieldChange(index, 'company', e.target.value)}
                    placeholder="Tech Company Inc."
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    disabled={disabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="email"
                    value={reference.email}
                    onChange={(e) => handleFieldChange(index, 'email', e.target.value)}
                    placeholder="john.smith@company.com"
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
              onClick={handleAddReference}
              disabled={disabled}
              className="btn btn-outline"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Another Reference
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default ReferencesForm
