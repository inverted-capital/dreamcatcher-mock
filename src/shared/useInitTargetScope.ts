import { useEffect } from 'react'
import { useTargetScopeStore } from './targetScope'
import useHomeScope from './useHomeScope'

export default function useInitTargetScope() {
  const scope = useTargetScopeStore((s) => s.scope)
  const setScope = useTargetScopeStore((s) => s.setScope)
  const homeScope = useHomeScope()

  useEffect(() => {
    if (scope || !homeScope) return
    setScope(homeScope)
  }, [scope, setScope, homeScope])
}
