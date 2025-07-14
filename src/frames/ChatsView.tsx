import React, { useCallback } from 'react'
import FrameWithDiagnostic from '@/shared/FrameWithDiagnostic'
import useHomeScope from '@/shared/useHomeScope'
import { useChatStore } from '@/chat'
import { isFileScope, type Scope } from '@artifact/client/api'

const ChatsView: React.FC = () => {
  const scope = useHomeScope()

  const setCurrentChatId = useChatStore((s) => s.setCurrentChatId)

  const handleNavigate = useCallback(
    (navigate: Scope) => {
      if (isFileScope(navigate)) {
        const { path } = navigate
        const [chats, chatId] = path.split('/')
        if (chats === 'chats' && chatId) {
          setCurrentChatId(chatId)
        }
      }
    },
    [setCurrentChatId]
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
