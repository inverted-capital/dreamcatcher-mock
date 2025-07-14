import { useArtifact, useJson, useDir, useStore } from '@artifact/client/hooks'
import { useCallback, useMemo, useEffect } from 'react'
import schema from '@dreamcatcher/chats'
import { configSchema } from '@dreamcatcher/chats/schema'
import { useChatStore } from './chatState'
import { useChat as aiUseChat, UIMessage } from '@ai-sdk/react'
import transport from '@dreamcatcher/chats/transport'
import Debug from 'debug'
import { z } from 'zod'

const log = Debug('dreamcatcher:useChatHooks')

// only when the status is idle, can we use setMessages to add messages in ?
// or, just try it, add them whenever they change.

export const useChat = () => {
  const artifact = useArtifact()
  if (!artifact) {
    throw new Error('No artifact found')
  }

  const chatId = useChatStore((s) => s.currentChatId)
  const ai = aiUseChat({
    transport: transport(artifact.fibers.actions.bind(schema).generateText),
    id: chatId
  })

  const messagesDir = useDir(chatId && `chats/${chatId}/messages`)
  const store = useStore()

  const messages = useMemo(() => {
    if (!messagesDir || !store) return []
    const { readFile } = store.getState()
    const messages: UIMessage[] = []
    for (const meta of messagesDir) {
      if (meta.type !== 'blob') continue
      const json = readFile(meta.path, transform)
      const { success, data, error } = uiMessageSchema.safeParse(json)
      if (success) {
        messages.push(data as UIMessage)
      } else {
        log('error parsing message', error)
      }
    }
    return messages
  }, [store, messagesDir])

  useEffect(() => {
    log('setting messages', messages)
    ai.setMessages(messages)
  }, [messages, ai])

  return ai
}

const transform = (bytes: Uint8Array) => {
  return JSON.parse(new TextDecoder().decode(bytes))
}

export const useChatManagement = () => {
  const artifact = useArtifact()
  if (!artifact) {
    throw new Error('No artifact found')
  }
  const newChat = useCallback(async (): Promise<string> => {
    const fns = artifact.fibers.actions.bind(schema)
    const { chatId } = await fns.newChat({
      config: { model: 'gpt-4o', provider: 'openai' }
    })
    return chatId
  }, [artifact])

  const deleteChat = useCallback(
    async (chatId: string): Promise<void> => {
      const fns = artifact.fibers.actions.bind(schema)
      await fns.deleteChat({ chatId })
    },
    [artifact]
  )

  return { newChat, deleteChat }
}

export const useConfig = (chatId: string) => {
  const json = useJson('chats/' + chatId + '/config.json')
  const { data: config, error } = configSchema.safeParse(json)
  if (error) {
    log('error parsing config', error)
  }
  const artifact = useArtifact()
  const setConfig = useCallback(
    async (config: z.infer<typeof configSchema>) => {
      if (!artifact || !chatId) {
        return
      }
      const fns = artifact.fibers.actions.bind(schema)
      await fns.updateConfig({ chatId, config })
    },
    [artifact, chatId]
  )
  if (!config || !artifact) {
    return []
  }
  return [config, setConfig]
}

const uiMessageSchema = z.object({
  id: z.string(),
  role: z.enum(['system', 'user', 'assistant']),
  parts: z.array(z.object({ type: z.string() }).passthrough())
})
