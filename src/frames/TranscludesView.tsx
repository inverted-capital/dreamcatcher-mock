import React from 'react'
import useHomeScope from '@/shared/useHomeScope'
import FrameWithDiagnostic from '@/shared/FrameWithDiagnostic'

const TranscludesView: React.FC = () => {
  const scope = useHomeScope()

  if (!scope) return <div className="p-6">Loading home scope...</div>

  return (
    <FrameWithDiagnostic view="transcludes" scope={scope} title="Transcludes" />
  )
}

export default TranscludesView
