import React from 'react'
import useHomeScope from '@/shared/useHomeScope'
import FrameWithDiagnostic from '@/shared/FrameWithDiagnostic'

const HomeView: React.FC = () => {
  const scope = useHomeScope()
  if (!scope) return <div className="p-6">Loading home scope...</div>

  return <FrameWithDiagnostic view="home" scope={scope} title="Home Panel" />
}

export default HomeView
