import type { Scope } from '@artifact/client/api'

type Role = 'user' | 'assistant' | 'system'
type MessageType = 'text' | 'navigation' | 'file' | 'code'
export type View =
  | 'contacts'
  | 'chats'
  | 'home-events'
  | 'events'
  | 'files'
  | 'repos'
  | 'branches'
  | 'help'
  | 'weather'
  | 'customers'
  | 'home'
  | 'innovations'
  | 'settings'
  | 'account'
  | 'napps'
  | 'transcludes'
  | 'processes'

export interface ChatMessage {
  id: string
  content: string
  role: Role
  type: MessageType
  timestamp: string
  attachments?: Attachment[]
  chatId?: string // Reference to the chat this message belongs to
}

export interface NavigationItem {
  id: string
  title: string
  icon: string
  view: View
  timestamp: string
  collapsed?: boolean
  parentId?: string
  children: NavigationItem[]
  transcludes?: TranscludePart[] // Transclude information
}

export interface SidebarItem {
  icon: string
  label: string
  view: View
  action?: () => void
}

export interface Chat {
  id: string
  title: string
  lastMessage?: string
  timestamp: string
  messageIds: string[]
  /** The associated Artifact scope for this chat */
  scope?: Scope
}

interface TranscludePart {
  type: string
  value: string
}

interface Attachment {
  id: string
  name: string
  type: string
  url: string
  size?: number
}

export interface FileItem {
  id: string
  name: string
  type: string
  size?: number
  modified: string
  path: string
  parentId?: string
  isFolder?: boolean
}

export const validViews: readonly View[] = [
  'contacts',
  'chats',
  'home-events',
  'events',
  'files',
  'repos',
  'branches',
  'help',
  'weather',
  'customers',
  'home',
  'innovations',
  'settings',
  'account',
  'napps',
  'transcludes',
  'processes'
] as const;
