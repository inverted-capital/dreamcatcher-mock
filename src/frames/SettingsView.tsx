import React from 'react'
import { useTargetScopeStore } from '@/shared/targetScope'
import FrameWithDiagnostic from '@/shared/FrameWithDiagnostic'

const SettingsView: React.FC = () => {
  const scope = useTargetScopeStore((s) => s.scope)
  if (!scope) return <div className="p-6">Loading target scope...</div>
  return <FrameWithDiagnostic view="settings" scope={scope} title="Settings" />
}

export default SettingsView
