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
          <h2 className="text-xl font-semibold mb-4">🚀 Improvements Made</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h3 className="font-medium text-green-700 mb-2">📘 Facebook Improvements</h3>
              <ul className="text-xs text-green-600 space-y-1">
                <li>✅ Proper Open Graph meta tags</li>
                <li>✅ Platform-specific image optimization</li>
                <li>✅ 1200×630 image format</li>
                <li>✅ Rich preview with business branding</li>
                <li>✅ Cache-busting for image updates</li>
                <li>✅ Debug URL helper for cache issues</li>
              </ul>
            </div>

            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h3 className="font-medium text-blue-700 mb-2">💼 LinkedIn Improvements</h3>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>✅ LinkedIn-specific 1200×627 format</li>
                <li>✅ Professional styling with LinkedIn blue</li>
                <li>✅ Proper URL sharing with image</li>
                <li>✅ Enhanced feed posting integration</li>
                <li>✅ Business-focused design elements</li>
                <li>✅ LinkedIn meta tag optimization</li>
              </ul>
            </div>

            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
              <h3 className="font-medium text-purple-600 mb-2">📱 Instagram Enhancements</h3>
              <ul className="text-xs text-purple-600 space-y-1">
                <li>✅ Perfect 1080×1080 square format</li>
                <li>✅ Instagram-style gradient backgrounds</li>
                <li>✅ Optimized text sizing for mobile</li>
                <li>✅ Automatic caption generation</li>
                <li>✅ Download with posting instructions</li>
                <li>✅ Clipboard integration for captions</li>
              </ul>
            </div>

            <div className="border border-cyan-200 rounded-lg p-4 bg-cyan-50">
              <h3 className="font-medium text-cyan-700 mb-2">🐦 Twitter/X Enhancements</h3>
              <ul className="text-xs text-cyan-600 space-y-1">
                <li>✅ Twitter-optimized 1200×675 format</li>
                <li>✅ URL included in tweet text</li>
                <li>✅ Twitter blue styling elements</li>
                <li>✅ Proper card meta tags</li>
                <li>✅ Character-optimized content</li>
                <li>✅ Enhanced engagement features</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4">🧪 Testing Instructions</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-blue-900 mb-2">1. Generate Testimonial Card</h3>
              <p className="text-sm text-blue-700">Click "Test Social Sharing" above, then "Generate Testimonial Card" to create the shareable content.</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium text-green-900 mb-2">2. Test Platform-Specific Images</h3>
              <p className="text-sm text-green-700">Use the download buttons to get optimized images for each platform. Each has the correct dimensions and styling.</p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium text-purple-900 mb-2">3. Test Social Sharing</h3>
              <p className="text-sm text-purple-700">Try the Facebook and LinkedIn buttons to see the improved image previews. The images should now appear correctly.</p>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-medium text-yellow-900 mb-2">4. Verify Meta Tags</h3>
              <p className="text-sm text-yellow-700">
                Check the testimonial page meta tags with: 
                <br />
                <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                  https://developers.facebook.com/tools/debug/
                </code>
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
