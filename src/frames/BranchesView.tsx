import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import { useScope } from '@artifact/client/hooks'
import { useTargetScopeStore } from '@/shared/targetScope'
import useSelectionUpdater from '@/shared/useSelectionUpdater'
import { useFrameSrcStore } from '@/shared/frameSrc'

const BranchesView: React.FC = () => {
  const artifactScope = useScope()
  const scope = useTargetScopeStore((s) => s.scope) ?? artifactScope
  const onSelection = useSelectionUpdater()
  const src = useFrameSrcStore((s) => s.getSrc('branches'))
  if (!scope) return <div className="p-6">No target scope</div>
  return (
    <ArtifactHolder
      src={src}
      target={scope}
      onSelection={onSelection}
      onNavigateTo={() => {}}
      title="Branches Panel"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default BranchesView
