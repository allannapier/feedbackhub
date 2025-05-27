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
  
  const title = `${businessName} - ${rating}/5 Stars Customer Review`
  const description = `"${feedback}" - ${customerName}. See what our customers are saying about ${businessName}.`
  
  // Base URL for the Open Graph URL
  const baseUrl = 'https://feedbackhub-git-main-hobby-projects-8e6b5aff.vercel.app'
  const pageUrl = `${baseUrl}/testimonial/${params.id}?${new URLSearchParams(searchParams as any).toString()}`
  
  // Generate a simple OG image URL that will create a visual representation
  const ogImageUrl = `${baseUrl}/api/og-testimonial?feedback=${encodeURIComponent(feedback.substring(0, 100))}&rating=${rating}&name=${encodeURIComponent(customerName)}&business=${encodeURIComponent(businessName)}`
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: pageUrl,
      siteName: 'FeedbackHub',
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Customer testimonial for ${businessName}`,
        },
      ],
      type: 'article',
      locale: 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImageUrl],
      creator: '@feedbackhub',
      site: '@feedbackhub',
    },
    // Essential meta tags for Facebook
    other: {
      'og:type': 'article',
      'og:locale': 'en_US',
      'og:site_name': 'FeedbackHub',
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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-black/10"></div>
      <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/20 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      
      {/* Main testimonial card */}
      <div className="relative z-10 bg-white/95 backdrop-blur-lg rounded-3xl shadow-2xl p-8 md:p-12 max-w-4xl w-full text-center border border-white/20">
        {/* Large decorative quote */}
        <div className="text-6xl md:text-8xl text-blue-500/30 font-serif leading-none mb-6">"</div>
        
        {/* Business name header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            {businessName}
          </h1>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
        </div>
        
        {/* Feedback content */}
        <div className="mb-8">
          <p className="text-xl md:text-3xl text-gray-700 italic leading-relaxed font-light max-w-3xl mx-auto">
            {feedback}
          </p>
        </div>
        
        {/* Star rating */}
        <div className="mb-8">
          <div className="text-4xl md:text-6xl text-yellow-400 mb-4 tracking-wider drop-shadow-lg">
            {stars}
          </div>
          <div className="text-lg md:text-xl text-gray-600 font-semibold">
            {rating} out of 5 stars
          </div>
        </div>
        
        {/* Customer attribution */}
        <div className="mb-12">
          <div className="text-xl md:text-2xl text-gray-800 font-semibold mb-2">
            — {customerName}
          </div>
          <div className="text-sm text-gray-500 uppercase tracking-wide">
            Verified Customer Review
          </div>
        </div>
        
        {/* Call to action section */}
        <div className="border-t border-gray-200 pt-8">
          <div className="mb-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">
              Love what you see? Get your own feedback system!
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Join thousands of businesses using FeedbackHub to collect reviews and create beautiful testimonials like this one.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://feedbackhub-git-main-hobby-projects-8e6b5aff.vercel.app"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Create Your Feedback Forms
            </a>
            <div className="text-sm text-gray-500">
              Free to start • No credit card required
            </div>
          </div>
        </div>
        
        {/* Branding */}
        <div className="mt-8 pt-6 border-t border-gray-100">
          <div className="flex items-center justify-center gap-2 text-gray-400 text-sm">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            Powered by FeedbackHub
          </div>
        </div>
      </div>
    </div>
  )
}
