import React from 'react'
import { useResume } from '../../context/ResumeContext'

const LanguagesForm = ({ disabled = false }) => {
  const { resumeData, addLanguage, updateLanguage, removeLanguage } = useResume()

  const handleFieldChange = (index, field, value) => {
    updateLanguage(index, { ...resumeData.languages[index], [field]: value })
  }

  const handleAddLanguage = () => {
    addLanguage({
      name: '',
      proficiency: 'Basic'
    })
  }

  const handleRemoveLanguage = (index) => {
    removeLanguage(index)
  }

  const proficiencyLevels = ['Basic', 'Intermediate', 'Advanced', 'Native']

  return (
    <div className="space-y-6">
      {resumeData.languages.length === 0 ? (
        <div className="text-center py-8">
          <i className="fas fa-language text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 mb-4">No languages added yet (Optional)</p>
          <button
            type="button"
            onClick={handleAddLanguage}
            disabled={disabled}
            className="btn btn-outline"
          >
            <i className="fas fa-plus mr-2"></i>
            Add Language
          </button>
        </div>
      ) : (
        <>
          {resumeData.languages.map((language, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900">Language {index + 1}</h3>
                <button
                  type="button"
                  onClick={() => handleRemoveLanguage(index)}
                  disabled={disabled}
                  className="text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                  <input
                    type="text"
                    value={language.name}
                    onChange={(e) => handleFieldChange(index, 'name', e.target.value)}
                    placeholder="English"
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    disabled={disabled}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency</label>
                  <select
                    value={language.proficiency}
                    onChange={(e) => handleFieldChange(index, 'proficiency', e.target.value)}
                    className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
                    disabled={disabled}
                  >
                    {proficiencyLevels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center">
            <button
              type="button"
              onClick={handleAddLanguage}
              disabled={disabled}
              className="btn btn-outline"
            >
              <i className="fas fa-plus mr-2"></i>
              Add Another Language
            </button>
          </div>
        </>
      )}
    </div>
  )
}

export default LanguagesForm
