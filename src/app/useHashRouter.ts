import { useEffect } from 'react'
import { useNavigationStore } from '@/shared/navigationState'
import { View } from '@/shared/types'
import { useChatStore } from '@/chat/chatState'

export default function useHashRouter() {
  const setCurrentView = useNavigationStore((state) => state.setCurrentView)
  const currentView = useNavigationStore((state) => state.currentView)

  const selectChat = useChatStore((state) => state.selectChat)
  const currentChatId = useChatStore((state) => state.currentChatId)

  // Sync state from the current hash fragment
  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.slice(1)
      if (!hash) return

      const [viewPart, query] = hash.split('?')
      if (viewPart) {
        setCurrentView(viewPart as View)
      }
      if (query) {
        const params = new URLSearchParams(query)
        const chat = params.get('chat')
        if (chat) selectChat(chat)
      }
    }

    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [setCurrentView, selectChat])

  // Update hash when relevant state changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (currentChatId) params.set('chat', currentChatId)

    const query = params.toString()
    const newHash = `${currentView}${query ? `?${query}` : ''}`
    if (window.location.hash.slice(1) !== newHash) {
      window.location.hash = newHash
    }
  }, [currentView, currentChatId])
}
