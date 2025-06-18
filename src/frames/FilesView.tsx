import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import { useScope } from '@artifact/client/hooks'
import { useTargetScopeStore } from '@/shared/targetScope'
import useSelectionUpdater from '@/shared/useSelectionUpdater'

const FilesView: React.FC = () => {
  const artifactScope = useScope()
  const scope = useTargetScopeStore((s) => s.scope) ?? artifactScope
  const onSelection = useSelectionUpdater()
  if (!scope) return <div className="p-6">No target scope</div>
  return (
    <ArtifactHolder
      src="https://inverted-capital.github.io/frame-files-panel/"
      target={scope}
      diffs={[]}
      expandedAccess={[]}
      onSelection={onSelection}
      onMessage={() => {}}
      onAccessRequest={() => {}}
      onNavigateTo={() => {}}
      title="Files Panel"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default FilesView
