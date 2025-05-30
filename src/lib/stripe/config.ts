import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-05-28.basil',
  typescript: true,
})

export const STRIPE_CONFIG = {
  currency: 'gbp',
  plans: {
    free: {
      name: 'Free',
      price: 0,
      priceId: null,
      limits: {
        feedbackRequests: 5,
        socialShares: 5,
        platforms: ['facebook', 'linkedin', 'twitter', 'x'] // X is Twitter's new name
      }
    },
    pro: {
      name: 'Pro',
      price: 299, // £2.99 in pence
      priceId: process.env.STRIPE_PRO_PRICE_ID || process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
      limits: {
        feedbackRequests: -1, // unlimited
        socialShares: -1, // unlimited
        platforms: ['facebook', 'linkedin', 'twitter', 'x', 'instagram']
      }
    }
  }
}

export type PlanType = keyof typeof STRIPE_CONFIG.plans
