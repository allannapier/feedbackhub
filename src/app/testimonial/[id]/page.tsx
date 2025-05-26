import { Metadata } from 'next'
import { redirect } from 'next/navigation'

interface TestimonialPageProps {
  params: { id: string }
  searchParams: {
    feedback?: string
    rating?: string
    name?: string
    business?: string
    tid?: string
  }
}

export async function generateMetadata({ params, searchParams }: TestimonialPageProps): Promise<Metadata> {
  const feedback = searchParams.feedback || 'Great service!'
  const rating = searchParams.rating || '5'
  const customerName = searchParams.name || 'A satisfied customer'
  const businessName = searchParams.business || 'Our Business'
  const testimonialId = searchParams.tid // Get stored testimonial ID
  
  const title = `${businessName} - ${rating}/5 Stars`
  const description = `"${feedback}" - ${customerName}`
  
  // Base URL for the Open Graph URL
  const baseUrl = 'https://feedbackhub-git-main-hobby-projects-8e6b5aff.vercel.app'
  
  // Try to use stored images if testimonialId is available
  let ogImageUrl = `${baseUrl}/api/og?feedback=${encodeURIComponent(feedback.substring(0, 120))}&rating=${rating}&name=${encodeURIComponent(customerName)}&business=${encodeURIComponent(businessName)}&platform=facebook`
  let linkedinImageUrl = `${baseUrl}/api/og?feedback=${encodeURIComponent(feedback.substring(0, 120))}&rating=${rating}&name=${encodeURIComponent(customerName)}&business=${encodeURIComponent(businessName)}&platform=linkedin`
  let twitterImageUrl = `${baseUrl}/api/og?feedback=${encodeURIComponent(feedback.substring(0, 80))}&rating=${rating}&name=${encodeURIComponent(customerName)}&business=${encodeURIComponent(businessName)}&platform=twitter`
  
  if (testimonialId) {
    // Use stored images from Supabase if available
    try {
      const supabaseUrl = 'https://fcedxvdoercnkyhnzwzf.supabase.co'
      ogImageUrl = `${supabaseUrl}/storage/v1/object/public/testimonials/testimonial-${testimonialId}-facebook.png`
      linkedinImageUrl = `${supabaseUrl}/storage/v1/object/public/testimonials/testimonial-${testimonialId}-linkedin.png`
      twitterImageUrl = `${supabaseUrl}/storage/v1/object/public/testimonials/testimonial-${testimonialId}-twitter.png`
    } catch (error) {
      console.log('Using fallback OG images')
    }
  }
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/testimonial/${params.id}`,
      siteName: 'FeedbackHub',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Customer testimonial for ${businessName}`,
          type: 'image/png',
        },
      ],
      type: 'article',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [twitterImageUrl],
      creator: '@feedbackhub',
      site: '@feedbackhub',
    },
    // Add additional meta tags for better compatibility
    other: {
      'og:image:type': 'image/png',
      'og:image:width': '1200',
      'og:image:height': '630',
      'og:image:secure_url': ogImageUrl,
      'twitter:image:alt': `Customer testimonial for ${businessName}`,
      // LinkedIn specific tags
      'linkedin:owner': 'FeedbackHub',
      'linkedin:image': linkedinImageUrl,
      // Facebook specific tags
      'fb:app_id': 'FeedbackHub',
      'article:author': businessName,
      'article:section': 'Customer Reviews',
    }
  }
}

export default function TestimonialPage({ params, searchParams }: TestimonialPageProps) {
  const feedback = searchParams.feedback || 'Great service!'
  const rating = parseInt(searchParams.rating || '5')
  const customerName = searchParams.name || 'A satisfied customer'
  const businessName = searchParams.business || 'Our Business'
  
  const stars = '★'.repeat(Math.max(1, Math.min(5, rating))) + '☆'.repeat(5 - Math.max(1, Math.min(5, rating)))
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{businessName}</h1>
          <div className="text-6xl text-blue-600 mb-6">"</div>
          <p className="text-2xl text-gray-700 italic mb-8 leading-relaxed">{feedback}</p>
          <div className="text-4xl text-yellow-400 mb-6">{stars}</div>
          <p className="text-xl text-gray-600 font-semibold">— {customerName}</p>
        </div>
        
        <div className="border-t pt-8">
          <p className="text-gray-500 mb-4">Powered by FeedbackHub</p>
          <div className="flex gap-4 justify-center">
            <a 
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Create Your Own Feedback Forms
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
