import React from 'react'
import Loader2 from 'lucide-react/dist/esm/icons/loader-2'
import type { UIMessage } from '@ai-sdk/react'

interface ChatMessageProps {
  message: UIMessage
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user'

  const textParts = message.parts.filter((p) => p.type === 'text') as Array<{
    type: 'text'
    text: string
    state?: 'streaming' | 'done'
  }>

  const reasoningParts = message.parts.filter(
    (p) => p.type === 'reasoning'
  ) as Array<{ type: 'reasoning'; text: string; state?: 'streaming' | 'done' }>

  const textContent = textParts.map((p) => p.text).join('')
  const reasoningContent = reasoningParts.map((p) => p.text).join('')

  const isStreaming =
    message.parts.some((p) => p.type === 'step-start') ||
    textParts.some((p) => p.state === 'streaming') ||
    reasoningParts.some((p) => p.state === 'streaming')

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-white border border-gray-200 text-gray-800'
        }`}
      >
        {!isUser && reasoningContent && (
          <div className="text-xs italic text-gray-500 mb-1">
            {reasoningContent}
          </div>
        )}
        <span>{textContent}</span>
        {isStreaming && (
          <Loader2 size={14} className="inline-block ml-1 animate-spin" />
        )}
      </div>
    </div>
  )
}

export default ChatMessage
