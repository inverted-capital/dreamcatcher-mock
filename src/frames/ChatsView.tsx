import React, { useCallback } from 'react'
import FrameWithDiagnostic from '@/shared/FrameWithDiagnostic'
import useHomeScope from '@/shared/useHomeScope'
import { useChatStore } from '@/chat'
import type { Scope } from '@artifact/client/api'

const ChatsView: React.FC = () => {
  const scope = useHomeScope()
  const selectOrCreateChat = useChatStore((s) => s.selectOrCreateChat)

  const handleNavigate = useCallback(
    (target: Scope) => {
      const chatId =
        (target as Record<string, string>).fiber ||
        (target as Record<string, string>).repo ||
        'unknown'
      selectOrCreateChat(chatId, target)
    },
    [selectOrCreateChat]
  )

  if (!scope) return <div className="p-6">Loading home scope...</div>

  return (
    <FrameWithDiagnostic
      view="chats"
      scope={scope}
      title="Chats"
      onNavigateTo={handleNavigate}
    />
  )
}

export default ChatsView
