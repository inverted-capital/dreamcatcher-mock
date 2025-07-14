import { create } from 'zustand'
import equal from 'fast-deep-equal'

interface ChatState {
  currentChatId: string | undefined
  setCurrentChatId: (id: string) => void
  pendingMessage: string | null
  setPendingMessage: (m: string | null) => void
  // TODO add transclude state in here
}

export const useChatStore = create<ChatState>()((set, get) => ({
  currentChatId: undefined,
  pendingMessage: null,
  setCurrentChatId: (id: string) => {
    const current = get().currentChatId
    if (!equal(current, id)) {
      set({ currentChatId: id })
    }
  },
  setPendingMessage: (m: string | null) => set({ pendingMessage: m })
}))
