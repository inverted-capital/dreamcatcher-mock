import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import { useScope } from '@artifact/client/hooks'
import { useTargetScopeStore } from '@/shared/targetScope'
import useSelectionUpdater from '@/shared/useSelectionUpdater'

const BranchesView: React.FC = () => {
  const artifactScope = useScope()
  const scope = useTargetScopeStore((s) => s.scope) ?? artifactScope
  const onSelection = useSelectionUpdater()
  return (
    <ArtifactHolder
      src="https://inverted-capital.github.io/frame-branches-panel/"
      target={scope}
      onSelection={onSelection}
      onNavigateTo={() => {}}
      title="Branches Panel"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default BranchesView
