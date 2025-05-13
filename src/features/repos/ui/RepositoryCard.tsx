import React, { useState } from 'react'
import {
  Star,
  FolderGit2,
  LinkIcon,
  Trash2,
  ArrowDownToLine,
  ArrowUpToLine,
  FolderOpen,
  ExternalLink,
  Home,
  Settings
} from 'lucide-react'
import { Repository } from '@/shared/types'
import { useRepoStore } from '../state'
import { useNavigationStore } from '@/features/navigation/state'
import { useChatStore } from '@/features/chat/state'
import ConfirmationModal from '../modals/ConfirmationModal'

interface RepositoryCardProps {
  repo: Repository
  isSelected: boolean
  onSettingsClick?: () => void
}

const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repo,
  isSelected,
  onSettingsClick
}) => {
  const {
    selectRepository,
    deleteRepository,
    unlinkRepository,
    isHomeRepository
  } = useRepoStore()

  const setCurrentView = useNavigationStore((state) => state.setCurrentView)
  const navigateTo = useChatStore((state) => state.navigateTo)

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showUnlinkConfirm, setShowUnlinkConfirm] = useState(false)

  const isHome = isHomeRepository(repo.id)

  const viewRepositoryFiles = (repoId: string) => {
    selectRepository(repoId)
    setCurrentView('files')
    navigateTo({
      title: 'Files',
      icon: 'Folder',
      view: 'files'
    })
  }

  const handleRepoClick = () => {
    selectRepository(repo.id)
  }

  const handlePullRepo = () => {
    // Simulate pull operation
    alert(`Pulling latest changes for repository ${repo.name}`)
  }

  const handlePushRepo = () => {
    // Simulate push operation
    alert(`Pushing changes to repository ${repo.name}`)
  }

  const handleExternalLink = () => {
    // In a real app, this would navigate to the actual repo URL
    alert(`Navigate to external repository URL`)
  }

  return (
    <div
      className={`bg-white border ${isSelected ? 'border-blue-300 ring-2 ring-blue-100' : 'border-gray-200'} rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer`}
      onClick={handleRepoClick}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-medium text-blue-600 flex items-center">
          {isHome ? (
            <Home size={18} className="mr-2" />
          ) : (
            <FolderGit2 size={18} className="mr-2" />
          )}
          {repo.name}
        </h3>
        <div className="flex items-center space-x-2">
          {isHome && (
            <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
              Personal
            </div>
          )}
          {repo.isLinked && (
            <div className="flex items-center bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
              <LinkIcon size={10} className="mr-1" />
              Linked
            </div>
          )}
          {!isHome && (
            <div className="flex items-center text-gray-500 text-sm">
              <Star size={14} className="text-yellow-500 mr-1" />
              {repo.stars}
            </div>
          )}
        </div>
      </div>

      <p className="text-sm text-gray-600 mb-3">{repo.description}</p>

      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center">
          <FolderGit2 size={14} className="mr-1" />
          <span className="bg-gray-100 px-2 py-1 rounded">
            {isHome ? 'Settings & Configuration' : repo.language}
          </span>
        </div>
        <div className="text-gray-500">
          {isHome ? 'Your main workspace' : `Updated on ${repo.lastUpdated}`}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation()
            viewRepositoryFiles(repo.id)
          }}
          className={`text-xs px-2 py-1 ${isSelected ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'} rounded flex items-center transition-colors`}
        >
          <FolderOpen size={12} className="mr-1" />
          View Files
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            onSettingsClick?.()
          }}
          className={`text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded flex items-center hover:bg-gray-100 transition-colors`}
        >
          <Settings size={12} className="mr-1" />
          Settings
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation()
            handlePullRepo()
          }}
          className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded flex items-center hover:bg-blue-100 transition-colors"
        >
          <ArrowDownToLine size={12} className="mr-1" />
          Pull
        </button>

        {!repo.isLinked && !isHome && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handlePushRepo()
            }}
            className="text-xs px-2 py-1 bg-green-50 text-green-600 rounded flex items-center hover:bg-green-100 transition-colors"
          >
            <ArrowUpToLine size={12} className="mr-1" />
            Push
          </button>
        )}

        {/* Only show delete/unlink buttons for non-home repositories */}
        {!isHome &&
          (repo.isLinked ? (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowUnlinkConfirm(true)
              }}
              className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded flex items-center hover:bg-purple-100 transition-colors ml-auto"
            >
              <LinkIcon size={12} className="mr-1" />
              Unlink
            </button>
          ) : (
            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowDeleteConfirm(true)
              }}
              className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded flex items-center hover:bg-red-100 transition-colors ml-auto"
            >
              <Trash2 size={12} className="mr-1" />
              Delete
            </button>
          ))}

        {/* External link for linked repositories */}
        {repo.isLinked && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              handleExternalLink()
            }}
            className="text-xs px-2 py-1 bg-gray-50 text-gray-600 rounded flex items-center hover:bg-gray-100 transition-colors"
          >
            <ExternalLink size={12} className="mr-1" />
            Open External
          </button>
        )}
      </div>

      {/* Confirmation Modals */}
      {showDeleteConfirm && (
        <ConfirmationModal
          title="Delete Repository"
          message={`Are you sure you want to delete ${repo.name}? This action cannot be undone.`}
          confirmText="Delete"
          confirmButtonClass="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          onConfirm={() => {
            deleteRepository(repo.id)
            setShowDeleteConfirm(false)
          }}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showUnlinkConfirm && (
        <ConfirmationModal
          title="Unlink Repository"
          message={`Are you sure you want to unlink ${repo.name}? You won't lose any data, but the repository will be removed from your list.`}
          confirmText="Unlink"
          confirmButtonClass="px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600"
          onConfirm={() => {
            unlinkRepository(repo.id)
            setShowUnlinkConfirm(false)
          }}
          onCancel={() => setShowUnlinkConfirm(false)}
        />
      )}
    </div>
  )
}

export default RepositoryCard