import React from 'react'
import Home from 'lucide-react/dist/esm/icons/home'
import MessageSquare from 'lucide-react/dist/esm/icons/message-square'
import Folder from 'lucide-react/dist/esm/icons/folder'
import FolderGit2 from 'lucide-react/dist/esm/icons/folder-git-2'
import LogOut from 'lucide-react/dist/esm/icons/log-out'
import HelpCircle from 'lucide-react/dist/esm/icons/help-circle'
import User from 'lucide-react/dist/esm/icons/user'
import Lightbulb from 'lucide-react/dist/esm/icons/lightbulb'
import Settings from 'lucide-react/dist/esm/icons/settings'
import Package from 'lucide-react/dist/esm/icons/package'
import CloudUpload from 'lucide-react/dist/esm/icons/cloud-upload'
import GitBranch from 'lucide-react/dist/esm/icons/git-branch'
import Mail from 'lucide-react/dist/esm/icons/mail'
import Cpu from 'lucide-react/dist/esm/icons/cpu'
import UsersRound from 'lucide-react/dist/esm/icons/users-round'
import Zap from 'lucide-react/dist/esm/icons/zap'
import { SidebarItem } from '@/shared/types'
import { useNavigationStore } from '@/shared/navigationState'
import { usePrivy } from '@privy-io/react-auth'

const Sidebar: React.FC = () => {
  // Get state and actions from Zustand stores
  const currentView = useNavigationStore((state) => state.currentView)
  const setCurrentView = useNavigationStore((state) => state.setCurrentView)

  // Get the logout function from Privy
  const { logout } = usePrivy()

  const sidebarItems: SidebarItem[] = [
    { icon: 'Home', label: 'Home', view: 'home' },
    { icon: 'MessageSquare', label: 'Chats', view: 'chats' },
    { icon: 'UsersRound', label: 'Contacts', view: 'contacts' },
    { icon: 'CloudUpload', label: 'Transcludes', view: 'transcludes' },
    { icon: 'Zap', label: 'Events', view: 'home-events' },
    { icon: 'FolderGit2', label: 'Repos', view: 'repos' },
    { icon: 'GitBranch', label: 'Branches', view: 'branches' },
    { icon: 'Folder', label: 'Files', view: 'files' },
    { icon: 'Package', label: 'Napps', view: 'napps' },
    { icon: 'Cpu', label: 'Processes', view: 'processes' },
    { icon: 'Zap', label: 'Events', view: 'events' },
    { icon: 'Settings', label: 'Settings', view: 'settings' },
    { icon: 'Lightbulb', label: 'Innovations', view: 'innovations' },
    { icon: 'User', label: 'Account', view: 'account' },
    { icon: 'LogOut', label: 'Sign Out', view: 'home', action: () => logout() },
    { icon: 'HelpCircle', label: 'Help', view: 'help' }
  ]

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Home':
        return <Home size={20} />
      case 'MessageSquare':
        return <MessageSquare size={20} />
      case 'Folder':
        return <Folder size={20} />
      case 'FolderGit2':
        return <FolderGit2 size={20} />
      case 'GitBranch':
        return <GitBranch size={20} />
      case 'Lightbulb':
        return <Lightbulb size={20} />
      case 'Settings':
        return <Settings size={20} />
      case 'Package':
        return <Package size={20} />
      case 'LogOut':
        return <LogOut size={20} />
      case 'HelpCircle':
        return <HelpCircle size={20} />
      case 'User':
        return <User size={20} />
      case 'CloudUpload':
        return <CloudUpload size={20} />
      case 'Mail':
        return <Mail size={20} />
      case 'Cpu':
        return <Cpu size={20} />
      case 'UsersRound':
        return <UsersRound size={20} />
      case 'Zap':
        return <Zap size={20} />
      default:
        return <MessageSquare size={20} />
    }
  }

  const handleNavigation = (item: SidebarItem) => {
    if (item.action) {
      item.action()
    } else {
      setCurrentView(item.view)
    }
  }

  const isActive = (item: SidebarItem) => {
    return currentView === item.view && !item.action
  }

  // Group 1: User-specific items (Home, Chats, Contacts, Transcludes, Events)
  const userGroup = sidebarItems.slice(0, 5)
  // Group 2: Transclude/scope selection items (Repos, Branches, Files, Napps, Processes, Events, Settings, Innovations)
  const transcludeSelectorGroup = sidebarItems.slice(5, 13)
  // Group 3: Account and help items
  const accountGroup = sidebarItems.slice(13)

  return (
    <nav className="w-16 bg-gray-900 text-white flex flex-col items-center py-6">
      <div className="flex-1 flex flex-col">
        {/* User-specific group */}
        <div className="space-y-3 mb-6">
          {userGroup.map((item) => (
            <div key={item.label} className="relative group">
              <button
                className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                  isActive(item)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
                onClick={() => handleNavigation(item)}
                aria-label={item.label}
              >
                {getIcon(item.icon)}
              </button>
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            </div>
          ))}
        </div>

        {/* Visual separator */}
        <div className="w-8 border-t border-gray-700 mx-auto mb-6"></div>

        {/* Transclude selector group with enhanced background indicator */}
        <div className="relative mb-6">
          {/* Enhanced background indicator for the transclude selector group */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-12 h-full rounded-xl bg-gray-700 border border-gray-600 -z-10"></div>

          <div className="space-y-3 relative z-0 py-3">
            {transcludeSelectorGroup.map((item) => (
              <div key={item.label} className="relative group">
                <button
                  className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                    isActive(item)
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                  onClick={() => handleNavigation(item)}
                  aria-label={item.label}
                >
                  {getIcon(item.icon)}
                </button>
                <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-50">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Second visual separator after transclude group */}
        <div className="w-8 border-t border-gray-700 mx-auto mb-6"></div>
      </div>

      {/* Account and help items */}
      <div className="flex flex-col space-y-3">
        {accountGroup.map((item) => (
          <div key={item.label} className="relative group">
            <button
              className={`flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-colors ${
                isActive(item)
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
              }`}
              onClick={() => handleNavigation(item)}
              aria-label={item.label}
            >
              {getIcon(item.icon)}
            </button>
            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity whitespace-nowrap z-50">
              {item.label}
            </div>
          </div>
        ))}
      </div>
    </nav>
  )
}

export default Sidebar
