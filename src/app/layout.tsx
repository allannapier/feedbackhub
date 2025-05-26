import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'FeedbackHub - Turn Customer Feedback into Social Proof',
  description: 'Collect customer feedback and automatically transform positive reviews into shareable social media content.',
  keywords: 'feedback, testimonials, social media, customer reviews, social proof, marketing',
  authors: [{ name: 'FeedbackHub' }],
  creator: 'FeedbackHub',
  publisher: 'FeedbackHub',
  openGraph: {
    title: 'FeedbackHub - Turn Customer Feedback into Social Proof',
    description: 'Collect customer feedback and automatically transform positive reviews into shareable social media content.',
    url: 'https://feedbackhub-git-main-hobby-projects-8e6b5aff.vercel.app',
    siteName: 'FeedbackHub',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://feedbackhub-git-main-hobby-projects-8e6b5aff.vercel.app/api/testimonials?feedback=Amazing%20service!%20Highly%20recommend!&rating=5&name=Happy%20Customer&business=FeedbackHub&format=facebook&download=true',
        width: 1200,
        height: 630,
        alt: 'FeedbackHub - Customer Testimonials Made Social',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FeedbackHub - Turn Customer Feedback into Social Proof',
    description: 'Collect customer feedback and automatically transform positive reviews into shareable social media content.',
    creator: '@feedbackhub',
    images: ['https://feedbackhub-git-main-hobby-projects-8e6b5aff.vercel.app/api/testimonials?feedback=Amazing%20service!%20Highly%20recommend!&rating=5&name=Happy%20Customer&business=FeedbackHub&format=facebook&download=true'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code', // Add your actual verification code
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
