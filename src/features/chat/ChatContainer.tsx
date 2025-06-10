import React from 'react'
import ChatHistory from './ChatHistory'
import ChatInput from './ChatInput'
import CanvasContainer from '@/app/canvas/CanvasContainer'

const ChatContainer: React.FC = () => {
  // The chat window should always be visible per requirement
  return (
    <div className="flex-1 flex overflow-hidden bg-white">
      {/* Chat section - always visible */}
      <div className="w-2/5 flex flex-col overflow-hidden border-r border-gray-200">
        <ChatHistory />
        <ChatInput />
      </div>

      {/* Canvas/State board section */}
      <div className="w-3/5 overflow-hidden">
        <CanvasContainer />
      </div>
    </div>
  )
}

export default ChatContainer
