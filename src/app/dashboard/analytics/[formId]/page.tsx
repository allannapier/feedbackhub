import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

interface PageProps {
  params: {
    formId: string
  }
}

export default async function FormAnalyticsPage({ params }: PageProps) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  // Fetch the form
  const { data: form, error: formError } = await supabase
    .from('Form')
    .select('*')
    .eq('id', params.formId)
    .eq('userId', user.id)
    .single()

  if (formError || !form) {
    notFound()
  }

  // Fetch all responses for this form
  const { data: responses, error: responsesError } = await supabase
    .from('Response')
    .select('*')
    .eq('formId', params.formId)
    .order('createdAt', { ascending: false })

  if (responsesError) {
    console.error('Error fetching responses:', responsesError)
  }

  // Calculate analytics
  const totalResponses = responses?.length || 0
  const ratingResponses = responses?.filter(r => r.rating !== null) || []
  const textResponses = responses?.filter(r => r.text) || []
  
  const averageRating = ratingResponses.length > 0
    ? (ratingResponses.reduce((sum, r) => sum + r.rating, 0) / ratingResponses.length).toFixed(1)
    : null

  // Rating distribution
  const ratingDistribution = [1, 2, 3, 4, 5].map(rating => ({
    rating,
    count: ratingResponses.filter(r => r.rating === rating).length,
    percentage: ratingResponses.length > 0 
      ? Math.round((ratingResponses.filter(r => r.rating === rating).length / ratingResponses.length) * 100)
      : 0
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/dashboard/analytics"
              className="text-indigo-600 hover:text-indigo-800"
            >
              ← Back to Analytics
            </Link>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
              <p className="text-gray-600 mt-2">{form.question}</p>
            </div>
            <div className="flex gap-3">
              <Link
                href={`/forms/${form.slug}`}
                target="_blank"
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                View Public Form
              </Link>
            </div>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-blue-600">{totalResponses}</p>
                <p className="text-sm text-gray-600 mt-1">Total Responses</p>
              </div>
            </div>
            
            {averageRating && (
              <div className="bg-white rounded-lg shadow p-6">
                <div className="text-center">
                  <p className="text-3xl font-bold text-yellow-600">{averageRating}</p>
                  <p className="text-sm text-gray-600 mt-1">Average Rating</p>
                  <div className="flex justify-center mt-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className={`text-sm ${star <= Math.round(parseFloat(averageRating)) ? 'text-yellow-400' : 'text-gray-300'}`}>
                        ⭐
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-green-600">{ratingResponses.length}</p>
                <p className="text-sm text-gray-600 mt-1">Rating Responses</p>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-center">
                <p className="text-3xl font-bold text-purple-600">{textResponses.length}</p>
                <p className="text-sm text-gray-600 mt-1">Text Responses</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rating Distribution */}
            {form.type === 'rating' && ratingResponses.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating Distribution</h3>
                <div className="space-y-3">
                  {ratingDistribution.reverse().map((item) => (
                    <div key={item.rating} className="flex items-center">
                      <div className="flex items-center w-20">
                        <span className="text-sm font-medium">{item.rating}</span>
                        <span className="text-yellow-400 ml-1">⭐</span>
                      </div>
                      <div className="flex-1 mx-4">
                        <div className="bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-yellow-400 h-3 rounded-full transition-all"
                            style={{ width: `${item.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="w-16 text-right">
                        <span className="text-sm text-gray-600">{item.count} ({item.percentage}%)</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Responses */}
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Responses</h3>
              {responses && responses.length > 0 ? (
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {responses.slice(0, 5).map((response) => (
                    <div key={response.id} className="border-l-4 border-indigo-400 pl-4 py-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          {response.rating && (
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <span key={i} className={`text-sm ${i < response.rating ? 'text-yellow-400' : 'text-gray-300'}`}>
                                    ⭐
                                  </span>
                                ))}
                              </div>
                              <span className="text-sm text-gray-600">({response.rating}/5)</span>
                            </div>
                          )}
                          {response.text && (
                            <p className="text-sm text-gray-700 mt-1 line-clamp-2">{response.text}</p>
                          )}
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xs text-gray-500">
                            {new Date(response.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No responses yet</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
