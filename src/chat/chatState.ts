import { create } from 'zustand'
import { ChatMessage, Chat, NavigationItem } from '@/shared/types'
import type { Scope } from '@artifact/client/api'
import { mockMessages } from '@/shared/mockMessages'
import { mockChats } from '@/shared/mockChats'

function getInitialChatId(): string {
  if (typeof window === 'undefined') return 'chat-1'
  const hash = window.location.hash.slice(1)
  if (!hash) return 'chat-1'
  const [, query] = hash.split('?')
  if (!query) return 'chat-1'
  const params = new URLSearchParams(query)
  return params.get('chat') || 'chat-1'
}

const initialChatId = getInitialChatId()

interface ChatState {
  messages: ChatMessage[]
  navigationHistory: NavigationItem[]
  currentChatId: string | null
  chats: Chat[]
}

interface ChatActions {
  addMessage: (message: Omit<ChatMessage, 'id' | 'timestamp'>) => void
  navigateTo: (
    item: Omit<NavigationItem, 'id' | 'timestamp' | 'children'>
  ) => void
  collapseNavItem: (id: string) => void
  expandNavItem: (id: string) => void
  createNewChat: () => string
  /** Select a chat by id, creating it if necessary */
  selectOrCreateChat: (id: string, scope?: Scope) => void
  selectChat: (chatId: string) => void
  getChatMessages: (chatId: string) => ChatMessage[]
}

// Initialize with mock data - in a real app this would come from an API or local storage
export const useChatStore = create<ChatState & ChatActions>()((set, get) => ({
  // State
  messages: mockMessages.map((msg) => ({
    ...msg,
    chatId: msg.chatId || 'chat-1' // Default to first chat if not specified
  })),
  chats: mockChats,
  currentChatId: initialChatId,
  navigationHistory: [
    {
      id: '1',
      title: 'Chats',
      icon: 'MessageSquare',
      view: 'chats',
      timestamp: new Date().toISOString(),
      collapsed: false,
      children: []
    }
  ],

  // Actions
  addMessage: (message) => {
    const { currentChatId } = get()
    if (!currentChatId) return

    const newMessageId = `msg-${Date.now()}`
    const newMessage: ChatMessage = {
      ...message,
      id: newMessageId,
      timestamp: new Date().toISOString(),
      chatId: currentChatId
    }

    // Add message to messages array and update the chat with the new message
    set((state) => {
      const updatedChats = state.chats.map((chat) =>
        chat.id === currentChatId
          ? {
              ...chat,
              messageIds: [...chat.messageIds, newMessageId],
              lastMessage: message.content,
              timestamp: new Date().toISOString()
            }
          : chat
      )

      return {
        messages: [...state.messages, newMessage],
        chats: updatedChats
      }
    })
  },

  navigateTo: (item) => {
    const newItem: NavigationItem = {
      ...item,
      id: `nav-${Date.now()}`,
      timestamp: new Date().toISOString(),
      collapsed: false,
      children: []
    }

    set((state) => {
      // Check if this is a child navigation of the current view
      if (item.parentId) {
        return {
          navigationHistory: state.navigationHistory.map((navItem) => {
            if (navItem.id === item.parentId) {
              return {
                ...navItem,
                children: [...navItem.children, newItem]
              }
            }
            return navItem
          })
        }
      } else {
        return {
          navigationHistory: [...state.navigationHistory, newItem]
        }
      }
    })
  },

  collapseNavItem: (id) => {
    set((state) => ({
      navigationHistory: state.navigationHistory.map((item) =>
        item.id === id ? { ...item, collapsed: true } : item
      )
    }))
  },

  expandNavItem: (id) => {
    set((state) => ({
      navigationHistory: state.navigationHistory.map((item) =>
        item.id === id ? { ...item, collapsed: false } : item
      )
    }))
  },

  createNewChat: () => {
    const newChatId = `chat-${Date.now()}`
    const newChat: Chat = {
      id: newChatId,
      title: `New Chat ${get().chats.length + 1}`,
      timestamp: new Date().toISOString(),
      messageIds: []
    }

    set((state) => ({
      chats: [newChat, ...state.chats],
      currentChatId: newChatId
    }))

    return newChatId
  },

  selectOrCreateChat: (id, scope) => {
    const existing = get().chats.find((c) => c.id === id)
    if (!existing) {
      const newChat: Chat = {
        id,
        title: `Chat ${id}`,
        timestamp: new Date().toISOString(),
        messageIds: [],
        scope
      }
      set((state) => ({
        chats: [newChat, ...state.chats],
        currentChatId: id
      }))
    } else {
      set({
        currentChatId: id
      })
    }
  },

  selectChat: (chatId) => {
    set({
      currentChatId: chatId
    })
  },

  getChatMessages: (chatId) => {
    const { messages } = get()
    return messages.filter((message) => message.chatId === chatId)
  }
}))
