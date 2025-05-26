import { Metadata } from 'next'
import { redirect } from 'next/navigation'

interface TestimonialPageProps {
  params: { id: string }
  searchParams: {
    feedback?: string
    rating?: string
    name?: string
    business?: string
  }
}

export async function generateMetadata({ params, searchParams }: TestimonialPageProps): Promise<Metadata> {
  const feedback = searchParams.feedback || 'Great service!'
  const rating = searchParams.rating || '5'
  const customerName = searchParams.name || 'A satisfied customer'
  const businessName = searchParams.business || 'Our Business'
  
  const title = `${businessName} - ${rating}/5 Stars`
  const description = `"${feedback}" - ${customerName}`

  // Determine siteOrigin. Use NEXT_PUBLIC_APP_URL or fallback for local dev.
  // VERCEL_URL includes http/https, NEXT_PUBLIC_VERCEL_URL is just the domain.
  // For server-side generation, VERCEL_URL is preferred if available and correctly prefixed.
  // For simplicity and consistency with typical Next.js setups, we'll use NEXT_PUBLIC_APP_URL.
  const siteOrigin = process.env.NEXT_PUBLIC_APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');

  const imageGenParams = new URLSearchParams();
  if (searchParams.feedback) imageGenParams.set('feedback', searchParams.feedback);
  if (searchParams.rating) imageGenParams.set('rating', searchParams.rating);
  if (searchParams.name) imageGenParams.set('name', searchParams.name);
  if (searchParams.business) imageGenParams.set('business', searchParams.business);
  imageGenParams.set('download', 'true'); // Or perhaps false if we just want to display it
  imageGenParams.set('format', 'facebook'); // For 1200x630, suitable for OG images

  const imageUrl = `${siteOrigin}/api/testimonials?${imageGenParams.toString()}`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${siteOrigin}/testimonial/${params.id}`, // Use siteOrigin
      siteName: 'FeedbackHub',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `Customer testimonial for ${businessName}`,
        },
      ],
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    // Add additional meta tags for better compatibility
    other: {
      'fb:app_id': '12345', // You can add your actual Facebook App ID here if you have one
      'og:image:type': 'image/png',
      'og:image:width': '1200',
      'og:image:height': '630',
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
