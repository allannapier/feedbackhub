import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold text-center mb-8">
          Welcome to FeedbackHub
        </h1>
        <p className="text-center text-lg text-muted-foreground mb-8">
          Turn customer feedback into social proof with one click
        </p>
        <div className="flex gap-4 justify-center">
          <Link 
            href="/auth"
            className="px-6 py-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>
          <Link 
            href="/demo"
            className="px-6 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition"
          >
            See Demo
          </Link>
        </div>
      </div>
    </main>
  )
}
