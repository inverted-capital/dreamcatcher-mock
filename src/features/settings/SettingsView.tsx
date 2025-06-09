import React from 'react'
import { Settings } from 'lucide-react'
const SettingsView: React.FC = () => {
  return (
    <div className="animate-fadeIn p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Settings className="mr-2" size={24} />
        Repository Settings
      </h1>
      <p>Settings management is not available.</p>
    </div>
  )
}

export default SettingsView
