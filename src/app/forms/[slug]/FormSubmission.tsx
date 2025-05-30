'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface FormSubmissionProps {
  form: {
    id: string
    title: string
    question: string
    type: string
    settings: any
  }
}

export default function FormSubmission({ form }: FormSubmissionProps) {
  const [response, setResponse] = useState<{
    rating?: number
    text?: string
    answer?: string
    respondentEmail?: string
    respondentName?: string
    respondentCompany?: string
    respondentPhone?: string
    consentToShare?: boolean
  }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate consent if required
    if (form.settings?.requireConsent && !response.consentToShare) {
      setMessage('Please confirm that you consent to sharing your feedback')
      return
    }

    // Validate response based on form type
    if (form.type === 'rating' && !response.rating) {
      setMessage('Please select a rating')
      return
    }
    if (form.type === 'text' && !response.text?.trim()) {
      setMessage('Please provide your feedback')
      return
    }
    if (form.type === 'yesno' && !response.answer) {
      setMessage('Please select an answer')
      return
    }
    if (form.type === 'nps' && response.rating === undefined) {
      setMessage('Please select a score')
      return
    }

    setIsSubmitting(true)
    setMessage('')

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('Response')
        .insert({
          formId: form.id,
          rating: response.rating,
          text: response.text,
          answer: response.answer,
          respondentEmail: response.respondentEmail,
          respondentName: response.respondentName,
          respondentCompany: response.respondentCompany,
          respondentPhone: response.respondentPhone,
          consentToShare: response.consentToShare || false,
          metadata: {
            userAgent: navigator.userAgent,
            timestamp: new Date().toISOString()
          }
        })

      if (error) {
        console.error('Submission error:', error)
        setMessage('Error submitting response. Please try again.')
        return
      }

      setIsSubmitted(true)
    } catch (error: any) {
      console.error('Unexpected error:', error)
      setMessage('An unexpected error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="text-center py-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Thank You!</h3>
        <p className="text-gray-600">
          {form.settings?.thankYouMessage || 'Thank you for your feedback!'}
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Star Rating */}
      {form.type === 'rating' && (
        <div className="text-center">
          <div className="flex justify-center gap-2 mb-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setResponse({ ...response, rating: star })}
                className="text-4xl transition-colors focus:outline-none"
              >
                {response.rating && response.rating >= star ? (
                  <span className="text-yellow-400">★</span>
                ) : (
                  <span className="text-gray-300 hover:text-yellow-300">☆</span>
                )}
              </button>
            ))}
          </div>
          {response.rating && (
            <p className="text-sm text-gray-600">
              {response.rating === 1 && 'Poor'}
              {response.rating === 2 && 'Fair'}
              {response.rating === 3 && 'Good'}
              {response.rating === 4 && 'Very Good'}
              {response.rating === 5 && 'Excellent'}
            </p>
          )}
        </div>
      )}

      {/* Text Response */}
      {form.type === 'text' && (
        <div>
          <textarea
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            rows={4}
            placeholder="Share your thoughts..."
            value={response.text || ''}
            onChange={(e) => setResponse({ ...response, text: e.target.value })}
          />
        </div>
      )}

      {/* Yes/No */}
      {form.type === 'yesno' && (
        <div className="flex justify-center gap-4">
          <button
            type="button"
            onClick={() => setResponse({ ...response, answer: 'yes' })}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              response.answer === 'yes'
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            Yes
          </button>
          <button
            type="button"
            onClick={() => setResponse({ ...response, answer: 'no' })}
            className={`px-8 py-3 rounded-lg font-medium transition-colors ${
              response.answer === 'no'
                ? 'bg-red-600 text-white'
                : 'bg-red-100 text-red-700 hover:bg-red-200'
            }`}
          >
            No
          </button>
        </div>
      )}

      {/* NPS Scale */}
      {form.type === 'nps' && (
        <div>
          <div className="flex justify-center gap-1 mb-4 flex-wrap">
            {[...Array(11)].map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setResponse({ ...response, rating: i })}
                className={`w-12 h-12 border rounded-lg font-medium transition-colors ${
                  response.rating === i
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'border-gray-300 text-gray-700 hover:bg-indigo-50'
                }`}
              >
                {i}
              </button>
            ))}
          </div>
          <div className="flex justify-between text-sm text-gray-600">
            <span>Not likely</span>
            <span>Very likely</span>
          </div>
        </div>
      )}

      {/* Optional Information Collection */}
      {(form.settings?.collectName || form.settings?.collectEmail || form.settings?.collectCompany || form.settings?.collectPhone) && (
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-gray-900">Tell us about yourself (optional)</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {form.settings?.collectName && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your name"
                  value={response.respondentName || ''}
                  onChange={(e) => setResponse({ ...response, respondentName: e.target.value })}
                />
              </div>
            )}
            
            {form.settings?.collectEmail && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="your@email.com"
                  value={response.respondentEmail || ''}
                  onChange={(e) => setResponse({ ...response, respondentEmail: e.target.value })}
                />
              </div>
            )}
            
            {form.settings?.collectCompany && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Your company"
                  value={response.respondentCompany || ''}
                  onChange={(e) => setResponse({ ...response, respondentCompany: e.target.value })}
                />
              </div>
            )}
            
            {form.settings?.collectPhone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="+1 (555) 123-4567"
                  value={response.respondentPhone || ''}
                  onChange={(e) => setResponse({ ...response, respondentPhone: e.target.value })}
                />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Consent Checkbox */}
      {form.settings?.requireConsent && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <input
              type="checkbox"
              id="consentToShare"
              checked={response.consentToShare || false}
              onChange={(e) => setResponse({ ...response, consentToShare: e.target.checked })}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded mt-1"
            />
            <label htmlFor="consentToShare" className="ml-3 text-sm text-gray-700">
              <span className="font-medium">Sharing Permission:</span> I consent to having my feedback shared publicly as a testimonial for marketing purposes. I understand that my response may be used on social media, websites, or other promotional materials.
            </label>
          </div>
        </div>
      )}

      {message && (
        <div className="p-3 rounded bg-red-100 text-red-700 text-sm">
          {message}
        </div>
      )}

      <div className="text-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </div>
    </form>
  )
}
