import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BillingPage } from './BillingPage'

export default async function BillingDashboard() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    redirect('/auth')
  }

  // Get user's billing information
  const { data: userRecord } = await supabase
    .from('User')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <BillingPage 
      user={userRecord} 
      email={user.email!}
    />
  )
}
