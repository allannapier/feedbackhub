import { Metadata } from 'next'
import { redirect } from 'next/navigation'

interface TestimonialPageProps {
  params: { id: string }
  searchParams: {
    feedback?: string;
    rating?: string;
    name?: string;
    company?: string;
    business?: string;
    formType?: string;
  }
}

export async function generateMetadata({ params, searchParams }: TestimonialPageProps): Promise<Metadata> {
  const feedback = searchParams.feedback || 'Great service!'
  const rating = searchParams.rating || '5'
  const customerName = searchParams.name || 'A satisfied customer'
  const businessName = searchParams.business || 'Our Business'
  const formType = searchParams.formType || 'rating'
  
  const title = `${businessName} - ${rating}/${formType === 'nps' ? '10' : '5'} ${formType === 'nps' ? 'Score' : 'Stars'}`
  const description = `"${feedback}" - ${customerName}`

  // Build URL with query params for the OG image
  const ogImageParams = new URLSearchParams()
  if (searchParams.feedback) ogImageParams.set('feedback', searchParams.feedback)
  if (searchParams.rating) ogImageParams.set('rating', searchParams.rating)
  if (searchParams.name) ogImageParams.set('name', searchParams.name)
  if (searchParams.company) ogImageParams.set('company', searchParams.company)
  if (searchParams.business) ogImageParams.set('business', searchParams.business)
  if (searchParams.formType) ogImageParams.set('formType', searchParams.formType)
  
  // Use the dedicated og-image route for better reliability
  const imageUrl = `/testimonial/${params.id}/og-image?${ogImageParams.toString()}`;
  
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${businessName} testimonial from ${customerName}`,
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
  }
}

export default function TestimonialPage({ params, searchParams }: TestimonialPageProps) {
  const feedback = searchParams.feedback || 'Great service!'
  const rating = parseInt(searchParams.rating || '5', 10)
  const customerName = searchParams.name || 'A satisfied customer'
  const customerCompany = searchParams.company || ''
  const businessName = searchParams.business || 'Our Business'
  const formType = searchParams.formType || 'rating'; // Read formType for display logic, default to 'rating'

  let ratingDisplay;
  if (formType === 'nps') {
    ratingDisplay = <div className="text-4xl text-gray-800 mb-6">{rating}/10</div>;
  } else { // Default to 5-star rating
    // Ensure star characters are used directly for potentially better rendering
    const starsFilled = '★'.repeat(Math.max(0, Math.min(5, rating)));
    const starsEmpty = '☆'.repeat(Math.max(0, 5 - Math.min(5, rating)));
    ratingDisplay = <div className="text-4xl text-yellow-400 mb-6">{starsFilled}{starsEmpty}</div>;
  }
  
  const displayFeedback = feedback.startsWith('"') && feedback.endsWith('"') ? feedback : `"${feedback}"`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-700 flex items-center justify-center p-8">
      <div className="bg-white rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">{businessName}</h1>
          {/* Removed the static large quote div that was here */}
          <p className="text-2xl text-gray-700 italic mb-8 leading-relaxed">{displayFeedback}</p>
          {ratingDisplay}
          <p className="text-xl text-gray-600 font-semibold">— {customerName}</p>
          {customerCompany && (
            <p className="text-lg text-gray-500 mt-1">{customerCompany}</p>
          )}
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
