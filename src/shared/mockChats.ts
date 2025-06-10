import { Chat } from '@/shared/types'

export const mockChats: Chat[] = [
  {
    id: 'chat-1',
    title: 'Customer Data Analysis',
    lastMessage: "I've processed your request. Here's what I found:",
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    messageIds: ['msg-1', 'msg-2', 'msg-3']
  },
  {
    id: 'chat-2',
    title: 'Product Planning',
    lastMessage: 'Here is the current weather for your location:',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    messageIds: ['msg-4', 'msg-5']
  },
  {
    id: 'chat-3',
    title: 'Marketing Strategy',
    lastMessage:
      'The most effective channels for your target audience are social media and email marketing.',
    timestamp: new Date(Date.now() - 345600000).toISOString(), // 4 days ago
    messageIds: []
  },
  {
    id: 'chat-4',
    title: 'Budget Review',
    lastMessage:
      "Based on the Q3 projections, we're 12% under budget for marketing expenses.",
    timestamp: new Date(Date.now() - 518400000).toISOString(), // 6 days ago
    messageIds: []
  }
]
