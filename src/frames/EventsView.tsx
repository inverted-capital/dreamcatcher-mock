import React from 'react'
import { ArtifactHolder } from '@artifact/client/react'
import { useTargetScopeStore } from '@/shared/targetScope'
import useHomeScope from '@/shared/useHomeScope'
import useSelectionUpdater from '@/shared/useSelectionUpdater'
import { useFrameSrcStore } from '@/shared/frameSrc'

interface EventsViewProps {
  home?: boolean
}

const EventsView: React.FC<EventsViewProps> = ({ home }) => {
  const homeScope = useHomeScope()
  const targetScope = useTargetScopeStore((s) => s.scope)
  const onSelection = useSelectionUpdater()
  const src = useFrameSrcStore((s) => s.getSrc(home ? 'home-events' : 'events'))

  const scope = home ? homeScope : targetScope

  if (home && !homeScope)
    return <div className="p-6">Loading home scope...</div>

  if (!home && !targetScope) return <div className="p-6">No target scope</div>

  if (!scope) return <div className="p-6">No scope</div>

  return (
    <ArtifactHolder
      src={src}
      target={scope}
      onSelection={onSelection}
      title="Events Panel"
      className="w-full h-[calc(100vh-48px)]"
    />
  )
}

export default EventsView
