import React from 'react'
import {
  ChevronDown,
  ChevronRight,
  Code,
  FileText,
  Home,
  GitBranch
} from 'lucide-react'
import { NavigationItem } from '@/shared/types'
import { useChatStore } from '../state'
import { useNavigationStore } from '@/features/navigation/state'

interface NavigationMarkerProps {
  item: NavigationItem
}

const NavigationMarker: React.FC<NavigationMarkerProps> = ({ item }) => {
  // Get state and actions from Zustand stores
  const { navigateTo, collapseNavItem, expandNavItem } = useChatStore()

  const currentView = useNavigationStore((state) => state.currentView)
  const setCurrentView = useNavigationStore((state) => state.setCurrentView)

  const isActive = currentView === item.view

  // Transclude parts from messages
  const transcludeParts = item.transcludes
    ? item.transcludes.map((context) => ({
        type: context.type,
        value: context.value
      }))
    : []

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <span className="text-sm">🏠</span>
      case 'MessageSquare':
        return <span className="text-sm">💬</span>
      case 'Folder':
        return <span className="text-sm">📁</span>
      case 'FolderGit2':
        return <span className="text-sm">⑂</span>
      case 'HelpCircle':
        return <span className="text-sm">❓</span>
      case 'Weather':
        return <span className="text-sm">🌤️</span>
      case 'Users':
        return <span className="text-sm">👥</span>
      case 'User':
        return <span className="text-sm">👤</span>
      case 'Lightbulb':
        return <span className="text-sm">💡</span>
      case 'Settings':
        return <span className="text-sm">⚙️</span>
      case 'Package':
        return <span className="text-sm">📦</span>
      default:
        return <span className="text-sm">📱</span>
    }
  }

  const handleClick = () => {
    setCurrentView(item.view)
    navigateTo({
      title: item.title,
      icon: item.icon,
      view: item.view,
      parentId: item.parentId
    })
  }

  const toggleCollapse = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (item.collapsed) {
      expandNavItem(item.id)
    } else {
      collapseNavItem(item.id)
    }
  }

  const handleTranscludeItemClick = (part: { type: string; value: string }) => {
    if (part.type === 'file') {
      setCurrentView('files')
      navigateTo({ title: 'Files', icon: 'Folder', view: 'files' })
    }
  }

  return (
    <div className="my-2">
      <div
        className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
          isActive ? 'bg-blue-100' : 'hover:bg-gray-100'
        }`}
        onClick={handleClick}
      >
        <div className="flex items-center flex-1">
          {item.children.length > 0 && (
            <button
              onClick={toggleCollapse}
              className="mr-1 text-gray-500 hover:text-gray-700"
            >
              {item.collapsed ? (
                <ChevronRight size={16} />
              ) : (
                <ChevronDown size={16} />
              )}
            </button>
          )}
          <div className="mr-2">{getIcon(item.icon)}</div>
          <div className="text-sm font-medium text-gray-700">{item.title}</div>
        </div>

        {/* Transclude decorators on the right */}
        {transcludeParts.length > 0 && (
          <div className="flex flex-wrap items-center gap-1 ml-auto">
            {transcludeParts.map((part, idx) => (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation()
                  handleTranscludeItemClick(part)
                }}
                className="inline-flex items-center text-xs px-2 py-0.5 bg-gray-100 rounded hover:bg-gray-200"
              >
                {part.type === 'home' && <Home size={10} className="mr-1" />}
                {part.type === 'repo' && <Code size={10} className="mr-1" />}
                {part.type === 'branch' && (
                  <GitBranch size={10} className="mr-1" />
                )}
                {part.type === 'file' && (
                  <FileText size={10} className="mr-1" />
                )}
                {part.value}
              </button>
            ))}
          </div>
        )}
      </div>

      {!item.collapsed && item.children.length > 0 && (
        <div className="ml-6 pl-2 border-l border-gray-200">
          {item.children.map((child) => (
            <NavigationMarker key={child.id} item={child} />
          ))}
        </div>
      )}
    </div>
  )
}

export default NavigationMarker
