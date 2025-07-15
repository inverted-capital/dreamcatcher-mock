import React, { useState, useEffect } from 'react'
import { useChatStore } from './chatState'
import { useExists } from '@artifact/client/hooks'
import ChatMessage from './ChatMessage'
// import NavigationMarker from './NavigationMarker'
import MessageSquare from 'lucide-react/dist/esm/icons/message-square'
import Settings from 'lucide-react/dist/esm/icons/settings'
import Search from 'lucide-react/dist/esm/icons/search'
import Plus from 'lucide-react/dist/esm/icons/plus'
import Maximize2 from 'lucide-react/dist/esm/icons/maximize-2'
import Minimize2 from 'lucide-react/dist/esm/icons/minimize-2'
// import { ChatMessage as ChatMessageType, NavigationItem } from '@/shared/types'
import { useChatManagement, useChat } from './useChatHooks'
import equal from 'fast-deep-equal'
// import Debug from 'debug'
// const log = Debug('artifact:ChatHistory')

// type TimelineItem =
//   | { type: 'message'; data: ChatMessageType; time: number }
//   | { type: 'navigation'; data: NavigationItem; time: number }

interface ChatHistoryProps {
  onToggleFullscreen: () => void
  isFullscreen: boolean
  ai: ReturnType<typeof useChat>
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  onToggleFullscreen,
  isFullscreen,
  ai
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  const { newChat } = useChatManagement()

  const setCurrentChatId = useChatStore((state) => state.setCurrentChatId)
  const [pendingChatId, setPendingChatId] = React.useState<string | null>(null)
  const chatExists = useExists(
    pendingChatId ? `chats/${pendingChatId}` : undefined
  )

  const handleNewChat = async () => {
    const id = await newChat()
    setCurrentChatId(id)
    setPendingChatId(id)
  }

  const [messages, setMessages] = useState<typeof ai.messages>([])
  const equalMessages = equal(ai.messages, messages)

  useEffect(() => {
    if (!equalMessages) {
      const clone = structuredClone(ai.messages)
      setMessages(clone)
    }
  }, [ai.messages, equalMessages])

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  React.useEffect(() => {
    if (pendingChatId && chatExists) {
      setPendingChatId(null)
    }
  }, [pendingChatId, chatExists])

  // Get items for the timeline display
  // const getTimelineItems = (): TimelineItem[] => {

  //   // Initialize result array with messages
  //   const result: TimelineItem[] = sortedMessages.map((msg) => ({
  //     type: 'message',
  //     data: msg,
  //     time: new Date(msg.timestamp).getTime()
  //   }))

  //   // Track contextual navigation markers (those that were active when messages were sent)
  //   const contextualNavMarkers = new Set()

  //   // Group messages by time chunks to find navigation context
  //   let currentMessageIndex = 0
  //   while (currentMessageIndex < sortedMessages.length) {
  //     const currentMsg = sortedMessages[currentMessageIndex]
  //     const msgTime = new Date(currentMsg.timestamp).getTime()

  //     // Find the navigation item that was active when this message was sent
  //     const activeNavItem = navigationHistory
  //       .filter((nav) => new Date(nav.timestamp).getTime() < msgTime)
  //       .sort(
  //         (a, b) =>
  //           new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  //       )[0]

  //     if (activeNavItem && !contextualNavMarkers.has(activeNavItem.id)) {
  //       contextualNavMarkers.add(activeNavItem.id)
  //       result.push({
  //         type: 'navigation',
  //         data: activeNavItem,
  //         time: new Date(activeNavItem.timestamp).getTime()
  //       })
  //     }

  //     currentMessageIndex++
  //   }

  //   // Add the most recent navigation marker only if no messages have been sent after it
  //   if (mostRecentNav && !contextualNavMarkers.has(mostRecentNav.id)) {
  //     const mostRecentNavTime = new Date(mostRecentNav.timestamp).getTime()
  //     const hasNewerMessages = sortedMessages.some(
  //       (msg) => new Date(msg.timestamp).getTime() > mostRecentNavTime
  //     )

  //     if (!hasNewerMessages) {
  //       result.push({
  //         type: 'navigation',
  //         data: mostRecentNav,
  //         time: mostRecentNavTime
  //       })
  //     }
  //   }

  //   // Sort all items chronologically
  //   return result.sort((a, b) => a.time - b.time)
  // }

  // const timelineItems = getTimelineItems()

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 py-2 pl-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare size={18} className="text-blue-600" />
            <div>
              <h2 className="text-base font-semibold text-gray-900">{ai.id}</h2>
              {ai.id && (
                <p className="text-xs text-gray-500">
                  {messages.length} messages
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
              <Search size={14} />
            </button>
            <button
              onClick={handleNewChat}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
            >
              <Plus size={14} />
            </button>
            <button
              onClick={onToggleFullscreen}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
              title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen chat'}
            >
              {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
              <Settings size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto">
        {pendingChatId && !chatExists ? (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-gray-500">Creating chat...</p>
            </div>
          </div>
        ) : !ai.id || messages.length === 0 ? (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare size={40} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">
                {!ai.id
                  ? 'Select a chat or start a new one'
                  : 'No messages yet'}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4 px-6">
            <div className="space-y-4">
              {messages.map((item) => (
                <ChatMessage key={item.id} message={item} />
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatHistory
