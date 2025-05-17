import { create } from 'zustand'
import { Commit } from '@/shared/types'

// Mock data for commits
const mockCommits: Commit[] = [
  {
    id: 'c1',
    hash: '8a7b9c5d3e1f2a0b8c7d6e5f4a3b2c1d0e9f8a7b',
    shortHash: '8a7b9c5',
    message: 'Fix navbar responsive design issues',
    author: 'Alex Johnson',
    date: '2023-06-15T10:30:00Z',
    branch: 'main',
    tags: ['v1.2.0']
  },
  {
    id: 'c2',
    hash: '7b6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c',
    shortHash: '7b6c5d4',
    message: 'Add authentication middleware',
    author: 'Sam Davis',
    date: '2023-06-14T15:45:00Z',
    branch: 'main'
  },
  {
    id: 'c3',
    hash: '6c5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d',
    shortHash: '6c5d4e3',
    message: 'Update API documentation',
    author: 'Taylor Smith',
    date: '2023-06-13T09:15:00Z',
    branch: 'main'
  },
  {
    id: 'c4',
    hash: '5d4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e',
    shortHash: '5d4e3f2',
    message: 'Merge feature/user-profiles into develop',
    author: 'Robin Garcia',
    date: '2023-06-12T14:20:00Z',
    branch: 'develop'
  },
  {
    id: 'c5',
    hash: '4e3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f',
    shortHash: '4e3f2a1',
    message: 'Add user profile settings page',
    author: 'Casey Wilson',
    date: '2023-06-11T11:10:00Z',
    branch: 'feature/user-profiles'
  },
  {
    id: 'c6',
    hash: '3f2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4e',
    shortHash: '3f2a1b0',
    message: 'Initial implementation of user profiles',
    author: 'Casey Wilson',
    date: '2023-06-10T16:30:00Z',
    branch: 'feature/user-profiles'
  },
  {
    id: 'c7',
    hash: '2a1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4e3f',
    shortHash: '2a1b0c9',
    message: 'Fix pagination bug on dashboard',
    author: 'Alex Johnson',
    date: '2023-06-09T10:45:00Z',
    branch: 'hotfix/pagination'
  },
  {
    id: 'c8',
    hash: '1b0c9d8e7f6a5b4c3d2e1f0a9b8c7d6e5f4e3f2a',
    shortHash: '1b0c9d8',
    message: 'Update dependencies and security patches',
    author: 'Sam Davis',
    date: '2023-06-08T09:20:00Z',
    branch: 'main',
    tags: ['v1.1.0']
  }
]

interface BranchState {
  commits: Commit[]
  selectedCommit: string | null
  filteredCommits: Commit[]
  searchTerm: string
}

interface BranchActions {
  setSelectedCommit: (commitId: string | null) => void
  setSearchTerm: (term: string) => void
  getCommitById: (commitId: string) => Commit | undefined
  filterCommitsByBranch: (branchName: string | null) => void
}

export const useBranchStore = create<BranchState & BranchActions>(
  (set, get) => ({
    // State
    commits: mockCommits,
    selectedCommit: null,
    filteredCommits: mockCommits,
    searchTerm: '',

    // Actions
    setSelectedCommit: (commitId) => {
      set({ selectedCommit: commitId })
    },

    setSearchTerm: (term) => {
      set((state) => {
        const newFilteredCommits = state.commits.filter(
          (commit) =>
            commit.message.toLowerCase().includes(term.toLowerCase()) ||
            commit.author.toLowerCase().includes(term.toLowerCase()) ||
            commit.shortHash.toLowerCase().includes(term.toLowerCase())
        )
        return { searchTerm: term, filteredCommits: newFilteredCommits }
      })
    },

    getCommitById: (commitId) => {
      return get().commits.find((commit) => commit.id === commitId)
    },

    filterCommitsByBranch: (branchName) => {
      set((state) => {
        if (!branchName) {
          return { filteredCommits: state.commits }
        }

        const newFilteredCommits = state.commits.filter(
          (commit) => commit.branch === branchName
        )
        return { filteredCommits: newFilteredCommits }
      })
    }
  })
)
