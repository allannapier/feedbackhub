import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { CopyButton } from '@/components/CopyButton'
import { ActionsSidebar } from '@/components/ActionsSidebar'
import FormDetailClient from './FormDetailClient'

export default async function FormDetailPage({ 
  params 
}: { 
  params: { slug: string } 
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  // Fetch form details
  const { data: form, error } = await supabase
    .from('Form')
    .select(`
      *,
      responses:Response(
        id,
        rating,
        text,
        answer,
        respondentName,
        respondentEmail,
        shared,
        createdAt
      )
    `)
    .eq('slug', params.slug)
    .eq('userId', user.id)
    .single()

  if (error || !form) {
    redirect('/dashboard')
  }

  const publicUrl = `${process.env.NEXT_PUBLIC_APP_URL}/forms/${form.slug}`

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div>
            <Link href="/dashboard" className="text-indigo-600 hover:text-indigo-800 text-sm">
              ← Back to Dashboard
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mt-2">{form.title}</h1>
          </div>
          <div className="flex gap-4">
            <Link
              href={publicUrl}
              target="_blank"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              View Public Form
            </Link>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
              Edit Form
            </button>
          </div>
        </div>
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Overview */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Form Overview</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Question</label>
                    <p className="mt-1 text-gray-900">{form.question}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Response Type</label>
                    <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {form.type}
                    </span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Public URL</label>
                    <div className="mt-1 flex">
                      <input
                        type="text"
                        value={publicUrl}
                        readOnly
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
                      />
                      <CopyButton text={publicUrl} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Responses */}
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">
                  Responses ({form.responses?.length || 0})
                </h2>
                {form.responses && form.responses.length > 0 ? (
                  <FormDetailClient form={form} />
                ) : (
                  <p className="text-gray-500 text-center py-8">No responses yet</p>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium mb-4">Quick Stats</h3>
                <div className="space-y-4">
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">{form.responses?.length || 0}</p>
                    <p className="text-sm text-gray-600">Total Responses</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {form.responses?.filter((r: any) => r.shared).length || 0}
                    </p>
                    <p className="text-sm text-gray-600">Shared as Social Proof</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">
                      {form.responses?.length > 0 ? 
                        (form.responses.reduce((sum: number, r: any) => sum + (r.rating || 0), 0) / form.responses.length).toFixed(1)
                        : 'N/A'
                      }
                    </p>
                    <p className="text-sm text-gray-600">Average Rating</p>
                  </div>
                </div>
              </div>

              <ActionsSidebar form={form} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
