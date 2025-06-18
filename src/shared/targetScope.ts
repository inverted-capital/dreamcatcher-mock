import { create } from 'zustand'
import type { Scope } from '@artifact/client/api'

interface TargetScopeState {
  scope: Scope | null
  secondary: Scope[]
  setScope: (scope: Scope | null) => void
  setSecondary: (scopes: Scope[]) => void
}

export const useTargetScopeStore = create<TargetScopeState>((set) => ({
  scope: null,
  secondary: [],
  setScope: (scope) => set({ scope }),
  setSecondary: (scopes) => set({ secondary: scopes })
}))
