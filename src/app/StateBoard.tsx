import React, { useEffect, useState } from 'react'
import { useNavigationStore } from '@/shared/navigationState'
import type { View } from '@/shared/types'
import type { Scope } from '@artifact/client/api'
import { useTargetScopeStore } from '@/shared/targetScope'
import Target from 'lucide-react/dist/esm/icons/target'
import Settings from 'lucide-react/dist/esm/icons/settings'
import ChevronDown from 'lucide-react/dist/esm/icons/chevron-down'
import ChevronLeft from 'lucide-react/dist/esm/icons/chevron-left'
import ChevronRight from 'lucide-react/dist/esm/icons/chevron-right'
import Bug from 'lucide-react/dist/esm/icons/bug'
import ChatsView from '@/frames/ChatsView'
import FilesView from '@/frames/FilesView'
import ReposView from '@/frames/ReposView'
import BranchesView from '@/frames/BranchesView'
import HelpView from '@/frames/HelpView'
import CustomersView from '@/frames/CustomersView'
import WeatherView from '@/frames/WeatherView'
import HomeView from '@/frames/HomeView'
import InnovationsView from '@/frames/InnovationsView'
import SettingsView from '@/frames/SettingsView'
import { useFrameSrcStore } from '@/shared/frameSrc'
import AccountView from '@/frames/AccountView'
import NappsView from '@/frames/NappsView'
import TranscludesView from '@/frames/TranscludesView'
import ProcessesView from '@/frames/ProcessesView'
import ContactsView from '@/frames/ContactsView'
import EventsView from '@/frames/EventsView'

const formatScope = (scope: Scope | null): string => {
  if (!scope) return 'No target'
  const parts = [] as string[]
  const anyScope = scope as Record<string, string>
  if (anyScope.did) parts.push(anyScope.did)
  if (anyScope.repo) parts.push(anyScope.repo)
  if (anyScope.branch) parts.push(anyScope.branch)
  if (anyScope.commit) parts.push(anyScope.commit)
  if (anyScope.fiber) parts.push(anyScope.fiber)
  return parts.join(' / ')
}

const StateBoard: React.FC = () => {
  const currentView = useNavigationStore((state) => state.currentView)
  const targetScope = useTargetScopeStore((s) => s.scope)
  const [showScopeDropdown, setShowScopeDropdown] = useState(false)
  const [showStateBoard, setShowStateBoard] = useState(true)
  const [showSettingsMenu, setShowSettingsMenu] = useState(false)
  const [reloadKeys, setReloadKeys] = useState<Partial<Record<View, number>>>(
    {}
  )

  const [visitedViews, setVisitedViews] = useState<View[]>([currentView])

  useEffect(() => {
    setVisitedViews((prev) => {
      if (prev.includes(currentView)) {
        return prev
      }
      return [currentView, ...prev]
    })
  }, [currentView])

  const getViewTitle = (view: View): string => {
    switch (view) {
      case 'chats':
        return 'Chats'
      case 'contacts':
        return 'Contacts'
      case 'home-events':
        return 'Home Events'
      case 'events':
        return 'Events'
      case 'files':
        return 'Files'
      case 'repos':
        return 'Repositories'
      case 'branches':
        return 'Branches'
      case 'napps':
        return 'Natural Applications'
      case 'transcludes':
        return 'Transcludes'
      case 'processes':
        return 'Processes'
      case 'help':
        return 'Help'
      case 'customers':
        return 'Customers'
      case 'weather':
        return 'Weather'
      case 'innovations':
        return 'Innovations'
      case 'settings':
        return 'Settings'
      case 'account':
        return 'Account'
      case 'home':
      default:
        return 'Home'
    }
  }

  const renderView = (view: View) => {
    switch (view) {
      case 'chats':
        return <ChatsView />
      case 'contacts':
        return <ContactsView />
      case 'home-events':
        return <EventsView home />
      case 'events':
        return <EventsView />
      case 'files':
        return <FilesView />
      case 'repos':
        return <ReposView />
      case 'branches':
        return <BranchesView />
      case 'napps':
        return <NappsView />
      case 'transcludes':
        return <TranscludesView />
      case 'processes':
        return <ProcessesView />
      case 'help':
        return <HelpView />
      case 'customers':
        return <CustomersView />
      case 'weather':
        return <WeatherView />
      case 'innovations':
        return <InnovationsView />
      case 'settings':
        return <SettingsView />
      case 'account':
        return <AccountView />
      case 'home':
      default:
        return <HomeView />
    }
  }

  const setFrameSrc = useFrameSrcStore((s) => s.setSrc)
  const getFrameSrc = useFrameSrcStore((s) => s.getSrc)
  const resetFrameSrc = useFrameSrcStore((s) => s.resetSrc)
  const toggleDiagnostic = useFrameSrcStore((s) => s.toggleDiagnostic)
  const diagnosticEnabled = useFrameSrcStore((s) => s.diagnostic)

  const reloadCurrentView = () => {
    setReloadKeys((prev) => ({
      ...prev,
      [currentView]: (prev[currentView] ?? 0) + 1
    }))
  }

  const reloadAllViews = () => {
    setReloadKeys((prev) => {
      const next = { ...prev }
      visitedViews.forEach((view) => {
        next[view] = (next[view] ?? 0) + 1
      })
      return next
    })
  }

  const handleEditSrc = () => {
    const current = getFrameSrc(currentView)
    const next = window.prompt('Enter frame source URL', current)
    if (next) {
      setFrameSrc(currentView, next)
      reloadCurrentView()
    }
    setShowSettingsMenu(false)
  }

  return (
    <div className="h-full flex flex-col bg-white">
      {/* StateBoard Header - Clean Design Without Window Dots */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-4 py-2.5 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* StateBoard Toggle Button */}
            <button
              onClick={() => setShowStateBoard(!showStateBoard)}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white hover:shadow-sm rounded-md border border-transparent hover:border-gray-200 transition-all duration-150"
              title={showStateBoard ? 'Minimize panel' : 'Expand panel'}
            >
              {showStateBoard ? (
                <ChevronLeft size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>

            <h1 className="text-lg font-semibold text-gray-900">
              {getViewTitle(currentView)}
            </h1>
          </div>

          <div className="flex items-center space-x-2">
            {/* Target Scope Selector */}
            <div className="relative">
              <button
                onClick={() => setShowScopeDropdown(!showScopeDropdown)}
                className="flex items-center space-x-2 px-2.5 py-1.5 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-150 shadow-sm"
              >
                <Target size={14} className="text-gray-500" />
                <span className="text-gray-700 max-w-xs truncate font-medium text-xs">
                  {formatScope(targetScope)}
                </span>
                <ChevronDown size={12} className="text-gray-400" />
              </button>

              {showScopeDropdown && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
                  <div className="p-4 border-b border-gray-100">
                    <div className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
                      Current Target Scope
                    </div>
                    <div className="text-sm text-gray-900 break-all font-mono bg-gray-50 p-2 rounded">
                      {formatScope(targetScope)}
                    </div>
                  </div>
                  <div className="p-2">
                    <button
                      onClick={() => setShowScopeDropdown(false)}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* View Settings */}
            <div className="relative">
              <button
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white hover:shadow-sm rounded-md border border-transparent hover:border-gray-200 transition-all duration-150"
              >
                <Settings size={14} />
              </button>
              {showSettingsMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                  <button
                    onClick={() => {
                      reloadCurrentView()
                      setShowSettingsMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Reload Frame
                  </button>
                  <button
                    onClick={handleEditSrc}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Edit Frame Source
                  </button>
                  <button
                    onClick={() => {
                      resetFrameSrc(currentView)
                      reloadCurrentView()
                      setShowSettingsMenu(false)
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Reset Frame Source
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => {
                toggleDiagnostic()
                reloadAllViews()
              }}
              className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-white hover:shadow-sm rounded-md border border-transparent hover:border-gray-200 transition-all duration-150"
              title={
                diagnosticEnabled ? 'Disable Diagnostic' : 'Enable Diagnostic'
              }
            >
              <Bug size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* View Content */}
      {showStateBoard && (
        <div className="flex-1 overflow-y-auto bg-gray-50">
          {visitedViews.map((view) => (
            <div
              key={`${view}-${reloadKeys[view] ?? 0}`}
              className={view === currentView ? 'block' : 'hidden'}
            >
              {renderView(view)}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StateBoard
