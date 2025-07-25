import React, { useState, useRef, useEffect } from 'react'
import Send from 'lucide-react/dist/esm/icons/send'
import Paperclip from 'lucide-react/dist/esm/icons/paperclip'
import Mic from 'lucide-react/dist/esm/icons/mic'
const ChatInput: React.FC<{ onSendMessage: (text: string) => void }> = ({
  onSendMessage
}) => {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto'
      // Set the height to scrollHeight to accommodate all content, with a max height
      const scrollHeight = textareaRef.current.scrollHeight
      const maxHeight = 120 // Equivalent to about 5 lines
      textareaRef.current.style.height = `${Math.min(scrollHeight, maxHeight)}px`
    }
  }, [])

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message)
      setMessage('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  return (
    <div className="bg-white border-t border-gray-200 p-4 flex-shrink-0">
      {isRecording && (
        <div className="mt-2 text-center text-sm text-red-500 animate-pulse">
          Recording... (Click mic to stop)
        </div>
      )}
      <div className="flex items-end bg-gray-50 rounded-lg border border-gray-200">
        <button
          className="p-2.5 text-gray-500 hover:text-gray-700 flex-shrink-0 transition-colors"
          aria-label="Attach file"
        >
          <Paperclip size={18} />
        </button>

        <textarea
          ref={textareaRef}
          className="flex-1 bg-transparent py-2.5 px-2 resize-none focus:outline-none min-h-[20px] max-h-[120px] overflow-y-auto text-sm leading-5"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
          style={{ height: '20px' }} // Start with minimal height
        />

        <button
          className={`p-2.5 ${isRecording ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'} flex-shrink-0 transition-colors`}
          onClick={toggleRecording}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          <Mic size={18} />
        </button>

        <button
          className={`p-2.5 rounded-r-lg ${message.trim() ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400'} flex-shrink-0 transition-colors`}
          onClick={handleSendMessage}
          disabled={!message.trim()}
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  )
}

export default ChatInput
