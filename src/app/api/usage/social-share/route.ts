import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getUserUsage } from '@/lib/usage/utils'
import { incrementSocialShares } from '@/lib/usage/tracking'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { platform } = await request.json()

    // Check usage limits before allowing share
    const usage = await getUserUsage(user.id)
    if (!usage.canShareSocial) {
      return NextResponse.json({ 
        error: 'Monthly social share limit reached. Please upgrade to Pro for unlimited shares.',
        usage: {
          remaining: usage.remainingSocialShares,
          limit: usage.limits.socialShares
        }
      }, { status: 429 })
    }

    // Check if platform is allowed for user's plan
    if (!usage.limits.platforms.includes(platform)) {
      return NextResponse.json({ 
        error: `${platform} sharing is only available on Pro plan. Please upgrade to access all platforms.`,
        allowedPlatforms: usage.limits.platforms
      }, { status: 403 })
    }

    // Increment usage counter
    const success = await incrementSocialShares(user.id)
    
    if (!success) {
      return NextResponse.json({ error: 'Failed to track usage' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Social share usage API error:', error)
    return NextResponse.json({ error: 'Failed to track social share' }, { status: 500 })
  }
}
