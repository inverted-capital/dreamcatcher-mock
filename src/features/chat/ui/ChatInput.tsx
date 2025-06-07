import React, { useState, useRef, useEffect } from 'react'
import { Send, Paperclip, Mic } from 'lucide-react'
import { View } from '@/shared/types'
import { useChatStore } from '../state'
import { useRepoStore } from '@/features/repos/state'
import { useNavigationStore } from '@/features/navigation/state'

const ChatInput: React.FC = () => {
  const [message, setMessage] = useState('')
  const [isRecording, setIsRecording] = useState(false)

  // Get state and actions from Zustand stores
  const { addMessage, navigateTo } = useChatStore()

  const { currentRepoId, currentBranch, getRepositoryById, isHomeRepository } =
    useRepoStore()

  const currentView = useNavigationStore((state) => state.currentView)

  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const currentRepo = currentRepoId ? getRepositoryById(currentRepoId) : null

  // Auto-resize the textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = 'auto'
      // Set the height to scrollHeight to accommodate all content
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 300)}px`
    }
  }, [message])

  const handleSendMessage = () => {
    if (message.trim()) {
      // Add context to navigation item instead of message content
      const contextParts = []
      if (currentRepoId && currentRepo) {
        const repoName = isHomeRepository(currentRepoId)
          ? 'Home'
          : currentRepo.name
        contextParts.push({ type: 'repo', value: repoName })
      }
      if (currentBranch) {
        contextParts.push({ type: 'branch', value: currentBranch })
      }

      // Add user message
      addMessage({
        content: message,
        role: 'user',
        type: 'text'
      })

      // If we have context, add a navigation marker with the context
      if (contextParts.length > 0) {
        navigateTo({
          title: getCurrentView() || 'Chat',
          icon: getCurrentView()
            ? getIconForView(getCurrentView())
            : 'MessageSquare',
          view: getCurrentView() || 'chats',
          context: contextParts
        })
      }

      setMessage('')

      // Store the message for response to prevent closure issues
      const userMessageContent = message

      // Simulate AI response with a fixed message after a short delay
      setTimeout(() => {
        addMessage({
          content: `I've processed your request about "${userMessageContent.substring(0, 20)}${userMessageContent.length > 20 ? '...' : ''}" within the current context. Here's what I found:`,
          role: 'assistant',
          type: 'text'
        })
      }, 1000)
    }
  }

  // Helper to get the current view
  const getCurrentView = (): View => {
    if (currentRepoId) return 'repos'
    return currentView
  }

  // Helper to get icon name for view
  const getIconForView = (view: View): string => {
    switch (view) {
      case 'files':
        return 'Folder'
      case 'repos':
        return 'GitBranch'
      case 'chats':
        return 'MessageSquare'
      default:
        return 'MessageSquare'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const toggleRecording = () => {
    setIsRecording(!isRecording)
  }

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-start bg-gray-100 rounded-lg">
        <button
          className="p-3 text-gray-500 hover:text-gray-700 flex-shrink-0 self-center"
          aria-label="Attach file"
        >
          <Paperclip size={20} />
        </button>

        <textarea
          ref={textareaRef}
          className="flex-1 bg-transparent py-3 px-2 resize-none focus:outline-none min-h-[52px] max-h-[300px] overflow-y-auto"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={1}
        />

        <button
          className={`p-3 ${isRecording ? 'text-red-500' : 'text-gray-500 hover:text-gray-700'} flex-shrink-0 self-center`}
          onClick={toggleRecording}
          aria-label={isRecording ? 'Stop recording' : 'Start recording'}
        >
          <Mic size={20} />
        </button>

        <button
          className={`p-3 rounded-r-lg ${message.trim() ? 'text-blue-500 hover:text-blue-600' : 'text-gray-400'} flex-shrink-0 self-center`}
          onClick={handleSendMessage}
          disabled={!message.trim()}
          aria-label="Send message"
        >
          <Send size={20} />
        </button>
      </div>

      {isRecording && (
        <div className="mt-2 text-center text-sm text-red-500 animate-pulse">
          Recording... (Click mic to stop)
        </div>
      )}
    </div>
  )
}

export default ChatInput
