'use client'

import { useState, useEffect } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface FormUrlDisplayProps {
  slug: string
}

export default function FormUrlDisplay({ slug }: FormUrlDisplayProps) {
  const [publicUrl, setPublicUrl] = useState('')

  useEffect(() => {
    // Generate the URL dynamically on the client side
    const baseUrl = window.location.origin
    const url = `${baseUrl}/forms/${slug}`
    setPublicUrl(url)
  }, [slug])

  if (!publicUrl) {
    return <div className="animate-pulse bg-gray-200 h-10 rounded"></div>
  }

  return (
    <div className="bg-gray-50 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-medium text-gray-900 mb-2">Public Form URL</h3>
      <div className="flex items-center gap-2">
        <code className="flex-1 bg-white px-3 py-2 rounded border text-sm text-gray-700 break-all">
          {publicUrl}
        </code>
        <CopyButton text={publicUrl} />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Share this link to collect feedback from your customers
      </p>
    </div>
  )
}
