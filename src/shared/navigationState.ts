import { create } from 'zustand'
import { View } from '@/shared/types'

interface NavigationState {
  currentView: View
}

interface NavigationActions {
  setCurrentView: (view: View) => void
}

function getInitialView(): View {
  if (typeof window === 'undefined') return 'home'
  const hash = window.location.hash.slice(1)
  if (!hash) return 'home'
  const [viewPart] = hash.split('?')
  return (viewPart as View) || 'home'
}

export const useNavigationStore = create<NavigationState & NavigationActions>()(
  (set) => ({
    // State
    currentView: getInitialView(),

    // Actions
    setCurrentView: (view) => {
      set({ currentView: view })
    }
  })
)
