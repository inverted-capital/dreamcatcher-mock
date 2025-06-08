import { useEffect } from 'react'
import { useNavigationStore } from '@/features/navigation/state'
import { View } from '@/shared/types'
import { useRepoStore } from '@/features/repos/state'
import { useChatStore } from '@/features/chat/state'

export default function useHashRouter() {
  const setCurrentView = useNavigationStore((state) => state.setCurrentView)
  const currentView = useNavigationStore((state) => state.currentView)

  const selectRepository = useRepoStore((state) => state.selectRepository)
  const currentRepoId = useRepoStore((state) => state.currentRepoId)

  const switchBranch = useRepoStore((state) => state.switchBranch)
  const currentBranch = useRepoStore((state) => state.currentBranch)

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
        const repo = params.get('repo')
        if (repo) selectRepository(repo)
        const branch = params.get('branch')
        if (branch) switchBranch(branch)
        const chat = params.get('chat')
        if (chat) selectChat(chat)
      }
    }

    applyHash()
    window.addEventListener('hashchange', applyHash)
    return () => window.removeEventListener('hashchange', applyHash)
  }, [setCurrentView, selectRepository, switchBranch, selectChat])

  // Update hash when relevant state changes
  useEffect(() => {
    const params = new URLSearchParams()
    if (currentRepoId) params.set('repo', currentRepoId)
    if (currentBranch) params.set('branch', currentBranch)
    if (currentChatId) params.set('chat', currentChatId)

    const query = params.toString()
    const newHash = `${currentView}${query ? `?${query}` : ''}`
    if (window.location.hash.slice(1) !== newHash) {
      window.location.hash = newHash
    }
  }, [currentView, currentRepoId, currentBranch, currentChatId])
}
