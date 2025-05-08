import { ChatMessage } from '@/shared/types';

export const mockMessages: ChatMessage[] = [
  {
    id: 'msg-1',
    content: 'Hello! How can I help you today?',
    role: 'assistant',
    type: 'text',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    chatId: 'chat-1'
  },
  {
    id: 'msg-2',
    content: 'Can you show me a list of my customers?',
    role: 'user',
    type: 'text',
    timestamp: new Date(Date.now() - 3500000).toISOString(),
    chatId: 'chat-1'
  },
  {
    id: 'msg-3',
    content: 'Here is a list of your customers:',
    role: 'assistant',
    type: 'text',
    timestamp: new Date(Date.now() - 3400000).toISOString(),
    chatId: 'chat-1'
  },
  {
    id: 'msg-4',
    content: 'How is the weather today?',
    role: 'user',
    type: 'text',
    timestamp: new Date(Date.now() - 1800000).toISOString(),
    chatId: 'chat-2'
  },
  {
    id: 'msg-5',
    content: 'Here is the current weather for your location:',
    role: 'assistant',
    type: 'text',
    timestamp: new Date(Date.now() - 1700000).toISOString(),
    chatId: 'chat-2'
  },
];