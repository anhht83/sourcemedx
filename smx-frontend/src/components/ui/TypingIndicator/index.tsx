import React from 'react'

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-1">
      <span className="w-1.5 h-1.5 bg-gray-50 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
      <span className="w-1.5 h-1.5 bg-gray-50 rounded-full animate-bounce"></span>
      <span className="w-1.5 h-1.5 bg-gray-50 rounded-full animate-bounce [animation-delay:0.2s]"></span>
    </div>
  )
}
export default TypingIndicator
