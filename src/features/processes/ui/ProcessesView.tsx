import React, { useState } from 'react'
import { 
  Cpu, 
  Search, 
  ChevronRight, 
  ChevronDown, 
  Activity, 
  Folder, 
  Settings, 
  HardDrive, 
  File, 
  Terminal, 
  StopCircle, 
  RefreshCw, 
  X, 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  ArrowDownLeft,
  ArrowUpRight,
  Info,
  Send,
  MessageSquare,
  Bug
} from 'lucide-react'
import { useProcessesStore } from '../state'
import { Process, ProcessFile, ProcessLog, ProcessEnvironment, ProcessMessage } from '@/shared/types'

const ProcessesView: React.FC = () => {
  const {
    processes,
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

  const [showProcessDetails, setShowProcessDetails] = useState(false)
  const [messageQueueTab, setMessageQueueTab] = useState<'input' | 'output'>('input')
  const [expandedMessageIds, setExpandedMessageIds] = useState<Set<string>>(new Set())

  const selectedProcess = selectedProcessId ? getProcessById(selectedProcessId) : null
  const filteredProcesses = getFilteredProcesses()
  
  // Function to count messages for a process
  const getProcessMessageCount = (processId: string) => {
    const messageQueue = getProcessMessageQueue(processId)
    if (!messageQueue) return 0
    
    return messageQueue.input.length + messageQueue.output.length
  }
  
  const toggleMessageExpand = (messageId: string) => {
    const newExpandedMessages = new Set(expandedMessageIds)
    if (newExpandedMessages.has(messageId)) {
      newExpandedMessages.delete(messageId)
    } else {
      newExpandedMessages.add(messageId)
    }
    setExpandedMessageIds(newExpandedMessages)
  }

  // Function to format process message status
  const getMessageStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-gray-500'
      case 'in-progress':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'pending':
        return 'text-gray-700'
      case 'waiting':
        return 'bg-yellow-50 text-yellow-700 border-yellow-200'
      default:
        return 'text-gray-500'
    }
  }
  
  // Recursive function to render the process tree
  const renderProcessTree = (processes: Process[], level: number = 0) => {
    return processes.map(process => {
      const isExpanded = expandedProcessIds.has(process.id)
      const isSelected = process.id === selectedProcessId
      const hasChildren = process.children && process.children.length > 0
      const messageCount = getProcessMessageCount(process.id)
      
      return (
        <div key={process.id} style={{ marginLeft: `${level * 16}px` }}>
          <div 
            className={`flex items-center p-2 rounded cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-blue-50 border-l-2 border-blue-500' : ''}`}
            onClick={() => {
              selectProcess(process.id)
              setShowProcessDetails(true)
            }}
          >
            {hasChildren ? (
              <button 
                className="mr-1 text-gray-500 hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation()
                  toggleExpandProcess(process.id)
                }}
              >
                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
              </button>
            ) : (
              <div className="w-4 mr-1"></div>
            )}
            
            <div className={`w-4 h-4 rounded-full mr-2 ${
              process.status === 'running' ? 'bg-green-500' :
              process.status === 'stopped' ? 'bg-red-500' :
              process.status === 'sleeping' ? 'bg-blue-500' :
              process.status === 'zombie' ? 'bg-purple-500' :
              'bg-gray-500'
            }`}></div>
            
            <div className="flex-1 flex items-center">
              <span className="font-medium">{process.name}</span>
              <span className="text-gray-500 text-xs ml-2">({process.pid})</span>
            </div>
            
            {messageCount > 0 && (
              <div className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs flex items-center">
                <MessageSquare size={12} className="mr-1" />
                {messageCount}
              </div>
            )}
          </div>

          {isExpanded && hasChildren && (
            <div className="pl-4 ml-2 border-l border-gray-200">
              {renderProcessTree(process.children!, level + 1)}
            </div>
          )}
        </div>
      )
    })
  }
  
  const renderProcessMessageQueue = () => {
    if (!selectedProcessId) return null;
    
    const messageQueue = getProcessMessageQueue(selectedProcessId);
    
    if (!messageQueue) {
      return (
        <div className="text-center p-6 text-gray-500">
          No message queue data available for this process.
        </div>
      );
    }
    
    const messages = messageQueueTab === 'input' 
      ? messageQueue.input
      : messageQueue.output;
      
    return (
      <div>
        <div className="flex border-b border-gray-200 mb-4">
          <button
            className={`px-4 py-2 font-medium text-sm border-b-2 mr-4 ${
              messageQueueTab === 'input' 
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setMessageQueueTab('input')}
          >
            <div className="flex items-center">
              <ArrowDownLeft size={16} className="mr-2" />
              Input Queue ({messageQueue.input.length})
            </div>
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm border-b-2 ${
              messageQueueTab === 'output' 
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setMessageQueueTab('output')}
          >
            <div className="flex items-center">
              <ArrowUpRight size={16} className="mr-2" />
              Output Queue ({messageQueue.output.length})
            </div>
          </button>
        </div>
        
        <div className="mb-4">
          <div className="text-sm flex items-center justify-between">
            <div className="text-gray-500">Message status legend:</div>
            <div className="flex space-x-3">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-300 mr-1"></div>
                <span className="text-xs text-gray-600">Completed</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-400 mr-1"></div>
                <span className="text-xs text-gray-600">In Progress</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-500 mr-1"></div>
                <span className="text-xs text-gray-600">Pending</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-1"></div>
                <span className="text-xs text-gray-600">Waiting</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-3">
          {messages.length > 0 ? (
            messages.map((message) => (
              <div 
                key={message.id} 
                className={`border ${getMessageStatusClass(message.status)} rounded-md overflow-hidden ${
                  message.status === 'completed' ? 'opacity-60' : ''
                }`}
              >
                <div 
                  className="p-3 cursor-pointer"
                  onClick={() => toggleMessageExpand(message.id)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full mr-2 ${
                        message.status === 'completed' ? 'bg-gray-300' :
                        message.status === 'in-progress' ? 'bg-blue-400' :
                        message.status === 'pending' ? 'bg-gray-500' :
                        'bg-yellow-400'
                      }`}></div>
                      <div className="font-medium">
                        {message.type}
                        {message.correlationId && (
                          <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">
                            ID: {message.correlationId.substring(0, 8)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-gray-500">
                      <Clock size={12} className="mr-1" />
                      {new Date(message.timestamp).toLocaleTimeString()}
                      {expandedMessageIds.has(message.id) ? (
                        <ChevronDown size={14} className="ml-2" />
                      ) : (
                        <ChevronRight size={14} className="ml-2" />
                      )}
                    </div>
                  </div>
                  
                  <div className="mt-1 text-sm">
                    <div className="flex items-center text-xs text-gray-500">
                      {messageQueueTab === 'input' ? (
                        <>
                          <span>From: {message.source}</span>
                        </>
                      ) : (
                        <>
                          <span>To: {message.target}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                {expandedMessageIds.has(message.id) && (
                  <div className="bg-gray-50 p-3 border-t border-gray-200">
                    <div className="text-xs font-mono overflow-auto max-h-36 whitespace-pre">
                      {JSON.stringify(message.payload, null, 2)}
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center p-4 bg-gray-50 rounded-md text-gray-500">
              No {messageQueueTab} messages in queue.
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="animate-fadeIn h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Cpu className="mr-2" size={24} />
          Processes
        </h1>
        <div className="flex items-center space-x-2">
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
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="border border-gray-200 rounded-md overflow-hidden flex">
            <button
              className={`px-3 py-2 ${viewType === 'tree' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setViewType('tree')}
            >
              Tree
            </button>
            <button
              className={`px-3 py-2 ${viewType === 'list' ? 'bg-blue-50 text-blue-600' : 'text-gray-600 hover:bg-gray-50'}`}
              onClick={() => setViewType('list')}
            >
              List
            </button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Process tree/list */}
        <div className={`${showProcessDetails && selectedProcess ? 'w-1/3' : 'w-full'} overflow-auto bg-white rounded-lg border border-gray-200`}>
          <div className="p-3 border-b border-gray-200 flex justify-between items-center">
            <div className="text-sm font-medium">
              {viewType === 'tree' ? 'Process Hierarchy' : 'Process List'}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={expandAllProcesses}
                className="text-xs px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded"
              >
                Expand All
              </button>
              <button
                onClick={collapseAllProcesses}
                className="text-xs px-2 py-1 bg-gray-50 hover:bg-gray-100 rounded"
              >
                Collapse All
              </button>
            </div>
          </div>
          
          <div className="overflow-y-auto h-full p-3">
            {filteredProcesses.length > 0 ? (
              renderProcessTree(filteredProcesses)
            ) : (
              <div className="text-center py-6 text-gray-500">
                {searchTerm 
                  ? `No processes matching "${searchTerm}"`
                  : 'No processes found'
                }
              </div>
            )}
          </div>
        </div>

        {/* Process details panel */}
        {showProcessDetails && selectedProcess && (
          <div className="w-2/3 pl-4">
            <div className="bg-white rounded-lg border border-gray-200 h-full overflow-hidden flex flex-col">
              {/* Process header */}
              <div className="flex justify-between items-start p-4 border-b border-gray-200">
                <div>
                  <div className="flex items-center">
                    <h2 className="text-xl font-medium">
                      {selectedProcess.name}
                    </h2>
                    <div className="ml-2 px-2 py-0.5 bg-gray-100 text-gray-700 text-sm rounded">
                      PID: {selectedProcess.pid}
                    </div>
                    <div className={`ml-2 px-2 py-0.5 text-white text-sm rounded ${
                      selectedProcess.status === 'running' ? 'bg-green-500' :
                      selectedProcess.status === 'stopped' ? 'bg-red-500' :
                      selectedProcess.status === 'sleeping' ? 'bg-blue-500' :
                      selectedProcess.status === 'zombie' ? 'bg-purple-500' :
                      'bg-gray-500'
                    }`}>
                      {selectedProcess.status.charAt(0).toUpperCase() + selectedProcess.status.slice(1)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {selectedProcess.command}
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button 
                    className="p-2 text-red-600 bg-red-50 rounded hover:bg-red-100"
                    title="Stop Process"
                  >
                    <StopCircle size={18} />
                  </button>
                  <button 
                    className="p-2 text-blue-600 bg-blue-50 rounded hover:bg-blue-100"
                    title="Restart Process"
                  >
                    <RefreshCw size={18} />
                  </button>
                  <button 
                    className="p-2 text-purple-600 bg-purple-50 rounded hover:bg-purple-100"
                    title="Debug Process"
                  >
                    <Bug size={18} />
                  </button>
                  <button 
                    className="p-2 text-gray-500 hover:text-gray-700"
                    title="Close Details"
                    onClick={() => {
                      setShowProcessDetails(false)
                      selectProcess(null)
                    }}
                  >
                    <X size={18} />
                  </button>
                </div>
              </div>

              {/* Process details tabs */}
              <div className="flex border-b border-gray-200">
                <button
                  className={`px-4 py-2 text-sm font-medium ${currentTabName === 'overview' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setCurrentTab('overview')}
                >
                  <div className="flex items-center">
                    <Activity size={16} className="mr-2" />
                    Overview
                  </div>
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${currentTabName === 'files' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setCurrentTab('files')}
                >
                  <div className="flex items-center">
                    <Folder size={16} className="mr-2" />
                    Files
                  </div>
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${currentTabName === 'env' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setCurrentTab('env')}
                >
                  <div className="flex items-center">
                    <Settings size={16} className="mr-2" />
                    Environment
                  </div>
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${currentTabName === 'logs' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setCurrentTab('logs')}
                >
                  <div className="flex items-center">
                    <Terminal size={16} className="mr-2" />
                    Logs
                  </div>
                </button>
                <button
                  className={`px-4 py-2 text-sm font-medium ${currentTabName === 'messages' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
                  onClick={() => setCurrentTab('messages')}
                >
                  <div className="flex items-center">
                    <MessageSquare size={16} className="mr-2" />
                    Messages
                  </div>
                </button>
              </div>

              {/* Tab content */}
              <div className="flex-1 overflow-auto p-4">
                {/* Overview Tab */}
                {currentTabName === 'overview' && (
                  <div>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-500 mb-1">CPU Usage</div>
                        <div className="text-2xl font-medium">{selectedProcess.cpu}%</div>
                        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${Math.min(selectedProcess.cpu, 100)}%` }}></div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <div className="text-sm text-gray-500 mb-1">Memory Usage</div>
                        <div className="text-2xl font-medium">{selectedProcess.memory}%</div>
                        <div className="w-full bg-gray-200 h-2 rounded-full mt-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.min(selectedProcess.memory, 100)}%` }}></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 font-medium">
                        Process Details
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                          <div>
                            <div className="text-sm font-medium text-gray-500">Process ID</div>
                            <div>{selectedProcess.pid}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500">User</div>
                            <div>{selectedProcess.user}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500">Started</div>
                            <div>{new Date(selectedProcess.startTime).toLocaleString()}</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-500">Parent Process</div>
                            <div>{selectedProcess.parentId ? getProcessById(selectedProcess.parentId)?.name || 'Unknown' : 'None'}</div>
                          </div>
                          <div className="col-span-2">
                            <div className="text-sm font-medium text-gray-500">Command</div>
                            <div className="font-mono text-sm bg-gray-50 p-2 rounded border border-gray-200 overflow-x-auto">
                              {selectedProcess.command || '<No command>'}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {selectedProcess.children && selectedProcess.children.length > 0 && (
                      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-4">
                        <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 font-medium">
                          Child Processes ({selectedProcess.children.length})
                        </div>
                        <div className="divide-y divide-gray-100">
                          {selectedProcess.children.map(child => (
                            <div 
                              key={child.id} 
                              className="p-3 hover:bg-gray-50 cursor-pointer"
                              onClick={() => {
                                selectProcess(child.id)
                              }}
                            >
                              <div className="flex items-center">
                                <div className={`w-3 h-3 rounded-full mr-2 ${
                                  child.status === 'running' ? 'bg-green-500' :
                                  child.status === 'stopped' ? 'bg-red-500' :
                                  child.status === 'sleeping' ? 'bg-blue-500' :
                                  child.status === 'zombie' ? 'bg-purple-500' :
                                  'bg-gray-500'
                                }`}></div>
                                <div className="font-medium">{child.name}</div>
                                <div className="text-gray-500 text-xs ml-2">({child.pid})</div>
                                <div className="ml-auto text-xs text-gray-500">
                                  CPU: {child.cpu}% | Mem: {child.memory}%
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Files Tab */}
                {currentTabName === 'files' && (
                  <div>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 font-medium">
                        Process Files
                      </div>
                      <div className="divide-y divide-gray-100">
                        {getProcessFiles(selectedProcessId).length > 0 ? (
                          getProcessFiles(selectedProcessId).map(file => (
                            <div key={file.id} className="p-3 hover:bg-gray-50">
                              <div className="flex items-center">
                                <div className="mr-3 text-gray-400">
                                  <File size={18} />
                                </div>
                                <div>
                                  <div className="font-medium">{file.name}</div>
                                  <div className="text-xs text-gray-500">
                                    {file.path} | {file.size} bytes
                                    {file.lastAccessed && ` | Last accessed: ${new Date(file.lastAccessed).toLocaleString()}`}
                                  </div>
                                </div>
                                <div className="ml-auto">
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    file.type === 'in' ? 'bg-blue-100 text-blue-800' :
                                    file.type === 'out' ? 'bg-green-100 text-green-800' :
                                    file.type === 'err' ? 'bg-red-100 text-red-800' :
                                    file.type === 'config' ? 'bg-purple-100 text-purple-800' :
                                    'bg-gray-100 text-gray-800'
                                  }`}>
                                    {file.type}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            No files found for this process.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Environment Tab */}
                {currentTabName === 'env' && (
                  <div>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 font-medium">
                        Environment Variables
                      </div>
                      <div className="divide-y divide-gray-100">
                        {getProcessEnv(selectedProcessId).length > 0 ? (
                          getProcessEnv(selectedProcessId).map(env => (
                            <div key={env.key} className="p-3 hover:bg-gray-50">
                              <div className="flex items-center">
                                <div className="font-medium font-mono">{env.key}</div>
                                <div className="mx-2 text-gray-400">=</div>
                                <div className="font-mono text-gray-800 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                                  {env.value}
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            No environment variables found for this process.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Logs Tab */}
                {currentTabName === 'logs' && (
                  <div>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 font-medium flex justify-between items-center">
                        <span>Process Logs</span>
                        <button className="text-xs px-2 py-1 bg-gray-200 hover:bg-gray-300 rounded">
                          Refresh
                        </button>
                      </div>
                      <div className="p-2">
                        {getProcessLogs(selectedProcessId).length > 0 ? (
                          <div className="font-mono text-sm bg-gray-900 text-gray-100 p-3 rounded overflow-auto max-h-96">
                            {getProcessLogs(selectedProcessId).map(log => (
                              <div key={log.id} className="mb-1 flex">
                                <span className="text-gray-400 mr-2">
                                  [{new Date(log.timestamp).toLocaleTimeString()}]
                                </span>
                                <span className={
                                  log.level === 'info' ? 'text-blue-300' :
                                  log.level === 'warning' ? 'text-yellow-300' :
                                  log.level === 'error' ? 'text-red-300' :
                                  'text-green-300'
                                }>
                                  [{log.level.toUpperCase()}]
                                </span>
                                <span className="ml-2">{log.message}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="p-4 text-center text-gray-500">
                            No logs found for this process.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Messages Tab */}
                {currentTabName === 'messages' && renderProcessMessageQueue()}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProcessesView