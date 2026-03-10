import React from 'react'
import { useResume } from '../../context/ResumeContext'

const HobbiesForm = ({ disabled = false }) => {
  const { resumeData, setHobbies } = useResume()

  const handleHobbiesChange = (value) => {
    setHobbies(value)
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hobbies & Interests (Optional)
        </label>
        <textarea
          rows={4}
          value={resumeData.hobbies}
          onChange={(e) => handleHobbiesChange(e.target.value)}
          placeholder="Reading, traveling, photography, coding, gaming..."
          className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm"
          disabled={disabled}
        />
        <p className="mt-1 text-sm text-gray-500">
          Separate multiple hobbies with commas
        </p>
      </div>

      {/* Hobby Suggestions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          <i className="fas fa-lightbulb mr-1"></i>
          Popular Hobbies:
        </h4>
        <div className="flex flex-wrap gap-2">
          {['Reading', 'Traveling', 'Photography', 'Gaming', 'Cooking', 'Music', 'Sports', 'Art', 'Writing', 'Coding'].map(hobby => (
            <button
              key={hobby}
              type="button"
              onClick={() => {
                const currentHobbies = resumeData.hobbies ? resumeData.hobbies.split(',').map(h => h.trim()).filter(h => h) : []
                if (!currentHobbies.includes(hobby)) {
                  const newHobbies = [...currentHobbies, hobby].join(', ')
                  setHobbies(newHobbies)
                }
              }}
              disabled={disabled}
              className="text-xs bg-white border border-blue-300 text-blue-700 px-2 py-1 rounded hover:bg-blue-100 disabled:opacity-50"
            >
              + {hobby}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HobbiesForm
