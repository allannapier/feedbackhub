# Getting Started with FeedbackHub

## Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works)
- A Vercel account for deployment

## Quick Start

1. **Clone and install:**
```bash
cd /Users/allannapier/code/FeedbackHub
npm install
```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Copy your project URL and anon key
   - Get your database connection string

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. **Set up database:**
```bash
npm run prisma:generate
npm run prisma:migrate
```

5. **Start development:**
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app!

## Project Structure

```
FeedbackHub/
├── src/
│   ├── app/          # Next.js app router pages
│   ├── components/   # Reusable components
│   ├── lib/         # Utilities and configs
│   └── types/       # TypeScript types
├── prisma/          # Database schema
├── docs/            # Documentation
└── public/          # Static assets
```

## Next Steps

1. Set up authentication pages
2. Create form builder interface
3. Implement response collection
4. Add social sharing features

See [docs/implementation-plan.md](docs/implementation-plan.md) for the full roadmap.
