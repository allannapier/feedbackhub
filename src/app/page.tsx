import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <div className="flex items-center">
            {/* Professional Logo */}
            <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">FeedbackHub</span>
          </div>
        </div>
        <div className="flex lg:flex-1 lg:justify-end gap-4">
          <Link 
            href="/auth" 
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600 transition-colors"
          >
            Sign In
          </Link>
          <Link 
            href="/auth" 
            className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 hover:shadow-md"
          >
            Start Free Trial
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative isolate px-6 pt-8 lg:px-8">
        {/* Background decoration */}
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80" aria-hidden="true">
          <div className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-indigo-200 to-purple-300 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"></div>
        </div>
        <div className="mx-auto max-w-5xl py-12 sm:py-16 lg:py-20">
          <div className="text-center">
            {/* Trust Badge */}
            <div className="mb-8 flex justify-center">
              <div className="rounded-full bg-indigo-100 px-4 py-2 text-sm font-medium text-indigo-700">
                ✨ Free to start • No credit card required
              </div>
            </div>
            
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-7xl lg:text-8xl">
              Turn customer feedback into
              <span className="text-indigo-600 block"> social proof</span>
            </h1>
            <p className="mt-8 text-xl leading-8 text-gray-600 max-w-3xl mx-auto">
              Create beautiful feedback forms, collect customer responses, and automatically generate 
              eye-catching testimonials for social media. Build trust and attract more customers.
            </p>
            <div className="mt-12 flex items-center justify-center gap-x-6">
              <Link
                href="/auth"
                className="group flex items-center gap-2 rounded-lg bg-indigo-600 px-8 py-4 text-lg font-semibold text-white shadow-lg hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-200 hover:shadow-xl hover:scale-105"
              >
                Start Collecting Feedback
                <svg className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>              <Link
                href="#how-it-works"
                className="flex items-center gap-2 text-lg font-semibold leading-6 text-gray-700 hover:text-indigo-600 transition-colors"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                See How It Works
              </Link>
            </div>
          </div>
          
          {/* Enhanced Mock Interface */}
          <div className="mt-20 flow-root sm:mt-28">
            <div className="mx-auto max-w-2xl">
              <div className="rounded-2xl bg-white p-8 shadow-2xl ring-1 ring-gray-200 hover:shadow-3xl transition-shadow duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                      <svg className="h-4 w-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900">How was your experience?</h3>
                  </div>
                  <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                    Live Preview
                  </span>
                </div>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Your email (optional)</label>
                    <input 
                      type="email" 
                      placeholder="john@example.com" 
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      disabled
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">Rate your experience</label>
                    <div className="flex justify-center gap-2">
                      {[1,2,3,4,5].map(i => (
                        <button key={i} className={`text-3xl transition-all duration-200 hover:scale-110 ${i <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tell us more (optional)</label>
                    <textarea 
                      placeholder="The service was amazing! Really exceeded my expectations..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm h-20 resize-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                      disabled
                    />
                  </div>
                  
                  <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-indigo-500 transition-colors shadow-sm">
                    Submit Feedback
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Bottom background decoration */}
        <div className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
          <div className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-cyan-200 to-indigo-300 opacity-20 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"></div>
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="py-24 sm:py-32 bg-gray-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">How It Works</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              From feedback to social proof in 3 simple steps
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <div className="grid max-w-xl grid-cols-1 gap-12 lg:max-w-none lg:grid-cols-3">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Create Your Form</h3>
                <p className="text-gray-600 leading-7">
                  Design beautiful feedback forms with our no-code builder. Choose from templates or customize your own in minutes.
                </p>
              </div>
              
              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Collect Responses</h3>
                <p className="text-gray-600 leading-7">
                  Share your form via email, QR codes, or embed it on your website. Watch the feedback roll in automatically.
                </p>
              </div>
              
              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Share Testimonials</h3>
                <p className="text-gray-600 leading-7">
                  Positive feedback automatically becomes beautiful testimonial graphics ready for social media sharing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600">Features</h2>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
              Everything you need to collect and share feedback
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col group">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-600 group-hover:bg-indigo-700 transition-colors shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </div>
                  No-Code Form Builder
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Create professional feedback forms in minutes with our drag-and-drop interface. No technical skills required.</p>
                </dd>
              </div>
              
              <div className="flex flex-col group">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-600 group-hover:bg-indigo-700 transition-colors shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  Automated Social Posts
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Transform 5-star reviews into eye-catching graphics for Twitter, LinkedIn, and Instagram with one click.</p>
                </dd>
              </div>
              
              <div className="flex flex-col group">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-12 w-12 flex items-center justify-center rounded-xl bg-indigo-600 group-hover:bg-indigo-700 transition-colors shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  Smart Insights
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Track response rates, sentiment trends, and identify your biggest advocates with detailed analytics.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Social Proof Section */}
      <div className="py-24 sm:py-32 bg-indigo-600">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Join thousands of businesses building trust through feedback
            </h2>
            <p className="mt-6 text-lg leading-8 text-indigo-200">
              Start collecting feedback and creating social proof today. No credit card required.
            </p>
            <div className="mt-10">
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-8 py-4 text-lg font-semibold text-indigo-600 shadow-lg hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-200 hover:shadow-xl hover:scale-105"
              >
                Get Started Free
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <span className="text-xs leading-5 text-gray-400">v1.0.0</span>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; 2025 FeedbackHub. Built with ❤️ for better customer relationships.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
