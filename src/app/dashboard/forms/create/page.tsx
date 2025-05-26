'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/DashboardLayout'

export default function CreateFormPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    title: '',
    question: '',
    type: 'rating',
    settings: {
      buttonColor: '#4F46E5',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      thankYouMessage: 'Thank you for your feedback!',
      collectEmail: false,
      collectName: false,
      collectCompany: false,
      collectPhone: false,
      requireConsent: true
    }
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const response = await fetch('/api/forms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to create form')
      }

      const { form } = await response.json()
      router.push(`/dashboard/forms/${form.slug}`)
    } catch (err) {
      setError('Failed to create form. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout user={null}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-indigo-600 hover:text-indigo-800 text-sm mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Create New Form</h1>
          <p className="mt-2 text-gray-600">Set up a new feedback form for your customers</p>
        </div>
        
        <div className="bg-white shadow rounded-lg">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Form Title
              </label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., Customer Satisfaction Survey"
                required
              />
            </div>

            <div>
              <label htmlFor="question" className="block text-sm font-medium text-gray-700 mb-2">
                Main Question
              </label>
              <textarea
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="e.g., How would you rate your experience with our service?"
                required
              />
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Response Type
              </label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="rating">Star Rating (1-5)</option>
                <option value="nps">NPS Scale (0-10)</option>
                <option value="text">Text Response</option>
                <option value="yesno">Yes/No</option>
              </select>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Customization</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="buttonColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Button Color
                  </label>
                  <input
                    type="color"
                    id="buttonColor"
                    value={formData.settings.buttonColor}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, buttonColor: e.target.value }
                    })}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="backgroundColor" className="block text-sm font-medium text-gray-700 mb-2">
                    Background Color
                  </label>
                  <input
                    type="color"
                    id="backgroundColor"
                    value={formData.settings.backgroundColor}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, backgroundColor: e.target.value }
                    })}
                    className="w-full h-10 border border-gray-300 rounded-md"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="thankYouMessage" className="block text-sm font-medium text-gray-700 mb-2">
                  Thank You Message
                </label>
                <input
                  type="text"
                  id="thankYouMessage"
                  value={formData.settings.thankYouMessage}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, thankYouMessage: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Thank you for your feedback!"
                />
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Optional Information Collection</h3>
              <p className="text-sm text-gray-600 mb-4">
                Choose which optional fields to show to respondents. This helps you identify feedback providers and build stronger relationships.
              </p>
              
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="collectName"
                    checked={formData.settings.collectName}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, collectName: e.target.checked }
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="collectName" className="ml-2 block text-sm text-gray-700">
                    Collect respondent name
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="collectEmail"
                    checked={formData.settings.collectEmail}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, collectEmail: e.target.checked }
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="collectEmail" className="ml-2 block text-sm text-gray-700">
                    Collect email address
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="collectCompany"
                    checked={formData.settings.collectCompany}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, collectCompany: e.target.checked }
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="collectCompany" className="ml-2 block text-sm text-gray-700">
                    Collect company name
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="collectPhone"
                    checked={formData.settings.collectPhone}
                    onChange={(e) => setFormData({
                      ...formData,
                      settings: { ...formData.settings, collectPhone: e.target.checked }
                    })}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label htmlFor="collectPhone" className="ml-2 block text-sm text-gray-700">
                    Collect phone number
                  </label>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sharing Consent</h3>
              <p className="text-sm text-gray-600 mb-4">
                Require consent before sharing positive feedback as testimonials on social media or marketing materials.
              </p>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="requireConsent"
                  checked={formData.settings.requireConsent}
                  onChange={(e) => setFormData({
                    ...formData,
                    settings: { ...formData.settings, requireConsent: e.target.checked }
                  })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="requireConsent" className="ml-2 block text-sm text-gray-700">
                  Require consent to share feedback publicly
                </label>
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Recommended for compliance with privacy regulations. When enabled, respondents must explicitly agree to allow their feedback to be shared.
              </p>
            </div>

            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isLoading ? 'Creating...' : 'Create Form'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
