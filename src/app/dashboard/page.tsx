import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  // Fetch user's forms
  const { data: forms, error } = await supabase
    .from('Form')
    .select('*')
    .eq('userId', user.id)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching forms:', error)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">FeedbackHub Dashboard</h1>
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/analytics"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              View Analytics
            </Link>
            <span className="text-sm text-gray-600">Welcome, {user.email}</span>
            <form action="/auth/logout" method="post">
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
            <h2 className="text-2xl font-semibold mb-4">Your Feedback Forms</h2>
            <p className="text-gray-600 mb-6">Create and manage your feedback forms here.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Existing Forms */}
              {forms && forms.map((form) => (
                <div key={form.id} className="bg-white p-6 rounded-lg shadow border hover:border-indigo-500 transition-colors">
                  <h3 className="text-lg font-medium mb-2">{form.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{form.question}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                      {form.type}
                    </span>
                    <div className="flex gap-2">
                      <Link
                        href={`/forms/${form.slug}`}
                        className="text-indigo-600 hover:text-indigo-800 text-sm"
                      >
                        View
                      </Link>
                      <button className="text-gray-600 hover:text-gray-800 text-sm">
                        Edit
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-500">
                    Created {new Date(form.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
              
              {/* Create New Form Card */}
              <div className="bg-white p-6 rounded-lg shadow border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors">
                <div className="text-center">
                  <div className="text-4xl mb-4">+</div>
                  <h3 className="text-lg font-medium">Create New Form</h3>
                  <p className="text-gray-500 text-sm mt-2">Start collecting feedback</p>
                  <Link
                    href="/dashboard/forms/create"
                    className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 inline-block"
                  >
                    Create Form
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
