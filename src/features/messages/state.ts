import { create } from 'zustand'
import { Message } from '@/shared/types'

// Mock messages data
const mockMessages: Message[] = [
  {
    id: 'msg-1',
    type: 'incoming',
    channel: 'email',
    subject: 'Project Status Update',
    content: 'Hello,\n\nThe project is proceeding as planned. We have completed the initial design phase and are moving into development. Please review the attached documents and provide your feedback.\n\nRegards,\nProject Manager',
    sender: 'project.manager@company.com',
    recipient: 'me@example.com',
    timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    read: true,
    starred: false
  },
  {
    id: 'msg-2',
    type: 'outgoing',
    channel: 'email',
    subject: 'Re: Project Status Update',
    content: 'Thanks for the update. I\'ll review the documents and get back to you by tomorrow.\n\nBest,\nMe',
    sender: 'me@example.com',
    recipient: 'project.manager@company.com',
    timestamp: new Date(Date.now() - 3000000).toISOString(), // 50 minutes ago
    read: true,
    status: 'delivered',
    starred: true
  },
  {
    id: 'msg-3',
    type: 'incoming',
    channel: 'whatsapp',
    subject: 'Quick Question',
    content: 'Hi there! Do you have a moment to discuss the upcoming meeting?',
    sender: 'Team Lead',
    recipient: 'me@example.com',
    timestamp: new Date(Date.now() - 1800000).toISOString(), // 30 minutes ago
    read: false,
    starred: false
  },
  {
    id: 'msg-4',
    type: 'incoming',
    channel: 'status',
    subject: 'Server Status Alert',
    content: 'WARNING: High CPU usage detected on production server.\n\nServer: prod-db-01\nCPU: 92%\nMemory: 78%\n\nPlease investigate immediately.',
    sender: 'monitoring-system',
    recipient: 'admin-team',
    timestamp: new Date(Date.now() - 900000).toISOString(), // 15 minutes ago
    read: false,
    starred: false
  },
  {
    id: 'msg-5',
    type: 'outgoing',
    channel: 'system',
    subject: 'Automated Backup Completed',
    content: 'The automated backup process has completed successfully.\n\nBackup ID: BKP-2023-06-15-001\nSize: 2.3 GB\nDuration: 8 minutes\nStatus: Success',
    sender: 'me@example.com',
    recipient: 'backup-logs',
    timestamp: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
    read: true,
    status: 'delivered',
    starred: false
  }
]

interface MessagesState {
  messages: Message[]
  markAsRead: (id: string) => void
  deleteMessage: (id: string) => void
  toggleStarred: (id: string) => void
  sendMessage: (message: Omit<Message, 'id' | 'timestamp' | 'read' | 'starred'>) => void
}

export const useMessagesStore = create<MessagesState>((set) => ({
  messages: mockMessages,
  
  markAsRead: (id: string) => {
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id ? { ...message, read: true } : message
      )
    }))
  },
  
  deleteMessage: (id: string) => {
    set((state) => ({
      messages: state.messages.filter((message) => message.id !== id)
    }))
  },
  
  toggleStarred: (id: string) => {
    set((state) => ({
      messages: state.messages.map((message) =>
        message.id === id ? { ...message, starred: !message.starred } : message
      )
    }))
  },
  
  sendMessage: (message) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: true,
      starred: false,
      ...message,
      status: 'delivered' // Assuming successful delivery for mock data
    }
    
    set((state) => ({
      messages: [newMessage, ...state.messages]
    }))
  }
}))