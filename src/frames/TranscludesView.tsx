import React from 'react'
import { useScope } from '@artifact/client/hooks'
import { useTargetScopeStore } from '@/shared/targetScope'
import FrameWithDiagnostic from '@/shared/FrameWithDiagnostic'

const TranscludesView: React.FC = () => {
  const artifactScope = useScope()
  const scope = useTargetScopeStore((s) => s.scope) ?? artifactScope
  if (!scope) return <div className="p-6">No target scope</div>
  return (
    <FrameWithDiagnostic
      view="transcludes"
      scope={scope}
      title="Transcludes Panel"
    />
  )
}

export default TranscludesView
