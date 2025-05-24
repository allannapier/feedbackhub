import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DashboardLayout } from '@/components/DashboardLayout'

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
    <DashboardLayout user={user}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your feedback forms and view analytics</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Existing Forms */}
          {forms && forms.map((form) => (
            <div key={form.id} className="bg-white p-6 rounded-lg shadow border hover:border-indigo-500 transition-colors">
              <h3 className="text-lg font-medium mb-2">{form.title}</h3>
              <p className="text-gray-600 text-sm mb-4 line-clamp-2">{form.question}</p>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                  {form.type}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  form.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {form.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="flex gap-2 mb-4">
                <Link
                  href={`/dashboard/forms/${form.slug}`}
                  className="flex-1 text-center px-3 py-2 bg-indigo-600 text-white text-sm rounded hover:bg-indigo-700"
                >
                  View Details
                </Link>
                <Link
                  href={`/dashboard/forms/${form.slug}/edit`}
                  className="flex-1 text-center px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-gray-50"
                >
                  Edit
                </Link>
              </div>
              <div className="text-xs text-gray-500">
                Created {new Date(form.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))}
          
          {/* Create New Form Card */}
          <div className="bg-white p-6 rounded-lg shadow border-2 border-dashed border-gray-300 hover:border-indigo-500 transition-colors">
            <div className="text-center">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">+</span>
              </div>
              <h3 className="text-lg font-medium mb-2">Create New Form</h3>
              <p className="text-gray-500 text-sm mb-4">Start collecting feedback from your customers</p>
              <Link
                href="/dashboard/forms/create"
                className="inline-block bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
              >
                Create Form
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
