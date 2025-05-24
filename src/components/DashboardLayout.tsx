'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Navbar } from './Navbar'

interface DashboardLayoutProps {
  children: React.ReactNode
  user?: {
    email: string
    name?: string
  }
}

export function DashboardLayout({ children, user: userProp }: DashboardLayoutProps) {
  const [user, setUser] = useState(userProp)

  useEffect(() => {
    if (!userProp) {
      // Fetch user if not provided
      const fetchUser = async () => {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          setUser({
            email: user.email || '',
            name: user.user_metadata?.name || user.email
          })
        }
      }
      fetchUser()
    }
  }, [userProp])

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />
      <main className="py-6">
        {children}
      </main>
    </div>
  )
}
