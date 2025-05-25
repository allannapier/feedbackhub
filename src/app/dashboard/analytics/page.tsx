import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DashboardLayout } from '@/components/DashboardLayout'

export default async function AnalyticsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  // Fetch user's forms with response counts
  const { data: forms, error: formsError } = await supabase
    .from('forms')
    .select(`
      *,
      responses:responses(count)
    `)
    .eq('userId', user.id)
    .order('createdAt', { ascending: false })

  // Fetch recent responses across all forms
  const { data: recentResponses, error: responsesError } = await supabase
    .from('responses')
    .select(`
      *,
      form:forms!inner(title, userId)
    `)
    .eq('form.userId', user.id)
    .order('createdAt', { ascending: false })
    .limit(10)

  if (formsError || responsesError) {
    console.error('Error fetching analytics data:', formsError, responsesError)
  }

  const totalResponses = recentResponses?.length || 0
  const totalForms = forms?.length || 0

  return (
    <DashboardLayout user={{ email: user.email || '', name: user.user_metadata?.name || user.email }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="mt-2 text-gray-600">View insights and metrics for your feedback forms</p>
        </div>
        
        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Forms</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalForms}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Responses</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalResponses}</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Avg Rating</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {recentResponses && recentResponses.filter(r => r.rating).length > 0 
                      ? (recentResponses.filter(r => r.rating).reduce((sum, r) => sum + r.rating, 0) / recentResponses.filter(r => r.rating).length).toFixed(1)
                      : 'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>
        </div>

        {/* Forms Overview */}
        <div className="bg-white rounded-lg shadow mb-8">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Your Forms</h2>
            </div>
            <div className="p-6">
              {forms && forms.length > 0 ? (
                <div className="space-y-4">
                  {forms.map((form) => (
                    <div key={form.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">{form.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{form.question}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">{form.type}</span>
                            <span className="text-xs text-gray-500">
                              {form.responses?.[0]?.count || 0} responses
                            </span>
                            <span className="text-xs text-gray-500">
                              Created {new Date(form.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Link
                            href={`/dashboard/analytics/${form.id}`}
                            className="px-3 py-1 text-sm bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                          >
                            View Details
                          </Link>
                          <Link
                            href={`/forms/${form.slug}`}
                            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                            target="_blank"
                          >
                            Public Link
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No forms created yet.</p>
                  <Link
                    href="/dashboard/forms/create"
                    className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Create Your First Form
                  </Link>
                </div>
              )}
            </div>
        </div>

        {/* Recent Responses */}
        <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Responses</h2>
            </div>
            <div className="p-6">
              {recentResponses && recentResponses.length > 0 ? (
                <div className="space-y-4">
                  {recentResponses.map((response) => (
                    <div key={response.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{response.form.title}</h4>
                          {response.rating && (
                            <div className="flex items-center gap-1 mt-1">
                              {[...Array(5)].map((_, i) => (
                                <span key={i} className={`text-sm ${i < response.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                  ⭐
                                </span>
                              ))}
                              <span className="text-sm text-gray-600 ml-2">({response.rating}/5)</span>
                            </div>
                          )}
                          {response.text && (
                            <p className="text-gray-700 mt-2 text-sm">{response.text}</p>
                          )}
                          {response.answer && (
                            <p className="text-gray-700 mt-2">
                              <span className={`inline-flex px-2 py-1 text-xs rounded ${
                                response.answer === 'yes' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {response.answer.charAt(0).toUpperCase() + response.answer.slice(1)}
                              </span>
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">
                            {new Date(response.createdAt).toLocaleDateString()} at{' '}
                            {new Date(response.createdAt).toLocaleTimeString()}
                          </p>
                          {response.respondentName && (
                            <p className="text-xs text-gray-600 mt-1">{response.respondentName}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No responses yet. Share your forms to start collecting feedback!</p>
                </div>
              )}
            </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
