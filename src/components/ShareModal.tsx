'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RatingDisplay } from '@/components/RatingDisplay'

interface ShareModalProps {
  response: {
    id: string
    rating?: number
    text?: string
    respondentName?: string
    formId: string
  }
  form: {
    title: string
    type: string
    user?: {
      name?: string
    }
  }
  isOpen: boolean
  onClose: () => void
}

export function ShareModal({ response, form, isOpen, onClose }: ShareModalProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [shareText, setShareText] = useState('')

  if (!isOpen) return null

  const generateCard = async () => {
    setIsGenerating(true)
    try {
      const params = new URLSearchParams({
        feedback: response.text || `Rated us ${response.rating}/5 stars`,
        rating: response.rating?.toString() || '5',
        name: response.respondentName || 'A satisfied customer',
        business: form.user?.name || form.title,
      })
      
      const imageUrl = `/api/testimonials/image?${params.toString()}`
      setImageUrl(imageUrl)
      
      // Generate default share text
      const defaultText = `🌟 We're thrilled to share this amazing feedback! ${response.text ? `"${response.text}"` : `${response.rating}/5 stars`} Thank you ${response.respondentName || 'to our customer'} for this review! #CustomerLove #Testimonial`
      setShareText(defaultText)
      
    } catch (error) {
      console.error('Error generating card:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const shareToTwitter = () => {
    const tweetText = encodeURIComponent(shareText)
    const url = `https://twitter.com/intent/tweet?text=${tweetText}`
    if (imageUrl) {
      // For image sharing, we'd need to implement file upload to Twitter API
      window.open(url, '_blank')
    } else {
      window.open(url, '_blank')
    }
    markAsShared('twitter')
  }

  const shareToLinkedIn = () => {
    const text = encodeURIComponent(shareText)
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}&summary=${text}`
    window.open(url, '_blank')
    markAsShared('linkedin')
  }

  const markAsShared = async (platform: string) => {
    const supabase = createClient()
    await supabase
      .from('Response')
      .update({ 
        shared: true, 
        sharedAt: new Date().toISOString(),
        shareData: { platform, sharedAt: new Date().toISOString() }
      })
      .eq('id', response.id)
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Share Testimonial</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Feedback Preview */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center mb-2">
              {response.rating && (
                <RatingDisplay 
                  rating={response.rating} 
                  formType={form.type}
                  showLabel={true}
                />
              )}
            </div>
            {response.text && (
              <p className="text-gray-800 italic mb-2">"{response.text}"</p>
            )}
            <p className="text-sm text-gray-600">— {response.respondentName || 'Anonymous'}</p>
          </div>

          {/* Generate Card Section */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-4">Testimonial Card</h3>
            {!imageUrl ? (
              <button
                onClick={generateCard}
                disabled={isGenerating}
                className="w-full px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {isGenerating ? 'Generating...' : 'Generate Testimonial Card'}
              </button>
            ) : (
              <div className="space-y-4">
                <img 
                  src={imageUrl} 
                  alt="Testimonial Card"
                  className="w-full rounded-lg shadow-lg border"
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => window.open(imageUrl, '_blank')}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                  >
                    Open Full Size
                  </button>
                  <button
                    onClick={() => setImageUrl('')}
                    className="px-4 py-2 text-indigo-600 hover:text-indigo-800"
                  >
                    Generate New
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Share Text */}
          {imageUrl && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Share Text
              </label>
              <textarea
                value={shareText}
                onChange={(e) => setShareText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                rows={3}
              />
            </div>
          )}

          {/* Share Buttons */}
          {imageUrl && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Share to Social Media</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={shareToTwitter}
                  className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                  </svg>
                  Twitter
                </button>
                <button
                  onClick={shareToLinkedIn}
                  className="flex items-center justify-center px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
