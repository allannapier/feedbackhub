'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)
  const [message, setMessage] = useState('')

  const supabase = createClient()

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage('')

    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/callback`,
          },
        })
        if (error) throw error
        setMessage('Check your email for verification link!')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        window.location.href = '/dashboard'
      }
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-8">
        <Link href="/" className="flex items-center">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
            <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <span className="ml-3 text-2xl font-bold text-gray-900">FeedbackHub</span>
        </Link>
      </nav>

      <div className="flex flex-col lg:flex-row max-w-7xl mx-auto px-6 py-12 gap-12">
        {/* Left side - Pricing Plans */}
        <div className="lg:w-1/2">
          <div className="text-center lg:text-left mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Start with our free plan
            </h1>
            <p className="text-xl text-gray-600">
              Create your account and explore FeedbackHub risk-free. You can upgrade to unlock more features anytime in your settings.
            </p>
          </div>

          <div className="space-y-6">
            {/* Free Plan */}
            <div className="relative rounded-2xl border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Free</h3>
                  <p className="text-2xl font-bold text-gray-900">£0<span className="text-sm font-normal text-gray-500">/month</span></p>
                </div>
                <div className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                  Perfect to start
                </div>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  5 Feedback requests per month
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  5 Social Media shares per month
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Share to Facebook, LinkedIn and X
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Printable QR Code per campaign
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Embeddable web form for website
                </li>
              </ul>
            </div>

            {/* Professional Plan */}
            <div className="relative rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm hover:shadow-lg transition-shadow">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="inline-flex items-center rounded-full bg-indigo-600 px-4 py-1 text-xs font-medium text-white">
                  Most Popular
                </span>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">Professional</h3>
                  <p className="text-2xl font-bold text-gray-900">£2.99<span className="text-sm font-normal text-gray-500">/month</span></p>
                </div>
                <div className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-1 text-xs font-medium text-indigo-700">
                  Best Value
                </div>
              </div>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Unlimited</span> Feedback requests per month
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="font-medium">Unlimited</span> Social Media shares per month
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Share to Facebook, LinkedIn, X, <span className="font-medium">Instagram</span>
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Printable QR Code per campaign
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Embeddable web form for website
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 text-center lg:text-left">
            <p className="text-sm text-gray-500">
              ✨ Everyone starts free! Upgrade to Professional in your account settings when you're ready for unlimited features.
            </p>
          </div>
        </div>

        {/* Right side - Auth Form */}
        <div className="lg:w-1/2 flex items-center justify-center">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  {isSignUp ? 'Get started free' : 'Welcome back'}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {isSignUp ? 'Join thousands using FeedbackHub to build trust' : 'Sign in to your account'}
                </p>
              </div>

              <form className="space-y-6" onSubmit={handleAuth}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="john@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {isSignUp && (
                    <p className="mt-1 text-xs text-gray-500">
                      Minimum 6 characters
                    </p>
                  )}
                </div>

                {message && (
                  <div className={`p-3 rounded-lg text-sm ${
                    message.includes('email') 
                      ? 'bg-green-50 text-green-700 border border-green-200' 
                      : 'bg-red-50 text-red-700 border border-red-200'
                  }`}>
                    {message}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : null}
                  {isLoading ? 'Creating account...' : (isSignUp ? 'Get Started Free' : 'Sign In')}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
                    onClick={() => {
                      setIsSignUp(!isSignUp)
                      setMessage('')
                    }}
                  >
                    {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Get started free"}
                  </button>
                </div>

                {isSignUp && (
                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      By signing up, you agree to our{' '}
                      <a href="#" className="text-indigo-600 hover:text-indigo-500">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-indigo-600 hover:text-indigo-500">Privacy Policy</a>
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
