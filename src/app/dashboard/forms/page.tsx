import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DashboardLayout } from '@/components/DashboardLayout'

export default async function FormsPage() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  // Fetch user's forms with response counts
  const { data: forms, error } = await supabase
    .from('Form')
    .select(`
      *,
      responses:Response(count)
    `)
    .eq('userId', user.id)
    .order('createdAt', { ascending: false })

  if (error) {
    console.error('Error fetching forms:', error)
  }

  return (
    <DashboardLayout user={{ email: user.email || '', name: user.user_metadata?.name || user.email }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Forms</h1>
            <p className="mt-2 text-gray-600">Manage and view all your feedback forms</p>
          </div>
          <Link
            href="/dashboard/forms/create"
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          >
            Create New Form
          </Link>
        </div>
        
        {forms && forms.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {forms.map((form) => (
              <div key={form.id} className="bg-white p-6 rounded-lg shadow border hover:border-indigo-500 transition-colors">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{form.title}</h3>                  <span className={`text-xs px-2 py-1 rounded ${
                    form.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {form.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{form.question}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                    {form.type}
                  </span>
                  <span className="text-sm font-medium text-indigo-600">
                    {form.responses?.[0]?.count || 0} responses
                  </span>
                </div>
                
                <div className="space-y-2">
                  <Link
                    href={`/dashboard/forms/${form.slug}`}
                    className="block w-full text-center px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                  >
                    View Details
                  </Link>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      href={`/dashboard/forms/${form.slug}/edit`}
                      className="text-center px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/forms/${form.slug}`}
                      className="text-center px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                      target="_blank"
                    >
                      Public Link
                    </Link>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Created {new Date(form.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-12">
            <div className="text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>              <h3 className="text-xl font-medium text-gray-900 mb-2">No forms yet</h3>
              <p className="text-gray-500 mb-6">
                Create your first feedback form to start collecting customer insights and testimonials.
              </p>
              <Link
                href="/dashboard/forms/create"
                className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Create Your First Form
              </Link>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}