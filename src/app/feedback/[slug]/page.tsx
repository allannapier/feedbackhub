import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import FeedbackForm from './FeedbackForm'

interface FeedbackPageProps {
  params: {
    slug: string
  }
}

export default async function FeedbackPage({ params }: FeedbackPageProps) {
  const supabase = await createClient()
  
  const { data: form, error } = await supabase
    .from('Form')
    .select('*')
    .eq('slug', params.slug)
    .eq('isActive', true)
    .single()

  if (error || !form) {
    notFound()
  }

  // Convert to plain object to avoid serialization issues
  const formData = {
    id: form.id,
    title: form.title,
    question: form.question,
    type: form.type,
    settings: form.settings || {}
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {formData.title}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {formData.question}
          </p>
        </div>
        <FeedbackForm form={formData} />
      </div>
    </div>
  )
}
