import { useArtifact, useJson, useDir, useStore } from '@artifact/client/hooks'
import { useCallback, useMemo, useEffect, useState } from 'react'
import schema from '@dreamcatcher/chats'
import { configSchema } from '@dreamcatcher/chats/schema'
import transport from '@dreamcatcher/chats/transport'
import {
  type UIMessage,
  useChat as aiUseChat,
  Chat
} from '@dreamcatcher/chats/react'
import Debug from 'debug'
import { z } from 'zod'
import equal from 'fast-deep-equal'
export type { UIMessage }
import { produce } from 'immer'
import delay from 'delay'

const log = Debug('artifact:useChatHooks')

const chatCache = new Map<string, Chat<UIMessage>>()

// only when the status is idle, can we use setMessages to add messages in ?
// or, just try it, add them whenever they change.

export const useChat = (chatId: string) => {
  const [chatIdCheck] = useState(chatId)
  if (chatIdCheck !== chatId) {
    throw new Error('chatId changed:' + chatIdCheck + ' -> ' + chatId)
  }

  const artifact = useArtifact()
  if (!artifact) {
    throw new Error('No artifact found')
  }

  const [messages, setMessages] = useState<UIMessage[]>([])

  const chat = useMemo(() => {
    let existing = chatCache.get(chatId)
    if (!existing) {
      existing = new Chat({
        messages: [],
        transport: transport(artifact.fibers.actions.bind(schema).generateText),
        id: chatId,
        onData: (data) => {
          log('onData', data)
        }
      })
      chatCache.set(chatId, existing)
    }
    return existing
  }, [artifact, chatId])

  const ai = aiUseChat({
    chat,
    experimental_throttle: 50
  })
  const { setMessages: aiSetMessages, sendMessage } = ai

  const messagesPath = `chats/${chatId}/messages`
  const messagesDir = useDir(messagesPath)
  const store = useStore()

  useEffect(() => {
    if (!messagesDir || !store) return
    const { readFile } = store.getState()
    const storedMessages: UIMessage[] = []
    for (const meta of messagesDir) {
      if (meta.type !== 'blob') continue
      const json = readFile(messagesPath + '/' + meta.path, transform)
      const { success, data, error } = uiMessageSchema.safeParse(json)
      if (success) {
        storedMessages.push(data as UIMessage)
      } else {
        log('error parsing message', error)
      }
    }

    if (!containsAllById(messages, storedMessages)) {
      log('setting stored messages', storedMessages)
      aiSetMessages(storedMessages)
    }
  }, [messages, store, messagesDir, messagesPath, aiSetMessages])

  useEffect(() => {
    let active = true
    delay(10).then(() => {
      // idea here is to allow the ui thread a break
      if (!active) return

      setMessages((current) => {
        if (equal(current, ai.messages)) {
          return current
        }
        const next = produce(current, (draft) => {
          const patches = createPatch(current, ai.messages)
          applyPatch(draft, patches)
        })
        if (equal(next, current)) {
          return current
        }
        return next
      })
    })
    return () => {
      active = false
    }
  }, [ai])

  return useMemo(() => ({ sendMessage, messages }), [sendMessage, messages])
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
      config: { model: 'grok-4', provider: 'xai' }
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

const containsAllById = (current: UIMessage[], incoming: UIMessage[]) => {
  const ids = new Set(current.map((m) => m.id))
  return incoming.every((msg) => ids.has(msg.id))
}

import { createPatch, applyPatch } from 'rfc6902'
