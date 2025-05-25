'use client'

import { useState } from 'react'
import { CopyButton } from '@/components/CopyButton'

interface EmbedWidgetProps {
  formSlug: string
}

export function EmbedWidget({ formSlug }: EmbedWidgetProps) {
  const [embedType, setEmbedType] = useState<'iframe' | 'popup' | 'inline'>('iframe')
  const [width, setWidth] = useState('100%')
  const [height, setHeight] = useState('600')
  
  const formUrl = `${process.env.NEXT_PUBLIC_APP_URL}/forms/${formSlug}`
  
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
      <h3 className="text-lg font-medium mb-4">Embed on Your Website</h3>
      <p className="text-gray-600 text-sm mb-4">
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