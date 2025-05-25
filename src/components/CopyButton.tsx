'use client'

interface CopyButtonProps {
  text: string
  disabled?: boolean
}

export function CopyButton({ text, disabled = false }: CopyButtonProps) {
  const handleCopy = () => {
    if (!disabled && text) {
      navigator.clipboard.writeText(text)
    }
  }

  return (
    <button
      onClick={handleCopy}
      disabled={disabled}
      className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md text-sm hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Copy
    </button>
  )
}
