import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import { useScope } from '@artifact/client/hooks'
import { useTargetScopeStore } from '@/shared/targetScope'

const InnovationsView: React.FC = () => {
  const artifactScope = useScope()
  const scope = useTargetScopeStore((s) => s.scope) ?? artifactScope
  return (
    <ArtifactHolder
      src="https://inverted-capital.github.io/frame-innovations-panel/"
      target={scope}
      diffs={[]}
      access={[]}
      onSelection={() => {}}
      onMessage={() => {}}
      onAccessRequest={() => {}}
      onNavigateTo={() => {}}
      title="Innovations Panel"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default InnovationsView
