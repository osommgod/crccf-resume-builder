import React from 'react'
import { useResume } from '../../context/ResumeContext'

const CertificationsForm = ({ disabled = false }) => {
  const { resumeData, addCertification, updateCertification, removeCertification } = useResume()

  const handleFieldChange = (index, field, value) => {
    updateCertification(index, { ...resumeData.certifications[index], [field]: value })
  }

  const handleAddCertification = () => {
    addCertification({
      name: '',
      issuer: '',
      year: ''
    })
  }

  const handleRemoveCertification = (index) => {
    removeCertification(index)
  }

  return (
    <div className="space-y-6">
      {resumeData.certifications.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-certificate text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 mb-4">No certifications added yet (Optional)</p>
          <button
            type="button"
            onClick={handleAddCertification}
            disabled={disabled}
            className="btn btn-outline"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Certification
          </button>
        </div>
      ) : (
        <>
          {resumeData.certifications.map((certification, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Certification {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => handleRemoveCertification(index)}
                  disabled={disabled}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certification Name</label>
                  <input
                    type="text"
                    value={certification.name}
                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                    placeholder="AWS Certified Developer"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    disabled={disabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Issuer</label>
                  <input
                    type="text"
                    value={certification.issuer}
                    onChange={(e) => handleFieldChange(index, 'issuer', e.target.value)}
                    placeholder="Amazon Web Services"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    disabled={disabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Year</label>
                  <input
                    type="number"
                    value={certification.year}
                    onChange={(e) => handleFieldChange(index, 'year', e.target.value)}
                    placeholder="2023"
                    min="1950"
                    max={new Date().getFullYear()}
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
              onClick={handleAddCertification}
              disabled={disabled}
              className="btn btn-outline"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Another Certification
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default CertificationsForm
