import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createStripeCustomer, createCheckoutSession } from '@/lib/stripe/helpers'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { priceId } = await request.json()

    if (!priceId) {
      return NextResponse.json({ error: 'Price ID required' }, { status: 400 })
    }

    // Get or create user record
    let { data: userRecord } = await supabase
      .from('User')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!userRecord) {
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

    // Create Stripe customer if needed
    let customerId = userRecord.customerId
    if (!customerId) {
      const customer = await createStripeCustomer(user.email!, userRecord.name)
      customerId = customer.id

      // Update user record with customer ID
      await supabase
        .from('User')
        .update({ customerId })
        .eq('id', user.id)
    }

    // Create checkout session
    const successUrl = `${request.nextUrl.origin}/dashboard?success=true`
    const cancelUrl = `${request.nextUrl.origin}/dashboard/billing?canceled=true`

    const session = await createCheckoutSession(
      customerId,
      priceId,
      successUrl,
      cancelUrl
    )

    return NextResponse.json({ sessionId: session.id })
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}
