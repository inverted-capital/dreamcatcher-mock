import React, { useState } from 'react'
import { X, Loader } from 'lucide-react'
import { useRepoStore } from '../state'

interface LinkRepositoryModalProps {
  onClose: () => void
}

const LinkRepositoryModal: React.FC<LinkRepositoryModalProps> = ({
  onClose
}) => {
  const { linkRepository, selectRepository } = useRepoStore()

  const [linkRepoName, setLinkRepoName] = useState('')
  const [linkRepoDesc, setLinkRepoDesc] = useState('')
  const [linkRepoUrl, setLinkRepoUrl] = useState('')
  const [linkRepoLang, setLinkRepoLang] = useState('JavaScript')
  const [isLoading, setIsLoading] = useState(false)

  const handleLinkRepo = async () => {
    if (!linkRepoName.trim()) return

    setIsLoading(true)

    try {
      // Simulate some async operation for linking
      await new Promise((resolve) => setTimeout(resolve, 800))

      const newRepo = {
        name: linkRepoName.trim(),
        description:
          linkRepoDesc.trim() ||
          `Linked repository: ${linkRepoUrl.trim() || 'No URL provided'}`,
        stars: 0,
        lastUpdated: new Date().toISOString().split('T')[0],
        language: linkRepoLang
      }

      const newRepoId = linkRepository(newRepo)
      selectRepository(newRepoId)
      onClose()
    } catch (error) {
      console.error('Error linking repository:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/20 flex items-center justify-center z-50"
      onClick={(e) => {
        e.stopPropagation()
        if (!isLoading) onClose()
      }}
    >
      <div
        className="bg-white rounded-lg p-6 shadow-xl max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium">Connect to Repository</h3>
          {!isLoading && (
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repository Name*
            </label>
            <input
              type="text"
              value={linkRepoName}
              onChange={(e) => setLinkRepoName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="company-project"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Repository URL
            </label>
            <input
              type="text"
              value={linkRepoUrl}
              onChange={(e) => setLinkRepoUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://github.com/company/project.git"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={linkRepoDesc}
              onChange={(e) => setLinkRepoDesc(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Describe the linked repository (optional)"
              rows={2}
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Primary Language
            </label>
            <select
              value={linkRepoLang}
              onChange={(e) => setLinkRepoLang(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              <option value="JavaScript">JavaScript</option>
              <option value="TypeScript">TypeScript</option>
              <option value="Python">Python</option>
              <option value="Java">Java</option>
              <option value="C#">C#</option>
              <option value="Go">Go</option>
              <option value="Rust">Rust</option>
            </select>
          </div>
        </div>

        <div className="mt-6 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleLinkRepo}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 flex items-center"
            disabled={!linkRepoName.trim() || isLoading}
          >
            {isLoading ? (
              <>
                <Loader size={16} className="mr-2 animate-spin" />
                Connecting...
              </>
            ) : (
              'Connect Repository'
            )}
          </button>
        </div>

        {isLoading && (
          <div className="mt-4 text-center text-sm text-gray-500">
            Connecting to repository, please wait...
          </div>
        )}
      </div>
    </div>
  )
}

export default LinkRepositoryModal
