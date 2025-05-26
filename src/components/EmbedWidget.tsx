'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'
import { getFormUrl } from '@/lib/url-utils'

interface EmbedWidgetProps {
  formSlug: string
}

export function EmbedWidget({ formSlug }: EmbedWidgetProps) {
  const [embedType, setEmbedType] = useState<'iframe' | 'popup' | 'inline'>('iframe')
  const [width, setWidth] = useState('100%')
  const [height, setHeight] = useState('600')
  
  const formUrl = getFormUrl(formSlug)
  
  const generateEmbedCode = () => {
    switch (embedType) {
      case 'iframe':
        return `<iframe 
  src="${formUrl}" 
  width="${width}" 
  height="${height}px" 
  frameborder="0" 
  style="border: 1px solid #e5e7eb; border-radius: 8px;">
</iframe>`
      
      case 'popup':
        return `<!-- FeedbackHub Popup Widget -->
<script>
  (function() {
    var button = document.createElement('button');
    button.innerHTML = '💬 Give Feedback';
    button.style.cssText = 'position: fixed; bottom: 20px; right: 20px; background: #4f46e5; color: white; border: none; padding: 12px 20px; border-radius: 25px; cursor: pointer; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; font-family: system-ui;';
    
    button.onclick = function() {
      var popup = window.open('${formUrl}', 'feedback', 'width=600,height=700,scrollbars=yes,resizable=yes');
      popup.focus();
    };
    
    document.body.appendChild(button);
  })();
</script>`
      
      case 'inline':
        return `<!-- FeedbackHub Inline Widget -->
<div id="feedbackhub-widget"></div>
<script>
  (function() {
    var container = document.getElementById('feedbackhub-widget');
    var iframe = document.createElement('iframe');
    iframe.src = '${formUrl}';
    iframe.style.cssText = 'width: 100%; height: ${height}px; border: 1px solid #e5e7eb; border-radius: 8px;';
    container.appendChild(iframe);
  })();
</script>`
    }
  }

  const embedCode = generateEmbedCode()

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-medium mb-4">Embed on Your Website</h3>      <p className="text-gray-600 text-sm mb-4">
        Add this feedback form to your website using one of these embed options.
      </p>
      
      <div className="space-y-4">
        {/* Embed Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Embed Type
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => setEmbedType('iframe')}
              className={`px-3 py-2 text-sm rounded border ${
                embedType === 'iframe' 
                  ? 'bg-indigo-100 border-indigo-500 text-indigo-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              IFrame
            </button>
            <button
              onClick={() => setEmbedType('popup')}
              className={`px-3 py-2 text-sm rounded border ${
                embedType === 'popup' 
                  ? 'bg-indigo-100 border-indigo-500 text-indigo-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Popup Button
            </button>
            <button
              onClick={() => setEmbedType('inline')}
              className={`px-3 py-2 text-sm rounded border ${
                embedType === 'inline' 
                  ? 'bg-indigo-100 border-indigo-500 text-indigo-700' 
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              Inline Script
            </button>
          </div>
        </div>
        
        {/* Size Options for iframe */}
        {embedType === 'iframe' && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Width
              </label>
              <input
                type="text"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                placeholder="e.g., 100%, 500px"
              />
            </div>            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Height (px)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                placeholder="600"
              />
            </div>
          </div>
        )}
        
        {/* Generated Code */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Embed Code
            </label>
            <CopyButton text={embedCode} />
          </div>
          <textarea
            value={embedCode}
            readOnly
            className="w-full px-3 py-2 border border-gray-300 rounded bg-gray-50 text-sm font-mono"
            rows={embedType === 'iframe' ? 6 : 12}
          />
        </div>
        
        {/* Instructions */}
        <div className="text-xs text-gray-500 space-y-2">
          <p><strong>Instructions:</strong></p>
          {embedType === 'iframe' && (
            <p>Copy and paste this iframe code directly into your HTML where you want the form to appear.</p>
          )}
          {embedType === 'popup' && (
            <p>This creates a floating feedback button in the bottom-right corner that opens your form in a popup window.</p>
          )}
          {embedType === 'inline' && (
            <p>Add a div with id "feedbackhub-widget" to your page, then include this script. The form will appear inline.</p>
          )}
        </div>
      </div>
    </div>
  )
}
