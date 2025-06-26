import React from 'react'
import FrameWithDiagnostic from '@/shared/FrameWithDiagnostic'
import useHomeScope from '@/shared/useHomeScope'

const ChatsView: React.FC = () => {
  const scope = useHomeScope()
  if (!scope) return <div className="p-6">Loading home scope...</div>

  return <FrameWithDiagnostic view="chats" scope={scope} title="Chats" />
}

export default ChatsView
