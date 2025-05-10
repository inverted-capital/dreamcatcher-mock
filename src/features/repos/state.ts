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
  expandedRepos: Set<string>;
  repositoryTree: Record<string, string[]>; // parentId -> childIds[]
  selectRepository: (repoId: string) => void;
  addRepository: (repo: Omit<Repository, 'id'>, parentId?: string) => string;
  deleteRepository: (repoId: string) => void;
  unlinkRepository: (repoId: string) => void;
  linkRepository: (repo: Omit<Repository, 'id'>, parentId?: string) => string;
  getRepositoryById: (repoId: string) => Repository | null;
  isHomeRepository: (repoId: string) => boolean;
  selectHomeRepository: () => void;
  filterRepositories: (query: string) => Repository[];
  viewRepositoryFiles: (repoId: string) => void;
  switchBranch: (branchName: string) => void;
  getRepositoryChildren: (repoId: string | null) => Repository[];
  toggleExpandRepository: (repoId: string) => void;
  isRepositoryExpanded: (repoId: string) => boolean;
  getRepositoryParent: (repoId: string) => string | null;
  getRepositoryPath: (repoId: string) => string;
}

// Initial repository tree structure
const initRepositoryTree = () => {
  const tree: Record<string, string[]> = {
    null: ['home-repo'] // Root level contains home repo
  };
  
  // Home repo contains some of the mock repos
  tree['home-repo'] = ['repo-1', 'repo-2'];
  
  // Some repositories have children
  tree['repo-1'] = ['repo-4'];
  tree['repo-2'] = ['repo-5'];
  tree['repo-4'] = ['repo-3'];
  
  return tree;
};

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
  expandedRepos: new Set(['home-repo']), // Home repo is expanded by default
  repositoryTree: initRepositoryTree(),
  
  selectRepository: (repoId: string) => set({ currentRepoId: repoId }),
  
  addRepository: (repo: Omit<Repository, 'id'>, parentId = 'home-repo') => {
    const newRepoId = `repo-${Date.now()}`;
    const newRepo: Repository = {
      ...repo,
      id: newRepoId,
      isLinked: false
    };
    
    set(state => {
      // Add to repositories array
      const updatedRepositories = [...state.repositories, newRepo];
      
      // Update tree structure
      const updatedTree = { ...state.repositoryTree };
      if (!updatedTree[parentId]) {
        updatedTree[parentId] = [];
      }
      updatedTree[parentId].push(newRepoId);
      
      return {
        repositories: updatedRepositories,
        repositoryTree: updatedTree
      };
    });
    
    return newRepoId;
  },
  
  deleteRepository: (repoId: string) => {
    // Cannot delete home repository
    if (repoId === 'home-repo') return;
    
    const { getRepositoryById, getRepositoryChildren } = get();
    const repo = getRepositoryById(repoId);
    if (repo?.isLinked) return;
    
    // Recursively collect all child repos to delete
    const getAllChildrenIds = (id: string): string[] => {
      const children = getRepositoryChildren(id);
      if (children.length === 0) return [id];
      
      return [id, ...children.flatMap(child => getAllChildrenIds(child.id))];
    };
    
    const repoIdsToDelete = getAllChildrenIds(repoId);
    
    set(state => {
      // Remove from repositories array
      const updatedRepositories = state.repositories.filter(repo => !repoIdsToDelete.includes(repo.id));
      
      // Update tree structure - remove from parent's children list
      const updatedTree = { ...state.repositoryTree };
      
      // Find and remove from parent
      for (const parentId in updatedTree) {
        if (updatedTree[parentId].includes(repoId)) {
          updatedTree[parentId] = updatedTree[parentId].filter(id => id !== repoId);
        }
      }
      
      // Delete entries for all deleted repos
      repoIdsToDelete.forEach(id => {
        delete updatedTree[id];
      });
      
      return {
        repositories: updatedRepositories,
        repositoryTree: updatedTree,
        // If we deleted the current repo, select the home repo
        currentRepoId: state.currentRepoId && repoIdsToDelete.includes(state.currentRepoId) 
          ? 'home-repo' 
          : state.currentRepoId
      };
    });
  },
  
  unlinkRepository: (repoId: string) => {
    // Cannot unlink home repository
    if (repoId === 'home-repo') return;
    
    const { getRepositoryById, getRepositoryChildren } = get();
    const repo = getRepositoryById(repoId);
    if (!repo?.isLinked) return;
    
    // Recursively collect all child repos to unlink
    const getAllChildrenIds = (id: string): string[] => {
      const children = getRepositoryChildren(id);
      if (children.length === 0) return [id];
      
      return [id, ...children.flatMap(child => getAllChildrenIds(child.id))];
    };
    
    const repoIdsToUnlink = getAllChildrenIds(repoId);
    
    set(state => {
      // Remove from repositories array
      const updatedRepositories = state.repositories.filter(repo => !repoIdsToUnlink.includes(repo.id));
      
      // Update tree structure - remove from parent's children list
      const updatedTree = { ...state.repositoryTree };
      
      // Find and remove from parent
      for (const parentId in updatedTree) {
        if (updatedTree[parentId].includes(repoId)) {
          updatedTree[parentId] = updatedTree[parentId].filter(id => id !== repoId);
        }
      }
      
      // Delete entries for all unlinked repos
      repoIdsToUnlink.forEach(id => {
        delete updatedTree[id];
      });
      
      return {
        repositories: updatedRepositories,
        repositoryTree: updatedTree,
        // If we unlinked the current repo, select the home repo
        currentRepoId: state.currentRepoId && repoIdsToUnlink.includes(state.currentRepoId) 
          ? 'home-repo' 
          : state.currentRepoId
      };
    });
  },
  
  linkRepository: (repo: Omit<Repository, 'id'>, parentId = 'home-repo') => {
    const newRepoId = `repo-${Date.now()}`;
    const newRepo: Repository = {
      ...repo,
      id: newRepoId,
      isLinked: true
    };
    
    set(state => {
      // Add to repositories array
      const updatedRepositories = [...state.repositories, newRepo];
      
      // Update tree structure
      const updatedTree = { ...state.repositoryTree };
      if (!updatedTree[parentId]) {
        updatedTree[parentId] = [];
      }
      updatedTree[parentId].push(newRepoId);
      
      return {
        repositories: updatedRepositories,
        repositoryTree: updatedTree
      };
    });
    
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
      return repositories;
    }
    
    const lowercaseQuery = query.toLowerCase();
    return repositories.filter(repo => 
      repo.name.toLowerCase().includes(lowercaseQuery) || 
      repo.description.toLowerCase().includes(lowercaseQuery) ||
      repo.language.toLowerCase().includes(lowercaseQuery)
    );
  },
  
  viewRepositoryFiles: (repoId: string) => {
    // Just select the repository - the actual navigation would be handled by a navigation store
    set({ currentRepoId: repoId });
  },
  
  switchBranch: (branchName: string) => {
    set({ currentBranch: branchName });
  },
  
  getRepositoryChildren: (repoId: string | null): Repository[] => {
    const { repositories, repositoryTree } = get();
    
    if (!repositoryTree[repoId]) return [];
    
    const childIds = repositoryTree[repoId];
    return childIds.map(id => repositories.find(repo => repo.id === id)).filter(Boolean) as Repository[];
  },
  
  toggleExpandRepository: (repoId: string) => {
    set(state => {
      const newExpandedRepos = new Set(state.expandedRepos);
      if (newExpandedRepos.has(repoId)) {
        newExpandedRepos.delete(repoId);
      } else {
        newExpandedRepos.add(repoId);
      }
      return { expandedRepos: newExpandedRepos };
    });
  },
  
  isRepositoryExpanded: (repoId: string): boolean => {
    const { expandedRepos } = get();
    return expandedRepos.has(repoId);
  },
  
  getRepositoryParent: (repoId: string): string | null => {
    const { repositoryTree } = get();
    
    for (const parentId in repositoryTree) {
      if (repositoryTree[parentId].includes(repoId)) {
        return parentId === 'null' ? null : parentId;
      }
    }
    
    return null;
  },
  
  getRepositoryPath: (repoId: string): string => {
    const { getRepositoryById, getRepositoryParent } = get();
    
    const path: string[] = [];
    let currentId = repoId;
    
    while (currentId) {
      const repo = getRepositoryById(currentId);
      if (repo) {
        path.unshift(repo.name);
      }
      
      currentId = getRepositoryParent(currentId) || '';
    }
    
    return path.join(' / ');
  }
}));