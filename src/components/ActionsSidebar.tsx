'use client'

import { useState } from 'react'
import Link from 'next/link'

interface ActionsSidebarProps {
  form: {
    id: string;
    slug: string; // Add slug here
    responses?: Array<{
      id: string
      rating?: number
      answer?: string
    }>
  }
}

export function ActionsSidebar({ form }: ActionsSidebarProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isExporting, setIsExporting] = useState(false); // New state for export

  const positiveResponses = form.responses?.filter(r => 
    (r.rating && r.rating >= 4) || r.answer === 'yes'
  ) || []

  const handleGenerateCards = async () => {
    setIsGenerating(true)
    // For now, just show an alert. Later we can implement bulk card generation
    alert(`Found ${positiveResponses.length} positive responses ready for social sharing!`)
    setIsGenerating(false)
  }

  const handleExportResponses = async () => {
    setIsExporting(true);
    // Construct the URL for the export endpoint
    const exportUrl = `/api/forms/${form.slug}/export`; // Use form.slug
    
    // Use window.location.href to trigger the download
    window.location.href = exportUrl;

    // Re-enable the button after a short delay
    setTimeout(() => {
      setIsExporting(false);
    }, 2000); // Adjust delay as needed
  };

  return (
    <div className="space-y-6">
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium mb-4">Actions</h3>
        <div className="space-y-3">
          <Link 
            href={`/dashboard/requests?formId=${form.id}`}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 block text-center"
          >
            Send Feedback Requests
          </Link>
          <button 
            className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            onClick={handleGenerateCards}
            disabled={isGenerating || positiveResponses.length === 0}
          >
            {isGenerating ? 'Generating...' : `Generate Social Cards (${positiveResponses.length})`}
          </button>
          <button 
            className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 disabled:opacity-50"
            onClick={handleExportResponses} // Updated handler
            disabled={isExporting} // Disable button when exporting
          >
            {isExporting ? 'Exporting...' : 'Export Responses'} {/* Update text based on state */}
          </button>
        </div>
      </div>
    </div>
  )
}
