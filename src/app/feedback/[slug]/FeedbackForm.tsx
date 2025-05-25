'use client'

import { useState } from 'react'

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
  const [isLoading, setIsLoading] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [rating, setRating] = useState<number | null>(null)

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
          rating,
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
          Thank you for your feedback!
        </h3>
        <p className="text-gray-600 mb-4">
          Your response has been recorded successfully.
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-3">
            Rate your experience (1-5 stars)
          </label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className={`text-3xl transition-colors ${
                  rating && rating >= star
                    ? 'text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-200'
                }`}
              >
                ⭐
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isLoading || rating === null}
          className="w-full py-3 px-4 rounded-md font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          {isLoading ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>
    </div>
  )
}
