import React from 'react'
import { useTargetScopeStore } from '@/shared/targetScope'
import FrameWithDiagnostic from '@/shared/FrameWithDiagnostic'

const TranscludesView: React.FC = () => {
  const scope = useTargetScopeStore((s) => s.scope)
  if (!scope) return <div className="p-6">Loading target scope...</div>
  return (
    <FrameWithDiagnostic view="transcludes" scope={scope} title="Transcludes" />
  )
}

export default TranscludesView
