import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import FormSubmission from './FormSubmission'

interface PageProps {
  params: {
    slug: string
  }
}

export default async function PublicFormPage({ params }: PageProps) {
  const supabase = await createClient()
  
  // Fetch the form by slug
  const { data: form, error } = await supabase
    .from('Form')
    .select(`
      *,
      user:User(name, email)
    `)
    .eq('slug', params.slug)
    .eq('isActive', true)
    .single()

  if (error || !form) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {form.title}
            </h1>
            <p className="text-lg text-gray-600 mb-6">
              {form.question}
            </p>
          </div>
          
          <FormSubmission form={form} />
        </div>
        
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            Powered by <span className="font-semibold">FeedbackHub</span>
          </p>
        </div>
      </div>
    </div>
  )
}
