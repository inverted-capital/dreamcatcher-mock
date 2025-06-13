import { create } from 'zustand'
import type { Scope } from '@artifact/client/api'

interface TargetScopeState {
  scope: Scope | null
  setScope: (scope: Scope) => void
}

export const useTargetScopeStore = create<TargetScopeState>((set) => ({
  scope: null,
  setScope: (scope) => set({ scope })
}))
