import React from 'react'
import { useChatStore } from './chatState'
import ChatMessage from './ChatMessage'
import NavigationMarker from './NavigationMarker'
import MessageSquare from 'lucide-react/dist/esm/icons/message-square'
import Settings from 'lucide-react/dist/esm/icons/settings'
import Search from 'lucide-react/dist/esm/icons/search'
import Plus from 'lucide-react/dist/esm/icons/plus'
import Maximize2 from 'lucide-react/dist/esm/icons/maximize-2'
import Minimize2 from 'lucide-react/dist/esm/icons/minimize-2'
import { ChatMessage as ChatMessageType, NavigationItem } from '@/shared/types'

type TimelineItem =
  | { type: 'message'; data: ChatMessageType; time: number }
  | { type: 'navigation'; data: NavigationItem; time: number }

interface ChatHistoryProps {
  onToggleFullscreen: () => void
  isFullscreen: boolean
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  onToggleFullscreen,
  isFullscreen
}) => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Get state from Zustand store
  const navigationHistory = useChatStore((state) => state.navigationHistory)
  const currentChatId = useChatStore((state) => state.currentChatId)
  const getChatMessages = useChatStore((state) => state.getChatMessages)
  const createNewChat = useChatStore((state) => state.createNewChat)
  const chats = useChatStore((state) => state.chats)

  // Get current chat info
  const currentChat = currentChatId
    ? chats.find((chat) => chat.id === currentChatId)
    : null

  // Get messages for the current chat
  const chatMessages = React.useMemo(
    () => (currentChatId ? getChatMessages(currentChatId) : []),
    [currentChatId, getChatMessages]
  )

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages])

  // Get items for the timeline display
  const getTimelineItems = (): TimelineItem[] => {
    // Sort messages by timestamp
    const sortedMessages = [...chatMessages].sort(
      (a, b) =>
        new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )

    // Get most recent navigation item
    const sortedNavigation = [...navigationHistory].sort(
      (a, b) =>
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )
    const mostRecentNav = sortedNavigation[0]

    // Initialize result array with messages
    const result: TimelineItem[] = sortedMessages.map((msg) => ({
      type: 'message',
      data: msg,
      time: new Date(msg.timestamp).getTime()
    }))

    // Track contextual navigation markers (those that were active when messages were sent)
    const contextualNavMarkers = new Set()

    // Group messages by time chunks to find navigation context
    let currentMessageIndex = 0
    while (currentMessageIndex < sortedMessages.length) {
      const currentMsg = sortedMessages[currentMessageIndex]
      const msgTime = new Date(currentMsg.timestamp).getTime()

      // Find the navigation item that was active when this message was sent
      const activeNavItem = navigationHistory
        .filter((nav) => new Date(nav.timestamp).getTime() < msgTime)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        )[0]

      if (activeNavItem && !contextualNavMarkers.has(activeNavItem.id)) {
        contextualNavMarkers.add(activeNavItem.id)
        result.push({
          type: 'navigation',
          data: activeNavItem,
          time: new Date(activeNavItem.timestamp).getTime()
        })
      }

      currentMessageIndex++
    }

    // Add the most recent navigation marker only if no messages have been sent after it
    if (mostRecentNav && !contextualNavMarkers.has(mostRecentNav.id)) {
      const mostRecentNavTime = new Date(mostRecentNav.timestamp).getTime()
      const hasNewerMessages = sortedMessages.some(
        (msg) => new Date(msg.timestamp).getTime() > mostRecentNavTime
      )

      if (!hasNewerMessages) {
        result.push({
          type: 'navigation',
          data: mostRecentNav,
          time: mostRecentNavTime
        })
      }
    }

    // Sort all items chronologically
    return result.sort((a, b) => a.time - b.time)
  }

  const timelineItems = getTimelineItems()

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Chat Header - Made Slimmer with Space for Toggle Button */}
      <div className="bg-white border-b border-gray-200 px-4 py-2 pl-12">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <MessageSquare size={18} className="text-blue-600" />
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                {currentChat?.title || 'Agentic Messages'}
              </h2>
              {currentChat && (
                <p className="text-xs text-gray-500">
                  {chatMessages.length} messages
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-1">
            <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors">
              <Search size={14} />
            </button>
            <button
              onClick={createNewChat}
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
        {!currentChatId || timelineItems.length === 0 ? (
          <div className="flex-1 flex items-center justify-center h-full">
            <div className="text-center">
              <MessageSquare size={40} className="mx-auto text-gray-300 mb-2" />
              <p className="text-gray-500">
                {!currentChatId
                  ? 'Select a chat or start a new one'
                  : 'No messages yet'}
              </p>
            </div>
          </div>
        ) : (
          <div className="py-4 px-6">
            <div className="space-y-4">
              {timelineItems.map((item) =>
                item.type === 'message' ? (
                  <ChatMessage
                    key={`msg-${item.data.id}`}
                    message={item.data}
                  />
                ) : (
                  <NavigationMarker
                    key={`nav-${item.data.id}`}
                    item={item.data}
                  />
                )
              )}
            </div>
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
    </div>
  )
}

export default ChatHistory
