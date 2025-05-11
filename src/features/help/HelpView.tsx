import React from 'react'
import { HelpCircle, BookOpen, MessageCircle, FileQuestion } from 'lucide-react'

const HelpView: React.FC = () => {
  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <HelpCircle className="mr-2" size={24} />
        Help Center
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <BookOpen size={24} className="text-blue-500 mb-4" />
          <h2 className="text-lg font-medium mb-2">Documentation</h2>
          <p className="text-gray-600 mb-4">
            Explore our comprehensive guides and documentation to get the most
            out of the platform.
          </p>
          <button className="text-blue-500 hover:text-blue-700 font-medium">
            Browse docs →
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <MessageCircle size={24} className="text-blue-500 mb-4" />
          <h2 className="text-lg font-medium mb-2">Live Chat Support</h2>
          <p className="text-gray-600 mb-4">
            Connect with our support team in real-time for immediate assistance
            with any issues.
          </p>
          <button className="text-blue-500 hover:text-blue-700 font-medium">
            Start chat →
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
          <FileQuestion size={24} className="text-blue-500 mb-4" />
          <h2 className="text-lg font-medium mb-2">FAQ</h2>
          <p className="text-gray-600 mb-4">
            Find answers to commonly asked questions about features, billing,
            and troubleshooting.
          </p>
          <button className="text-blue-500 hover:text-blue-700 font-medium">
            View FAQs →
          </button>
        </div>
      </div>

      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
        <h2 className="text-lg font-medium mb-4">Quick Navigation Tips</h2>

        <div className="space-y-4">
          <div className="flex items-start">
            <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-medium mr-3 mt-1">
              1
            </div>
            <div>
              <h3 className="font-medium">Using the Chat Interface</h3>
              <p className="text-gray-600 text-sm mt-1">
                Type natural language commands to navigate, search, and perform
                actions across the platform.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-medium mr-3 mt-1">
              2
            </div>
            <div>
              <h3 className="font-medium">Navigation Markers</h3>
              <p className="text-gray-600 text-sm mt-1">
                Click on navigation markers in the chat history to quickly
                return to previous views and states.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center font-medium mr-3 mt-1">
              3
            </div>
            <div>
              <h3 className="font-medium">Sidebar Navigation</h3>
              <p className="text-gray-600 text-sm mt-1">
                Use the sidebar icons to quickly switch between main sections of
                the application.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default HelpView
