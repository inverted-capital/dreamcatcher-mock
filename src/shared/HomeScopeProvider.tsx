import React, { useEffect, useState } from 'react'
import { useBaseArtifact } from '@artifact/client/hooks'
import { isBranchScope, type BranchScope } from '@artifact/client/api'
import HomeScopeContext from './homeScopeContext'

export const HomeScopeProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const artifact = useBaseArtifact()
  const [scope, setScope] = useState<BranchScope | null>(null)

  useEffect(() => {
    if (!artifact) return
    let cancelled = false
    ;(async () => {
      const [repo] = await artifact.super.ls()
      if (cancelled) return
      const repoArtifact = artifact.checkout(repo)
      const { scope } = await repoArtifact.repo.branches.default()
      if (cancelled) return
      if (isBranchScope(scope)) {
        setScope(scope)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [artifact])

  if (!artifact) return null

  return (
    <HomeScopeContext.Provider value={scope}>
      {children}
    </HomeScopeContext.Provider>
  )
}

export default HomeScopeProvider
