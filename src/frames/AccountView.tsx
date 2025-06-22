import React from 'react'
import useHomeScope from '@/shared/useHomeScope'
import FrameWithDiagnostic from '@/shared/FrameWithDiagnostic'

const AccountView: React.FC = () => {
  const scope = useHomeScope()
  if (!scope) return <div className="p-6">Loading home scope...</div>

  return (
    <FrameWithDiagnostic view="account" scope={scope} title="Account Panel" />
  )
}

export default AccountView
