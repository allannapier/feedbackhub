/**
 * Get the base URL from request headers
 * This ensures the URL works across different environments (localhost, staging, production)
 */
export function getBaseUrl(request?: Request): string {
  if (typeof window !== 'undefined') {
    // Client side
    return window.location.origin
  }
  
  if (request) {
    // Server side with request
    const host = request.headers.get('host')
    const protocol = request.headers.get('x-forwarded-proto') || 'https'
    return `${protocol}://${host}`
  }
  
  // Fallback to environment variable
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

/**
 * Generate a public form URL dynamically
 */
export function getFormUrl(slug: string, request?: Request): string {
  const baseUrl = getBaseUrl(request)
  return `${baseUrl}/forms/${slug}`
}
