import React from 'react'
import { useTargetScopeStore } from '@/shared/targetScope'
import FrameWithDiagnostic from '@/shared/FrameWithDiagnostic'

const FilesView: React.FC = () => {
  const scope = useTargetScopeStore((s) => s.scope)
  if (!scope) return <div className="p-6">Loading target scope...</div>
  return <FrameWithDiagnostic view="files" scope={scope} title="Files" />
}

export default FilesView
