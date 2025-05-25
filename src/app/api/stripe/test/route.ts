import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe/config'

export async function GET(request: NextRequest) {
  try {
    // Test Stripe configuration
    const hasSecretKey = !!process.env.STRIPE_SECRET_KEY
    const hasPublishableKey = !!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
    const hasPriceId = !!process.env.STRIPE_PRO_PRICE_ID
    const hasPublicPriceId = !!process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID
    
    console.log('Stripe Environment Check:')
    console.log('- Secret Key:', hasSecretKey ? 'Present' : 'Missing')
    console.log('- Publishable Key:', hasPublishableKey ? 'Present' : 'Missing')
    console.log('- Price ID:', hasPriceId ? process.env.STRIPE_PRO_PRICE_ID : 'Missing')
    console.log('- Public Price ID:', hasPublicPriceId ? process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID : 'Missing')

    if (!hasSecretKey) {
      return NextResponse.json({ 
        error: 'Stripe Secret Key not configured',
        config: {
          hasSecretKey,
          hasPublishableKey,
          hasPriceId,
          hasPublicPriceId
        }
      }, { status: 500 })
    }

    // Test Stripe API connection
    try {
      const products = await stripe.products.list({ limit: 1 })
      console.log('Stripe API connection successful')
      
      // Test price retrieval if price ID exists
      let priceValid = false
      let priceDetails = null
      
      if (process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID) {
        try {
          priceDetails = await stripe.prices.retrieve(process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID)
          priceValid = true
          console.log('Price details:', {
            id: priceDetails.id,
            amount: priceDetails.unit_amount,
            currency: priceDetails.currency,
            type: priceDetails.type
          })
        } catch (priceError) {
          console.error('Error retrieving price:', priceError)
        }
      }

      return NextResponse.json({
        status: 'success',
        config: {
          hasSecretKey,
          hasPublishableKey,
          hasPriceId,
          hasPublicPriceId,
          priceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID,
          priceValid,
          priceDetails: priceValid ? {
            id: priceDetails?.id,
            amount: priceDetails?.unit_amount,
            currency: priceDetails?.currency,
            type: priceDetails?.type
          } : null
        },
        stripeApiConnected: true
      })
    } catch (stripeError) {
      console.error('Stripe API connection failed:', stripeError)
      return NextResponse.json({
        error: 'Failed to connect to Stripe API',
        details: stripeError instanceof Error ? stripeError.message : String(stripeError),
        config: {
          hasSecretKey,
          hasPublishableKey,
          hasPriceId,
          hasPublicPriceId
        }
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Stripe test error:', error)
    return NextResponse.json({
      error: 'Stripe test failed',
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 })
  }
}
