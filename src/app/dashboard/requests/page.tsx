'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import { DashboardLayout } from '@/components/DashboardLayout'

interface Form {
  id: string
  title: string
  question: string
  slug: string
}

export default function RequestsPage() {
  const [forms, setForms] = useState<Form[]>([])
  const [selectedForm, setSelectedForm] = useState<Form | null>(null)
  const [recipients, setRecipients] = useState('')
  const [customMessage, setCustomMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)

  useEffect(() => {
    fetchForms()
  }, [])

  const fetchForms = async () => {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user) {
      const { data } = await supabase
        .from('forms')
        .select('id, title, question, slug')
        .eq('userId', user.id)
        .eq('isActive', true)
        .order('createdAt', { ascending: false })
      
      setForms(data || [])
      if (data && data.length > 0 && !selectedForm) {
        setSelectedForm(data[0])
      }
    }
  }

  const parseRecipients = (input: string) => {
    const lines = input.trim().split('\n')
    const recipients = []
    
    for (const line of lines) {
      const trimmed = line.trim()
      if (!trimmed) continue
      
      // Check if it's "Name <email>" format
      const nameEmailMatch = trimmed.match(/^(.+?)\s*<(.+?)>$/)
      if (nameEmailMatch) {
        recipients.push({
          name: nameEmailMatch[1].trim(),
          email: nameEmailMatch[2].trim()
        })
      } else if (trimmed.includes('@')) {
        // Just an email
        recipients.push({
          email: trimmed
        })
      }
    }
    
    return recipients
  }

  const sendRequests = async () => {
    if (!selectedForm || !recipients.trim()) return
    
    setIsLoading(true)
    setResult(null)
    
    try {
      const parsedRecipients = parseRecipients(recipients)
      
      if (parsedRecipients.length === 0) {
        alert('Please enter valid email addresses')
        return
      }
      
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          formId: selectedForm.id,
          recipients: parsedRecipients,
          customMessage: customMessage.trim() || undefined
        }),
      })
      
      const data = await response.json()
      setResult(data)
      
      if (data.sent > 0) {
        setRecipients('')
        setCustomMessage('')
      }
    } catch (error) {
      console.error('Error sending requests:', error)
      alert('Failed to send requests. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <DashboardLayout user={null}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Send Feedback Requests</h1>
            <p className="mt-2 text-gray-600">Send personalized feedback requests to your customers</p>
          </div>
          <Link
            href="/dashboard/requests/history"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            View Request History
          </Link>
        </div>
        
        <div className="bg-white shadow rounded-lg">
          <div className="p-6">
            {result && (
              <div className={`mb-6 p-4 rounded-lg ${
                result.errors && result.errors.length > 0 ? 'bg-yellow-50 border border-yellow-200' : 'bg-green-50 border border-green-200'
              }`}>
                <p className="font-medium">
                  {result.sent > 0 && `✅ ${result.sent} requests sent successfully`}
                  {result.failed > 0 && ` • ⚠️ ${result.failed} failed`}
                </p>
                {result.errors && result.errors.length > 0 && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm text-yellow-700">View errors</summary>
                    <ul className="mt-2 text-sm">
                      {result.errors.map((error: any, index: number) => (
                        <li key={index}>{error.email}: {String(error.error)}</li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>
            )}

            <form onSubmit={(e) => { e.preventDefault(); sendRequests(); }} className="space-y-6">
              {/* Form Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Feedback Form
                </label>
                <select
                  value={selectedForm?.id || ''}
                  onChange={(e) => {
                    const form = forms.find(f => f.id === e.target.value)
                    setSelectedForm(form || null)
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Choose a form...</option>
                  {forms.map(form => (
                    <option key={form.id} value={form.id}>
                      {form.title}
                    </option>
                  ))}
                </select>
                {selectedForm && (
                  <p className="mt-2 text-sm text-gray-600">
                    Question: "{selectedForm.question}"
                  </p>
                )}
              </div>

              {/* Recipients */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipients
                </label>
                <textarea
                  value={recipients}
                  onChange={(e) => setRecipients(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={6}
                  placeholder="Enter email addresses, one per line:

john@example.com
Jane Smith <jane@example.com>
support@company.com"
                  required
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter one email per line. You can use "Name &lt;email@example.com&gt;" format.
                </p>
              </div>

              {/* Custom Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Message (Optional)
                </label>
                <textarea
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={3}
                  placeholder="Add a personal message to include in the email..."
                />
              </div>

              {/* Preview */}
              {selectedForm && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-medium text-gray-900 mb-2">Email Preview</h3>
                  <div className="text-sm text-gray-600">
                    <p><strong>Subject:</strong> Quick feedback request: {selectedForm.title}</p>
                    <p><strong>Form Link:</strong> {process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/forms/{selectedForm.slug}</p>
                  </div>
                </div>
              )}

              {/* Submit */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading || !selectedForm || !recipients.trim()}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? 'Sending...' : 'Send Requests'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
