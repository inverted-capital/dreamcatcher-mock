import React, { useState } from 'react'
import {
  Lightbulb,
  Search,
  Filter,
  Link,
  ExternalLink,
  Plus,
  ChevronDown,
  ChevronRight
} from 'lucide-react'
import { Innovation } from '@/shared/types'

// Mock combined innovations data (problems and solutions)
const mockInnovations: Innovation[] = [
  // Problems (formerly issues)
  {
    id: 'problem-1',
    title: 'API response timeout on high traffic',
    description:
      'When the system experiences high traffic, API responses are timing out after 30 seconds.',
    repository: 'api-server',
    status: 'open',
    priority: 'high',
    type: 'problem',
    relatedItems: ['solution-1'],
    createdAt: '2023-05-15',
    updatedAt: '2023-06-01'
  },
  {
    id: 'problem-2',
    title: 'Mobile layout broken on small devices',
    description:
      'The layout is not rendering correctly on devices with screen width below 320px.',
    repository: 'frontend-app',
    status: 'in-progress',
    priority: 'medium',
    type: 'problem',
    relatedItems: ['solution-2'],
    createdAt: '2023-05-20',
    updatedAt: '2023-05-28'
  },
  {
    id: 'problem-3',
    title: 'Customer data not syncing with CRM',
    description:
      'Customer data updates are not being propagated to the CRM system in real-time.',
    repository: 'integration-service',
    status: 'open',
    priority: 'critical',
    type: 'problem',
    relatedItems: ['solution-3'],
    createdAt: '2023-06-01',
    updatedAt: '2023-06-02'
  },
  {
    id: 'problem-4',
    title: 'Login fails intermittently',
    description: 'Users report intermittent login failures during peak hours.',
    repository: 'auth-service',
    status: 'in-progress',
    priority: 'high',
    type: 'problem',
    relatedItems: ['solution-4'],
    createdAt: '2023-05-10',
    updatedAt: '2023-05-25'
  },
  {
    id: 'problem-5',
    title: 'Typo in welcome email',
    description:
      'There is a typo in the welcome email that is sent to new users.',
    repository: 'notification-service',
    status: 'resolved',
    priority: 'low',
    type: 'problem',
    relatedItems: ['solution-5'],
    createdAt: '2023-05-30',
    updatedAt: '2023-06-01'
  },

  // Solutions
  {
    id: 'solution-1',
    title: 'Implement connection pooling for API',
    description:
      'Reduce timeout issues by implementing a connection pool that manages and reuses connections efficiently.',
    repository: 'api-server',
    status: 'proposed',
    type: 'solution',
    relatedItems: ['problem-1', 'solution-6'],
    createdAt: '2023-06-01'
  },
  {
    id: 'solution-2',
    title: 'Add responsive breakpoints for mobile',
    description:
      'Fix mobile layout by implementing additional breakpoints and adjusting media queries for small screens.',
    repository: 'frontend-app',
    status: 'approved',
    type: 'solution',
    relatedItems: ['problem-2'],
    createdAt: '2023-05-29'
  },
  {
    id: 'solution-3',
    title: 'Update CRM integration endpoints',
    description:
      'Resolve sync issues by updating the integration to use the new CRM API endpoints and authentication method.',
    repository: 'integration-service',
    status: 'proposed',
    type: 'solution',
    relatedItems: ['problem-3'],
    createdAt: '2023-06-02'
  },
  {
    id: 'solution-4',
    title: 'Add retry logic to authentication service',
    description:
      'Implement exponential backoff retry pattern in the authentication service to handle intermittent failures.',
    repository: 'auth-service',
    status: 'implemented',
    type: 'solution',
    relatedItems: ['problem-4'],
    createdAt: '2023-05-26'
  },
  {
    id: 'solution-5',
    title: 'Fix typo in email template',
    description:
      'Update the welcome email template to fix the typo in the greeting message.',
    repository: 'notification-service',
    status: 'implemented',
    type: 'solution',
    relatedItems: ['problem-5'],
    createdAt: '2023-06-01'
  },
  {
    id: 'solution-6',
    title: 'Add data caching to improve performance',
    description:
      'Implement Redis caching for frequently accessed data to reduce database load and improve response times.',
    repository: 'api-server',
    status: 'proposed',
    type: 'solution',
    relatedItems: ['solution-1'],
    createdAt: '2023-05-20'
  }
]

const InnovationsView: React.FC = () => {
  const [sortField] = useState('createdAt')
  const [sortDirection] = useState<'asc' | 'desc'>('desc')
  const [viewMode, setViewMode] = useState<'flat' | 'tree'>('tree')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(
    () => new Set(mockInnovations.map((item) => item.id))
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [filterType, setFilterType] = useState<'all' | 'problem' | 'solution'>(
    'all'
  )
  const [showFilterMenu, setShowFilterMenu] = useState(false)

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-blue-100 text-blue-800'
      case 'in-progress':
        return 'bg-purple-100 text-purple-800'
      case 'resolved':
      case 'implemented':
        return 'bg-green-100 text-green-800'
      case 'proposed':
        return 'bg-yellow-100 text-yellow-800'
      case 'approved':
        return 'bg-indigo-100 text-indigo-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityClass = (priority: string | undefined) => {
    if (!priority) return ''

    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800'
      case 'high':
        return 'bg-orange-100 text-orange-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getTypeIcon = (type: 'problem' | 'solution') => {
    if (type === 'problem') {
      return <span className="text-red-500">⚠️</span>
    } else {
      return <span className="text-blue-500">💡</span>
    }
  }

  const toggleExpandItem = (id: string) => {
    const newExpandedItems = new Set(expandedItems)
    if (newExpandedItems.has(id)) {
      newExpandedItems.delete(id)
    } else {
      newExpandedItems.add(id)
    }
    setExpandedItems(newExpandedItems)
  }

  const filteredInnovations = mockInnovations.filter((item) => {
    const matchesSearch =
      searchTerm === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesType = filterType === 'all' || item.type === filterType

    return matchesSearch && matchesType
  })

  const sortedInnovations = [...filteredInnovations].sort((a, b) => {
    const fieldA = a[sortField as keyof Innovation]
    const fieldB = b[sortField as keyof Innovation]

    if (!fieldA && !fieldB) return 0
    if (!fieldA) return sortDirection === 'asc' ? 1 : -1
    if (!fieldB) return sortDirection === 'asc' ? -1 : 1

    if (fieldA < fieldB) return sortDirection === 'asc' ? -1 : 1
    if (fieldA > fieldB) return sortDirection === 'asc' ? 1 : -1
    return 0
  })

  // Get related items for an innovation
  const getRelatedItems = (id: string): Innovation[] => {
    const item = mockInnovations.find((i) => i.id === id)
    if (!item || !item.relatedItems || item.relatedItems.length === 0) {
      return []
    }

    return mockInnovations.filter((i) => item.relatedItems?.includes(i.id))
  }

  // Build tree structure
  const buildTree = () => {
    // First, find root items (items that are not referenced by any other item)
    const referencedIds = new Set<string>()

    sortedInnovations
      .filter((item) => item.type === 'problem')
      .forEach((item) => {
        if (item.relatedItems) {
          item.relatedItems.forEach((relId) => {
            referencedIds.add(relId)
          })
        }
      })

    // Filter to only show root items that pass the current filters
    const rootItems = sortedInnovations.filter((item) => {
      // An item is a root if no other item points to it, OR it has no related items itself
      const isRoot = !referencedIds.has(item.id)

      return isRoot
    })

    return rootItems
  }

  const renderTreeItem = (
    item: Innovation,
    level: number = 0,
    visited: Set<string> = new Set()
  ) => {
    if (visited.has(item.id)) {
      return null
    }
    const newVisited = new Set(visited)
    newVisited.add(item.id)
    const relatedItems = getRelatedItems(item.id)
    const hasChildren = relatedItems.length > 0
    const isExpanded = expandedItems.has(item.id)

    return (
      <div key={item.id} className="mb-2">
        <div
          className={`bg-white rounded-lg border ${level > 0 ? 'border-gray-200' : 'border-gray-300'} p-4 hover:shadow-sm transition-shadow`}
          style={{ marginLeft: `${level * 20}px` }}
        >
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-start">
              {hasChildren && (
                <button
                  className="mr-2 mt-1 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => toggleExpandItem(item.id)}
                >
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              )}
              <div>
                <h2 className="font-medium text-lg flex items-center">
                  {getTypeIcon(item.type)}
                  <span className="ml-2">{item.title}</span>
                </h2>

                <div className="flex items-center space-x-2 mt-1">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getStatusClass(item.status)}`}
                  >
                    {item.status.charAt(0).toUpperCase() +
                      item.status.slice(1).replace('-', ' ')}
                  </span>

                  {item.priority && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(item.priority)}`}
                    >
                      {item.priority.charAt(0).toUpperCase() +
                        item.priority.slice(1)}
                    </span>
                  )}

                  <span className="text-xs text-gray-500">
                    {item.repository}
                  </span>
                </div>
              </div>
            </div>

            <div className="text-xs text-gray-500">
              {item.updatedAt
                ? `Updated: ${item.updatedAt}`
                : `Created: ${item.createdAt}`}
            </div>
          </div>

          <p className="text-gray-600 mb-3">{item.description}</p>

          {hasChildren && !isExpanded && (
            <div
              className="text-xs text-blue-600 hover:text-blue-800 cursor-pointer"
              onClick={() => toggleExpandItem(item.id)}
            >
              Show {relatedItems.length} related item
              {relatedItems.length !== 1 ? 's' : ''}
            </div>
          )}
        </div>

        {isExpanded && hasChildren && (
          <div className="mt-1 ml-5 pl-3 border-l border-gray-200">
            {relatedItems.map((related) =>
              renderTreeItem(related, level + 1, newVisited)
            )}
          </div>
        )}
      </div>
    )
  }

  const renderFlatView = () => {
    return (
      <div className="grid grid-cols-1 gap-4">
        {sortedInnovations.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start mb-2">
              <h2 className="font-medium text-lg flex items-center">
                {getTypeIcon(item.type)}
                <span className="ml-2">{item.title}</span>
              </h2>

              <div className="flex items-center space-x-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${getStatusClass(item.status)}`}
                >
                  {item.status.charAt(0).toUpperCase() +
                    item.status.slice(1).replace('-', ' ')}
                </span>

                {item.priority && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${getPriorityClass(item.priority)}`}
                  >
                    {item.priority.charAt(0).toUpperCase() +
                      item.priority.slice(1)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-600 mb-3">{item.description}</p>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-gray-500">
                <span className="mr-3">{item.repository}</span>

                {item.relatedItems && item.relatedItems.length > 0 && (
                  <div className="flex items-center">
                    <Link size={14} className="mr-1" />
                    <span>
                      {item.relatedItems.length} related item
                      {item.relatedItems.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">
                  {item.updatedAt
                    ? `Updated: ${item.updatedAt}`
                    : `Created: ${item.createdAt}`}
                </span>
                <button className="text-blue-500 hover:text-blue-700 flex items-center">
                  <span className="mr-1">Details</span>
                  <ExternalLink size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Lightbulb className="mr-2" size={24} />
          Innovations
        </h1>

        <div className="flex space-x-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search innovations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div className="relative">
            <button
              className="border border-gray-200 bg-white hover:bg-gray-50 px-3 py-2 rounded-md flex items-center transition-colors"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            >
              <Filter size={16} className="mr-2" />
              {filterType === 'all'
                ? 'All Types'
                : filterType === 'problem'
                  ? 'Problems'
                  : 'Solutions'}
            </button>

            {showFilterMenu && (
              <div className="absolute right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="py-1">
                  <button
                    className={`w-full text-left px-4 py-2 ${filterType === 'all' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                      setFilterType('all')
                      setShowFilterMenu(false)
                    }}
                  >
                    All Types
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 ${filterType === 'problem' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                      setFilterType('problem')
                      setShowFilterMenu(false)
                    }}
                  >
                    Problems
                  </button>
                  <button
                    className={`w-full text-left px-4 py-2 ${filterType === 'solution' ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50'}`}
                    onClick={() => {
                      setFilterType('solution')
                      setShowFilterMenu(false)
                    }}
                  >
                    Solutions
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="flex border border-gray-200 rounded-md overflow-hidden">
            <button
              className={`px-3 py-2 ${viewMode === 'flat' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setViewMode('flat')}
            >
              Flat
            </button>
            <button
              className={`px-3 py-2 ${viewMode === 'tree' ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setViewMode('tree')}
            >
              Tree
            </button>
          </div>

          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors">
            <Plus size={16} className="mr-2" />
            New Innovation
          </button>
        </div>
      </div>

      {filteredInnovations.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <Lightbulb size={40} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-medium text-gray-700 mb-2">
            No innovations found
          </h2>
          <p className="text-gray-500 mb-4">
            {searchTerm
              ? `No innovations match your search "${searchTerm}"`
              : 'There are no innovations yet. Create your first one!'}
          </p>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md inline-flex items-center transition-colors">
            <Plus size={16} className="mr-2" />
            Create Innovation
          </button>
        </div>
      ) : viewMode === 'flat' ? (
        renderFlatView()
      ) : (
        <div className="space-y-4">
          {buildTree().map((item) => renderTreeItem(item))}
        </div>
      )}
    </div>
  )
}

export default InnovationsView
