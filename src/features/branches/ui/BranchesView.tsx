import React from 'react'
import { Github as Git } from 'lucide-react'

const BranchesView: React.FC = () => {
  return (
    <div className="animate-fadeIn p-4">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Git className="mr-2" size={24} />
        Git History
      </h1>
      <p>Branch information is not available.</p>
    </div>
  )
}

export default BranchesView
