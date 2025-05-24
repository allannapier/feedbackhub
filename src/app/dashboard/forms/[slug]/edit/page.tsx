'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DashboardLayout } from '@/components/DashboardLayout'

interface Form {
  id: string
  title: string
  question: string
  type: string
  settings: any
  isActive: boolean
}

export default function EditFormPage() {
  const router = useRouter()
  const params = useParams()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [user, setUser] = useState<any>(null)
  const [form, setForm] = useState<Form | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    question: '',
    type: 'rating',
    isActive: true,
    settings: {
      buttonColor: '#4F46E5',
      backgroundColor: '#FFFFFF',
      textColor: '#1F2937',
      thankYouMessage: 'Thank you for your feedback!'
    }
  })

  useEffect(() => {
    loadForm()
  }, [])

  const loadForm = async () => {
    setIsLoading(true)
    const supabase = createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/auth')
      return
    }
    setUser(user)

    const { data: form, error } = await supabase
      .from('Form')
      .select('*')
      .eq('slug', params.slug)
      .eq('userId', user.id)
      .single()

    if (error || !form) {
      setError('Form not found')
      setIsLoading(false)
      return
    }

    setForm(form)
    setFormData({
      title: form.title,
      question: form.question,
      type: form.type,
      isActive: form.isActive,
      settings: form.settings || {
        buttonColor: '#4F46E5',
        backgroundColor: '#FFFFFF',
        textColor: '#1F2937',
        thankYouMessage: 'Thank you for your feedback!'
      }
    })
    setIsLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      const supabase = createClient()
      
      const { error } = await supabase
        .from('Form')
        .update({
          title: formData.title,
          question: formData.question,
          type: formData.type,
          isActive: formData.isActive,
          settings: formData.settings
        })
        .eq('id', form?.id)

      if (error) {
        throw new Error('Failed to update form')
      }

      router.push(`/dashboard/forms/${params.slug}`)
    } catch (err) {
      setError('Failed to update form. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <DashboardLayout user={user}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading form...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (error && !form) {
    return (
      <DashboardLayout user={user}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">❌</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Form Not Found</h2>
            <p className="text-gray-600 mb-4">The form you're looking for doesn't exist or you don't have permission to edit it.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout user={user}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="text-indigo-600 hover:text-indigo-800 text-sm mb-4"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Edit Form</h1>
          <p className="mt-2 text-gray-600">Update your feedback form settings</p>
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

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-700">
                Form is active (accepts new responses)
              </label>
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
                />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  )
}
