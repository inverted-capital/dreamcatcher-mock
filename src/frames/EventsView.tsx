import React from 'react'
import { useTargetScopeStore } from '@/shared/targetScope'
import useHomeScope from '@/shared/useHomeScope'
import FrameWithDiagnostic from '@/shared/FrameWithDiagnostic'

interface EventsViewProps {
  home?: boolean
}

const EventsView: React.FC<EventsViewProps> = ({ home }) => {
  const homeScope = useHomeScope()
  const targetScope = useTargetScopeStore((s) => s.scope)

  const scope = home ? homeScope : targetScope

  if (home && !homeScope)
    return <div className="p-6">Loading home scope...</div>

  if (!home && !targetScope) return <div className="p-6">No target scope</div>

  if (!scope) return <div className="p-6">No scope</div>

  return (
    <FrameWithDiagnostic
      view={home ? 'home-events' : 'events'}
      scope={scope}
      title="Events Panel"
    />
  )
}

export default EventsView
