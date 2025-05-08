import { create } from 'zustand';
import { FileItem } from '@/shared/types';
import { mockFilesForRepos } from '@/shared/mock-data/mockFilesForRepos';
import { useRepoStore } from '@/features/repos/state';

interface FilesState {
  currentFileId: string | null;
}

interface FilesActions {
  selectFile: (fileId: string | null) => void;
  getRepositoryFiles: () => FileItem[];
  getCurrentFile: () => FileItem | null;
}

export const useFilesStore = create<FilesState & FilesActions>()((set, get) => ({
  // State
  currentFileId: null,
  
  // Actions
  selectFile: (fileId) => {
    set({ currentFileId: fileId });
  },
  
  getRepositoryFiles: () => {
    const currentRepoId = useRepoStore.getState().currentRepoId;
    const currentBranch = useRepoStore.getState().currentBranch;
    
    if (!currentRepoId) return [];
    
    // Get files for the current repository
    const repoFiles = currentRepoId === 'home-repo'
      ? mockFilesForRepos['home-repo'] || [] // Home repo files
      : mockFilesForRepos[currentRepoId] || [];
    
    // Filter files by branch if needed
    // In a real app, this would query different files based on the branch
    return repoFiles.filter(file => {
      // Show all files for now, but in a real app you would filter by branch
      return true;
    });
  },
  
  getCurrentFile: () => {
    const { currentFileId } = get();
    const currentRepoId = useRepoStore.getState().currentRepoId;
    
    if (!currentFileId || !currentRepoId) return null;
    
    const repoFiles = mockFilesForRepos[currentRepoId] || [];
    return repoFiles.find(file => file.id === currentFileId) || null;
  }
}));