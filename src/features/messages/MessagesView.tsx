import React, { useState } from 'react'
import {
  Mail,
  Search,
  Filter,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  X,
  Trash2,
  Star,
  StarOff,
  RefreshCw,
  Send,
  PhoneCall,
  Video
} from 'lucide-react'
import { useMessagesStore } from './state'

type Channel = 'email' | 'whatsapp' | 'status' | 'system' | 'other'

const MessagesView: React.FC = () => {
  const { messages, markAsRead, deleteMessage, toggleStarred, sendMessage } =
    useMessagesStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const [filterType, setFilterType] = useState<'all' | 'incoming' | 'outgoing'>(
    'all'
  )
  const [showComposeModal, setShowComposeModal] = useState(false)
  const [newMessage, setNewMessage] = useState<{
    recipient: string
    subject: string
    content: string
    channel: Channel
  }>({
    recipient: '',
    subject: '',
    content: '',
    channel: 'email'
  })

  // Filter messages based on search term and filters
  const filteredMessages = messages.filter((message) => {
    const matchesSearch =
      searchTerm === '' ||
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.recipient.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'all' || message.type === filterType

    return matchesSearch && matchesType
  })

  const currentMessage = selectedMessage
    ? messages.find((m) => m.id === selectedMessage)
    : null

  const getChannelBadge = (channel: string) => {
    switch (channel) {
      case 'email':
        return (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
            Email
          </span>
        )
      case 'whatsapp':
        return (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
            WhatsApp
          </span>
        )
      case 'status':
        return (
          <span className="bg-purple-100 text-purple-800 text-xs px-2 py-0.5 rounded-full">
            Status Report
          </span>
        )
      case 'system':
        return (
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
            System
          </span>
        )
      default:
        return (
          <span className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
            {channel}
          </span>
        )
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()

    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    } else if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: 'short', day: 'numeric' })
    } else {
      return date.toLocaleDateString([], {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    }
  }

  const handleComposeSubmit = () => {
    sendMessage({
      type: 'outgoing',
      channel: newMessage.channel,
      subject: newMessage.subject,
      content: newMessage.content,
      recipient: newMessage.recipient,
      sender: 'me@example.com' // Would be dynamically set in a real app
    })

    setNewMessage({
      recipient: '',
      subject: '',
      content: '',
      channel: 'email'
    })

    setShowComposeModal(false)
  }

  const handleMessageClick = (messageId: string) => {
    if (selectedMessage === messageId) {
      setSelectedMessage(null)
    } else {
      setSelectedMessage(messageId)
      const message = messages.find((m) => m.id === messageId)
      if (message && !message.read) {
        markAsRead(messageId)
      }
    }
  }

  return (
    <div className="animate-fadeIn h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Mail className="mr-2" size={24} />
          Agentic Messages
        </h1>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowComposeModal(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <Plus size={16} className="mr-2" />
            New Agentic Message
          </button>

          <button className="border border-gray-200 bg-white hover:bg-gray-50 px-3 py-2 rounded-md flex items-center transition-colors">
            <RefreshCw size={16} className="mr-2" />
            Refresh
          </button>
        </div>
      </div>

      <div className="flex mb-4">
        <div className="mr-2 flex">
          <button
            className={`px-4 py-2 rounded-l-md ${filterType === 'all' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setFilterType('all')}
          >
            All
          </button>
          <button
            className={`px-4 py-2 ${filterType === 'incoming' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setFilterType('incoming')}
          >
            Incoming
          </button>
          <button
            className={`px-4 py-2 rounded-r-md ${filterType === 'outgoing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setFilterType('outgoing')}
          >
            Outgoing
          </button>
        </div>

        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search agentic messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="ml-2 relative">
          <button className="border border-gray-200 bg-white hover:bg-gray-50 px-3 py-2 rounded-md flex items-center transition-colors">
            <Filter size={16} className="mr-2" />
            Channels
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden bg-white rounded-lg border border-gray-200">
        {/* Message list */}
        <div
          className={`${selectedMessage ? 'w-2/5' : 'w-full'} border-r border-gray-200 overflow-auto`}
        >
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div
                key={message.id}
                className={`border-b border-gray-100 p-4 cursor-pointer transition-colors ${
                  selectedMessage === message.id
                    ? 'bg-blue-50'
                    : message.read
                      ? ''
                      : 'bg-gray-50'
                } hover:bg-gray-50`}
                onClick={() => handleMessageClick(message.id)}
              >
                <div className="flex justify-between items-start mb-1">
                  <div className="flex items-center">
                    {message.type === 'incoming' ? (
                      <ArrowDownLeft
                        size={14}
                        className="mr-1 text-green-500"
                      />
                    ) : (
                      <ArrowUpRight size={14} className="mr-1 text-blue-500" />
                    )}
                    <span
                      className={`font-medium ${!message.read && message.type === 'incoming' ? 'font-semibold' : ''}`}
                    >
                      {message.type === 'incoming'
                        ? message.sender
                        : message.recipient}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">
                    {formatDate(message.timestamp)}
                  </div>
                </div>

                <div className="font-medium text-sm mb-1 truncate">
                  {!message.read && message.type === 'incoming' && (
                    <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                  )}
                  {message.subject}
                </div>

                <div className="text-sm text-gray-600 truncate">
                  {message.content.substring(0, 70)}
                  {message.content.length > 70 ? '...' : ''}
                </div>

                <div className="flex justify-between items-center mt-2">
                  <div>
                    {getChannelBadge(message.channel)}
                    {message.status && (
                      <span
                        className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                          message.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : message.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {message.status}
                      </span>
                    )}
                  </div>

                  {message.starred && (
                    <Star size={14} className="text-yellow-500" />
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-gray-500 p-6">
              <Mail size={32} className="mb-2 text-gray-300" />
              <p className="text-center mb-2">
                {searchTerm
                  ? 'No agentic messages match your search criteria'
                  : 'No agentic messages to display'}
              </p>
            </div>
          )}
        </div>

        {/* Message detail view */}
        {selectedMessage && currentMessage && (
          <div className="w-3/5 overflow-auto">
            <div className="p-4 border-b border-gray-200 flex justify-between">
              <h2 className="text-xl font-medium">{currentMessage.subject}</h2>
              <div className="flex space-x-2">
                <button
                  className="text-gray-500 hover:text-yellow-500"
                  onClick={() => toggleStarred(currentMessage.id)}
                >
                  {currentMessage.starred ? (
                    <StarOff size={18} />
                  ) : (
                    <Star size={18} />
                  )}
                </button>
                <button
                  className="text-gray-500 hover:text-red-500"
                  onClick={() => {
                    deleteMessage(currentMessage.id)
                    setSelectedMessage(null)
                  }}
                >
                  <Trash2 size={18} />
                </button>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => setSelectedMessage(null)}
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="p-4 border-b border-gray-200">
              <div className="flex justify-between">
                <div>
                  <div className="mb-1">
                    <span className="text-gray-500 mr-2">From:</span>
                    <span className="font-medium">{currentMessage.sender}</span>
                  </div>
                  <div>
                    <span className="text-gray-500 mr-2">To:</span>
                    <span className="font-medium">
                      {currentMessage.recipient}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-end">
                  <div className="text-sm text-gray-500 mb-1">
                    {new Date(currentMessage.timestamp).toLocaleString()}
                  </div>
                  <div className="flex space-x-2">
                    {getChannelBadge(currentMessage.channel)}
                    {currentMessage.status && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full ${
                          currentMessage.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : currentMessage.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {currentMessage.status}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="prose max-w-none">
                {currentMessage.content.split('\n').map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="border-t border-gray-200 p-4">
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center">
                  <Send size={16} className="mr-2" />
                  Reply
                </button>

                {currentMessage.channel === 'email' && (
                  <button className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center">
                    <Send size={16} className="mr-2" />
                    Forward
                  </button>
                )}

                {currentMessage.channel === 'whatsapp' && (
                  <>
                    <button className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center">
                      <PhoneCall size={16} className="mr-2" />
                      Call
                    </button>
                    <button className="px-4 py-2 border border-gray-200 rounded-md hover:bg-gray-50 flex items-center">
                      <Video size={16} className="mr-2" />
                      Video
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compose new message modal */}
      {showComposeModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center border-b border-gray-200 p-4">
              <h3 className="text-lg font-medium">New Agentic Message</h3>
              <button
                onClick={() => setShowComposeModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Channel
                </label>
                <select
                  value={newMessage.channel}
                  onChange={(e) =>
                    setNewMessage({
                      ...newMessage,
                      channel: e.target.value as Channel
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="email">Email</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="status">Status Report</option>
                  <option value="system">System</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  To
                </label>
                <input
                  type="text"
                  value={newMessage.recipient}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, recipient: e.target.value })
                  }
                  placeholder="Recipient"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={newMessage.subject}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, subject: e.target.value })
                  }
                  placeholder="Subject"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  value={newMessage.content}
                  onChange={(e) =>
                    setNewMessage({ ...newMessage, content: e.target.value })
                  }
                  placeholder="Type your message here..."
                  rows={6}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="border-t border-gray-200 p-4 flex justify-end space-x-2">
              <button
                onClick={() => setShowComposeModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleComposeSubmit}
                disabled={
                  !newMessage.recipient ||
                  !newMessage.subject ||
                  !newMessage.content
                }
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                <Send size={16} className="mr-2" />
                Send Agentic Message
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default MessagesView
