import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <div className="flex items-center">
            <span className="text-3xl">📝</span>
            <span className="ml-2 text-2xl font-bold text-gray-900">FeedbackHub</span>
          </div>
        </div>
        <div className="flex lg:flex-1 lg:justify-end gap-4">
          <Link 
            href="/auth" 
            className="text-sm font-semibold leading-6 text-gray-900 hover:text-indigo-600"
          >
            Sign In
          </Link>
          <Link 
            href="/auth" 
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Sign Up
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-4xl py-24 sm:py-32 lg:py-40">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Collect your 
              <span className="text-indigo-600"> feedback</span>
              <br />
              seamlessly
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600 max-w-2xl mx-auto">
              Easily integrate Nexx and start collecting feedback today. 
              Transform customer feedback into shareable social proof with one click.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/auth"
                className="flex items-center gap-2 rounded-md bg-indigo-600 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                <span>→</span>
                Get Started
              </Link>
              <Link
                href="https://github.com/allannapier/feedbackhub"
                className="flex items-center gap-2 text-base font-semibold leading-6 text-gray-900 hover:text-indigo-600"
              >
                <span>⚡</span>
                GitHub
              </Link>
            </div>
          </div>
          
          {/* Mock Interface */}
          <div className="mt-16 flow-root sm:mt-24">
            <div className="mx-auto max-w-lg">
              <div className="rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-900/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-semibold text-gray-900">Send us your feedback</h3>
                  <span className="text-sm text-gray-500">Quick</span>
                </div>
                <div className="space-y-3">
                  <input 
                    type="text" 
                    placeholder="Enter your email" 
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                    disabled
                  />
                  <div className="flex gap-1">
                    {[1,2,3,4,5].map(i => (
                      <button key={i} className="text-2xl text-gray-300">⭐</button>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 bg-gray-100 text-gray-400 px-4 py-2 rounded-md text-sm">
                      😡 Poor
                    </button>
                    <button className="flex-1 bg-indigo-600 text-white px-4 py-2 rounded-md text-sm">
                      😍 Amazing
                    </button>
                  </div>
                </div>
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
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to collect and share feedback
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                    <span className="text-white text-lg">📊</span>
                  </div>
                  Simple Forms
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Create beautiful feedback forms in minutes. No coding required.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                    <span className="text-white text-lg">🎨</span>
                  </div>
                  Social Sharing
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Turn positive feedback into beautiful social media posts automatically.</p>
                </dd>
              </div>
              <div className="flex flex-col">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-gray-900">
                  <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-indigo-600">
                    <span className="text-white text-lg">📈</span>
                  </div>
                  Analytics
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-gray-600">
                  <p className="flex-auto">Track feedback trends and measure customer satisfaction over time.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <span className="text-xs leading-5 text-gray-500">Development mode</span>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <p className="text-center text-xs leading-5 text-gray-500">
              &copy; 2025 FeedbackHub. Made with ❤️ for better feedback.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
