import { createClient } from '../supabase/server'

export interface UsageLimits {
  feedbackRequests: number // -1 for unlimited
  socialShares: number // -1 for unlimited
  platforms: string[]
}

export interface UsageRecord {
  id: string
  userId: string
  month: string
  feedbackRequests: number
  socialShares: number
  createdAt: string
  updatedAt: string
}

export interface UserUsage {
  currentMonth: UsageRecord | null
  limits: UsageLimits
  canCreateFeedbackRequest: boolean
  canShareSocial: boolean
  remainingFeedbackRequests: number
  remainingSocialShares: number
}

export const PLAN_LIMITS = {
  free: {
    feedbackRequests: 5,
    socialShares: 5,
    platforms: ['facebook', 'linkedin', 'twitter', 'x']
  },
  pro: {
    feedbackRequests: -1, // unlimited
    socialShares: -1, // unlimited
    platforms: ['facebook', 'linkedin', 'twitter', 'x', 'instagram']
  }
}

export function getCurrentMonth(): string {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
}

export function getPlanLimits(plan: string): UsageLimits {
  return PLAN_LIMITS[plan as keyof typeof PLAN_LIMITS] || PLAN_LIMITS.free
}

export function calculateUserUsage(
  plan: string,
  currentMonthRecord: UsageRecord | null
): UserUsage {
  const limits = getPlanLimits(plan)
  const currentUsage = currentMonthRecord || {
    id: '',
    userId: '',
    month: getCurrentMonth(),
    feedbackRequests: 0,
    socialShares: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  const canCreateFeedbackRequest = limits.feedbackRequests === -1 || 
    currentUsage.feedbackRequests < limits.feedbackRequests

  const canShareSocial = limits.socialShares === -1 || 
    currentUsage.socialShares < limits.socialShares

  const remainingFeedbackRequests = limits.feedbackRequests === -1 
    ? -1 
    : Math.max(0, limits.feedbackRequests - currentUsage.feedbackRequests)

  const remainingSocialShares = limits.socialShares === -1 
    ? -1 
    : Math.max(0, limits.socialShares - currentUsage.socialShares)

  return {
    currentMonth: currentUsage,
    limits,
    canCreateFeedbackRequest,
    canShareSocial,
    remainingFeedbackRequests,
    remainingSocialShares
  }
}

export async function getUserUsage(userId: string): Promise<UserUsage> {
  const supabase = await createClient()
  
  // Get user's plan
  const { data: user } = await supabase
    .from('User')
    .select('plan')
    .eq('id', userId)
    .single()

  const plan = user?.plan || 'free'
  const currentMonth = getCurrentMonth()

  // Get current month usage
  const { data: usageRecord } = await supabase
    .from('UsageRecord')
    .select('*')
    .eq('userId', userId)
    .eq('month', currentMonth)
    .single()

  return calculateUserUsage(plan, usageRecord)
}
