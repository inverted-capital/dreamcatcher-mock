import React from 'react'
import { ArrowRight, BarChart2, Clock, Sparkles } from 'lucide-react'
import { useNavigationStore } from '@/features/navigation/state'
import { useChatStore } from '@/features/chat/state'
import type { View } from '@/shared/types'

const HomeView: React.FC = () => {
  const setCurrentView = useNavigationStore((state) => state.setCurrentView)
  const navigateTo = useChatStore((state) => state.navigateTo)

  const handleNavigate = (view: View, title: string, icon: string) => {
    setCurrentView(view)
    navigateTo({
      title,
      icon,
      view
    })
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-3xl font-bold mb-2">Welcome back</h1>
      <p className="text-gray-600 mb-8">
        Here's an overview of your recent activity and suggestions.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-medium">Recent Chats</h2>
              <p className="text-sm text-gray-500">
                Continue where you left off
              </p>
            </div>
            <Clock size={20} className="text-blue-500" />
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold mr-3">
                D
              </div>
              <div className="flex-1">
                <div className="font-medium">Data Analysis</div>
                <div className="text-xs text-gray-500">2 hours ago</div>
              </div>
            </div>

            <div className="flex items-center p-2 rounded-md hover:bg-gray-50 cursor-pointer">
              <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 font-semibold mr-3">
                P
              </div>
              <div className="flex-1">
                <div className="font-medium">Product Planning</div>
                <div className="text-xs text-gray-500">Yesterday</div>
              </div>
            </div>
          </div>

          <button
            className="flex items-center text-blue-500 hover:text-blue-700 text-sm font-medium"
            onClick={() => handleNavigate('chats', 'Chats', 'MessageSquare')}
          >
            View all chats
            <ArrowRight size={14} className="ml-1" />
          </button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-medium">Analytics</h2>
              <p className="text-sm text-gray-500">Activity overview</p>
            </div>
            <BarChart2 size={20} className="text-blue-500" />
          </div>

          <div className="h-24 flex items-end space-x-1 mb-4">
            {[40, 25, 45, 30, 60, 55, 65].map((height, i) => (
              <div
                key={i}
                className="flex-1 bg-blue-100 rounded-t"
                style={{ height: `${height}%` }}
              ></div>
            ))}
          </div>

          <div className="flex justify-between text-xs text-gray-500">
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
            <div>Sun</div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="font-medium">Suggestions</h2>
              <p className="text-sm text-gray-500">Try these features</p>
            </div>
            <Sparkles size={20} className="text-blue-500" />
          </div>

          <div className="space-y-3">
            <button
              className="w-full flex items-center p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => handleNavigate('weather', 'Weather', 'Weather')}
            >
              <span className="mr-2">🌤️</span>
              <span className="text-sm">Check today's weather</span>
            </button>

            <button
              className="w-full flex items-center p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
              onClick={() => handleNavigate('customers', 'Customers', 'Users')}
            >
              <span className="mr-2">👥</span>
              <span className="text-sm">View customer list</span>
            </button>

            <button className="w-full flex items-center p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors">
              <span className="mr-2">📊</span>
              <span className="text-sm">Generate sales report</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex items-start">
          <div className="mr-4 text-2xl">💡</div>
          <div>
            <h2 className="font-medium text-lg mb-2">Pro Tip</h2>
            <p className="text-gray-700">
              You can navigate between views using the chat! Try asking for
              weather, customers, or files to see it in action.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomeView
