import { create } from 'zustand'
import { Napp } from '@/shared/types'

// Mock data for natural applications
const mockInstalledNapps: Napp[] = [
  {
    id: '1',
    name: 'Code Formatter',
    description: 'Automatically formats code according to repository standards',
    version: '1.2.0',
    isEnabled: true,
    installDate: '2023-06-15'
  },
  {
    id: '2',
    name: 'Security Scanner',
    description: 'Scans code for security vulnerabilities and suggests fixes',
    version: '2.0.1',
    isEnabled: true,
    installDate: '2023-05-20'
  },
  {
    id: '3',
    name: 'Documentation Generator',
    description:
      'Generates documentation from code comments and project structure',
    version: '1.0.5',
    isEnabled: false,
    installDate: '2023-04-10'
  }
]

const mockAvailableNapps: Napp[] = [
  {
    id: '4',
    name: 'Database Manager',
    description:
      'Manage database schemas, migrations, and queries directly from the repository',
    version: '3.1.0',
    isEnabled: false,
    installDate: ''
  },
  {
    id: '5',
    name: 'CI/CD Pipeline',
    description:
      'Configure and manage continuous integration and deployment workflows',
    version: '2.2.1',
    isEnabled: false,
    installDate: ''
  },
  {
    id: '6',
    name: 'Test Generator',
    description: 'Generate unit and integration tests based on your codebase',
    version: '1.1.2',
    isEnabled: false,
    installDate: ''
  }
]

interface NappsState {
  installedNapps: Napp[]
  availableNapps: Napp[]
  expandedConfig: string | null
  runningNapp: string | null
  toggleNappStatus: (id: string) => void
  installNapp: (napp: Napp) => void
  uninstallNapp: (id: string) => void
  toggleConfigPanel: (id: string) => void
  runNapp: (id: string) => void
}

export const useNappsStore = create<NappsState>((set) => ({
  installedNapps: mockInstalledNapps,
  availableNapps: mockAvailableNapps,
  expandedConfig: null,
  runningNapp: null,

  toggleNappStatus: (id: string) =>
    set((state) => ({
      installedNapps: state.installedNapps.map((napp) =>
        napp.id === id ? { ...napp, isEnabled: !napp.isEnabled } : napp
      )
    })),

  installNapp: (napp: Napp) =>
    set((state) => {
      const newNapp = {
        ...napp,
        isEnabled: true,
        installDate: new Date().toISOString().split('T')[0]
      }

      return {
        installedNapps: [...state.installedNapps, newNapp],
        availableNapps: state.availableNapps.filter((n) => n.id !== napp.id)
      }
    }),

  uninstallNapp: (id: string) =>
    set((state) => {
      const nappToUninstall = state.installedNapps.find(
        (napp) => napp.id === id
      )
      if (!nappToUninstall) return state

      return {
        availableNapps: [
          ...state.availableNapps,
          {
            ...nappToUninstall,
            isEnabled: false,
            installDate: ''
          }
        ],
        installedNapps: state.installedNapps.filter((napp) => napp.id !== id)
      }
    }),

  toggleConfigPanel: (id: string) =>
    set((state) => ({
      expandedConfig: state.expandedConfig === id ? null : id
    })),

  runNapp: (id: string) =>
    set((state) => {
      if (state.runningNapp === id) {
        return { runningNapp: null }
      }

      // Start running the napp
      setTimeout(() => {
        // After simulated running, reset the running state
        set({ runningNapp: null })
        // In a real app, you might want to show a success toast or message
        alert(`Napp ${id} has completed running successfully!`)
      }, 3000)

      return { runningNapp: id }
    })
}))
