import React, { useState, useEffect } from 'react'
import {
  Cpu,
  Search,
  RefreshCw,
  Activity,
  List,
  ChevronRight,
  ChevronDown,
  Play,
  Square,
  X,
  Info,
  Terminal,
  FileText,
  Settings,
  Eye,
  Code,
  Filter,
  BarChart,
  MessageSquare,
  ArrowDown,
  ArrowUp,
  Check,
  Clock3,
  Loader,
  HelpCircle,
  BugPlay
} from 'lucide-react'
import { useProcessesStore } from '../state'
import { Process, ProcessMessage } from '@/shared/types'

const ProcessesView: React.FC = () => {
  const {
    selectedProcessId,
    expandedProcessIds,
    searchTerm,
    viewType,
    currentTabName,
    selectProcess,
    toggleExpandProcess,
    expandAllProcesses,
    collapseAllProcesses,
    setSearchTerm,
    setViewType,
    setCurrentTab,
    getProcessById,
    getProcessFiles,
    getProcessLogs,
    getProcessEnv,
    getProcessMessageQueue,
    getFilteredProcesses
  } = useProcessesStore()

  const [sortBy, setSortBy] = useState<'pid' | 'name' | 'cpu' | 'memory'>('pid')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [showFilterOptions, setShowFilterOptions] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string | null>(null)
  const [userFilter, setUserFilter] = useState<string | null>(null)
  const [activeMessageTab, setActiveMessageTab] = useState<'input' | 'output'>(
    'input'
  )
  const [expandedMessageId, setExpandedMessageId] = useState<string | null>(
    null
  )

  // Get the selected process
  const selectedProcess = selectedProcessId
    ? getProcessById(selectedProcessId)
    : null

  // Get files, logs, and environment variables for the selected process
  const processFiles = selectedProcessId
    ? getProcessFiles(selectedProcessId)
    : []
  const processLogs = selectedProcessId ? getProcessLogs(selectedProcessId) : []
  const processEnv = selectedProcessId ? getProcessEnv(selectedProcessId) : []
  const processMessageQueue = selectedProcessId
    ? getProcessMessageQueue(selectedProcessId)
    : undefined

  // Get filtered processes
  const filteredProcesses = getFilteredProcesses()

  // Effect to auto-refresh data (simulate in real app)
  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, this would fetch fresh process data
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // Format timestamp to relative time
  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`
    return `${Math.floor(diffInSeconds / 86400)}d ago`
  }

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  // Format uptime
  const formatUptime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

    const days = Math.floor(diffInSeconds / 86400)
    const hours = Math.floor((diffInSeconds % 86400) / 3600)
    const minutes = Math.floor((diffInSeconds % 3600) / 60)

    if (days > 0) return `${days}d ${hours}h ${minutes}m`
    if (hours > 0) return `${hours}h ${minutes}m`
    return `${minutes}m ${diffInSeconds % 60}s`
  }

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800'
      case 'stopped':
        return 'bg-red-100 text-red-800'
      case 'sleeping':
        return 'bg-blue-100 text-blue-800'
      case 'zombie':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  // Get message status color and icon
  const getMessageStatusInfo = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          color: 'text-green-500',
          bgColor: 'bg-green-100',
          icon: <Check size={14} />
        }
      case 'in-progress':
        return {
          color: 'text-blue-500',
          bgColor: 'bg-blue-100',
          icon: <Loader size={14} className="animate-spin" />
        }
      case 'pending':
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          icon: <Clock3 size={14} />
        }
      case 'waiting':
        return {
          color: 'text-yellow-500',
          bgColor: 'bg-yellow-100',
          icon: <HelpCircle size={14} />
        }
      default:
        return {
          color: 'text-gray-500',
          bgColor: 'bg-gray-100',
          icon: <Info size={14} />
        }
    }
  }

  // Get log level color
  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'info':
        return 'text-blue-600'
      case 'warning':
        return 'text-yellow-600'
      case 'error':
        return 'text-red-600'
      case 'debug':
        return 'text-gray-600'
      default:
        return 'text-gray-600'
    }
  }

  // Get file type icon
  const getFileTypeIcon = (type: string) => {
    switch (type) {
      case 'in':
        return <FileText size={16} className="text-blue-500" />
      case 'out':
        return <FileText size={16} className="text-green-500" />
      case 'err':
        return <FileText size={16} className="text-red-500" />
      case 'config':
        return <Settings size={16} className="text-purple-500" />
      case 'socket':
        return <Activity size={16} className="text-yellow-500" />
      default:
        return <FileText size={16} className="text-gray-500" />
    }
  }

  // Handle sort change
  const handleSortChange = (field: 'pid' | 'name' | 'cpu' | 'memory') => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  // Toggle expanded message details
  const toggleMessageDetails = (id: string) => {
    if (expandedMessageId === id) {
      setExpandedMessageId(null)
    } else {
      setExpandedMessageId(id)
    }
  }

  // Recursive function to render process tree
  const renderProcessTree = (processList: Process[], level = 0) => {
    return processList.map((process) => {
      const isExpanded = expandedProcessIds.has(process.id)
      const hasChildren = process.children && process.children.length > 0
      const isSelected = selectedProcessId === process.id

      return (
        <React.Fragment key={process.id}>
          <div
            className={`flex items-center py-2 px-2 hover:bg-gray-50 cursor-pointer transition-colors ${
              isSelected ? 'bg-blue-50' : ''
            }`}
            style={{ paddingLeft: `${12 + level * 20}px` }}
          >
            <div className="flex items-center flex-1 min-w-0">
              {hasChildren ? (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    toggleExpandProcess(process.id)
                  }}
                  className="w-5 h-5 flex items-center justify-center text-gray-500 hover:text-gray-700 mr-2"
                >
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>
              ) : (
                <div className="w-5 mr-2"></div>
              )}

              <div
                className="flex items-center flex-1 min-w-0"
                onClick={() => selectProcess(process.id)}
              >
                <div className="flex-shrink-0 mr-3">
                  <Cpu size={16} className="text-gray-600" />
                </div>
                <div className="truncate">
                  <div className="font-medium text-sm">{process.name}</div>
                  <div className="text-xs text-gray-500">
                    PID: {process.pid}
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <div className="hidden sm:block">
                  <div className="w-20 text-right">
                    <div className="text-sm">{process.cpu.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">CPU</div>
                  </div>
                </div>
                <div className="hidden sm:block ml-4">
                  <div className="w-20 text-right">
                    <div className="text-sm">{process.memory.toFixed(1)}%</div>
                    <div className="text-xs text-gray-500">Memory</div>
                  </div>
                </div>
                <div className="ml-4">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(process.status)}`}
                  >
                    {process.status}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {isExpanded && hasChildren && (
            <div>{renderProcessTree(process.children!, level + 1)}</div>
          )}
        </React.Fragment>
      )
    })
  }

  // Render process table (list view)
  const renderProcessTable = (processList: Process[]) => {
    // Flatten the process tree for list view
    const flattenProcesses = (processes: Process[]): Process[] => {
      return processes.reduce((acc: Process[], process) => {
        acc.push(process)
        if (process.children && process.children.length > 0) {
          acc.push(...flattenProcesses(process.children))
        }
        return acc
      }, [])
    }

    const flatProcesses = flattenProcesses(processList)

    // Apply sorting
    const sortedProcesses = [...flatProcesses].sort((a, b) => {
      let comparison = 0
      if (sortBy === 'pid') {
        comparison = a.pid - b.pid
      } else if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name)
      } else if (sortBy === 'cpu') {
        comparison = a.cpu - b.cpu
      } else if (sortBy === 'memory') {
        comparison = a.memory - b.memory
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    // Apply filters
    const filteredByStatus = statusFilter
      ? sortedProcesses.filter((p) => p.status === statusFilter)
      : sortedProcesses

    const filteredByUser = userFilter
      ? filteredByStatus.filter((p) => p.user === userFilter)
      : filteredByStatus

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('pid')}
              >
                <div className="flex items-center">
                  <span>PID</span>
                  {sortBy === 'pid' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('name')}
              >
                <div className="flex items-center">
                  <span>Process</span>
                  {sortBy === 'name' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('cpu')}
              >
                <div className="flex items-center">
                  <span>CPU</span>
                  {sortBy === 'cpu' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSortChange('memory')}
              >
                <div className="flex items-center">
                  <span>Memory</span>
                  {sortBy === 'memory' && (
                    <span className="ml-1">
                      {sortOrder === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Started
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredByUser.map((process) => {
              const isSelected = selectedProcessId === process.id

              return (
                <tr
                  key={process.id}
                  className={`hover:bg-gray-50 cursor-pointer ${isSelected ? 'bg-blue-50' : ''}`}
                  onClick={() => selectProcess(process.id)}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {process.pid}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="flex items-center">
                      <Cpu size={16} className="text-gray-500 mr-2" />
                      <div className="text-sm font-medium text-gray-900">
                        {process.name}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{process.user}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {process.cpu.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {process.memory.toFixed(1)}%
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs ${getStatusColor(process.status)}`}
                    >
                      {process.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatRelativeTime(process.startTime)}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    )
  }

  // Render message queue section
  const renderMessageQueue = (
    messages: ProcessMessage[],
    direction: 'input' | 'output'
  ) => {
    if (!messages || messages.length === 0) {
      return (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare size={32} className="mx-auto mb-2 text-gray-300" />
          <p>No {direction} messages</p>
        </div>
      )
    }

    return (
      <div className="space-y-2">
        {messages.map((message) => {
          const statusInfo = getMessageStatusInfo(message.status)
          const isExpanded = expandedMessageId === message.id

          return (
            <div
              key={message.id}
              className={`border rounded-lg overflow-hidden ${
                message.status === 'completed'
                  ? 'opacity-60 border-gray-200'
                  : 'border-gray-300'
              }`}
            >
              <div
                className={`p-3 flex items-start justify-between cursor-pointer ${
                  message.status === 'in-progress'
                    ? 'bg-blue-50'
                    : message.status === 'waiting'
                      ? 'bg-yellow-50'
                      : 'bg-white'
                }`}
                onClick={() => toggleMessageDetails(message.id)}
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="flex items-center">
                      <span className={`mr-2 ${statusInfo.color}`}>
                        {statusInfo.icon}
                      </span>
                      <span className="font-medium text-sm">
                        {message.type}
                      </span>
                    </div>
                    <span className="mx-2 text-gray-300">|</span>
                    <span className="text-xs text-gray-500">
                      {formatRelativeTime(message.timestamp)}
                    </span>
                    {message.correlationId && (
                      <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                        {message.correlationId}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 text-xs text-gray-600 line-clamp-1">
                    {direction === 'input' ? (
                      <span className="flex items-center">
                        <span className="text-gray-500">From: </span>
                        <span className="mx-1 font-medium">
                          {message.source}
                        </span>
                        <ArrowDown size={12} className="mx-1 text-blue-500" />
                        <span className="text-gray-500">To: </span>
                        <span className="mx-1 font-medium">
                          {message.target}
                        </span>
                      </span>
                    ) : (
                      <span className="flex items-center">
                        <span className="text-gray-500">To: </span>
                        <span className="mx-1 font-medium">
                          {message.target}
                        </span>
                        <ArrowUp size={12} className="mx-1 text-green-500" />
                        <span className="text-gray-500">From: </span>
                        <span className="mx-1 font-medium">
                          {message.source}
                        </span>
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-gray-400">
                  {isExpanded ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-200 p-3 bg-gray-50">
                  <div className="text-xs font-medium mb-1 text-gray-600">
                    Payload:
                  </div>
                  <pre className="text-xs bg-gray-100 p-2 rounded overflow-auto max-h-32">
                    {JSON.stringify(message.payload, null, 2)}
                  </pre>

                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <div>ID: {message.id}</div>
                    <div>
                      <span
                        className={`px-1.5 py-0.5 rounded-full ${statusInfo.bgColor}`}
                      >
                        {message.status}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="animate-fadeIn h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Cpu className="mr-2" size={24} />
          Process Manager
        </h1>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => {
              /* In a real app this would refresh process data */
            }}
            className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-md"
            title="Refresh Process List"
          >
            <RefreshCw size={16} />
          </button>

          <div className="relative">
            <button
              onClick={() => setShowFilterOptions(!showFilterOptions)}
              className="p-2 text-gray-500 hover:text-gray-700 bg-white border border-gray-200 rounded-md"
              title="Filter Options"
            >
              <Filter size={16} />
            </button>

            {showFilterOptions && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                <div className="p-2">
                  <div className="text-xs font-medium text-gray-500 mb-1">
                    Status
                  </div>
                  <div className="space-y-1">
                    {['running', 'stopped', 'sleeping', 'zombie'].map(
                      (status) => (
                        <div key={status} className="flex items-center">
                          <input
                            type="radio"
                            id={`status-${status}`}
                            name="status"
                            checked={statusFilter === status}
                            onChange={() => setStatusFilter(status)}
                            className="mr-2"
                          />
                          <label
                            htmlFor={`status-${status}`}
                            className="text-sm cursor-pointer"
                          >
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </label>
                        </div>
                      )
                    )}
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="status-all"
                        name="status"
                        checked={statusFilter === null}
                        onChange={() => setStatusFilter(null)}
                        className="mr-2"
                      />
                      <label
                        htmlFor="status-all"
                        className="text-sm cursor-pointer"
                      >
                        All statuses
                      </label>
                    </div>
                  </div>

                  <div className="border-t border-gray-200 my-2"></div>

                  <div className="text-xs font-medium text-gray-500 mb-1">
                    User
                  </div>
                  <div className="space-y-1">
                    {['root', 'www-data', 'node', 'postgres'].map((user) => (
                      <div key={user} className="flex items-center">
                        <input
                          type="radio"
                          id={`user-${user}`}
                          name="user"
                          checked={userFilter === user}
                          onChange={() => setUserFilter(user)}
                          className="mr-2"
                        />
                        <label
                          htmlFor={`user-${user}`}
                          className="text-sm cursor-pointer"
                        >
                          {user}
                        </label>
                      </div>
                    ))}
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="user-all"
                        name="user"
                        checked={userFilter === null}
                        onChange={() => setUserFilter(null)}
                        className="mr-2"
                      />
                      <label
                        htmlFor="user-all"
                        className="text-sm cursor-pointer"
                      >
                        All users
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center bg-white border border-gray-200 rounded-md overflow-hidden">
            <button
              className={`p-2 ${viewType === 'tree' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewType('tree')}
              title="Tree View"
            >
              <Activity size={16} />
            </button>
            <button
              className={`p-2 ${viewType === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setViewType('list')}
              title="List View"
            >
              <List size={16} />
            </button>
          </div>

          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search processes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-4 py-2 w-64 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Process List */}
      <div
        className={`bg-white rounded-lg border border-gray-200 mb-6 ${selectedProcessId ? 'max-h-96' : 'flex-1'} overflow-auto`}
      >
        <div className="border-b border-gray-200 p-2 bg-gray-50 flex justify-between items-center">
          <h2 className="font-medium text-gray-700">Process List</h2>

          {viewType === 'tree' && (
            <div className="flex space-x-2">
              <button
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                onClick={expandAllProcesses}
              >
                Expand All
              </button>
              <button
                className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
                onClick={collapseAllProcesses}
              >
                Collapse All
              </button>
            </div>
          )}
        </div>

        {filteredProcesses.length > 0 ? (
          viewType === 'tree' ? (
            <div>{renderProcessTree(filteredProcesses)}</div>
          ) : (
            renderProcessTable(filteredProcesses)
          )
        ) : (
          <div className="p-8 text-center text-gray-500">
            <Cpu size={32} className="mx-auto mb-2 text-gray-300" />
            {searchTerm ? (
              <>
                <p>No processes found matching "{searchTerm}"</p>
                <button
                  className="mt-2 text-blue-500 hover:underline"
                  onClick={() => setSearchTerm('')}
                >
                  Clear search
                </button>
              </>
            ) : (
              <p>No processes found</p>
            )}
          </div>
        )}
      </div>

      {/* Process Details */}
      {selectedProcess && (
        <div className="bg-white rounded-lg border border-gray-200 flex-1 overflow-hidden">
          <div className="border-b border-gray-200">
            <div className="flex justify-between items-center px-4 py-3">
              <div className="flex items-center">
                <Cpu size={18} className="text-gray-600 mr-2" />
                <h3 className="font-medium">
                  {selectedProcess.name} (PID: {selectedProcess.pid})
                </h3>
                <span
                  className={`ml-2 inline-block px-2 py-0.5 rounded-full text-xs ${getStatusColor(selectedProcess.status)}`}
                >
                  {selectedProcess.status}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {selectedProcess.status === 'running' ? (
                  <>
                    <button
                      className="p-1.5 bg-purple-50 text-purple-500 rounded-md hover:bg-purple-100"
                      title="Debug Process"
                    >
                      <BugPlay size={14} />
                    </button>
                    <button
                      className="p-1.5 bg-red-50 text-red-500 rounded-md hover:bg-red-100"
                      title="Stop Process"
                    >
                      <Square size={14} />
                    </button>
                  </>
                ) : (
                  <button
                    className="p-1.5 bg-green-50 text-green-500 rounded-md hover:bg-green-100"
                    title="Start Process"
                  >
                    <Play size={14} />
                  </button>
                )}
                <button
                  className="p-1.5 bg-yellow-50 text-yellow-500 rounded-md hover:bg-yellow-100"
                  title="Restart Process"
                >
                  <RefreshCw size={14} />
                </button>
                <button
                  className="p-1.5 bg-gray-50 text-gray-500 rounded-md hover:bg-gray-100"
                  onClick={() => selectProcess(null)}
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            <div className="flex border-t border-gray-200">
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  currentTabName === 'overview'
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setCurrentTab('overview')}
              >
                Overview
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  currentTabName === 'messages'
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setCurrentTab('messages')}
              >
                Messages
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  currentTabName === 'files'
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setCurrentTab('files')}
              >
                Files
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  currentTabName === 'env'
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setCurrentTab('env')}
              >
                Environment
              </button>
              <button
                className={`px-4 py-2 text-sm font-medium ${
                  currentTabName === 'logs'
                    ? 'text-blue-600 border-b-2 border-blue-500'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                onClick={() => setCurrentTab('logs')}
              >
                Logs
              </button>
            </div>
          </div>

          <div
            className="p-4 overflow-auto"
            style={{ maxHeight: 'calc(100% - 100px)' }}
          >
            {currentTabName === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Info size={16} className="text-gray-500 mr-2" />
                    General Information
                  </h4>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">
                        Process Name:
                      </span>
                      <span className="text-sm font-medium">
                        {selectedProcess.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">PID:</span>
                      <span className="text-sm font-medium">
                        {selectedProcess.pid}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">User:</span>
                      <span className="text-sm font-medium">
                        {selectedProcess.user}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Status:</span>
                      <span
                        className={`text-sm font-medium ${
                          selectedProcess.status === 'running'
                            ? 'text-green-600'
                            : selectedProcess.status === 'stopped'
                              ? 'text-red-600'
                              : 'text-gray-600'
                        }`}
                      >
                        {selectedProcess.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Started:</span>
                      <span className="text-sm font-medium">
                        {new Date(selectedProcess.startTime).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500">Uptime:</span>
                      <span className="text-sm font-medium">
                        {formatUptime(selectedProcess.startTime)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Terminal size={16} className="text-gray-500 mr-2" />
                    Command
                  </h4>

                  <div className="bg-gray-50 p-3 rounded font-mono text-sm text-gray-800 break-all">
                    {selectedProcess.command || (
                      <span className="text-gray-400">No command</span>
                    )}
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 md:col-span-2">
                  <h4 className="font-medium mb-3 flex items-center">
                    <BarChart size={16} className="text-gray-500 mr-2" />
                    Resource Usage
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500">
                          CPU Usage:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedProcess.cpu.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(selectedProcess.cpu, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-gray-500">
                          Memory Usage:
                        </span>
                        <span className="text-sm font-medium">
                          {selectedProcess.memory.toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{
                            width: `${Math.min(selectedProcess.memory, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 md:col-span-2">
                  <h4 className="font-medium mb-3 flex items-center">
                    <Activity size={16} className="text-gray-500 mr-2" />
                    Process Hierarchy
                  </h4>

                  <div className="bg-gray-50 p-3 rounded">
                    {selectedProcess.parentId ? (
                      <div className="flex items-center mb-2">
                        <Cpu size={14} className="text-gray-500 mr-2" />
                        <span className="text-sm text-gray-500 mr-2">
                          Parent:
                        </span>
                        <button
                          className="text-sm text-blue-500 hover:underline"
                          onClick={() =>
                            selectProcess(selectedProcess.parentId!)
                          }
                        >
                          PID{' '}
                          {getProcessById(selectedProcess.parentId!)?.pid ||
                            '?'}{' '}
                          (
                          {getProcessById(selectedProcess.parentId!)?.name ||
                            'Unknown'}
                          )
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center mb-2">
                        <span className="text-sm text-gray-500">
                          Root process (no parent)
                        </span>
                      </div>
                    )}

                    {selectedProcess.children &&
                      selectedProcess.children.length > 0 && (
                        <div>
                          <div className="text-sm text-gray-500 mb-2">
                            Children ({selectedProcess.children.length}):
                          </div>
                          <div className="space-y-1 ml-4">
                            {selectedProcess.children.map((child) => (
                              <button
                                key={child.id}
                                className="text-sm text-blue-500 hover:underline block"
                                onClick={() => selectProcess(child.id)}
                              >
                                PID {child.pid} ({child.name})
                              </button>
                            ))}
                          </div>
                        </div>
                      )}

                    {(!selectedProcess.children ||
                      selectedProcess.children.length === 0) && (
                      <div className="text-sm text-gray-500">
                        No child processes
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {currentTabName === 'messages' && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex rounded-lg overflow-hidden border border-gray-200">
                    <button
                      className={`px-4 py-2 text-sm ${
                        activeMessageTab === 'input'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-white text-gray-600'
                      }`}
                      onClick={() => setActiveMessageTab('input')}
                    >
                      <div className="flex items-center">
                        <ArrowDown size={14} className="mr-2" />
                        Input Queue
                      </div>
                    </button>
                    <button
                      className={`px-4 py-2 text-sm ${
                        activeMessageTab === 'output'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-white text-gray-600'
                      }`}
                      onClick={() => setActiveMessageTab('output')}
                    >
                      <div className="flex items-center">
                        <ArrowUp size={14} className="mr-2" />
                        Output Queue
                      </div>
                    </button>
                  </div>

                  <div className="text-xs text-gray-500 flex items-center">
                    <span className="inline-flex items-center mr-3">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                      Completed
                    </span>
                    <span className="inline-flex items-center mr-3">
                      <span className="w-2 h-2 rounded-full bg-blue-500 mr-1"></span>
                      In Progress
                    </span>
                    <span className="inline-flex items-center mr-3">
                      <span className="w-2 h-2 rounded-full bg-gray-400 mr-1"></span>
                      Pending
                    </span>
                    <span className="inline-flex items-center">
                      <span className="w-2 h-2 rounded-full bg-yellow-500 mr-1"></span>
                      Waiting
                    </span>
                  </div>
                </div>

                {processMessageQueue ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden p-4">
                    {activeMessageTab === 'input'
                      ? renderMessageQueue(processMessageQueue.input, 'input')
                      : renderMessageQueue(
                          processMessageQueue.output,
                          'output'
                        )}
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 border border-gray-200 rounded-lg">
                    <MessageSquare
                      size={40}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    <p className="font-medium text-gray-700 mb-1">
                      No Message Queue Available
                    </p>
                    <p className="text-sm text-gray-500">
                      This process doesn't have a message queue or is not
                      message-driven
                    </p>
                  </div>
                )}
              </div>
            )}

            {currentTabName === 'files' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Process Files</h4>
                  <div className="text-sm text-gray-500">
                    {processFiles.length} files in{' '}
                    <code>/proc/{selectedProcess.pid}/</code>
                  </div>
                </div>

                {processFiles.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            File
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Size
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Last Accessed
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {processFiles.map((file) => (
                          <tr key={file.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                {getFileTypeIcon(file.type)}
                                <div className="ml-2">
                                  <div className="text-sm font-medium text-gray-900">
                                    {file.name}
                                  </div>
                                  <div className="text-xs text-gray-500">
                                    {file.path}
                                  </div>
                                </div>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span
                                className={`inline-block px-2 py-1 text-xs rounded-full ${
                                  file.type === 'out'
                                    ? 'bg-green-100 text-green-800'
                                    : file.type === 'err'
                                      ? 'bg-red-100 text-red-800'
                                      : file.type === 'in'
                                        ? 'bg-blue-100 text-blue-800'
                                        : file.type === 'config'
                                          ? 'bg-purple-100 text-purple-800'
                                          : 'bg-gray-100 text-gray-800'
                                }`}
                              >
                                {file.type}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {formatFileSize(file.size)}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                              {file.lastAccessed
                                ? formatRelativeTime(file.lastAccessed)
                                : '-'}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-sm">
                              <button className="text-blue-500 hover:text-blue-700 mr-2">
                                <Eye size={16} />
                              </button>
                              <button className="text-purple-500 hover:text-purple-700">
                                <Terminal size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
                    <FileText
                      size={32}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    <p>No files available for this process</p>
                  </div>
                )}
              </div>
            )}

            {currentTabName === 'env' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Environment Variables</h4>
                  <div className="text-sm text-gray-500">
                    {processEnv.length} variables
                  </div>
                </div>

                {processEnv.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Key
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Value
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {processEnv.map((env, index) => (
                          <tr key={index} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-mono text-gray-900">
                                {env.key}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="text-sm font-mono text-gray-500">
                                {env.value.includes('*')
                                  ? env.value
                                  : env.value.length > 40
                                    ? `${env.value.substring(0, 40)}...`
                                    : env.value}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
                    <Code size={32} className="mx-auto mb-2 text-gray-300" />
                    <p>No environment variables available for this process</p>
                  </div>
                )}
              </div>
            )}

            {currentTabName === 'logs' && (
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-medium">Process Logs</h4>
                  <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded text-sm hover:bg-gray-200 flex items-center">
                    <Terminal size={14} className="mr-1" />
                    Tail Logs
                  </button>
                </div>

                {processLogs.length > 0 ? (
                  <div className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 p-4">
                    <div className="font-mono text-sm space-y-2">
                      {processLogs.map((log) => (
                        <div key={log.id} className="flex">
                          <div className="text-gray-400 mr-3">
                            {new Date(log.timestamp).toLocaleTimeString()}
                          </div>
                          <div
                            className={`${getLogLevelColor(log.level)} uppercase mr-3`}
                          >
                            [{log.level}]
                          </div>
                          <div>{log.message}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border border-gray-200 rounded-lg">
                    <Terminal
                      size={32}
                      className="mx-auto mb-2 text-gray-300"
                    />
                    <p>No logs available for this process</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProcessesView
