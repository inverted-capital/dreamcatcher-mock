import useHashRouter from './useHashRouter'
import useHomeScope from '@/shared/useHomeScope'
import Sidebar from './Sidebar'
import StateBoard from './StateBoard'
import { ChatHistory, ChatInput } from '@/chat'

function App() {
  useHashRouter()
  useHomeScope()
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 flex overflow-hidden bg-white">
          <div className="w-2/5 flex flex-col overflow-hidden border-r border-gray-200">
            <ChatHistory />
            <ChatInput />
          </div>
          <div className="w-3/5 overflow-hidden">
            <StateBoard />
          </div>
        </div>
      </main>
    </div>
  )
}

export default App
