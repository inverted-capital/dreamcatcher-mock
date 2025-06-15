import React from 'react'

import { ChatMessage as ChatMessageType } from '@/shared/types'

interface ChatMessageProps {
  message: ChatMessageType
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user'

  // Get actions from Zustand stores

  // Extract context information from the message if it exists
  const hasContext = isUser && message.content.startsWith('Context:')
  let messageContent = message.content

  if (hasContext) {
    const parts = message.content.split('\n\n')
    if (parts.length > 1) {
      messageContent = parts.slice(1).join('\n\n')
    }
  }

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[80%] rounded-lg px-4 py-2 ${
          isUser
            ? 'bg-blue-500 text-white'
            : 'bg-white border border-gray-200 text-gray-800'
        }`}
      >
        {messageContent}

        {message.attachments && message.attachments.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.attachments.map((attachment) => (
              <div
                key={attachment.id}
                className="flex items-center bg-white/10 rounded px-2 py-1 text-sm"
              >
                <span className="truncate">{attachment.name}</span>
                <span className="ml-1 text-xs opacity-70">
                  ({Math.round(attachment.size || 0 / 1024)}KB)
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatMessage
