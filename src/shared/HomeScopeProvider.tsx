import React, { createContext, useContext, useEffect, useState } from 'react'
import { useBaseArtifact } from '@artifact/client/hooks'
import type { Scope } from '@artifact/client/api'

export const HomeScopeContext = createContext<Scope | null>(null)

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

export function useHomeScope(): Scope | null {
  return useContext(HomeScopeContext)
}

export default HomeScopeProvider
