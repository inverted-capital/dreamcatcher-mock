import useHashRouter from './useHashRouter'
import useHomeScope from '@/shared/useHomeScope'
import Sidebar from './Sidebar'
import StateBoard from './StateBoard'
import { ChatHistory, ChatInput } from '@/chat'
import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

function App() {
  useHashRouter()
  useHomeScope()
  const [showChat, setShowChat] = useState(true)
  const [chatFullscreen, setChatFullscreen] = useState(false)

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      {/* Main Content Area */}
      <main className="flex-1 flex overflow-hidden">
        {/* Chat Section - Left Side */}
        <div className={`${
          chatFullscreen 
            ? 'w-full' 
            : showChat 
              ? 'w-2/5' 
              : 'w-0'
        } flex flex-col overflow-hidden bg-white transition-all duration-300 ease-in-out ${showChat ? 'border-r border-gray-200' : ''}`}>
          {showChat && (
            <>
              <ChatHistory 
                onToggleFullscreen={() => setChatFullscreen(!chatFullscreen)}
                isFullscreen={chatFullscreen}
              />
              <ChatInput />
            </>
          )}
        </div>

        {/* StateBoard Section - Right Side with Inset Window Effect */}
        {!chatFullscreen && (
          <div className="flex-1 p-4 bg-gray-100 relative">
            {/* Chat Toggle Button */}
            <button
              onClick={() => setShowChat(!showChat)}
              className="absolute top-4 left-4 z-10 p-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 hover:shadow-md transition-all duration-200"
              title={showChat ? 'Hide chat' : 'Show chat'}
            >
              {showChat ? (
                <ChevronLeft size={16} className="text-gray-600" />
              ) : (
                <ChevronRight size={16} className="text-gray-600" />
              )}
            </button>

            {/* Inset Window Container */}
            <div className="h-full bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
              <StateBoard />
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default App