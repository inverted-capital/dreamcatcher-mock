import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import { useScope } from '@artifact/client/hooks'
import { useTargetScopeStore } from '@/shared/targetScope'
import useHomeScope from '@/shared/useHomeScope'

interface EventsViewProps {
  home?: boolean
}

const EventsView: React.FC<EventsViewProps> = ({ home }) => {
  const homeScope = useHomeScope()
  const artifactScope = useScope()
  const targetScope = useTargetScopeStore((s) => s.scope)

  const scope = home ? homeScope : targetScope ?? artifactScope

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
