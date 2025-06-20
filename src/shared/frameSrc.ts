import { create } from 'zustand'
import type { View } from '@/shared/types'

const DEFAULT_SRCS: Record<View, string> = {
  contacts: 'https://inverted-capital.github.io/frame-contacts-panel/',
  chats: 'https://inverted-capital.github.io/frame-chats-panel/',
  'home-events': 'https://inverted-capital.github.io/frame-events-panel/',
  events: 'https://inverted-capital.github.io/frame-events-panel/',
  files: 'https://inverted-capital.github.io/frame-files-panel/',
  repos: 'https://inverted-capital.github.io/frame-repos-panel/',
  branches: 'https://inverted-capital.github.io/frame-branches-panel/',
  help: 'https://inverted-capital.github.io/frame-help-panel/',
  weather: 'https://inverted-capital.github.io/frame-weather-panel/',
  customers: 'https://inverted-capital.github.io/frame-customers-panel/',
  home: 'https://inverted-capital.github.io/frame-home-panel/',
  innovations: 'https://inverted-capital.github.io/frame-innovations-panel/',
  settings: 'https://inverted-capital.github.io/frame-settings-panel/',
  account: 'https://inverted-capital.github.io/frame-account-panel/',
  napps: 'https://inverted-capital.github.io/frame-napps-panel/',
  transcludes: 'https://inverted-capital.github.io/frame-transcludes-panel/',
  processes: 'https://inverted-capital.github.io/frame-processes-panel/'
}

interface FrameSrcState {
  srcs: Partial<Record<View, string>>
  diagnostic: Partial<Record<View, boolean>>
  setSrc: (view: View, src: string) => void
  /**
   * Reset a frame source back to its default value
   */
  resetSrc: (view: View) => void
  setDiagnostic: (view: View, enabled: boolean) => void
  toggleDiagnostic: (view: View) => void
  getSrc: (view: View) => string
}

const DIAGNOSTIC_PATH = `${import.meta.env.BASE_URL}diagnotic.html`

export const useFrameSrcStore = create<FrameSrcState>((set, get) => ({
  srcs: {},
  diagnostic: Object.fromEntries(
    Object.keys(DEFAULT_SRCS).map((k) => [k, true])
  ) as Partial<Record<View, boolean>>,
  setSrc: (view, src) =>
    set((state) => ({ srcs: { ...state.srcs, [view]: src } })),
  resetSrc: (view) =>
    set((state) => {
      const next = { ...state.srcs }
      delete next[view]
      return { srcs: next }
    }),
  setDiagnostic: (view, enabled) =>
    set((state) => ({ diagnostic: { ...state.diagnostic, [view]: enabled } })),
  toggleDiagnostic: (view) =>
    set((state) => ({
      diagnostic: { ...state.diagnostic, [view]: !state.diagnostic[view] }
    })),
  getSrc: (view) =>
    get().diagnostic[view]
      ? DIAGNOSTIC_PATH
      : (get().srcs[view] ?? DEFAULT_SRCS[view])
}))

export function defaultSrcFor(view: View): string {
  return DEFAULT_SRCS[view]
}
