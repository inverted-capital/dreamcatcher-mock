import React from 'react'
import { useChatStore } from '../state'
import ChatMessage from './ChatMessage'
import NavigationMarker from './NavigationMarker'
import { MessageSquare } from 'lucide-react'
import { ChatMessage as ChatMessageType, NavigationItem } from '@/shared/types'

type TimelineItem =
  | { type: 'message'; data: ChatMessageType; time: number }
  | { type: 'navigation'; data: NavigationItem; time: number }

const ChatHistory: React.FC = () => {
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Get state from Zustand store
  const navigationHistory = useChatStore((state) => state.navigationHistory)
  const currentChatId = useChatStore((state) => state.currentChatId)
  const getChatMessages = useChatStore((state) => state.getChatMessages)

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

  // If no current chat is selected or the chat has no messages
  if (!currentChatId || timelineItems.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageSquare size={40} className="mx-auto text-gray-300 mb-2" />
          <p className="text-gray-500">
            {!currentChatId
              ? 'Select a chat or start a new one'
              : 'No messages yet'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto py-4 px-6 bg-gray-50">
      <div className="space-y-4">
        {timelineItems.map((item) =>
          item.type === 'message' ? (
            <ChatMessage key={`msg-${item.data.id}`} message={item.data} />
          ) : (
            <NavigationMarker key={`nav-${item.data.id}`} item={item.data} />
          )
        )}
      </div>
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatHistory
