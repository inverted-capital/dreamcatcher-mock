import { create } from 'zustand'
import equal from 'fast-deep-equal'

interface ChatState {
  currentChatId: string | undefined
  setCurrentChatId: (id: string) => void
  // TODO add transclude state in here
}

export const useChatStore = create<ChatState>()((set, get) => ({
  currentChatId: undefined,
  setCurrentChatId: (id: string) => {
    const current = get().currentChatId
    if (!equal(current, id)) {
      set({ currentChatId: id })
    }
  }
}))
