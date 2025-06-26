import React from 'react'
import { useTargetScopeStore } from '@/shared/targetScope'
import FrameWithDiagnostic from '@/shared/FrameWithDiagnostic'

const NappsView: React.FC = () => {
  const scope = useTargetScopeStore((s) => s.scope)
  if (!scope) return <div className="p-6">Loading target scope...</div>
  return <FrameWithDiagnostic view="napps" scope={scope} title="Napps" />
}

export default NappsView
