import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createStripeCustomer, createCheckoutSession } from '@/lib/stripe/helpers'

export async function POST(request: NextRequest) {
  try {
    console.log('Checkout API called')
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.log('No user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('User authenticated:', user.email)

    const { priceId } = await request.json()
    console.log('Received price ID:', priceId)

    if (!priceId) {
      console.log('No price ID provided')
      return NextResponse.json({ error: 'Price ID required' }, { status: 400 })
    }

    // Validate Stripe secret key
    if (!process.env.STRIPE_SECRET_KEY) {
      console.error('STRIPE_SECRET_KEY not configured')
      return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 })
    }

    // Get or create user record
    console.log('Looking for user record in database')
    let { data: userRecord } = await supabase
      .from('User')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!userRecord) {
      console.log('Creating new user record')
      // Create user record
      const { data: newUser, error: createError } = await supabase
        .from('User')
        .insert({
          id: user.id,
          email: user.email!,
          name: user.user_metadata?.name || user.email?.split('@')[0]
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating user:', createError)
        return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
      }
      userRecord = newUser
    }

    console.log('User record found/created:', userRecord.email)

    // Create Stripe customer if needed
    let customerId = userRecord.customerId
    if (!customerId) {
      console.log('Creating Stripe customer')
      try {
        const customer = await createStripeCustomer(user.email!, userRecord.name)
        customerId = customer.id
        console.log('Stripe customer created:', customerId)

        // Update user record with customer ID
        await supabase
          .from('User')
          .update({ customerId })
          .eq('id', user.id)
      } catch (stripeError) {
        console.error('Error creating Stripe customer:', stripeError)
        return NextResponse.json({ error: 'Failed to create Stripe customer' }, { status: 500 })
      }
    } else {
      console.log('Using existing Stripe customer:', customerId)
    }

    // Create checkout session
    console.log('Creating checkout session')
    const successUrl = `${request.nextUrl.origin}/dashboard?success=true`
    const cancelUrl = `${request.nextUrl.origin}/dashboard/billing?canceled=true`

    try {
      const session = await createCheckoutSession(
        customerId,
        priceId,
        successUrl,
        cancelUrl
      )

      console.log('Checkout session created successfully:', session.id)
      return NextResponse.json({ sessionId: session.id })
    } catch (checkoutError) {
      console.error('Error creating checkout session:', checkoutError)
      return NextResponse.json({ 
        error: 'Failed to create checkout session', 
        details: checkoutError instanceof Error ? checkoutError.message : String(checkoutError)
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
