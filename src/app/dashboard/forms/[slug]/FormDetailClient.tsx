'use client'

import { useState } from 'react'
import { ShareModal } from '@/components/ShareModal'
import { RatingDisplay } from '@/components/RatingDisplay'

interface Response {
  id: string
  rating?: number
  text?: string
  answer?: string
  respondentName?: string
  respondentEmail?: string
  shared: boolean
  createdAt: string
}

interface FormDetailClientProps {
  form: {
    id: string
    title: string
    question: string
    type: string
    slug: string
    user?: {
      name?: string
    }
    responses?: Response[]
  }
}

export default function FormDetailClient({ form }: FormDetailClientProps) {
  const [shareModalOpen, setShareModalOpen] = useState(false)
  const [selectedResponse, setSelectedResponse] = useState<Response | null>(null)

  const openShareModal = (response: Response) => {
    setSelectedResponse(response)
    setShareModalOpen(true)
  }

  const closeShareModal = () => {
    setShareModalOpen(false)
    setSelectedResponse(null)
  }

  return (
    <>
      <div className="space-y-4">
        {form.responses && form.responses.map((response) => (
          <div key={response.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {response.rating && (
                  <div className="flex items-center mb-2">
                    <span className="text-sm font-medium text-gray-700 mr-2">Rating: </span>
                    <RatingDisplay 
                      rating={response.rating} 
                      formType={form.type}
                      showLabel={true}
                    />
                  </div>
                )}
                {response.text && (
                  <p className="text-gray-900 mb-2">"{response.text}"</p>
                )}
                {response.answer && (
                  <p className="text-gray-900 mb-2">Answer: {response.answer}</p>
                )}
                {response.respondentName && (
                  <p className="text-sm text-gray-600">From: {response.respondentName}</p>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <p className="text-xs text-gray-500">
                  {new Date(response.createdAt).toLocaleDateString()}
                </p>
                {response.shared && (
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Shared
                  </span>
                )}
                {/* Only show share button for positive feedback */}
                {(response.rating && response.rating >= 4) || response.answer === 'yes' ? (
                  <button
                    onClick={() => openShareModal(response)}
                    className="px-3 py-1 bg-indigo-600 text-white text-xs rounded hover:bg-indigo-700"
                  >
                    Share
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Share Modal */}
      {selectedResponse && (
        <ShareModal
          response={{...selectedResponse, formId: form.id}}
          form={form}
          isOpen={shareModalOpen}
          onClose={closeShareModal}
        />
      )}
    </>
  )
}
