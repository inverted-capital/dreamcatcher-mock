import React, { useEffect, useCallback } from 'react'
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
  const { messages, sendMessage } = useChat(chatId ?? 'new')
  const valid = chatId && chatExists

  useEffect(() => {
    if (pendingMessage && valid) {
      sendMessage({ text: pendingMessage })
      setPendingMessage(null)
    }
  }, [pendingMessage, valid, sendMessage, setPendingMessage])

  const handleSend = useCallback(
    async (text: string) => {
      if (!valid) {
        const id = await newChat()
        setPendingMessage(text)
        setCurrentChatId(id)
      } else {
        sendMessage({ text })
      }
    },
    [valid, newChat, sendMessage, setCurrentChatId, setPendingMessage]
  )

  return (
    <div className="flex flex-col h-full">
      <ChatHistory
        onToggleFullscreen={onToggleFullscreen}
        isFullscreen={isFullscreen}
        chatId={chatId ?? 'new'}
        messages={messages}
      />
      <ChatInput onSendMessage={handleSend} />
    </div>
  )
}

export default Chat
