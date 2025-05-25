'use client'

import { useState, useEffect } from 'react'

/**
 * Custom hook to get the current base URL dynamically
 * This ensures URLs work correctly across different environments
 */
export function useBaseUrl(): string {
  const [baseUrl, setBaseUrl] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setBaseUrl(window.location.origin)
    }
  }, [])

  return baseUrl
}

/**
 * Custom hook to generate form URLs dynamically
 */
export function useFormUrl(slug: string): string {
  const baseUrl = useBaseUrl()
  return baseUrl ? `${baseUrl}/forms/${slug}` : ''
}
