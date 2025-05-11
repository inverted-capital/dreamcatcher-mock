import React from 'react'
import { MessageSquare, Plus, Search, Clock, X } from 'lucide-react'
import { useChatStore } from '../state'
import { formatDistanceToNow } from '@/shared/utils/dateUtils'

const ChatsView: React.FC = () => {
  const {
    createNewChat,
    selectChat,
    getFilteredChats,
    currentChatId,
    setSearchQuery,
    searchQuery
  } = useChatStore()

  const handleNewChat = () => {
    createNewChat()
  }

  const handleSelectChat = (chatId: string) => {
    selectChat(chatId)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  const clearSearch = () => {
    setSearchQuery('')
  }

  const chats = getFilteredChats()

  return (
    <div className="animate-fadeIn h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <MessageSquare className="mr-2" size={24} />
          Recent Chats
        </h1>

        <button
          onClick={handleNewChat}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
        >
          <Plus size={16} className="mr-2" />
          New Chat
        </button>
      </div>

      <div className="relative mb-4">
        <Search
          size={16}
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
        />
        <input
          type="text"
          placeholder="Search chats..."
          value={searchQuery}
          onChange={handleSearch}
          className="pl-9 pr-9 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        {searchQuery && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X size={16} />
          </button>
        )}
      </div>

      <div className="overflow-y-auto flex-1">
        <div className="grid grid-cols-1 gap-3">
          {chats.length > 0 ? (
            chats.map((chat) => (
              <div
                key={chat.id}
                className={`bg-white border ${
                  currentChatId === chat.id
                    ? 'border-blue-500 ring-2 ring-blue-100'
                    : 'border-gray-200'
                } rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer`}
                onClick={() => handleSelectChat(chat.id)}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className="font-medium">{chat.title}</div>
                  <div className="text-xs text-gray-500 flex items-center">
                    <Clock size={12} className="mr-1" />
                    {formatDistanceToNow(new Date(chat.timestamp))}
                  </div>
                </div>
                {chat.lastMessage && (
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {chat.lastMessage}
                  </p>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              {searchQuery ? 'No chats match your search' : 'No chats yet'}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ChatsView
