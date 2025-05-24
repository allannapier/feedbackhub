# FeedbackHub

> Quick feedback collection & social sharing platform - Turn customer feedback into social proof with one click

## 🚀 Overview

FeedbackHub is a simple, powerful tool that helps businesses:
- Collect customer feedback with one-question surveys
- Automatically generate shareable social media content from positive feedback
- Send feedback requests to customers via email/SMS
- Display testimonials on their website
- Track feedback analytics and trends

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes + Prisma
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **Deployment**: Vercel
- **Image Generation**: Canvas API / Vercel OG
- **Email**: Resend
- **SMS**: Twilio (optional)

## 📁 Project Structure

```
FeedbackHub/
├── docs/                    # Documentation
│   ├── implementation-plan.md
│   ├── api-design.md
│   └── features/
├── src/
│   ├── app/                # Next.js App Router
│   ├── components/         # React components
│   ├── lib/               # Utilities & configs
│   └── types/             # TypeScript types
├── prisma/                # Database schema
├── public/                # Static assets
└── tests/                 # Test files
```

## 🚦 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run development server: `npm run dev`
5. Open [http://localhost:3000](http://localhost:3000)

## 📋 Features

### MVP Features (v1.0)
- [ ] User authentication
- [ ] Create feedback forms
- [ ] Collect responses
- [ ] Generate shareable testimonial cards
- [ ] Basic analytics dashboard
- [ ] Embeddable widget

### Future Features
- [ ] Email/SMS feedback requests
- [ ] Automated social sharing
- [ ] Advanced analytics
- [ ] API access
- [ ] White-label options

## 📊 Implementation Timeline

See [Implementation Plan](./docs/implementation-plan.md) for detailed timeline and milestones.

## 🤝 Contributing

This project is currently in development. Contribution guidelines coming soon.

## 📄 License

[MIT License](LICENSE)
