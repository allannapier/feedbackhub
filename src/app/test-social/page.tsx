'use client'

import { useState } from 'react'
import { ShareModal } from '@/components/ShareModal'

export default function TestSocialPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const mockResponse = {
    id: 'test-response-123',
    rating: 5,
    text: 'Absolutely amazing service! The team went above and beyond to help us. Highly recommend!',
    respondentName: 'Sarah Johnson',
    formId: 'test-form-456'
  }

  const mockForm = {
    title: 'Customer Feedback',
    type: 'rating',
    user: {
      name: 'FeedbackHub Demo'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Social Sharing Test Page
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Test the new Facebook and Instagram sharing features
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">Test Feedback Response</h2>
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="flex items-center mb-3">
              <span className="text-yellow-400 text-xl">★★★★★</span>
              <span className="ml-2 font-medium">5/5 Stars</span>
            </div>
            <p className="text-gray-800 italic mb-3">"{mockResponse.text}"</p>
            <p className="text-sm text-gray-600">— {mockResponse.respondentName}</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            🚀 Test Social Sharing
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4">Features to Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-blue-600 mb-2">📘 Facebook Sharing</h3>
              <p className="text-sm text-gray-600">
                Available to all users (Free & Pro plans)
              </p>
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                <li>• Opens Facebook share dialog</li>
                <li>• Includes testimonial card</li>
                <li>• Custom share text</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-purple-600 mb-2">📱 Instagram Sharing</h3>
              <p className="text-sm text-gray-600">
                Pro plan only - downloads optimized image
              </p>
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                <li>• 1080x1080 square format</li>
                <li>• Downloads PNG image</li>
                <li>• Copies caption to clipboard</li>
                <li>• Instructions for manual posting</li>
              </ul>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-blue-400 mb-2">🐦 Twitter/X</h3>
              <p className="text-sm text-gray-600">
                Pro plan only (existing feature)
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-medium text-blue-700 mb-2">💼 LinkedIn</h3>
              <p className="text-sm text-gray-600">
                Pro plan only (existing feature)
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Test with napieraiagent@gmail.com account to verify functionality
          </p>
        </div>
      </div>

      <ShareModal
        response={mockResponse}
        form={mockForm}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  )
}
