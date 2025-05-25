'use client'

import { useState, useEffect } from 'react'
import { loadStripe } from '@stripe/stripe-js'

interface BillingPageProps {
  user: any
  email: string
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

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function BillingPage({ user, email }: BillingPageProps) {
  const [usage, setUsage] = useState<UserUsage | null>(null)
  const [loading, setLoading] = useState(false)
  const [loadingUsage, setLoadingUsage] = useState(true)

  useEffect(() => {
    fetchUsage()
  }, [])

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

  const handleUpgrade = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
        })
      })

      if (response.ok) {
        const { sessionId } = await response.json()
        const stripe = await stripePromise
        await stripe?.redirectToCheckout({ sessionId })
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error('Error starting checkout:', error)
      alert('Failed to start checkout process')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Billing & Subscription</h1>
        <p className="text-gray-600">Manage your FeedbackHub subscription and usage</p>
      </div>

      {/* Current Plan */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Current Plan</h2>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium capitalize">{user?.plan || 'Free'} Plan</h3>
            <p className="text-gray-600">
              {user?.plan === 'pro' 
                ? 'Unlimited feedback requests and social shares' 
                : 'Limited to 5 feedback requests and 5 social shares per month'}
            </p>
          </div>
          {user?.plan !== 'pro' && (
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Upgrade to Pro'}
            </button>
          )}
        </div>
      </div>

      {/* Usage Stats */}
      {usage && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">This Month's Usage</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Feedback Requests</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-indigo-600">
                  {usage.currentMonth?.feedbackRequests || 0}
                </span>
                <span className="text-gray-600">
                  {usage.limits.feedbackRequests === -1 ? 'Unlimited' : `/ ${usage.limits.feedbackRequests}`}
                </span>
              </div>
              {usage.limits.feedbackRequests !== -1 && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, ((usage.currentMonth?.feedbackRequests || 0) / usage.limits.feedbackRequests) * 100)}%` 
                    }}
                  ></div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-medium text-gray-900 mb-2">Social Shares</h3>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-green-600">
                  {usage.currentMonth?.socialShares || 0}
                </span>
                <span className="text-gray-600">
                  {usage.limits.socialShares === -1 ? 'Unlimited' : `/ ${usage.limits.socialShares}`}
                </span>
              </div>
              {usage.limits.socialShares !== -1 && (
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full" 
                    style={{ 
                      width: `${Math.min(100, ((usage.currentMonth?.socialShares || 0) / usage.limits.socialShares) * 100)}%` 
                    }}
                  ></div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6">
            <h3 className="font-medium text-gray-900 mb-2">Available Platforms</h3>
            <div className="flex flex-wrap gap-2">
              {usage.limits.platforms.map((platform) => (
                <span 
                  key={platform} 
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm capitalize"
                >
                  {platform === 'x' ? 'X (Twitter)' : platform}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Pricing Plans */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-6">Plans & Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Plan */}
          <div className={`border rounded-lg p-6 ${user?.plan === 'free' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
            <h3 className="text-lg font-semibold mb-2">Free Plan</h3>
            <div className="text-3xl font-bold mb-4">£0<span className="text-lg font-normal text-gray-600">/month</span></div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">5 feedback requests/month</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">5 social shares/month</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Facebook, LinkedIn, X</span>
              </li>
            </ul>
            {user?.plan === 'free' && (
              <div className="text-center py-2 px-4 bg-indigo-100 text-indigo-800 rounded font-medium">
                Current Plan
              </div>
            )}
          </div>

          {/* Pro Plan */}
          <div className={`border rounded-lg p-6 ${user?.plan === 'pro' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
            <h3 className="text-lg font-semibold mb-2">Pro Plan</h3>
            <div className="text-3xl font-bold mb-4">£2.99<span className="text-lg font-normal text-gray-600">/month</span></div>
            <ul className="space-y-2 mb-6">
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Unlimited feedback requests</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">Unlimited social shares</span>
              </li>
              <li className="flex items-center">
                <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                <span className="text-sm">All platforms + Instagram</span>
              </li>
            </ul>
            {user?.plan === 'pro' ? (
              <div className="text-center py-2 px-4 bg-indigo-100 text-indigo-800 rounded font-medium">
                Current Plan
              </div>
            ) : (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
              >
                {loading ? 'Processing...' : 'Upgrade to Pro'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
