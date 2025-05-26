'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect } from 'react'

interface SidebarLayoutProps {
  user?: {
    email: string
    name?: string
  }
  children: React.ReactNode
}

export function SidebarLayout({ user, children }: SidebarLayoutProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleSignOut = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: '📊' },
    { 
      name: 'Feedback Management',
      icon: '💬',
      children: [
        { name: 'Send Requests', href: '/dashboard/requests', icon: '📧' },
        { name: 'Request History', href: '/dashboard/requests/history', icon: '📋' },
        { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
      ]
    },
    { 
      name: 'Account',
      icon: '👤',
      children: [
        { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
        { name: 'Billing', href: '/dashboard/billing', icon: '💳' },
      ]
    },
    { name: 'Help', href: '/dashboard/help', icon: '❓' },
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-50 lg:block lg:relative lg:w-64`}>
        {/* Sidebar overlay (mobile) */}
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 lg:hidden" onClick={() => setSidebarOpen(false)} />
        
        {/* Sidebar content */}
        <div className="relative flex flex-col w-64 bg-white shadow-lg">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
            <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
              FeedbackHub
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.children ? (
                  <>
                    <div className="px-2 py-2 text-sm font-medium text-gray-600 uppercase tracking-wider">
                      <span className="mr-2">{item.icon}</span>
                      {item.name}
                    </div>
                    <div className="ml-4 space-y-1">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                            isActive(child.href)
                              ? 'bg-indigo-100 text-indigo-900'
                              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                          }`}
                        >
                          <span className="mr-3">{child.icon}</span>
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </>
                ) : (
                  <Link
                    href={item.href!}
                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md ${
                      isActive(item.href!)
                        ? 'bg-indigo-100 text-indigo-900'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <span className="mr-3">{item.icon}</span>
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>

          {/* User info */}
          {user && (
            <div className="flex-shrink-0 border-t border-gray-200 p-4">
              <div className="flex items-center">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {user.name || user.email.split('@')[0]}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {user.email}
                  </p>
                </div>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="ml-3 flex-shrink-0 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 disabled:opacity-50"
                  title="Sign Out"
                >
                  🚪
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="text-gray-500 hover:text-gray-600"
            >
              <span className="sr-only">Open sidebar</span>
              ☰
            </button>
            <Link href="/dashboard" className="text-xl font-bold text-indigo-600">
              FeedbackHub
            </Link>
            {user && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">
                  {user.name || user.email.split('@')[0]}
                </span>
                <button
                  onClick={handleSignOut}
                  disabled={isLoading}
                  className="text-gray-400 hover:text-gray-500 disabled:opacity-50"
                >
                  🚪
                </button>
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
