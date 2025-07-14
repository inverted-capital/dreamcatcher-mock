import { create } from 'zustand'
import { validViews, type View } from '@/shared/types'

// Generate default sources from validViews
const generateDefaultSrc = (view: View): string => {
  const panelName = view === 'home-events' ? 'events' : view
  return `https://inverted-capital.github.io/frame-${panelName}-panel/`
}
const DEFAULT_SRCS: Record<View, string> = validViews.reduce((acc, view) => {
  acc[view] = generateDefaultSrc(view)
  return acc
}, {} as Record<View, string>)

interface FrameSrcState {
  srcs: Partial<Record<View, string>>
  diagnostic: boolean
  setSrc: (view: View, src: string) => void
  /**
   * Reset a frame source back to its default value
   */
  resetSrc: (view: View) => void
  setDiagnostic: (enabled: boolean) => void
  toggleDiagnostic: () => void
  getSrc: (view: View) => string
}

export const DIAGNOSTIC_PATH = `${import.meta.env.BASE_URL}diagnostic.html`

export function useRegularSrc(view: View): string {
  return useFrameSrcStore((s) => s.srcs[view] ?? DEFAULT_SRCS[view])
}

export const useFrameSrcStore = create<FrameSrcState>((set, get) => ({
  srcs: {},
  diagnostic: false,
  setSrc: (view, src) =>
    set((state) => ({ srcs: { ...state.srcs, [view]: src } })),
  resetSrc: (view) =>
    set((state) => {
      const next = { ...state.srcs }
      delete next[view]
      return { srcs: next }
    }),
  setDiagnostic: (enabled) => set({ diagnostic: enabled }),
  toggleDiagnostic: () => set((state) => ({ diagnostic: !state.diagnostic })),
  getSrc: (view) =>
    get().diagnostic
      ? DIAGNOSTIC_PATH
      : (get().srcs[view] ?? DEFAULT_SRCS[view])
}))

export function defaultSrcFor(view: View): string {
  return DEFAULT_SRCS[view]
}
