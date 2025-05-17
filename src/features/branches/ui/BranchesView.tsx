import React, { useState } from 'react'
import {
  Github as Git,
  GitBranch,
  GitMerge,
  GitCommit,
  GitPullRequest,
  Search,
  Scissors,
  RefreshCw,
  Check,
  Plus,
  X,
  Tag,
  Clock,
  Filter,
  ArrowDown,
  ArrowUp
} from 'lucide-react'
import { useRepoStore } from '@/features/repos/state'
import { Commit } from '@/shared/types'

// Mock data for commits and branches
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

const BranchesView: React.FC = () => {
  const {
    currentRepoId,
    currentBranch,
    getRepositoryById,
    availableBranches,
    switchBranch
  } = useRepoStore()
  const currentRepo = currentRepoId ? getRepositoryById(currentRepoId) : null

  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCommit, setSelectedCommit] = useState<string | null>(null)
  const [selectedBranch, setSelectedBranch] = useState<string | null>(
    currentBranch || null
  )
  const [showCommitDetails, setShowCommitDetails] = useState<boolean>(false)
  const [newBranchName, setNewBranchName] = useState('')
  const [isCreatingBranch, setIsCreatingBranch] = useState(false)
  const [activeTab, setActiveTab] = useState<'graph' | 'branches' | 'tags'>(
    'graph'
  )

  // Filter commits based on search term and selected branch
  const filteredCommits = mockCommits.filter((commit) => {
    const matchesSearch =
      searchTerm === '' ||
      commit.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commit.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commit.shortHash.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesBranch =
      selectedBranch === null || commit.branch === selectedBranch

    return matchesSearch && matchesBranch
  })

  const handleCommitSelect = (commitId: string) => {
    if (selectedCommit === commitId) {
      setSelectedCommit(null)
      setShowCommitDetails(false)
    } else {
      setSelectedCommit(commitId)
      setShowCommitDetails(true)
    }
  }

  const handleBranchSelect = (branchName: string) => {
    setSelectedBranch(branchName)
    switchBranch(branchName)
  }

  const handleCreateBranch = () => {
    if (newBranchName.trim() && selectedCommit) {
      alert(`Creating branch '${newBranchName}' from commit ${selectedCommit}`)
      setNewBranchName('')
      setIsCreatingBranch(false)
    }
  }

  const getCommitDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Get the selected commit object
  const selectedCommitDetails = selectedCommit
    ? mockCommits.find((c) => c.id === selectedCommit)
    : null

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Git className="mr-2" size={24} />
        Git History
      </h1>

      {currentRepo ? (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center">
              <div className="flex-1">
                <h2 className="text-lg font-medium">{currentRepo.name}</h2>
                <p className="text-sm text-gray-600">
                  {currentRepo.description}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded flex items-center hover:bg-blue-100 transition-colors text-sm">
                  <RefreshCw size={14} className="mr-1" />
                  Fetch & Pull
                </button>
                <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded flex items-center hover:bg-gray-200 transition-colors text-sm">
                  <GitBranch size={14} className="mr-1" />
                  <span>{currentBranch}</span>
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left sidebar - branches and filters */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Branches</h3>
                  <button
                    className="p-1 text-gray-500 hover:text-gray-700 bg-gray-50 rounded"
                    title="Create new branch"
                    onClick={() => setIsCreatingBranch(true)}
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <div className="space-y-1">
                  {availableBranches.map((branch) => (
                    <div
                      key={branch.name}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer ${
                        selectedBranch === branch.name
                          ? 'bg-blue-50 text-blue-700'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={() => handleBranchSelect(branch.name)}
                    >
                      <div className="flex items-center">
                        <GitBranch size={16} className="mr-2 text-gray-500" />
                        <span className="text-sm">{branch.name}</span>
                        {branch.isDefault && (
                          <span className="ml-2 px-1.5 py-0.5 text-xs bg-gray-100 text-gray-800 rounded-full">
                            default
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Branch creation form */}
                {isCreatingBranch && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                    <div className="text-sm font-medium mb-2">
                      Create new branch
                    </div>
                    <input
                      type="text"
                      value={newBranchName}
                      onChange={(e) => setNewBranchName(e.target.value)}
                      placeholder="Branch name"
                      className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="text-xs text-gray-500 mb-2">
                      {selectedCommit
                        ? `Creating from: ${mockCommits.find((c) => c.id === selectedCommit)?.shortHash}`
                        : 'Select a commit to branch from'}
                    </div>
                    <div className="flex justify-end space-x-2">
                      <button
                        onClick={() => setIsCreatingBranch(false)}
                        className="px-2 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleCreateBranch}
                        className="px-2 py-1 bg-blue-500 text-white rounded-md text-sm hover:bg-blue-600 disabled:opacity-50"
                        disabled={!newBranchName.trim() || !selectedCommit}
                      >
                        Create
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h3 className="font-medium mb-3">Quick Actions</h3>
                <div className="space-y-2">
                  <button className="w-full flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm">
                    <GitMerge size={16} className="mr-2 text-purple-600" />
                    Merge Branches
                  </button>
                  <button className="w-full flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm">
                    <Tag size={16} className="mr-2 text-green-600" />
                    Create Tag
                  </button>
                  <button className="w-full flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm">
                    <Scissors size={16} className="mr-2 text-orange-600" />
                    Cherry Pick
                  </button>
                  <button className="w-full flex items-center p-2 bg-gray-50 rounded hover:bg-gray-100 transition-colors text-sm">
                    <GitPullRequest size={16} className="mr-2 text-blue-600" />
                    Create Pull Request
                  </button>
                </div>
              </div>
            </div>

            {/* Main content - commit graph, history */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <div className="flex border-b border-gray-200">
                  <button
                    className={`px-4 py-3 text-sm font-medium ${activeTab === 'graph' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
                    onClick={() => setActiveTab('graph')}
                  >
                    Commit Graph
                  </button>
                  <button
                    className={`px-4 py-3 text-sm font-medium ${activeTab === 'branches' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
                    onClick={() => setActiveTab('branches')}
                  >
                    Branches
                  </button>
                  <button
                    className={`px-4 py-3 text-sm font-medium ${activeTab === 'tags' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
                    onClick={() => setActiveTab('tags')}
                  >
                    Tags
                  </button>
                </div>

                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="relative flex-1 max-w-md">
                      <Search
                        size={16}
                        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                      <input
                        type="text"
                        placeholder="Search commits..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-9 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="flex space-x-2">
                      <button className="border border-gray-200 bg-white hover:bg-gray-50 px-3 py-2 rounded-md flex items-center text-sm transition-colors">
                        <Filter size={14} className="mr-2" />
                        Filter
                      </button>
                      <div className="border border-gray-200 rounded-md overflow-hidden flex">
                        <button
                          className="px-3 py-2 bg-white hover:bg-gray-50 text-sm flex items-center"
                          title="Older commits"
                        >
                          <ArrowDown size={14} className="mr-1" />
                          Older
                        </button>
                        <div className="border-l border-gray-200"></div>
                        <button
                          className="px-3 py-2 bg-white hover:bg-gray-50 text-sm flex items-center"
                          title="Newer commits"
                        >
                          <ArrowUp size={14} className="mr-1" />
                          Newer
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Commit list/graph */}
                  <div className="mt-4">
                    {filteredCommits.map((commit) => (
                      <div
                        key={commit.id}
                        className={`border-b border-gray-100 p-3 hover:bg-gray-50 cursor-pointer transition-colors ${
                          selectedCommit === commit.id ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => handleCommitSelect(commit.id)}
                      >
                        <div className="flex items-start">
                          <div className="text-gray-500 mr-3 mt-1">
                            <GitCommit size={16} />
                          </div>
                          <div className="flex-1">
                            <div className="font-medium">{commit.message}</div>
                            <div className="flex items-center text-sm mt-1">
                              <span className="text-blue-600 font-mono">
                                {commit.shortHash}
                              </span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-gray-600">
                                {commit.author}
                              </span>
                              <span className="mx-2 text-gray-400">•</span>
                              <span className="text-gray-500 flex items-center">
                                <Clock size={12} className="mr-1" />
                                {getCommitDate(commit.date)}
                              </span>
                            </div>
                            <div className="flex items-center mt-1">
                              <span className="px-2 py-0.5 bg-purple-100 text-purple-700 text-xs rounded-full mr-2">
                                {commit.branch}
                              </span>
                              {commit.tags?.map((tag) => (
                                <span
                                  key={tag}
                                  className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full mr-2"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Commit details panel */}
          {showCommitDetails && selectedCommitDetails && (
            <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-auto">
                <div className="flex items-center justify-between p-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium">Commit Details</h3>
                  <button
                    onClick={() => setShowCommitDetails(false)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4">
                  <div className="mb-4">
                    <div className="text-xl font-medium mb-2">
                      {selectedCommitDetails.message}
                    </div>
                    <div className="flex items-center text-sm">
                      <div className="font-mono bg-gray-100 px-2 py-1 rounded text-blue-700">
                        {selectedCommitDetails.hash}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Author
                      </div>
                      <div>{selectedCommitDetails.author}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Date
                      </div>
                      <div>{getCommitDate(selectedCommitDetails.date)}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Branch
                      </div>
                      <div className="flex items-center">
                        <GitBranch size={14} className="mr-1 text-purple-600" />
                        <span>{selectedCommitDetails.branch}</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-500">
                        Tags
                      </div>
                      <div>
                        {selectedCommitDetails.tags &&
                        selectedCommitDetails.tags.length > 0 ? (
                          <div className="flex items-center">
                            <Tag size={14} className="mr-1 text-green-600" />
                            <span>{selectedCommitDetails.tags.join(', ')}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">No tags</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium mb-2">Actions</h4>
                    <div className="flex flex-wrap gap-2">
                      <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded flex items-center text-sm hover:bg-blue-100">
                        <GitBranch size={14} className="mr-1" />
                        Create Branch
                      </button>
                      <button className="px-3 py-1.5 bg-purple-50 text-purple-600 rounded flex items-center text-sm hover:bg-purple-100">
                        <Tag size={14} className="mr-1" />
                        Create Tag
                      </button>
                      <button className="px-3 py-1.5 bg-green-50 text-green-600 rounded flex items-center text-sm hover:bg-green-100">
                        <Check size={14} className="mr-1" />
                        Checkout
                      </button>
                      <button className="px-3 py-1.5 bg-orange-50 text-orange-600 rounded flex items-center text-sm hover:bg-orange-100">
                        <Scissors size={14} className="mr-1" />
                        Cherry Pick
                      </button>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 mt-4 pt-4">
                    <h4 className="font-medium mb-2">Changes</h4>
                    <div className="bg-gray-50 p-4 rounded-md border border-gray-200 overflow-auto max-h-64">
                      <div className="font-mono text-sm text-gray-600">
                        <div className="text-green-600">
                          + Added feature components
                        </div>
                        <div className="text-green-600">
                          + Updated API client
                        </div>
                        <div className="text-red-600">
                          - Removed legacy code
                        </div>
                        <div className="text-gray-600">
                          {' '}
                          Modified test cases
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="text-gray-400 mb-2">
            <Git size={40} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No Repository Selected
          </h3>
          <p className="text-gray-500 mb-4">
            Please select a repository to view its branch and commit history
          </p>
        </div>
      )}
    </div>
  )
}

export default BranchesView
