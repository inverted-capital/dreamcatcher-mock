import React, { useState } from 'react'
import {
  Cpu,
  Search,
  ChevronRight,
  ChevronDown,
  FileCog,
  MemoryStick,
  Clock,
  User,
  Tag,
  Play,
  Square,
  XCircle,
  RefreshCw,
  FolderTree,
  List,
  FileCode,
  Folder,
  Workflow,
  MessageSquare,
  MailQuestion,
  HardDrive,
  Terminal
} from 'lucide-react'
import { useProcessesStore } from '../state'
import { Process, ProcessLog, ProcessFile, ProcessEnvironment, ProcessMessage } from '@/shared/types'

const ProcessesView: React.FC = () => {
  const {
    processes,
    getFilteredProcesses,
    selectedProcessId,
    expandedProcessIds,
    viewType,
    getProcessById,
    getProcessFiles,
    getProcessLogs,
    getProcessEnv,
    getProcessMessageQueue,
    selectProcess,
    toggleExpandProcess,
    expandAllProcesses,
    collapseAllProcesses,
    setSearchTerm,
    setViewType,
    currentTabName,
    setCurrentTab
  } = useProcessesStore()

  const [searchInput, setSearchInput] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setSearchTerm(searchInput)
  }

  const toggleProcessExpansion = (processId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    toggleExpandProcess(processId)
  }

  const selectedProcess = selectedProcessId ? getProcessById(selectedProcessId) : null
  const processFiles = selectedProcessId ? getProcessFiles(selectedProcessId) : []
  const processLogs = selectedProcessId ? getProcessLogs(selectedProcessId) : []
  const processEnv = selectedProcessId ? getProcessEnv(selectedProcessId) : []
  const messageQueue = selectedProcessId ? getProcessMessageQueue(selectedProcessId) : undefined

  const renderStatusBadge = (status: string) => {
    let bgColor = 'bg-gray-100 text-gray-800'
    if (status === 'running') bgColor = 'bg-green-100 text-green-800'
    else if (status === 'stopped') bgColor = 'bg-red-100 text-red-800'
    else if (status === 'sleeping') bgColor = 'bg-blue-100 text-blue-800'
    else if (status === 'zombie') bgColor = 'bg-purple-100 text-purple-800'

    return (
      <span className={`px-2 py-0.5 rounded-full text-xs ${bgColor}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    )
  }

  // Recursive function to render process tree
  const renderProcessTreeItem = (process: Process, depth: number = 0) => {
    const hasChildren = process.children && process.children.length > 0
    const isExpanded = expandedProcessIds.has(process.id)
    const isSelected = selectedProcessId === process.id

    return (
      <div key={process.id} className="mb-1">
        <div 
          className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
            isSelected ? 'bg-blue-100 border-l-2 border-blue-500' : 'hover:bg-gray-50'
          }`}
          onClick={() => selectProcess(process.id)}
          style={{ paddingLeft: `${depth * 20 + 8}px` }}
        >
          {hasChildren ? (
            <button 
              className="mr-2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={(e) => toggleProcessExpansion(process.id, e)}
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          ) : (
            <span className="w-6" />
          )}
          
          <div className="flex justify-between items-center w-full">
            <div className="flex items-center">
              <div className="mr-2 text-gray-500">
                {process.name === 'systemd' ? (
                  <Terminal size={16} />
                ) : process.name.includes('nginx') ? (
                  <Folder size={16} />
                ) : process.name === 'node' ? (
                  <FileCode size={16} />
                ) : process.name.includes('kworker') ? (
                  <Workflow size={16} />
                ) : (
                  <Cpu size={16} />
                )}
              </div>
              
              <div>
                <div className="font-medium text-sm flex items-center">
                  <span>{process.name}</span>
                  <span className="ml-2 text-xs text-gray-500">({process.pid})</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 text-xs text-gray-600">
              {renderStatusBadge(process.status)}
              <div className="flex items-center">
                <Cpu size={14} className="mr-1" />
                {process.cpu} units
              </div>
              <div className="flex items-center">
                <HardDrive size={14} className="mr-1" />
                {process.memory} units
              </div>
              <div>{process.user}</div>
            </div>
          </div>
        </div>
        
        {hasChildren && isExpanded && (
          <div className="ml-4 pl-4 border-l border-gray-200">
            {process.children.map(child => renderProcessTreeItem(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }
  
  // Render flat process list
  const renderProcessListItem = (process: Process) => {
    const isSelected = selectedProcessId === process.id

    return (
      <div 
        key={process.id}
        className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
          isSelected ? 'bg-blue-100 border-l-2 border-blue-500' : 'hover:bg-gray-50'
        } mb-1`}
        onClick={() => selectProcess(process.id)}
      >
        <div className="mr-2 text-gray-500">
          {process.name === 'systemd' ? (
            <Terminal size={16} />
          ) : process.name.includes('nginx') ? (
            <Folder size={16} />
          ) : process.name === 'node' ? (
            <FileCode size={16} />
          ) : process.name.includes('kworker') ? (
            <Workflow size={16} />
          ) : (
            <Cpu size={16} />
          )}
        </div>
        
        <div className="grid grid-cols-12 w-full gap-2 items-center">
          <div className="col-span-3">
            <div className="font-medium text-sm flex items-center">
              <span>{process.name}</span>
              <span className="ml-2 text-xs text-gray-500">({process.pid})</span>
            </div>
          </div>
          
          <div className="col-span-4 text-xs text-gray-600 truncate">{process.command}</div>
          
          <div className="col-span-1">{renderStatusBadge(process.status)}</div>
          
          <div className="col-span-1 text-xs text-gray-600 flex items-center">
            <Cpu size={14} className="mr-1" />
            {process.cpu}
          </div>
          
          <div className="col-span-1 text-xs text-gray-600 flex items-center">
            <HardDrive size={14} className="mr-1" />
            {process.memory}
          </div>
          
          <div className="col-span-2 text-xs text-gray-600 flex items-center">
            <User size={14} className="mr-1" />
            {process.user}
          </div>
        </div>
      </div>
    )
  }
  
  // Render process details
  const renderProcessDetails = () => {
    if (!selectedProcess) return null;
    
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 mt-4">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-lg font-medium flex items-center">
              {selectedProcess.name}
              <span className="ml-2 text-sm text-gray-500">PID: {selectedProcess.pid}</span>
            </h2>
            <p className="text-sm text-gray-600 mt-1">{selectedProcess.command}</p>
          </div>
          
          <div className="flex space-x-2">
            <button className="p-1.5 bg-green-50 text-green-700 rounded hover:bg-green-100">
              <Play size={14} />
            </button>
            <button className="p-1.5 bg-gray-50 text-gray-700 rounded hover:bg-gray-100">
              <Square size={14} />
            </button>
            <button className="p-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100">
              <XCircle size={14} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-xs text-gray-500 mb-1">Status</div>
            <div className="font-medium">{renderStatusBadge(selectedProcess.status)}</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-xs text-gray-500 mb-1">CPU</div>
            <div className="font-medium">{selectedProcess.cpu} units</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-xs text-gray-500 mb-1">Memory</div>
            <div className="font-medium">{selectedProcess.memory} units</div>
          </div>
          <div className="bg-gray-50 p-3 rounded-md">
            <div className="text-xs text-gray-500 mb-1">Started</div>
            <div className="font-medium">{new Date(selectedProcess.startTime).toLocaleString()}</div>
          </div>
        </div>
        
        {/* Tabs for process details */}
        <div className="border-b border-gray-200 mb-4">
          <div className="flex">
            <button
              className={`py-2 px-4 text-sm font-medium ${
                currentTabName === 'overview' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-600'
              }`}
              onClick={() => setCurrentTab('overview')}
            >
              Overview
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium ${
                currentTabName === 'files' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-600'
              }`}
              onClick={() => setCurrentTab('files')}
            >
              Files
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium ${
                currentTabName === 'env' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-600'
              }`}
              onClick={() => setCurrentTab('env')}
            >
              Environment
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium ${
                currentTabName === 'logs' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-600'
              }`}
              onClick={() => setCurrentTab('logs')}
            >
              Logs
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium ${
                currentTabName === 'messages' 
                  ? 'border-b-2 border-blue-500 text-blue-600' 
                  : 'text-gray-600'
              }`}
              onClick={() => setCurrentTab('messages')}
            >
              Messages
            </button>
          </div>
        </div>
        
        {/* Tab content */}
        {currentTabName === 'overview' && (
          <div>
            <h3 className="text-sm font-medium mb-3">Resource Usage History</h3>
            <div className="h-40 bg-gray-50 rounded-md p-3 flex flex-col justify-end">
              <div className="flex items-end space-x-1 h-32">
                {[...Array(24)].map((_, i) => {
                  const height = 10 + Math.random() * 80;
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center">
                      <div 
                        className="w-full bg-blue-200 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                      {i % 4 === 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {`${10 - Math.floor(i / 4)}m`}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        
        {currentTabName === 'files' && (
          <div>
            <h3 className="text-sm font-medium mb-3">Process Files</h3>
            {processFiles.length > 0 ? (
              <div className="space-y-2">
                {processFiles.map(file => renderFileItem(file))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileCog size={32} className="mx-auto mb-2 text-gray-300" />
                <p>No files available for this process</p>
              </div>
            )}
          </div>
        )}
        
        {currentTabName === 'env' && (
          <div>
            <h3 className="text-sm font-medium mb-3">Environment Variables</h3>
            {processEnv.length > 0 ? (
              <div className="bg-gray-50 rounded-md overflow-hidden">
                <div className="grid grid-cols-2 gap-1 p-2">
                  <div className="font-medium text-sm text-gray-600">Key</div>
                  <div className="font-medium text-sm text-gray-600">Value</div>
                  {processEnv.map(env => (
                    <React.Fragment key={env.key}>
                      <div className="bg-white p-2 rounded">{env.key}</div>
                      <div className="bg-white p-2 rounded font-mono text-sm">{env.value}</div>
                    </React.Fragment>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileCog size={32} className="mx-auto mb-2 text-gray-300" />
                <p>No environment variables available</p>
              </div>
            )}
          </div>
        )}
        
        {currentTabName === 'logs' && (
          <div>
            <h3 className="text-sm font-medium mb-3">Process Logs</h3>
            {processLogs.length > 0 ? (
              <div className="space-y-2">
                {processLogs.map(log => renderLogItem(log))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileCog size={32} className="mx-auto mb-2 text-gray-300" />
                <p>No logs available for this process</p>
              </div>
            )}
          </div>
        )}
        
        {currentTabName === 'messages' && messageQueue && (
          <div>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Input Queue</h3>
                {messageQueue.input.length > 0 ? (
                  <div className="space-y-2">
                    {messageQueue.input.map(msg => renderMessageItem(msg, 'input'))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border border-gray-100 rounded-lg">
                    <MailQuestion size={24} className="mx-auto mb-2 text-gray-300" />
                    <p>No incoming messages</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-sm font-medium mb-3">Output Queue</h3>
                {messageQueue.output.length > 0 ? (
                  <div className="space-y-2">
                    {messageQueue.output.map(msg => renderMessageItem(msg, 'output'))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500 border border-gray-100 rounded-lg">
                    <MailQuestion size={24} className="mx-auto mb-2 text-gray-300" />
                    <p>No outgoing messages</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }
  
  const renderFileItem = (file: ProcessFile) => {
    return (
      <div className="p-3 border border-gray-200 rounded-md flex justify-between items-center">
        <div className="flex items-center">
          <FileCog size={16} className="mr-2 text-blue-500" />
          <div>
            <div className="font-medium text-sm">{file.name}</div>
            <div className="text-xs text-gray-500">{file.path}</div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded">
            {file.type}
          </span>
          <span className="text-xs text-gray-500">
            {file.size < 1024 
              ? `${file.size} B` 
              : file.size < 1048576 
                ? `${(file.size / 1024).toFixed(1)} KB` 
                : `${(file.size / 1048576).toFixed(1)} MB`}
          </span>
        </div>
      </div>
    )
  }
  
  const renderLogItem = (log: ProcessLog) => {
    const logColors = {
      info: 'bg-blue-50 text-blue-700',
      warning: 'bg-yellow-50 text-yellow-700',
      error: 'bg-red-50 text-red-700',
      debug: 'bg-gray-50 text-gray-700'
    };
    
    return (
      <div className="p-3 border border-gray-200 rounded-md">
        <div className="flex justify-between items-start mb-1">
          <div>
            <span className={`text-xs px-2 py-0.5 rounded ${logColors[log.level]}`}>
              {log.level.toUpperCase()}
            </span>
          </div>
          <div className="text-xs text-gray-500">
            {new Date(log.timestamp).toLocaleTimeString()}
          </div>
        </div>
        <div className="text-sm font-mono">{log.message}</div>
      </div>
    )
  }
  
  const renderMessageItem = (message: ProcessMessage, type: 'input' | 'output') => {
    const statusColors = {
      'completed': 'bg-green-50 text-green-700',
      'in-progress': 'bg-blue-50 text-blue-700',
      'pending': 'bg-yellow-50 text-yellow-700',
      'waiting': 'bg-purple-50 text-purple-700'
    };
    
    return (
      <div className={`p-3 border rounded-md ${
        message.status === 'completed' 
          ? 'border-gray-200' 
          : message.status === 'in-progress' 
            ? 'border-blue-200 bg-blue-50/30'
            : message.status === 'pending'
              ? 'border-yellow-200 bg-yellow-50/30'
              : 'border-purple-200 bg-purple-50/30'
      }`}>
        <div className="flex justify-between items-start mb-1">
          <div className="font-medium text-sm">
            {message.type}
            {message.correlationId && (
              <span className="ml-2 text-xs text-gray-500">{message.correlationId}</span>
            )}
          </div>
          <div>
            <span className={`text-xs px-2 py-0.5 rounded ${statusColors[message.status]}`}>
              {message.status}
            </span>
          </div>
        </div>
        
        <div className="text-xs text-gray-600 mb-1 flex items-center">
          {type === 'input' 
            ? <span>From: <b>{message.source}</b> → To: <b>{message.target}</b></span>
            : <span>From: <b>{message.source}</b> → To: <b>{message.target}</b></span>
          }
        </div>
        
        <div className="text-xs text-gray-500 mb-2">
          {new Date(message.timestamp).toLocaleString()}
        </div>
        
        <div className="bg-gray-50 p-2 rounded text-xs overflow-auto max-h-20">
          <pre className="font-mono whitespace-pre-wrap">{JSON.stringify(message.payload, null, 2)}</pre>
        </div>
      </div>
    )
  }

  const filteredProcesses = getFilteredProcesses()

  return (
    <div className="animate-fadeIn h-full flex flex-col">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Cpu className="mr-2" size={24} />
        Processes
      </h1>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button 
            className={`px-4 py-2 rounded-md ${viewType === 'tree' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setViewType('tree')}
          >
            <FolderTree size={16} className="mr-2 inline-block" />
            Tree View
          </button>
          <button 
            className={`px-4 py-2 rounded-md ${viewType === 'list' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            onClick={() => setViewType('list')}
          >
            <List size={16} className="mr-2 inline-block" />
            List View
          </button>
        </div>
        
        <div className="flex space-x-2">
          <form onSubmit={handleSearch} className="flex">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search processes..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button 
              type="submit"
              className="ml-2 px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Search
            </button>
          </form>
          
          <button 
            className="px-3 py-2 border border-gray-200 bg-white rounded-md hover:bg-gray-50 flex items-center"
            onClick={() => {
              setSearchTerm('')
              setSearchInput('')
            }}
          >
            <RefreshCw size={16} className="mr-2" />
            Reset
          </button>
        </div>
      </div>
      
      {viewType === 'tree' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Process Tree</h2>
            <div className="flex space-x-2">
              <button 
                className="text-sm px-3 py-1.5 border border-gray-200 rounded hover:bg-gray-50"
                onClick={expandAllProcesses}
              >
                Expand All
              </button>
              <button 
                className="text-sm px-3 py-1.5 border border-gray-200 rounded hover:bg-gray-50"
                onClick={collapseAllProcesses}
              >
                Collapse All
              </button>
            </div>
          </div>
          
          <div className="overflow-auto">
            {filteredProcesses.map(process => renderProcessTreeItem(process))}
          </div>
        </div>
      )}
      
      {viewType === 'list' && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Process List</h2>
            <div className="grid grid-cols-12 gap-2 w-full text-xs text-gray-500 border-b border-gray-100 pb-2">
              <div className="col-span-3">Name</div>
              <div className="col-span-4">Command</div>
              <div className="col-span-1">Status</div>
              <div className="col-span-1">CPU</div>
              <div className="col-span-1">Memory</div>
              <div className="col-span-2">User</div>
            </div>
          </div>
          
          <div className="overflow-auto max-h-96">
            {/* Flatten process tree for list view */}
            {viewType === 'list' && filteredProcesses.flatMap(process => {
              const flattenProcess = (proc: Process): Process[] => {
                if (!proc.children || proc.children.length === 0) {
                  return [proc]
                }
                return [proc, ...proc.children.flatMap(flattenProcess)]
              }
              return flattenProcess(process)
            }).map(renderProcessListItem)}
          </div>
        </div>
      )}
      
      {renderProcessDetails()}
    </div>
  )
}

export default ProcessesView