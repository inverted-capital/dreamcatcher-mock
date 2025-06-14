import React, { useEffect, useState } from 'react'
import { useNavigationStore } from '@/shared/navigationState'
import type { View } from '@/shared/types'
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
import AgentsView from '@/frames/AgentsView'
import EventsView from '@/frames/EventsView'

const allViews: View[] = [
  'agents',
  'chats',
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

const CanvasContainer: React.FC = () => {
  const currentView = useNavigationStore((state) => state.currentView)

  const [visitedViews] = useState<View[]>(() => {
    const others = allViews.filter((v) => v !== currentView)
    return [currentView, ...others]
  })

  const renderView = (view: View) => {
    switch (view) {
      case 'chats':
        return <ChatsView />
      case 'agents':
        return <AgentsView />
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
    <div className="h-full overflow-y-auto p-6">
      {visitedViews.map((view) => (
        <div key={view} className={view === currentView ? 'block' : 'hidden'}>
          {renderView(view)}
        </div>
      ))}
    </div>
  )
}

export default CanvasContainer
