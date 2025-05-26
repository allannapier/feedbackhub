'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useState, useEffect, useRef } from 'react'

interface NavbarProps {
  user?: {
    email: string
    name?: string
  }
}

export function Navbar({ user }: NavbarProps) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const navRef = useRef<HTMLDivElement>(null)

  const handleSignOut = async () => {
    setIsLoading(true)
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = '/auth'
  }

  const navGroups = [
    {
      name: 'Dashboard',
      href: '/dashboard',
      icon: '📊',
      single: true
    },
    {
      name: 'Feedback',
      icon: '💬',
      items: [
        { name: 'Send Requests', href: '/dashboard/requests', icon: '📧' },
        { name: 'Request History', href: '/dashboard/requests/history', icon: '📋' },
        { name: 'Analytics', href: '/dashboard/analytics', icon: '📈' },
      ]
    },
    {
      name: 'Account',
      icon: '⚙️',
      items: [
        { name: 'Settings', href: '/dashboard/settings', icon: '⚙️' },
        { name: 'Billing', href: '/dashboard/billing', icon: '💳' },
      ]
    },
    {
      name: 'Help',
      href: '/dashboard/help',
      icon: '❓',
      single: true
    }
  ]

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    return pathname.startsWith(href)
  }

  const isGroupActive = (group: any) => {
    if (group.single) {
      return isActive(group.href)
    }
    return group.items?.some((item: any) => isActive(item.href))
  }

  const toggleDropdown = (groupName: string) => {
    console.log('Toggling dropdown:', groupName) // Debug log
    setActiveDropdown(prev => {
      const newState = prev === groupName ? null : groupName
      console.log('New dropdown state:', newState) // Debug log
      return newState
    })
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null)
      }
    }
    
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200" ref={navRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and main nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/dashboard" className="text-2xl font-bold text-indigo-600">
                FeedbackHub
              </Link>
            </div>
            
            {user && (
              <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                {navGroups.map((group) => (
                  <div key={group.name} className="relative">
                    {group.single ? (
                      <Link
                        href={group.href!}
                        className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium ${
                          isActive(group.href!)
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        <span className="mr-2">{group.icon}</span>
                        {group.name}
                      </Link>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleDropdown(group.name)
                        }}
                        className={`inline-flex items-center px-3 py-2 border-b-2 text-sm font-medium focus:outline-none ${
                          isGroupActive(group)
                            ? 'border-indigo-500 text-gray-900'
                            : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        <span className="mr-2">{group.icon}</span>
                        {group.name}
                        <span className={`ml-1 text-xs transition-transform duration-200 ${
                          activeDropdown === group.name ? 'rotate-180' : ''
                        }`}>▼</span>
                      </button>
                    )}

                    {/* Dropdown menu - Enhanced visibility */}
                    {!group.single && activeDropdown === group.name && (
                      <div 
                        className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-[1000]"
                        style={{ zIndex: 1000 }}
                      >
                        <div className="py-2">
                          {group.items?.map((item) => (
                            <Link
                              key={item.name}
                              href={item.href}
                              className={`flex items-center px-4 py-3 text-sm hover:bg-gray-50 transition-colors ${
                                isActive(item.href)
                                  ? 'bg-indigo-50 text-indigo-700 border-r-2 border-indigo-500'
                                  : 'text-gray-700'
                              }`}
                              onClick={() => setActiveDropdown(null)}
                            >
                              <span className="mr-3">{item.icon}</span>
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User menu */}
          {user ? (
            <div className="flex items-center">
              <div className="relative">
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    toggleDropdown('user')
                  }}
                  className="flex items-center space-x-2 text-sm text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md focus:outline-none"
                >
                  <span>Welcome, {user.name || user.email.split('@')[0]}</span>
                  <span className={`text-xs transition-transform duration-200 ${
                    activeDropdown === 'user' ? 'rotate-180' : ''
                  }`}>▼</span>
                </button>

                {/* User dropdown - Enhanced visibility */}
                {activeDropdown === 'user' && (
                  <div 
                    className="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-xl ring-1 ring-black ring-opacity-5 z-[1000]"
                    style={{ zIndex: 1000 }}
                  >
                    <div className="py-2">
                      <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-100">
                        {user.email}
                      </div>
                      <Link
                        href="/dashboard/settings"
                        className="flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <span className="mr-3">⚙️</span>
                        Settings
                      </Link>
                      <button
                        onClick={() => {
                          setActiveDropdown(null)
                          handleSignOut()
                        }}
                        disabled={isLoading}
                        className="w-full text-left flex items-center px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition-colors"
                      >
                        <span className="mr-3">🚪</span>
                        {isLoading ? 'Signing out...' : 'Sign Out'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex items-center">
              <Link
                href="/auth"
                className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium"
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {user && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {navGroups.map((group) => (
              <div key={group.name}>
                {group.single ? (
                  <Link
                    href={group.href!}
                    className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                      isActive(group.href!)
                        ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    }`}
                  >
                    <span className="mr-2">{group.icon}</span>
                    {group.name}
                  </Link>
                ) : (
                  <>
                    <div className="pl-3 pr-4 py-2 text-base font-medium text-gray-400 border-l-4 border-transparent">
                      <span className="mr-2">{group.icon}</span>
                      {group.name}
                    </div>
                    {group.items?.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={`block pl-8 pr-4 py-2 border-l-4 text-sm ${
                          isActive(item.href)
                            ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                            : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                        }`}
                      >
                        <span className="mr-2">{item.icon}</span>
                        {item.name}
                      </Link>
                    ))}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </nav>
  )
}
