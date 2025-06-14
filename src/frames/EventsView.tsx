import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import { useScope } from '@artifact/client/hooks'
import type { Scope } from '@artifact/client/api'
import { useTargetScopeStore } from '@/shared/targetScope'
import useHomeScope from '@/shared/useHomeScope'

interface EventsViewProps {
  home?: boolean
}

const EventsView: React.FC<EventsViewProps> = ({ home }) => {
  const homeScope = useHomeScope()
  const artifactScope = useScope()
  const targetScope = useTargetScopeStore((s) => s.scope) ?? artifactScope

  const scope = (home ? homeScope : targetScope) as Scope

  if (home && !homeScope) return <div>Loading home scope...</div>

  return (
    <ArtifactHolder
      src="https://inverted-capital.github.io/frame-events-panel/"
      target={scope}
      diffs={[]}
      expandedAccess={[]}
      onSelection={() => {}}
      onMessage={() => {}}
      onAccessRequest={() => {}}
      onNavigateTo={() => {}}
      title="Events Panel"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default EventsView
