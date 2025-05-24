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
          <button className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition">
            Get Started
          </button>
          <button className="px-6 py-3 border border-border rounded-md hover:bg-accent transition">
            Learn More
          </button>
        </div>
      </div>
    </main>
  )
}
