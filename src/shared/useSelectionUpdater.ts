import { useCallback } from 'react'
import type { Scope } from '@artifact/client/api'
import { useTargetScopeStore } from './targetScope'
import useHomeScope from './useHomeScope'

export default function useSelectionUpdater() {
  const setScope = useTargetScopeStore((s) => s.setScope)
  const setSecondary = useTargetScopeStore((s) => s.setSecondary)
  const home = useHomeScope()

  return useCallback(
    (scope?: Scope, extended?: Scope[]) => {
      if (scope) {
        setScope(scope)
        setSecondary(extended ?? [])
      } else if (home) {
        setScope(home)
        setSecondary([])
      }
    },
    [setScope, setSecondary, home]
  )
}
