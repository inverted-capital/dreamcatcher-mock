import React from 'react'
import useHomeScope from '@/shared/useHomeScope'
import FrameWithDiagnostic from '@/shared/FrameWithDiagnostic'

const EventsViewHome: React.FC = () => {
  const scope = useHomeScope()

  if (!scope) return <div className="p-6">Loading home scope...</div>

  return (
    <FrameWithDiagnostic view="home-events" scope={scope} title="Home Events" />
  )
}

export default EventsViewHome
