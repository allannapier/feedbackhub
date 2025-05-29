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
    respondentCompany: 'Tech Innovations Ltd',
    formId: 'test-form-456'
  }

  const mockForm = {
    title: 'Customer Feedback',
    type: 'rating',
    user: {
      name: 'FeedbackHub Demo'
    }
  }

  // Check if native sharing is supported
  const supportsNativeShare = typeof navigator !== 'undefined' && 'share' in navigator && 'canShare' in navigator

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Social Sharing Test Page
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Test the new Web Share API and enhanced social sharing features
          </p>
          
          {/* Native Share Support Badge */}
          <div className="inline-flex items-center space-x-2 mb-8">
            {supportsNativeShare ? (
              <div className="flex items-center space-x-2 bg-green-100 text-green-800 px-4 py-2 rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Native sharing supported!</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="font-medium">Using fallback sharing</span>
              </div>
            )}
          </div>
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
            <p className="text-xs text-gray-500">{mockResponse.respondentCompany}</p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors font-medium"
          >
            🚀 Test Social Sharing
          </button>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4">🆕 Web Share API Implementation</h2>
          
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-lg mb-3 text-indigo-900">✨ Key Improvements</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span><strong>One-tap sharing:</strong> Native OS share sheet with all installed apps</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span><strong>Text + Image together:</strong> Both testimonial card and caption in one action</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span><strong>Mobile-first experience:</strong> Seamless on iOS and Android devices</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span><strong>Fallback support:</strong> Platform buttons available for desktop/unsupported browsers</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2 mt-0.5">✓</span>
                <span><strong>Download option:</strong> Get assets for manual sharing when needed</span>
              </li>
            </ul>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="border border-green-200 rounded-lg p-4 bg-green-50">
              <h3 className="font-medium text-green-700 mb-2">📱 Mobile Experience</h3>
              <ul className="text-xs text-green-600 space-y-1">
                <li>✅ Native share button as primary CTA</li>
                <li>✅ Shares image + text + link together</li>
                <li>✅ Works with all installed social apps</li>
                <li>✅ Single tap to share anywhere</li>
                <li>✅ No clipboard copying needed</li>
                <li>✅ Respects user's app preferences</li>
              </ul>
            </div>

            <div className="border border-blue-200 rounded-lg p-4 bg-blue-50">
              <h3 className="font-medium text-blue-700 mb-2">💻 Desktop Experience</h3>
              <ul className="text-xs text-blue-600 space-y-1">
                <li>✅ Platform-specific buttons</li>
                <li>✅ Enhanced Open Graph tags</li>
                <li>✅ Improved URL sharing</li>
                <li>✅ Asset download option</li>
                <li>✅ Clipboard integration</li>
                <li>✅ Debug helpers for issues</li>
              </ul>
            </div>

            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50">
              <h3 className="font-medium text-purple-600 mb-2">🔧 Technical Details</h3>
              <ul className="text-xs text-purple-600 space-y-1">
                <li>✅ Progressive enhancement</li>
                <li>✅ Feature detection</li>
                <li>✅ Blob generation for images</li>
                <li>✅ Error handling & fallbacks</li>
                <li>✅ Usage tracking maintained</li>
                <li>✅ Platform limit checks</li>
              </ul>
            </div>

            <div className="border border-amber-200 rounded-lg p-4 bg-amber-50">
              <h3 className="font-medium text-amber-700 mb-2">🎯 User Benefits</h3>
              <ul className="text-xs text-amber-600 space-y-1">
                <li>✅ Faster sharing workflow</li>
                <li>✅ Better success rate</li>
                <li>✅ No manual copy/paste</li>
                <li>✅ Works with any app</li>
                <li>✅ Consistent experience</li>
                <li>✅ Less friction = more shares</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-xl font-semibold mb-4">🧪 Testing Instructions</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4">
              <h3 className="font-medium text-blue-900 mb-2">1. Test on Mobile Device</h3>
              <p className="text-sm text-blue-700">Open this page on your phone to see the native share button. It will show all your installed social apps.</p>
            </div>
            
            <div className="border-l-4 border-green-500 pl-4">
              <h3 className="font-medium text-green-900 mb-2">2. Try Native Sharing</h3>
              <p className="text-sm text-green-700">Click "Share Testimonial" to see the OS share sheet. Select any app to share with image + text.</p>
            </div>
            
            <div className="border-l-4 border-purple-500 pl-4">
              <h3 className="font-medium text-purple-900 mb-2">3. Test Fallback Mode</h3>
              <p className="text-sm text-purple-700">Click "Choose specific platform instead" to use traditional platform buttons.</p>
            </div>
            
            <div className="border-l-4 border-yellow-500 pl-4">
              <h3 className="font-medium text-yellow-900 mb-2">4. Desktop Experience</h3>
              <p className="text-sm text-yellow-700">On desktop, you'll automatically see platform buttons since most browsers don't support file sharing via Web Share API.</p>
            </div>

            <div className="border-l-4 border-red-500 pl-4">
              <h3 className="font-medium text-red-900 mb-2">5. Browser Support</h3>
              <p className="text-sm text-red-700">
                Works best on: iOS Safari, Android Chrome, Edge on Windows
                <br />
                Limited support: Desktop Chrome, Firefox (no file sharing)
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
