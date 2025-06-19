import React, { useEffect, useState } from 'react'
import { useBaseArtifact } from '@artifact/client/hooks'
import type { Scope } from '@artifact/client/api'
import HomeScopeContext from './homeScopeContext'
import { useTargetScopeStore } from './targetScope'

export const HomeScopeProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const artifact = useBaseArtifact()
  const [scope, setScope] = useState<Scope | null>(null)
  const setTargetScope = useTargetScopeStore((s) => s.setScope)

  useEffect(() => {
    if (!artifact) return
    let cancelled = false
    ;(async () => {
      const [repo] = await artifact.super.ls()
      if (cancelled) return
      const repoArtifact = artifact.checkout(repo)
      const { scope } = await repoArtifact.repo.branches.default()
      if (cancelled) return
      setScope(scope)
      setTargetScope(scope)
    })()
    return () => {
      cancelled = true
    }
  }, [artifact, setTargetScope])

  if (!artifact) return null

  return (
    <HomeScopeContext.Provider value={scope}>
      {children}
    </HomeScopeContext.Provider>
  )
}

export default HomeScopeProvider
