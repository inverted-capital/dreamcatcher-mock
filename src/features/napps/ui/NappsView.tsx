import React from 'react'
import { Package } from 'lucide-react'

const NappsView: React.FC = () => {
  return (
    <div className="animate-fadeIn p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Package className="mr-2" size={24} />
        Natural Applications
      </h1>
      <p>Napp management is not available.</p>
    </div>
  )
}

export default NappsView
