import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import { useScope } from '@artifact/client/hooks'
import { useTargetScopeStore } from '@/shared/targetScope'

const NappsView: React.FC = () => {
  const artifactScope = useScope()
  const scope = useTargetScopeStore((s) => s.scope) ?? artifactScope
  return (
    <ArtifactHolder
      src="https://inverted-capital.github.io/frame-napps-panel/"
      target={scope}
      diffs={[]}
      expandedAccess={[]}
      onSelection={() => {}}
      onMessage={() => {}}
      onAccessRequest={() => {}}
      onNavigateTo={() => {}}
      title="Napps Panel"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default NappsView
