import React, { useEffect, useState } from 'react'
import { useBaseArtifact } from '@artifact/client/hooks'
import type { Scope } from '@artifact/client/api'
import HomeScopeContext from './homeScopeContext'

export const HomeScopeProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const artifact = useBaseArtifact()
  const [scope, setScope] = useState<Scope | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const [first] = await artifact.super.ls()
      if (!cancelled) setScope(first ?? null)
    })()
    return () => {
      cancelled = true
    }
  }, [artifact])

  return (
    <HomeScopeContext.Provider value={scope}>
      {children}
    </HomeScopeContext.Provider>
  )
}

export default HomeScopeProvider
