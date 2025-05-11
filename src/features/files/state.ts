import { create } from 'zustand'
import { FileItem } from '@/shared/types'
import { mockFilesForRepos } from '@/shared/mock-data/mockFilesForRepos'
import { useRepoStore } from '@/features/repos/state'

interface FilesState {
  currentFileId: string | null
  currentFolderId: string | null
  folderPathHistory: string[]
}

interface FilesActions {
  selectFile: (fileId: string | null) => void
  selectFolder: (folderId: string | null) => void
  navigateToFolder: (folderId: string | null) => void
  navigateUp: () => void
  getRepositoryFiles: () => FileItem[]
  getCurrentFile: () => FileItem | null
  getCurrentFolderContents: () => FileItem[]
  getCurrentPath: () => string
}

export const useFilesStore = create<FilesState & FilesActions>()(
  (set, get) => ({
    // State
    currentFileId: null,
    currentFolderId: null,
    folderPathHistory: [],

    // Actions
    selectFile: (fileId) => {
      set({ currentFileId: fileId })
    },

    selectFolder: (folderId) => {
      set({ currentFolderId: folderId })
    },

    navigateToFolder: (folderId) => {
      const { currentFolderId, folderPathHistory } = get()

      if (currentFolderId) {
        // Save current folder to history
        set({
          folderPathHistory: [...folderPathHistory, currentFolderId],
          currentFolderId: folderId,
          currentFileId: null // Clear file selection when navigating folders
        })
      } else {
        // No previous folder, just set the new one
        set({
          currentFolderId: folderId,
          currentFileId: null
        })
      }
    },

    navigateUp: () => {
      const { folderPathHistory } = get()

      if (folderPathHistory.length > 0) {
        // Get the last folder from history
        const newHistory = [...folderPathHistory]
        const parentFolder = newHistory.pop()

        set({
          currentFolderId: parentFolder || null,
          folderPathHistory: newHistory,
          currentFileId: null // Clear file selection when navigating folders
        })
      } else {
        // If no history, go to root
        set({
          currentFolderId: null,
          currentFileId: null
        })
      }
    },

    getRepositoryFiles: () => {
      const currentRepoId = useRepoStore.getState().currentRepoId
      const currentBranch = useRepoStore.getState().currentBranch

      if (!currentRepoId) return []

      // Get files for the current repository
      const repoFiles =
        currentRepoId === 'home-repo'
          ? mockFilesForRepos['home-repo'] || [] // Home repo files
          : mockFilesForRepos[currentRepoId] || []

      // Filter files by branch if needed
      // In a real app, this would query different files based on the branch
      return repoFiles.filter((file) => {
        // Show all files for now, but in a real app you would filter by branch
        return true
      })
    },

    getCurrentFile: () => {
      const { currentFileId } = get()
      const currentRepoId = useRepoStore.getState().currentRepoId

      if (!currentFileId || !currentRepoId) return null

      const repoFiles = mockFilesForRepos[currentRepoId] || []
      return repoFiles.find((file) => file.id === currentFileId) || null
    },

    getCurrentFolderContents: () => {
      const { currentFolderId } = get()
      const allFiles = get().getRepositoryFiles()

      if (!currentFolderId) {
        // If no folder is selected, return root level items
        return allFiles.filter((item) => !item.parentId)
      }

      // Return children of the current folder
      return allFiles.filter((item) => item.parentId === currentFolderId)
    },

    getCurrentPath: () => {
      const { currentFolderId, folderPathHistory } = get()
      const allFiles = get().getRepositoryFiles()

      if (!currentFolderId && folderPathHistory.length === 0) {
        return '/'
      }

      // Build path from folder history
      let path = '/'
      const fullPathArray = [...folderPathHistory]

      if (currentFolderId) {
        fullPathArray.push(currentFolderId)
      }

      // Map folder IDs to names
      fullPathArray.forEach((folderId) => {
        const folder = allFiles.find((file) => file.id === folderId)
        if (folder) {
          path += folder.name + '/'
        }
      })

      return path
    }
  })
)
