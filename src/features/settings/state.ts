import { create } from 'zustand'

// Define store types
interface Remote {
  id: string
  name: string
  url: string
  type: 'fetch' | 'push' | 'both'
  isDefault: boolean
}

interface Permission {
  id: string
  name: string
  type: 'read' | 'write' | 'admin'
  scope: 'file' | 'branch' | 'repo'
}

interface Role {
  id: string
  name: string
  description: string
  permissions: string[]
  isInherited: boolean
  inheritedFrom?: string
}

interface Napp {
  id: string
  name: string
  description: string
  version: string
  isEnabled: boolean
  installDate: string
}

// Mock data for settings
const mockRemotes: Remote[] = [
  {
    id: '1',
    name: 'origin',
    url: 'https://github.com/user/repo.git',
    type: 'both',
    isDefault: true
  },
  {
    id: '2',
    name: 'upstream',
    url: 'https://github.com/original/repo.git',
    type: 'fetch',
    isDefault: false
  }
]

const mockPermissions: Permission[] = [
  { id: '1', name: 'Read Files', type: 'read', scope: 'file' },
  { id: '2', name: 'Write Files', type: 'write', scope: 'file' },
  { id: '3', name: 'Merge Branches', type: 'write', scope: 'branch' },
  { id: '4', name: 'Admin Access', type: 'admin', scope: 'repo' }
]

const mockRoles: Role[] = [
  {
    id: '1',
    name: 'Viewer',
    description: 'Can view files and branches',
    permissions: ['1'],
    isInherited: false
  },
  {
    id: '2',
    name: 'Developer',
    description: 'Can modify files and create branches',
    permissions: ['1', '2', '3'],
    isInherited: false
  },
  {
    id: '3',
    name: 'Admin',
    description: 'Full access to repository',
    permissions: ['1', '2', '3', '4'],
    isInherited: true,
    inheritedFrom: 'Global Settings'
  }
]

const mockNapps: Napp[] = [
  {
    id: '1',
    name: 'Code Formatter',
    description: 'Automatically formats code on commit',
    version: '1.2.0',
    isEnabled: true,
    installDate: '2023-01-15'
  },
  {
    id: '2',
    name: 'Security Scanner',
    description: 'Scans code for vulnerabilities',
    version: '2.0.1',
    isEnabled: true,
    installDate: '2023-02-10'
  },
  {
    id: '3',
    name: 'Documentation Generator',
    description: 'Generates documentation from comments',
    version: '1.0.5',
    isEnabled: false,
    installDate: '2023-03-05'
  }
]

interface SettingsState {
  remotes: Remote[]
  permissions: Permission[]
  roles: Role[]
  napps: Napp[]
}

interface SettingsActions {
  addRemote: (name: string, url: string) => void
  removeRemote: (id: string) => void
  addNapp: (name: string) => void
  toggleNappStatus: (id: string) => void
}

export const useSettingsStore = create<SettingsState & SettingsActions>()(
  (set) => ({
    // State
    remotes: mockRemotes,
    permissions: mockPermissions,
    roles: mockRoles,
    napps: mockNapps,

    // Actions
    addRemote: (name, url) => {
      if (!name.trim() || !url.trim()) return

      const newRemote: Remote = {
        id: `${Date.now()}`,
        name,
        url,
        type: 'both',
        isDefault: false // New remotes are not default by default
      }

      set((state) => ({
        remotes: [...state.remotes, newRemote]
      }))
    },

    removeRemote: (id) => {
      set((state) => ({
        remotes: state.remotes.filter((remote) => remote.id !== id)
      }))
    },

    addNapp: (name) => {
      if (!name.trim()) return

      const newNapp: Napp = {
        id: `${Date.now()}`,
        name,
        description: 'New application',
        version: '1.0.0',
        isEnabled: true,
        installDate: new Date().toISOString().split('T')[0]
      }

      set((state) => ({
        napps: [...state.napps, newNapp]
      }))
    },

    toggleNappStatus: (id) => {
      set((state) => ({
        napps: state.napps.map((napp) =>
          napp.id === id ? { ...napp, isEnabled: !napp.isEnabled } : napp
        )
      }))
    }
  })
)
