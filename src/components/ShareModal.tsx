'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RatingDisplay } from '@/components/RatingDisplay'

interface ShareModalProps {
  response: {
    id: string
    rating?: number
    text?: string
    respondentName?: string
    respondentCompany?: string
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

interface UserUsage {
  currentMonth: any
  limits: {
    feedbackRequests: number
    socialShares: number
    platforms: string[]
  }
  canCreateFeedbackRequest: boolean
  canShareSocial: boolean
  remainingFeedbackRequests: number
  remainingSocialShares: number
}

export function ShareModal({ response, form, isOpen, onClose }: ShareModalProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [imageUrl, setImageUrl] = useState<string>('')
  const [shareText, setShareText] = useState('')
  const [usage, setUsage] = useState<UserUsage | null>(null)
  const [loadingUsage, setLoadingUsage] = useState(false)

  useEffect(() => {
    if (isOpen) {
      fetchUsage()
    }
  }, [isOpen])

  const fetchUsage = async () => {
    setLoadingUsage(true)
    try {
      const response = await fetch('/api/usage')
      if (response.ok) {
        const data = await response.json()
        setUsage(data.usage)
      }
    } catch (error) {
      console.error('Error fetching usage:', error)
    } finally {
      setLoadingUsage(false)
    }
  }

  if (!isOpen) return null

  const generateCard = async () => {
    setIsGenerating(true)
    try {
      let apiFeedbackText = response.text || '';
      if (!response.text) {
        if (form.type === 'nps') {
          apiFeedbackText = `Rated us ${response.rating}/10`;
        } else {
          apiFeedbackText = `Rated us ${response.rating}/5`;
        }
      }

      const params = new URLSearchParams({
        feedback: apiFeedbackText, // Use the conditional text
        rating: response.rating?.toString() || (form.type === 'nps' ? '10' : '5'), // Default rating if none
        name: response.respondentName || 'A satisfied customer',
        company: response.respondentCompany || '', // Customer's company
        business: form.user?.name || form.title, // Business name for "Powered by" or context
        formType: form.type, // Pass formType
      });
      
      const url = `/api/testimonials?${params.toString()}`
      setImageUrl(url)
      
      // Generate default share text
      let ratingText = '';
      if (form.type === 'nps') {
        ratingText = `${response.rating}/10 score`;
      } else { // Default to 5-star
        ratingText = `${response.rating}/5 stars`;
      }
      const defaultText = `🌟 We're thrilled to share this amazing feedback! ${response.text ? `"${response.text}"` : ratingText} Thank you ${response.respondentName || 'to our customer'} for this review! #CustomerLove #Testimonial`;
      setShareText(defaultText)
      
    } catch (error) {
      console.error('Error generating card:', error)
    } finally {
      setIsGenerating(false)
    }
  }

  const shareToTwitter = async () => {
    if (!usage?.limits.platforms.includes('twitter') && !usage?.limits.platforms.includes('x')) {
      alert('Twitter/X sharing is only available on Pro plan. Please upgrade to access all platforms.')
      return
    }

    if (!usage?.canShareSocial) {
      alert(`Monthly social share limit reached (${usage?.limits.socialShares}). Please upgrade to Pro for unlimited shares.`)
      return
    }

    const testimonialPageParams = new URLSearchParams();
    if (response.text) testimonialPageParams.set('feedback', response.text);
    else testimonialPageParams.set('feedback', `Rated us ${response.rating}/5 stars`); // This fallback might need form.type awareness if used directly
    if (response.rating) testimonialPageParams.set('rating', response.rating.toString());
    else testimonialPageParams.set('rating', (form.type === 'nps' ? '10' : '5'));
    if (response.respondentName) testimonialPageParams.set('name', response.respondentName);
    else testimonialPageParams.set('name', 'A satisfied customer');
    if (response.respondentCompany) testimonialPageParams.set('company', response.respondentCompany);
    if (form.user?.name) testimonialPageParams.set('business', form.user.name);
    else testimonialPageParams.set('business', form.title);
    testimonialPageParams.set('formType', form.type); // Add formType

    const sharePageUrl = `${window.location.origin}/testimonial/${response.id}?${testimonialPageParams.toString()}`;
    const tweetText = encodeURIComponent(shareText);
    const url = `https://twitter.com/intent/tweet?text=${tweetText}&url=${encodeURIComponent(sharePageUrl)}`;
    window.open(url, '_blank')
    await markAsShared('twitter')
  }

  const shareToLinkedIn = async () => {
    if (!usage?.limits.platforms.includes('linkedin')) {
      alert('LinkedIn sharing is only available on Pro plan. Please upgrade to access all platforms.')
      return
    }

    if (!usage?.canShareSocial) {
      alert(`Monthly social share limit reached (${usage?.limits.socialShares}). Please upgrade to Pro for unlimited shares.`)
      return
    }

    const testimonialPageParams = new URLSearchParams();
    if (response.text) testimonialPageParams.set('feedback', response.text);
    else testimonialPageParams.set('feedback', `Rated us ${response.rating}/5 stars`); // This fallback might need form.type awareness if used directly
    if (response.rating) testimonialPageParams.set('rating', response.rating.toString());
    else testimonialPageParams.set('rating', (form.type === 'nps' ? '10' : '5'));
    if (response.respondentName) testimonialPageParams.set('name', response.respondentName);
    else testimonialPageParams.set('name', 'A satisfied customer');
    if (response.respondentCompany) testimonialPageParams.set('company', response.respondentCompany);
    if (form.user?.name) testimonialPageParams.set('business', form.user.name);
    else testimonialPageParams.set('business', form.title);
    testimonialPageParams.set('formType', form.type); // Add formType

    const sharePageUrl = `${window.location.origin}/testimonial/${response.id}?${testimonialPageParams.toString()}`;
    // LinkedIn uses the OG tags from sharePageUrl. A summary or text parameter is not reliably used for the main post content.
    const url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(sharePageUrl)}`;
    window.open(url, '_blank')
    await markAsShared('linkedin')
  }

  const shareToFacebook = async () => {
    if (!usage?.limits.platforms.includes('facebook')) {
      alert('Facebook sharing is not available on your current plan.')
      return
    }

    if (!usage?.canShareSocial) {
      alert(`Monthly social share limit reached (${usage?.limits.socialShares}). Please upgrade to Pro for unlimited shares.`)
      return
    }

    // Copy share text to clipboard first
    try {
      await navigator.clipboard.writeText(shareText)
    } catch (error) {
      console.log('Could not copy to clipboard:', error)
    }

    // Create a shareable URL with unique ID for better caching
    const shareParams = new URLSearchParams();
    if (response.text) shareParams.set('feedback', response.text);
    else shareParams.set('feedback', `Rated us ${response.rating}/5 stars`); // This fallback might need form.type awareness if used directly
    if (response.rating) shareParams.set('rating', response.rating.toString());
    else shareParams.set('rating', (form.type === 'nps' ? '10' : '5'));
    if (response.respondentName) shareParams.set('name', response.respondentName);
    else shareParams.set('name', 'A satisfied customer');
    if (response.respondentCompany) shareParams.set('company', response.respondentCompany);
    if (form.user?.name) shareParams.set('business', form.user.name);
    else shareParams.set('business', form.title);
    shareParams.set('formType', form.type); // Add formType
    
    // Use testimonial ID for unique URL that Facebook won't cache incorrectly
    const shareUrl = `${window.location.origin}/testimonial/${response.id}?${shareParams.toString()}`
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
    
    console.log('Sharing URL:', shareUrl) // Debug log
    
    // Show helpful message with debug option
    const debugUrl = `https://developers.facebook.com/tools/debug/?q=${encodeURIComponent(shareUrl)}`
    const message = `📘 Facebook Sharing Options\n\n💬 Your share text has been copied to your clipboard!\n\n✅ Share immediately (recommended)\n🔧 Debug URL if you see wrong/old content\n\nNote: If Facebook shows old content, use the Debug option to refresh their cache.`
    
    const userChoice = confirm(message + '\n\nClick OK to SHARE NOW, or Cancel to DEBUG URL first.')
    
    if (userChoice) {
      window.open(facebookUrl, '_blank')
    } else {
      // Open debug tool and provide instructions
      window.open(debugUrl, '_blank')
      setTimeout(() => {
        alert('🔧 Facebook URL Debugger opened!\n\n📋 Instructions:\n1. Click "Scrape Again" button\n2. Wait for it to update\n3. Close the debugger tab\n4. Try sharing again\n\nThis forces Facebook to refresh the cached content.')
      }, 1000)
    }
    await markAsShared('facebook')
  }

  const shareToInstagram = async () => {
    if (!usage?.limits.platforms.includes('instagram')) {
      alert('Instagram sharing is only available on Pro plan. Please upgrade to access all platforms.')
      return
    }

    if (!usage?.canShareSocial) {
      alert(`Monthly social share limit reached (${usage?.limits.socialShares}). Please upgrade to Pro for unlimited shares.`)
      return
    }

    // Download Instagram-optimized image
    await downloadInstagramImage()
    await markAsShared('instagram')
  }

  const downloadInstagramImage = async () => {
    try {
      let apiFeedbackTextInsta = response.text || '';
      if (!response.text) {
        if (form.type === 'nps') {
          apiFeedbackTextInsta = `Rated us ${response.rating}/10`;
        } else {
          apiFeedbackTextInsta = `Rated us ${response.rating}/5`;
        }
      }
      const params = new URLSearchParams({
        feedback: apiFeedbackTextInsta,
        rating: response.rating?.toString() || (form.type === 'nps' ? '10' : '5'),
        name: response.respondentName || 'A satisfied customer',
        company: response.respondentCompany || '',
        business: form.user?.name || form.title,
        formType: form.type, // Pass formType
        format: 'instagram',
        download: 'true'
      });
      
      const url = `/api/testimonials?${params.toString()}`
      
      // Create a temporary link to download the image
      const a = document.createElement('a')
      a.href = url
      a.download = `testimonial-instagram-${response.id}.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      
      // Show instructions and copy caption
      alert('✅ Instagram image downloaded!\n\n📱 To share on Instagram:\n1. Open Instagram app\n2. Create new post\n3. Select the downloaded image\n4. Use the caption text below\n\n💬 Caption text has been copied to your clipboard!')
      
      // Copy caption to clipboard
      navigator.clipboard.writeText(shareText).catch(() => {
        console.log('Caption text:', shareText)
      })
      
    } catch (error) {
      console.error('Error downloading Instagram image:', error)
      alert('Error downloading image. Please try again.')
    }
  }

  const markAsShared = async (platform: string) => {
    const supabase = createClient()
    
    // Update response as shared
    await supabase
      .from('Response')
      .update({ 
        shared: true, 
        sharedAt: new Date().toISOString(),
        shareData: { platform, sharedAt: new Date().toISOString() }
      })
      .eq('id', response.id)

    // Increment social share usage
    try {
      const response = await fetch('/api/usage/social-share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ platform })
      })
      
      if (response.ok) {
        // Refresh usage data
        await fetchUsage()
      } else {
        const error = await response.json()
        console.error('Error tracking social share usage:', error)
      }
    } catch (error) {
      console.error('Error tracking social share usage:', error)
    }
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

          {/* Usage Display */}
          {usage && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-blue-900">Social Shares This Month</h3>
                  <p className="text-sm text-blue-700">
                    {usage.limits.socialShares === -1 
                      ? `${usage.currentMonth?.socialShares || 0} shares (Unlimited)`
                      : `${usage.currentMonth?.socialShares || 0} / ${usage.limits.socialShares} shares`
                    }
                  </p>
                </div>
                {usage.limits.socialShares !== -1 && (
                  <div className="text-right">
                    <p className="text-sm font-medium text-blue-900">
                      {usage.remainingSocialShares} remaining
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

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
                <iframe 
                  src={imageUrl} 
                  className="w-full h-80 rounded-lg shadow-lg border"
                  title="Testimonial Card Preview"
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
                  disabled={!usage?.canShareSocial || (!usage?.limits.platforms.includes('twitter') && !usage?.limits.platforms.includes('x'))}
                  className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
                  </svg>
                  X (Twitter)
                  {(!usage?.limits.platforms.includes('twitter') && !usage?.limits.platforms.includes('x')) && (
                    <span className="ml-2 text-xs bg-yellow-500 text-yellow-900 px-2 py-1 rounded">Pro</span>
                  )}
                </button>
                <button
                  onClick={shareToLinkedIn}
                  disabled={!usage?.canShareSocial || !usage?.limits.platforms.includes('linkedin')}
                  className="flex items-center justify-center px-4 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                  LinkedIn
                  {!usage?.limits.platforms.includes('linkedin') && (
                    <span className="ml-2 text-xs bg-yellow-500 text-yellow-900 px-2 py-1 rounded">Pro</span>
                  )}
                </button>
                <button
                  onClick={shareToFacebook}
                  disabled={!usage?.canShareSocial || !usage?.limits.platforms.includes('facebook')}
                  className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                  Facebook
                </button>
                <button
                  onClick={shareToInstagram}
                  disabled={!usage?.canShareSocial || !usage?.limits.platforms.includes('instagram')}
                  className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  Instagram
                  {!usage?.limits.platforms.includes('instagram') && (
                    <span className="ml-2 text-xs bg-yellow-500 text-yellow-900 px-2 py-1 rounded">Pro</span>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
                      {!usage?.limits.platforms.includes('instagram') && (
                        <span className="ml-2 text-xs bg-yellow-500 text-yellow-900 px-2 py-1 rounded">Pro</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Download option */}
              <div className="border-t pt-4 mt-4">
                <button
                  onClick={downloadAllAssets}
                  className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Assets</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                      </svg>
                      Instagram
                      {!usage?.limits.platforms.includes('instagram') && (
                        <span className="ml-2 text-xs bg-yellow-500 text-yellow-900 px-2 py-1 rounded">Pro</span>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Download option */}
              <div className="border-t pt-4 mt-4">
                <button
                  onClick={downloadAllAssets}
                  className="w-full px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 flex items-center justify-center space-x-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Download Assets</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
