import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { DashboardLayout } from '@/components/DashboardLayout'
import Link from 'next/link'

export default async function SettingsPage() {
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

  const emailDomain = process.env.EMAIL_FROM_DOMAIN || 'resend.dev'
  const isEmailConfigured = emailDomain !== 'resend.dev'

  return (
    <DashboardLayout user={{ email: user.email || '', name: user.user_metadata?.name || user.email }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="mt-2 text-gray-600">Configure your FeedbackHub account</p>
        </div>
        
        {/* Subscription Information */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Subscription</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-medium text-gray-900 capitalize">
                  {userRecord?.plan || 'Free'} Plan
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {userRecord?.plan === 'pro' 
                    ? 'Unlimited feedback requests and social shares' 
                    : 'Limited to 5 feedback requests and 5 social shares per month'
                  }
                </p>
              </div>
              <Link
                href="/dashboard/billing"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {userRecord?.plan === 'pro' ? 'Manage Billing' : 'Upgrade to Pro'}
              </Link>
            </div>
          </div>
        </div>
        
        {/* Email Configuration */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Email Configuration</h2>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className={`p-2 rounded-full ${isEmailConfigured ? 'bg-green-100' : 'bg-yellow-100'}`}>
                {isEmailConfigured ? (
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-base font-medium text-gray-900">
                  {isEmailConfigured ? 'Email Domain Configured' : 'Email Domain Setup Required'}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {isEmailConfigured ? (
                    <>Email sending is configured with domain: <code className="bg-gray-100 px-2 py-1 rounded">{emailDomain}</code></>
                  ) : (
                    'You need to verify a custom domain to send feedback requests to any email address.'
                  )}
                </p>
                
                {!isEmailConfigured && (
                  <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                    <h4 className="text-sm font-medium text-yellow-800 mb-2">Setup Instructions:</h4>
                    <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
                      <li>Go to <a href="https://resend.com/domains" target="_blank" className="underline">resend.com/domains</a></li>
                      <li>Add and verify your domain (e.g., yourdomain.com)</li>
                      <li>Update the <code>EMAIL_FROM_DOMAIN</code> environment variable</li>
                      <li>Redeploy your application</li>
                    </ol>
                    <p className="text-xs text-yellow-600 mt-2">
                      <strong>Note:</strong> With the current setup, you can only send emails to allan@codebotiks.com
                    </p>
                  </div>
                )}
                
                {isEmailConfigured && (
                  <div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700">
                      ✅ You can send feedback requests to any email address using: 
                      <code className="bg-white px-2 py-1 rounded ml-1">noreply@{emailDomain}</code>
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Account Information */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Account Information</h2>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <p className="mt-1 text-sm text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Account ID</label>
              <p className="mt-1 text-sm text-gray-500 font-mono">{user.id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Member Since</label>
              <p className="mt-1 text-sm text-gray-900">
                {new Date(user.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
