import { useEffect } from 'react'
import { useBaseArtifact } from '@artifact/client/hooks'
import { useTargetScopeStore } from './targetScope'

export default function useInitTargetScope() {
  const artifact = useBaseArtifact()
  const scope = useTargetScopeStore((s) => s.scope)
  const setScope = useTargetScopeStore((s) => s.setScope)

  useEffect(() => {
    if (scope) return
    let cancelled = false
    ;(async () => {
      const [first] = await artifact.super.ls()
      if (!cancelled && first) {
        setScope(first)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [artifact, scope, setScope])
}
