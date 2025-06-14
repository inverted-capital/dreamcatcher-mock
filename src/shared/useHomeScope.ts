import { useEffect, useState } from 'react'
import { useBaseArtifact } from '@artifact/client/hooks'
import type { Scope } from '@artifact/client/api'

export default function useHomeScope(): Scope | null {
  const artifact = useBaseArtifact()
  const [homeScope, setHomeScope] = useState<Scope | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [first] = await artifact.super.ls()
      if (!cancelled) setHomeScope(first ?? null)
    })()
    return () => {
      cancelled = true
    }
  }, [artifact])

  return homeScope
}
