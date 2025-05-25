import { createClient } from '../supabase/server'
import { getCurrentMonth } from './utils'

export async function incrementFeedbackRequests(userId: string): Promise<boolean> {
  const supabase = await createClient()
  const currentMonth = getCurrentMonth()

  // Try to update existing record first
  const { data: existingRecord, error: fetchError } = await supabase
    .from('UsageRecord')
    .select('*')
    .eq('userId', userId)
    .eq('month', currentMonth)
    .single()

  if (existingRecord) {
    // Update existing record
    const { error } = await supabase
      .from('UsageRecord')
      .update({ 
        feedbackRequests: existingRecord.feedbackRequests + 1,
        updatedAt: new Date().toISOString()
      })
      .eq('id', existingRecord.id)

    return !error
  } else {
    // Create new record
    const { error } = await supabase
      .from('UsageRecord')
      .insert({
        userId,
        month: currentMonth,
        feedbackRequests: 1,
        socialShares: 0
      })

    return !error
  }
}

export async function incrementSocialShares(userId: string): Promise<boolean> {
  const supabase = await createClient()
  const currentMonth = getCurrentMonth()

  // Try to update existing record first
  const { data: existingRecord, error: fetchError } = await supabase
    .from('UsageRecord')
    .select('*')
    .eq('userId', userId)
    .eq('month', currentMonth)
    .single()

  if (existingRecord) {
    // Update existing record
    const { error } = await supabase
      .from('UsageRecord')
      .update({ 
        socialShares: existingRecord.socialShares + 1,
        updatedAt: new Date().toISOString()
      })
      .eq('id', existingRecord.id)

    return !error
  } else {
    // Create new record
    const { error } = await supabase
      .from('UsageRecord')
      .insert({
        userId,
        month: currentMonth,
        feedbackRequests: 0,
        socialShares: 1
      })

    return !error
  }
}
