import { create } from 'zustand'
import { AppSnapshot } from '@/shared/types'

// Mock data for app snapshots
const mockSnapshots: AppSnapshot[] = [
  {
    id: 'snapshot-1',
    imageUrl:
      'https://images.pexels.com/photos/5483077/pexels-photo-5483077.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Repository View',
    timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    description: 'Snapshot of the repository view showing active branches'
  },
  {
    id: 'snapshot-2',
    imageUrl:
      'https://images.pexels.com/photos/5483064/pexels-photo-5483064.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
    title: 'Files Navigation',
    timestamp: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    description: 'Browsing through project file structure'
  }
]

interface ContextState {
  snapshots: AppSnapshot[]
}

interface ContextActions {
  addSnapshot: (snapshot: Omit<AppSnapshot, 'id' | 'timestamp'>) => void
  removeSnapshot: (id: string) => void
  updateSnapshot: (id: string, data: Partial<AppSnapshot>) => void
}

export const useContextStore = create<ContextState & ContextActions>()(
  (set) => ({
    // State
    snapshots: mockSnapshots,

    // Actions
    addSnapshot: (snapshot) => {
      const newSnapshot: AppSnapshot = {
        ...snapshot,
        id: `snapshot-${Date.now()}`,
        timestamp: new Date().toISOString()
      }

      set((state) => ({
        snapshots: [newSnapshot, ...state.snapshots]
      }))
    },

    removeSnapshot: (id) => {
      set((state) => ({
        snapshots: state.snapshots.filter((snapshot) => snapshot.id !== id)
      }))
    },

    updateSnapshot: (id, data) => {
      set((state) => ({
        snapshots: state.snapshots.map((snapshot) =>
          snapshot.id === id ? { ...snapshot, ...data } : snapshot
        )
      }))
    }
  })
)
