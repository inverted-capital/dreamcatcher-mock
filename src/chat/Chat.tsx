import React, { useEffect } from 'react'
import { ChatHistory } from '.'
import ChatInput from './ChatInput'
import { useChat } from './useChatHooks'
import { useChatManagement } from './useChatHooks'
import { useChatStore } from './chatState'
import { useExists } from '@artifact/client/hooks'

interface ChatProps {
  onToggleFullscreen: () => void
  isFullscreen: boolean
  chatId: string | undefined
}

const Chat: React.FC<ChatProps> = ({
  onToggleFullscreen,
  isFullscreen,
  chatId
}) => {
  const { newChat } = useChatManagement()
  const setCurrentChatId = useChatStore((state) => state.setCurrentChatId)
  const pendingMessage = useChatStore((state) => state.pendingMessage)
  const setPendingMessage = useChatStore((state) => state.setPendingMessage)

  const chatExists = useExists(chatId ? `chats/${chatId}` : undefined)
  const valid = chatId && chatExists
  const ai = useChat(valid ? chatId! : 'new')

  useEffect(() => {
    if (pendingMessage && valid) {
      ai.sendMessage({ text: pendingMessage })
      setPendingMessage(null)
    }
  }, [pendingMessage, valid, ai, setPendingMessage])

  const handleSend = async (text: string) => {
    if (!valid) {
      const id = await newChat()
      setPendingMessage(text)
      setCurrentChatId(id)
    } else {
      ai.sendMessage({ text })
    }
  }

  return (
    <>
      <ChatHistory
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
        ai={ai}
      />
      <ChatInput onSendMessage={handleSend} />
    </>
  )
}

export default Chat
