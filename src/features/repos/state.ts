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
  getRepositoryPath: (repoId: string) => Repository[];
  getRepositoryChildren: (parentId: string | null) => Repository[];
}

// Extend mock repositories to include parent-child relationships
const extendedMockRepositories = [
  ...mockRepositories.slice(0, 2), // First two repos stay at root level
  {
    ...mockRepositories[2],
    parentId: 'home-repo' // Documentation repo is under home
  },
  {
    ...mockRepositories[3],
    parentId: 'repo-1' // Design-system is under frontend-app
  },
  {
    ...mockRepositories[4],
    parentId: 'repo-2', // Mobile-app is under api-server
    isLinked: true
  },
  // Additional nested repositories for deeper hierarchy
  {
    id: 'repo-6',
    name: 'analytics-tools',
    description: 'Analytics and reporting tools',
    stars: 7,
    lastUpdated: '2023-06-01',
    language: 'JavaScript',
    parentId: 'repo-1'
  },
  {
    id: 'repo-7',
    name: 'database-migrations',
    description: 'Database migration scripts',
    stars: 3,
    lastUpdated: '2023-05-28',
    language: 'SQL',
    parentId: 'repo-2'
  },
  {
    id: 'repo-8',
    name: 'shared-components',
    description: 'Common UI components shared across projects',
    stars: 14,
    lastUpdated: '2023-06-10',
    language: 'TypeScript',
    parentId: 'repo-3'
  }
];

export const useRepoStore = create<RepositoryState>((set, get) => ({
  repositories: [
    homeRepo,
    ...extendedMockRepositories
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
    
    const { getRepositoryById, getRepositoryChildren } = get();
    const repo = getRepositoryById(repoId);
    if (repo?.isLinked) return;
    
    // Get all child repos recursively to delete them as well
    const childrenToDelete = new Set<string>();
    
    const collectChildren = (parentId: string) => {
      const children = getRepositoryChildren(parentId);
      children.forEach(child => {
        childrenToDelete.add(child.id);
        collectChildren(child.id);
      });
    };
    
    collectChildren(repoId);
    
    set(state => ({
      repositories: state.repositories.filter(repo => 
        repo.id !== repoId && !childrenToDelete.has(repo.id)
      ),
      // If we deleted the current repo, select the home repo
      currentRepoId: state.currentRepoId === repoId || childrenToDelete.has(state.currentRepoId as string) 
        ? 'home-repo' 
        : state.currentRepoId
    }));
  },
  
  unlinkRepository: (repoId: string) => {
    // Cannot unlink home repository
    if (repoId === 'home-repo') return;
    
    const { getRepositoryById, getRepositoryChildren } = get();
    const repo = getRepositoryById(repoId);
    if (!repo?.isLinked) return;
    
    // Get all child repos recursively to unlink them as well
    const childrenToUnlink = new Set<string>();
    
    const collectChildren = (parentId: string) => {
      const children = getRepositoryChildren(parentId);
      children.forEach(child => {
        childrenToUnlink.add(child.id);
        collectChildren(child.id);
      });
    };
    
    collectChildren(repoId);
    
    set(state => ({
      repositories: state.repositories.filter(repo => 
        repo.id !== repoId && !childrenToUnlink.has(repo.id)
      ),
      // If we unlinked the current repo, select the home repo
      currentRepoId: state.currentRepoId === repoId || childrenToUnlink.has(state.currentRepoId as string) 
        ? 'home-repo' 
        : state.currentRepoId
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
  },
  
  // Get full path of repositories from root to the current repository
  getRepositoryPath: (repoId: string): Repository[] => {
    const { repositories, getRepositoryById } = get();
    
    const path: Repository[] = [];
    let currentRepo = getRepositoryById(repoId);
    
    while (currentRepo) {
      path.unshift(currentRepo);
      if (currentRepo.parentId) {
        currentRepo = getRepositoryById(currentRepo.parentId);
      } else {
        break;
      }
    }
    
    return path;
  },
  
  // Get direct children of a repository
  getRepositoryChildren: (parentId: string | null): Repository[] => {
    const { repositories } = get();
    
    return repositories.filter(repo => repo.parentId === parentId);
  }
}));