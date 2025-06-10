import React from 'react'
import Sidebar from './Sidebar'
import ChatContainer from '@/features/chat/ui/ChatContainer'

const AppLayout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <ChatContainer />
      </main>
    </div>
  )
}

export default AppLayout
