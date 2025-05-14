import { DivideIcon as LucideIcon } from 'lucide-react'

type Role = 'user' | 'assistant' | 'system'
type MessageType = 'text' | 'navigation' | 'file' | 'code'
export type View =
  | 'chats'
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
  | 'context'
  | 'messages'
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

interface Attachment {
  id: string
  name: string
  type: string
  url: string
  size?: number
}

export interface AppSnapshot {
  id: string
  imageUrl: string
  title: string
  timestamp: string
  description?: string
}

interface ContextPart {
  type: string
  value: string
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
  context?: ContextPart[] // Context information
}

export interface SidebarItem {
  icon: string
  label: string
  view: View
  action?: () => void
}

export interface Customer {
  id: string
  name: string
  email: string
  lastContact: string
  status: 'active' | 'inactive' | 'pending'
}

export interface FileItem {
  id: string
  name: string
  type: string
  size: number
  modified: string
  path: string
  isFolder?: boolean
  parentId?: string
}

export interface Repository {
  id: string
  name: string
  description: string
  stars: number
  lastUpdated: string
  language: string
  isHome?: boolean
  isLinked?: boolean // Whether this repo is linked but not owned
  parentId?: string // ID of parent repository for hierarchical structure
}

export interface Branch {
  name: string
  isDefault: boolean
}

export interface Commit {
  id: string
  hash: string
  shortHash: string
  message: string
  author: string
  date: string
  branch: string
  tags?: string[]
}

export interface WeatherData {
  location: string
  temperature: number
  condition: string
  high: number
  low: number
  precipitation: number
}

export interface Innovation {
  id: string
  title: string
  description: string
  repository: string
  status:
    | 'open'
    | 'in-progress'
    | 'resolved'
    | 'proposed'
    | 'approved'
    | 'implemented'
  priority?: 'low' | 'medium' | 'high' | 'critical'
  type: 'problem' | 'solution'
  relatedItems?: string[]
  createdAt: string
  updatedAt?: string
}

export interface Chat {
  id: string
  title: string
  lastMessage?: string
  timestamp: string
  messageIds: string[]
}

interface ConnectedMachine {
  id: string
  name: string
  lastActive: string
  isActive: boolean
}

interface UserProfile {
  name: string
  email: string
  profilePicture?: string
}

interface Remote {
  id: string
  name: string
  url: string
  type: 'fetch' | 'push' | 'both'
  isDefault: boolean
}

interface Permission {
  id: string
  name: string
  type: 'read' | 'write' | 'admin'
  scope: 'file' | 'branch' | 'repo'
  entityId?: string
  entityName?: string
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  isInherited: boolean
  inheritedFrom?: string
}

export interface Napp {
  id: string
  name: string
  description: string
  version: string
  isEnabled: boolean
  installDate: string
}

export interface Message {
  id: string
  type: 'incoming' | 'outgoing'
  channel: 'email' | 'whatsapp' | 'status' | 'system' | 'other'
  subject: string
  content: string
  sender: string
  recipient: string
  timestamp: string
  read: boolean
  status?: 'delivered' | 'pending' | 'failed'
  starred?: boolean
}

export interface Process {
  id: string
  pid: number
  name: string
  command: string
  status: 'running' | 'stopped' | 'sleeping' | 'zombie' | 'unknown'
  cpu: number
  memory: number
  user: string
  startTime: string
  parentId?: string
  children?: Process[]
}

export interface ProcessEnvironment {
  key: string
  value: string
}

export interface ProcessFile {
  id: string
  name: string
  type: 'in' | 'out' | 'err' | 'config' | 'socket' | 'other'
  size: number
  path: string
  lastAccessed?: string
}

export interface ProcessLog {
  id: string
  timestamp: string
  level: 'info' | 'warning' | 'error' | 'debug'
  message: string
}

export interface ProcessMessage {
  id: string
  type: string
  payload: Record<string, any>
  timestamp: string
  status: 'completed' | 'in-progress' | 'pending' | 'waiting'
  source: string
  target: string
  correlationId?: string
}

export interface MessageQueue {
  input: ProcessMessage[]
  output: ProcessMessage[]
}