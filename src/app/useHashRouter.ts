import { useEffect } from 'react'
import { useNavigationStore } from '@/shared/navigationState'
import { View, validViews } from '@/shared/types'
import { useChatStore } from '@/chat/chatState'

export default function useHashRouter() {
  const setCurrentView = useNavigationStore((state) => state.setCurrentView)
  const currentView = useNavigationStore((state) => state.currentView)

  const setCurrentChatId = useChatStore((state) => state.setCurrentChatId)
  const currentChatId = useChatStore((state) => state.currentChatId)

  useEffect(() => {
    const applyHash = () => {
      const hash = window.location.hash.slice(1)
      if (!hash) return

      const [viewPart, query] = hash.split('?')
      if (viewPart) {
        if (validViews.includes(viewPart as View)) {
          setCurrentView(viewPart as View)
        } else {
          setCurrentView('home')
        }
      }
      if (query) {
        const params = new URLSearchParams(query)
        const chat = params.get('chat')
        if (chat) setCurrentChatId(chat)
      }
    }

    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [setCurrentView, setCurrentChatId])

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
