'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface Form {
  id: string
  title: string
  question: string
  type: string
  settings: any
}

interface FeedbackFormProps {
  form: Form
}

export default function FeedbackForm({ form }: FeedbackFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    rating: null as number | null,
    text: '',
    answer: '',
    respondentEmail: '',
    respondentName: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/responses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: form.id,
          ...formData
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit feedback')
      }

      setIsSubmitted(true)
    } catch (err) {
      setError('Failed to submit feedback. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <div className="text-green-600 text-6xl mb-4">✓</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          {form.settings?.thankYouMessage || 'Thank you for your feedback!'}
        </h3>
        <p className="text-gray-600 mb-4">
          Your response has been recorded successfully.
        </p>
        <button
          onClick={() => setIsSubmitted(false)}
          className="text-indigo-600 hover:text-indigo-500 font-medium"
        >
          Submit another response
        </button>
      </div>
    )
  }

  return (
    <div 
      className="bg-white rounded-lg shadow p-6"
      style={{ 
        backgroundColor: form.settings?.backgroundColor || '#FFFFFF',
        color: form.settings?.textColor || '#1F2937'
      }}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Rating Type */}
        {form.type === 'rating' && (
          <div>
            <label className="block text-sm font-medium mb-3">
              Rate your experience (1-5 stars)
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: star })}
                  className={`text-3xl transition-colors ${
                    formData.rating && formData.rating >= star
                      ? 'text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-200'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>
        )}

        {/* NPS Type */}
        {form.type === 'nps' && (
          <div>
            <label className="block text-sm font-medium mb-3">
              How likely are you to recommend us? (0-10)
            </label>
            <div className="grid grid-cols-11 gap-1">
              {Array.from({ length: 11 }, (_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setFormData({ ...formData, rating: i })}
                  className={`p-2 text-sm rounded transition-colors ${
                    formData.rating === i
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {i}
                </button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2">
              <span>Not likely</span>
              <span>Very likely</span>
            </div>
          </div>
        )}

        {/* Text Type */}
        {form.type === 'text' && (
          <div>
            <label className="block text-sm font-medium mb-2">
              Your feedback
            </label>
            <textarea
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Share your thoughts..."
              required
            />
          </div>
        )}

        {/* Yes/No Type */}
        {form.type === 'yesno' && (
          <div>
            <label className="block text-sm font-medium mb-3">
              Your response
            </label>
            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, answer: 'yes' })}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                  formData.answer === 'yes'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👍 Yes
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, answer: 'no' })}
                className={`flex-1 py-3 px-4 rounded-md font-medium transition-colors ${
                  formData.answer === 'no'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👎 No
              </button>
            </div>
          </div>
        )}

        {/* Optional contact information */}
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-3">
            Contact Information (Optional)
          </h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <input
                type="text"
                placeholder="Your name"
                value={formData.respondentName}
                onChange={(e) => setFormData({ ...formData, respondentName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <input
                type="email"
                placeholder="Your email"
                value={formData.respondentEmail}
                onChange={(e) => setFormData({ ...formData, respondentEmail: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || !isFormValid()}
          className="w-full py-3 px-4 rounded-md font-medium text-white transition-colors disabled:opacity-50"
          style={{ 
            backgroundColor: form.settings?.buttonColor || '#4F46E5'
          }}
        >
          {isLoading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  )

  function isFormValid() {
    switch (form.type) {
      case 'rating':
      case 'nps':
        return formData.rating !== null
      case 'text':
        return formData.text.trim().length > 0
      case 'yesno':
        return formData.answer !== ''
      default:
        return false
    }
  }
}
