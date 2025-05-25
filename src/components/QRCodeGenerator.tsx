'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface QRCodeGeneratorProps {
  formSlug: string
}

export function QRCodeGenerator({ formSlug }: QRCodeGeneratorProps) {
  const [size, setSize] = useState(200)
  
  const formUrl = `${process.env.NEXT_PUBLIC_APP_URL}/forms/${formSlug}`
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(formUrl)}`
  
  const downloadQRCode = () => {
    const link = document.createElement('a')
    link.href = qrCodeUrl
    link.download = `feedback-form-qr-${formSlug}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">QR Code for Physical Locations</h3>
      <p className="text-gray-600 text-sm mb-4">
        Print this QR code and place it in your physical location for customers to easily access your feedback form.
      </p>
      
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Size:</label>
          <select 
            value={size} 
            onChange={(e) => setSize(Number(e.target.value))}
            className="px-3 py-1 border border-gray-300 rounded text-sm"
          >
            <option value={150}>150x150</option>
            <option value={200}>200x200</option>
            <option value={300}>300x300</option>
            <option value={400}>400x400</option>
          </select>
        </div>
        
        <div className="flex justify-center">
          <img 
            src={qrCodeUrl} 
            alt="QR Code for feedback form"
            className="border border-gray-200 rounded"
          />
        </div>
        
        <div className="space-y-2">
          <button
            onClick={downloadQRCode}
            className="w-full px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Download QR Code
          </button>
          
          <div className="flex gap-2">
            <input
              type="text"
              value={formUrl}
              readOnly
              className="flex-1 px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm"
            />
            <CopyButton text={formUrl} />
          </div>
        </div>
        
        <div className="text-xs text-gray-500">
          <p><strong>How to use:</strong></p>
          <ol className="list-decimal list-inside space-y-1 mt-1">
            <li>Download the QR code image</li>
            <li>Print it on flyers, table tents, or display screens</li>
            <li>Customers scan with their phone camera</li>
            <li>They're taken directly to your feedback form</li>
          </ol>
        </div>
      </div>
    </div>
  )
}
