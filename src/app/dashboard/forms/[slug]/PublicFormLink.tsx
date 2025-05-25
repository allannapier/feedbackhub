'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

interface PublicFormLinkProps {
  slug: string
}

export default function PublicFormLink({ slug }: PublicFormLinkProps) {
  const [publicUrl, setPublicUrl] = useState('')

  useEffect(() => {
    // Generate the URL dynamically on the client side
    const baseUrl = window.location.origin
    const url = `${baseUrl}/forms/${slug}`
    setPublicUrl(url)
  }, [slug])

  if (!publicUrl) {
    return (
      <div className="px-4 py-2 bg-gray-300 text-gray-600 rounded-md animate-pulse">
        Loading...
      </div>
    )
  }

  return (
    <Link
      href={publicUrl}
      target="_blank"
      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
    >
      View Public Form
    </Link>
  )
}
