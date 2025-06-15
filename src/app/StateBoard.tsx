import React, { useState } from 'react'
import { useNavigationStore } from '@/shared/navigationState'
import type { View } from '@/shared/types'
import type { Scope } from '@artifact/client/api'
import { useTargetScopeStore } from '@/shared/targetScope'
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
import AccountView from '@/frames/AccountView'
import NappsView from '@/frames/NappsView'
import TranscludesView from '@/frames/TranscludesView'
import ProcessesView from '@/frames/ProcessesView'
import ContactsView from '@/frames/ContactsView'
import EventsView from '@/frames/EventsView'

const allViews: View[] = [
  'contacts',
  'chats',
  'home-events',
  'events',
  'files',
  'repos',
  'branches',
  'help',
  'weather',
  'customers',
  'home',
  'innovations',
  'settings',
  'account',
  'napps',
  'transcludes',
  'processes'
]

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

  const [visitedViews] = useState<View[]>(() => {
    const others = allViews.filter((v) => v !== currentView)
    return [currentView, ...others]
  })

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

  return (
    <div className="h-full flex flex-col">
      <div className="h-12 flex items-center px-4 border-b bg-gray-100 text-sm text-gray-700">
        Target Scope: {formatScope(targetScope)}
      </div>
      <div className="flex-1 overflow-y-auto p-6">
        {visitedViews.map((view) => (
          <div key={view} className={view === currentView ? 'block' : 'hidden'}>
            {renderView(view)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default StateBoard
