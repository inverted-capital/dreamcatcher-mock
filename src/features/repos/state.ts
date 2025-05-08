import { create } from 'zustand';
import { Repository, Branch } from '@/shared/types';
import { mockRepositories } from '@/shared/mock-data/mockData';

// Create a home repository object
const homeRepo: Repository = {
  id: 'home-repo',
  name: 'Home',
  description: 'Your personal workspace containing all settings and configurations',
  stars: 0,
  lastUpdated: new Date().toISOString().split('T')[0],
  language: 'Markdown',
  isHome: true
};

interface RepositoryState {
  repositories: Repository[];
  currentRepoId: string | null;
  currentBranch: string;
  availableBranches: Branch[];
  selectRepository: (repoId: string) => void;
  addRepository: (repo: Omit<Repository, 'id'>) => string;
  deleteRepository: (repoId: string) => void;
  unlinkRepository: (repoId: string) => void;
  linkRepository: (repo: Omit<Repository, 'id'>) => string;
  getRepositoryById: (repoId: string) => Repository | null;
  isHomeRepository: (repoId: string) => boolean;
  selectHomeRepository: () => void;
  filterRepositories: (query: string) => Repository[];
  viewRepositoryFiles: (repoId: string) => void;
  switchBranch: (branchName: string) => void;
}

export const useRepoStore = create<RepositoryState>((set, get) => ({
  repositories: [
    homeRepo,
    ...mockRepositories
  ],
  currentRepoId: 'home-repo',
  currentBranch: 'main',
  availableBranches: [
    { name: 'main', isDefault: true },
    { name: 'develop', isDefault: false },
    { name: 'feature/new-ui', isDefault: false }
  ],
  
  selectRepository: (repoId: string) => set({ currentRepoId: repoId }),
  
  addRepository: (repo: Omit<Repository, 'id'>) => {
    const newRepoId = `repo-${Date.now()}`;
    const newRepo: Repository = {
      ...repo,
      id: newRepoId,
      isLinked: false
    };
    
    set(state => ({
      repositories: [newRepo, ...state.repositories.filter(r => r.id !== 'home-repo')]
    }));
    
    return newRepoId;
  },
  
  deleteRepository: (repoId: string) => {
    // Cannot delete home repository
    if (repoId === 'home-repo') return;
    
    const { getRepositoryById } = get();
    const repo = getRepositoryById(repoId);
    if (repo?.isLinked) return;
    
    set(state => ({
      repositories: state.repositories.filter(repo => repo.id !== repoId),
      // If we deleted the current repo, select the home repo
      currentRepoId: state.currentRepoId === repoId ? 'home-repo' : state.currentRepoId
    }));
  },
  
  unlinkRepository: (repoId: string) => {
    // Cannot unlink home repository
    if (repoId === 'home-repo') return;
    
    const { getRepositoryById } = get();
    const repo = getRepositoryById(repoId);
    if (!repo?.isLinked) return;
    
    set(state => ({
      repositories: state.repositories.filter(repo => repo.id !== repoId),
      // If we unlinked the current repo, select the home repo
      currentRepoId: state.currentRepoId === repoId ? 'home-repo' : state.currentRepoId
    }));
  },
  
  linkRepository: (repo: Omit<Repository, 'id'>) => {
    const newRepoId = `repo-${Date.now()}`;
    const newRepo: Repository = {
      ...repo,
      id: newRepoId,
      isLinked: true
    };
    
    set(state => ({
      repositories: [newRepo, ...state.repositories.filter(r => r.id !== 'home-repo')]
    }));
    
    return newRepoId;
  },
  
  getRepositoryById: (repoId: string): Repository | null => {
    const { repositories } = get();
    if (repoId === 'home-repo') {
      return homeRepo;
    }
    return repositories.find(repo => repo.id === repoId) || null;
  },
  
  isHomeRepository: (repoId: string): boolean => {
    return repoId === 'home-repo';
  },
  
  selectHomeRepository: () => set({ currentRepoId: 'home-repo' }),
  
  filterRepositories: (query: string): Repository[] => {
    const { repositories } = get();
    
    if (!query.trim()) {
      // Always show the home repository first
      const homeRepository = repositories.find(repo => repo.id === 'home-repo');
      const otherRepositories = repositories.filter(repo => repo.id !== 'home-repo');
      return homeRepository ? [homeRepository, ...otherRepositories] : repositories;
    }
    
    const lowercaseQuery = query.toLowerCase();
    const filteredRepos = repositories.filter(repo => 
      repo.name.toLowerCase().includes(lowercaseQuery) || 
      repo.description.toLowerCase().includes(lowercaseQuery) ||
      repo.language.toLowerCase().includes(lowercaseQuery)
    );
    
    // Always include home repository if it matches the search
    const homeRepository = repositories.find(repo => repo.id === 'home-repo');
    if (homeRepository && 
        (homeRepository.name.toLowerCase().includes(lowercaseQuery) || 
         homeRepository.description.toLowerCase().includes(lowercaseQuery))) {
      const reposWithoutHome = filteredRepos.filter(repo => repo.id !== 'home-repo');
      return [homeRepository, ...reposWithoutHome];
    }
    
    return filteredRepos;
  },
  
  viewRepositoryFiles: (repoId: string) => {
    // Just select the repository - the actual navigation would be handled by a navigation store
    set({ currentRepoId: repoId });
  },
  
  switchBranch: (branchName: string) => {
    set({ currentBranch: branchName });
  }
}));