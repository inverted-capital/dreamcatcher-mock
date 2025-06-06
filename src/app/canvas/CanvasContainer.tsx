import React from 'react'
import { useNavigationStore } from '@/features/navigation/state'
import ChatsView from '@/features/chat/ui/ChatsView'
import FilesView from '@/features/files/ui/FilesView'
import ReposView from '@/features/repos/ui/ReposView'
import BranchesView from '@/features/branches/ui/BranchesView'
import HelpView from '@/features/help/HelpView'
import CustomersView from '@/features/customers/CustomersView'
import WeatherView from '@/features/weather/WeatherView'
import HomeView from '@/features/home/HomeView'
import InnovationsView from '@/features/innovations/InnovationsView'
import SettingsView from '@/features/settings/SettingsView'
import AccountView from '@/features/account/AccountView'
import NappsView from '@/features/napps/ui/NappsView'
import ContextView from '@/features/context/ContextView'
import MessagesView from '@/features/messages/MessagesView'
import ProcessesView from '@/features/processes/ui/ProcessesView'

const CanvasContainer: React.FC = () => {
  const currentView = useNavigationStore((state) => state.currentView)

  const renderView = () => {
    switch (currentView) {
      case 'chats':
        return <ChatsView />
      case 'files':
        return <FilesView />
      case 'repos':
        return <ReposView />
      case 'branches':
        return <BranchesView />
      case 'napps':
        return <NappsView />
      case 'context':
        return <ContextView />
      case 'messages':
        return <MessagesView />
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

  return <div className="h-full overflow-y-auto p-6">{renderView()}</div>
}

export default CanvasContainer
