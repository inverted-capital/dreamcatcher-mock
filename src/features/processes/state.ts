import { create } from 'zustand'
import { Process, ProcessEnvironment, ProcessFile, ProcessLog, ProcessMessage, MessageQueue } from '@/shared/types'

// Mock data for processes
const mockProcesses: Process[] = [
  {
    id: 'p1',
    pid: 1,
    name: 'systemd',
    command: '/sbin/init',
    status: 'running',
    cpu: 0.1,
    memory: 0.5,
    user: 'root',
    startTime: '2023-06-15T00:00:00Z',
    children: [
      {
        id: 'p2',
        pid: 78,
        name: 'sshd',
        command: '/usr/sbin/sshd -D',
        status: 'running',
        cpu: 0.2,
        memory: 0.8,
        user: 'root',
        startTime: '2023-06-15T00:01:05Z',
        parentId: 'p1'
      },
      {
        id: 'p3',
        pid: 125,
        name: 'docker',
        command: 'dockerd',
        status: 'running',
        cpu: 2.1,
        memory: 4.2,
        user: 'root',
        startTime: '2023-06-15T00:01:15Z',
        parentId: 'p1',
        children: [
          {
            id: 'p4',
            pid: 842,
            name: 'node',
            command: 'node server.js',
            status: 'running',
            cpu: 15.3,
            memory: 8.7,
            user: 'node',
            startTime: '2023-06-15T10:15:23Z',
            parentId: 'p3'
          },
          {
            id: 'p5',
            pid: 901,
            name: 'postgres',
            command: 'postgres -D /var/lib/postgresql/data',
            status: 'running',
            cpu: 5.6,
            memory: 12.3,
            user: 'postgres',
            startTime: '2023-06-15T10:16:00Z',
            parentId: 'p3'
          }
        ]
      },
      {
        id: 'p6',
        pid: 212,
        name: 'nginx',
        command: 'nginx: master process',
        status: 'running',
        cpu: 0.3,
        memory: 1.2,
        user: 'www-data',
        startTime: '2023-06-15T00:02:10Z',
        parentId: 'p1',
        children: [
          {
            id: 'p7',
            pid: 214,
            name: 'nginx',
            command: 'nginx: worker process',
            status: 'running',
            cpu: 0.5,
            memory: 0.9,
            user: 'www-data',
            startTime: '2023-06-15T00:02:12Z',
            parentId: 'p6'
          }
        ]
      }
    ]
  },
  {
    id: 'p8',
    pid: 2,
    name: 'kthreadd',
    command: '',
    status: 'running',
    cpu: 0.0,
    memory: 0.0,
    user: 'root',
    startTime: '2023-06-15T00:00:01Z',
    children: [
      {
        id: 'p9',
        pid: 3,
        name: 'kworker/0:0',
        command: '',
        status: 'running',
        cpu: 0.1,
        memory: 0.0,
        user: 'root',
        startTime: '2023-06-15T00:00:01Z',
        parentId: 'p8'
      },
      {
        id: 'p10',
        pid: 4,
        name: 'kworker/0:1H',
        command: '',
        status: 'running',
        cpu: 0.0,
        memory: 0.0,
        user: 'root',
        startTime: '2023-06-15T00:00:01Z',
        parentId: 'p8'
      }
    ]
  }
]

// Mock process file data
const mockProcessFiles: Record<string, ProcessFile[]> = {
  'p4': [
    {
      id: 'f1',
      name: 'stdout',
      type: 'out',
      size: 1024,
      path: '/proc/842/fd/1',
      lastAccessed: '2023-06-16T15:30:00Z'
    },
    {
      id: 'f2',
      name: 'stderr',
      type: 'err',
      size: 512,
      path: '/proc/842/fd/2',
      lastAccessed: '2023-06-16T15:28:30Z'
    },
    {
      id: 'f3',
      name: 'config.json',
      type: 'config',
      size: 2048,
      path: '/proc/842/root/app/config.json',
      lastAccessed: '2023-06-16T10:00:00Z'
    }
  ],
  'p5': [
    {
      id: 'f4',
      name: 'postgres.log',
      type: 'out',
      size: 4096,
      path: '/proc/901/fd/1',
      lastAccessed: '2023-06-16T15:30:00Z'
    },
    {
      id: 'f5',
      name: 'postgres.err',
      type: 'err',
      size: 1024,
      path: '/proc/901/fd/2',
      lastAccessed: '2023-06-16T14:45:00Z'
    }
  ]
}

// Mock process logs
const mockProcessLogs: Record<string, ProcessLog[]> = {
  'p4': [
    {
      id: 'l1',
      timestamp: '2023-06-16T15:30:00Z',
      level: 'info',
      message: 'Server started on port 3000'
    },
    {
      id: 'l2',
      timestamp: '2023-06-16T15:29:50Z',
      level: 'info',
      message: 'Connected to database'
    },
    {
      id: 'l3',
      timestamp: '2023-06-16T15:29:45Z',
      level: 'debug',
      message: 'Loading configuration from config.json'
    }
  ],
  'p5': [
    {
      id: 'l4',
      timestamp: '2023-06-16T15:30:00Z',
      level: 'info',
      message: 'PostgreSQL database started on port 5432'
    },
    {
      id: 'l5',
      timestamp: '2023-06-16T15:29:55Z',
      level: 'warning',
      message: 'Low disk space on /var/lib/postgresql/data'
    }
  ]
}

// Mock process environment variables
const mockProcessEnv: Record<string, ProcessEnvironment[]> = {
  'p4': [
    { key: 'NODE_ENV', value: 'production' },
    { key: 'PORT', value: '3000' },
    { key: 'DB_HOST', value: 'localhost' },
    { key: 'DB_PORT', value: '5432' },
    { key: 'LOG_LEVEL', value: 'info' }
  ],
  'p5': [
    { key: 'POSTGRES_USER', value: 'postgres' },
    { key: 'POSTGRES_PASSWORD', value: '********' },
    { key: 'POSTGRES_DB', value: 'main' },
    { key: 'PGDATA', value: '/var/lib/postgresql/data' }
  ]
}

// Mock message queues for processes
const mockMessageQueues: Record<string, MessageQueue> = {
  'p1': {
    input: [
      {
        id: 'p1-in1',
        type: 'SYSTEM_CONTROL',
        payload: { command: 'STATUS', reportLevel: 'detailed' },
        timestamp: '2023-06-16T15:30:00Z',
        status: 'completed',
        source: 'system',
        target: 'p1'
      },
      {
        id: 'p1-in2',
        type: 'SERVICE_REQUEST',
        payload: { service: 'networking', action: 'restart' },
        timestamp: '2023-06-16T15:32:00Z',
        status: 'in-progress',
        source: 'admin',
        target: 'p1'
      }
    ],
    output: [
      {
        id: 'p1-out1',
        type: 'STATUS_REPORT',
        payload: { status: 'healthy', services: { running: 42, stopped: 2 } },
        timestamp: '2023-06-16T15:30:05Z',
        status: 'completed',
        source: 'p1',
        target: 'system'
      }
    ]
  },
  'p2': {
    input: [
      {
        id: 'p2-in1',
        type: 'CONNECTION_REQUEST',
        payload: { ip: '192.168.1.100', user: 'admin', auth: 'key-based' },
        timestamp: '2023-06-16T15:25:00Z',
        status: 'completed',
        source: 'external',
        target: 'p2'
      }
    ],
    output: [
      {
        id: 'p2-out1',
        type: 'CONNECTION_ACCEPTED',
        payload: { sessionId: 'ssh-12345', channel: 'secure' },
        timestamp: '2023-06-16T15:25:02Z',
        status: 'completed',
        source: 'p2',
        target: 'external'
      },
      {
        id: 'p2-out2',
        type: 'LOG_EVENT',
        payload: { level: 'info', message: 'New SSH connection established' },
        timestamp: '2023-06-16T15:25:03Z',
        status: 'completed',
        source: 'p2',
        target: 'p1'
      }
    ]
  },
  'p3': {
    input: [
      {
        id: 'p3-in1',
        type: 'CONTAINER_CREATE',
        payload: { image: 'node:18-alpine', name: 'api-server' },
        timestamp: '2023-06-16T14:50:00Z',
        status: 'completed',
        source: 'docker-cli',
        target: 'p3'
      },
      {
        id: 'p3-in2',
        type: 'CONTAINER_START',
        payload: { containerId: 'abcdef123456' },
        timestamp: '2023-06-16T14:52:00Z',
        status: 'completed',
        source: 'docker-cli',
        target: 'p3'
      },
      {
        id: 'p3-in3',
        type: 'VOLUME_MOUNT',
        payload: { volumeName: 'data-volume', mountPath: '/app/data' },
        timestamp: '2023-06-16T14:55:00Z',
        status: 'in-progress',
        source: 'docker-cli',
        target: 'p3'
      }
    ],
    output: [
      {
        id: 'p3-out1',
        type: 'CONTAINER_CREATED',
        payload: { containerId: 'abcdef123456', status: 'created' },
        timestamp: '2023-06-16T14:51:00Z',
        status: 'completed',
        source: 'p3',
        target: 'docker-cli'
      },
      {
        id: 'p3-out2',
        type: 'CONTAINER_STARTED',
        payload: { containerId: 'abcdef123456', status: 'running' },
        timestamp: '2023-06-16T14:53:00Z',
        status: 'completed',
        source: 'p3',
        target: 'docker-cli'
      }
    ]
  },
  'p4': {
    input: [
      {
        id: 'in1',
        type: 'HTTP_REQUEST',
        payload: { method: 'GET', path: '/api/users', query: { page: 1 } },
        timestamp: '2023-06-16T15:35:10Z',
        status: 'completed',
        source: 'external',
        target: 'p4'
      },
      {
        id: 'in2',
        type: 'DATABASE_QUERY',
        payload: { query: 'SELECT * FROM users LIMIT 10 OFFSET 0' },
        timestamp: '2023-06-16T15:35:12Z',
        status: 'completed',
        source: 'p5',
        target: 'p4',
        correlationId: 'txn-123456'
      },
      {
        id: 'in3',
        type: 'HTTP_REQUEST',
        payload: { method: 'POST', path: '/api/users', body: { name: 'New User' } },
        timestamp: '2023-06-16T15:36:00Z',
        status: 'in-progress',
        source: 'external',
        target: 'p4'
      },
      {
        id: 'in4',
        type: 'SYSTEM_NOTIFICATION',
        payload: { level: 'warning', message: 'High CPU usage detected' },
        timestamp: '2023-06-16T15:36:30Z',
        status: 'pending',
        source: 'p1',
        target: 'p4'
      }
    ],
    output: [
      {
        id: 'out1',
        type: 'HTTP_RESPONSE',
        payload: { status: 200, body: { users: [/* array of 10 users */], total: 42 } },
        timestamp: '2023-06-16T15:35:15Z',
        status: 'completed',
        source: 'p4',
        target: 'external'
      },
      {
        id: 'out2',
        type: 'DATABASE_QUERY',
        payload: { query: 'INSERT INTO users (name) VALUES ($1)', params: ['New User'] },
        timestamp: '2023-06-16T15:36:05Z',
        status: 'waiting',
        source: 'p4',
        target: 'p5',
        correlationId: 'txn-789012'
      }
    ]
  },
  'p5': {
    input: [
      {
        id: 'db-in1',
        type: 'DATABASE_QUERY',
        payload: { query: 'SELECT * FROM users LIMIT 10 OFFSET 0' },
        timestamp: '2023-06-16T15:35:12Z',
        status: 'completed',
        source: 'p4',
        target: 'p5',
        correlationId: 'txn-123456'
      },
      {
        id: 'db-in2',
        type: 'DATABASE_QUERY',
        payload: { query: 'INSERT INTO users (name) VALUES ($1)', params: ['New User'] },
        timestamp: '2023-06-16T15:36:05Z',
        status: 'in-progress',
        source: 'p4',
        target: 'p5',
        correlationId: 'txn-789012'
      },
      {
        id: 'db-in3',
        type: 'MAINTENANCE',
        payload: { operation: 'VACUUM', table: 'users' },
        timestamp: '2023-06-16T15:00:00Z',
        status: 'pending',
        source: 'scheduler',
        target: 'p5'
      }
    ],
    output: [
      {
        id: 'db-out1',
        type: 'QUERY_RESULT',
        payload: { rows: [/* array of 10 users */], rowCount: 10 },
        timestamp: '2023-06-16T15:35:14Z',
        status: 'completed',
        source: 'p5',
        target: 'p4',
        correlationId: 'txn-123456'
      },
      {
        id: 'db-out2',
        type: 'NOTIFICATION',
        payload: { channel: 'user_changes', message: 'user_created' },
        timestamp: '2023-06-16T15:36:10Z',
        status: 'completed',
        source: 'p5',
        target: 'broadcast'
      }
    ]
  },
  'p6': {
    input: [
      {
        id: 'p6-in1',
        type: 'HTTP_REQUEST',
        payload: { method: 'GET', path: '/', ip: '192.168.1.42' },
        timestamp: '2023-06-16T15:40:00Z',
        status: 'completed',
        source: 'external',
        target: 'p6'
      },
      {
        id: 'p6-in2',
        type: 'CONFIG_RELOAD',
        payload: { config: 'nginx.conf', triggeredBy: 'admin' },
        timestamp: '2023-06-16T15:45:00Z',
        status: 'pending',
        source: 'p1',
        target: 'p6'
      }
    ],
    output: [
      {
        id: 'p6-out1',
        type: 'WORKER_INSTRUCTION',
        payload: { action: 'process_request', clientIp: '192.168.1.42' },
        timestamp: '2023-06-16T15:40:01Z',
        status: 'completed',
        source: 'p6',
        target: 'p7'
      }
    ]
  },
  'p7': {
    input: [
      {
        id: 'p7-in1',
        type: 'WORKER_INSTRUCTION',
        payload: { action: 'process_request', clientIp: '192.168.1.42' },
        timestamp: '2023-06-16T15:40:01Z',
        status: 'completed',
        source: 'p6',
        target: 'p7'
      }
    ],
    output: [
      {
        id: 'p7-out1',
        type: 'HTTP_RESPONSE',
        payload: { status: 200, size: 12345, timeMs: 42 },
        timestamp: '2023-06-16T15:40:02Z',
        status: 'completed',
        source: 'p7',
        target: 'external'
      },
      {
        id: 'p7-out2',
        type: 'ACCESS_LOG',
        payload: { ip: '192.168.1.42', method: 'GET', path: '/', status: 200 },
        timestamp: '2023-06-16T15:40:03Z',
        status: 'completed',
        source: 'p7',
        target: 'p6'
      }
    ]
  },
  'p8': {
    input: [
      {
        id: 'p8-in1',
        type: 'SCHEDULER_EVENT',
        payload: { action: 'spawn_worker', cpuId: 0 },
        timestamp: '2023-06-16T15:10:00Z',
        status: 'completed',
        source: 'kernel',
        target: 'p8'
      }
    ],
    output: [
      {
        id: 'p8-out1',
        type: 'WORKER_SPAWN',
        payload: { worker: 'kworker/0:0', priority: 'normal' },
        timestamp: '2023-06-16T15:10:01Z',
        status: 'completed',
        source: 'p8',
        target: 'p9'
      }
    ]
  },
  'p9': {
    input: [
      {
        id: 'p9-in1',
        type: 'WORKER_SPAWN',
        payload: { worker: 'kworker/0:0', priority: 'normal' },
        timestamp: '2023-06-16T15:10:01Z',
        status: 'completed',
        source: 'p8',
        target: 'p9'
      },
      {
        id: 'p9-in2',
        type: 'IO_TASK',
        payload: { device: 'sda1', operation: 'read', blocks: 128 },
        timestamp: '2023-06-16T15:20:00Z',
        status: 'in-progress',
        source: 'kernel',
        target: 'p9'
      }
    ],
    output: [
      {
        id: 'p9-out1',
        type: 'TASK_STATUS',
        payload: { task: 'io', status: 'processing', progress: 65 },
        timestamp: '2023-06-16T15:20:10Z',
        status: 'waiting',
        source: 'p9',
        target: 'kernel'
      }
    ]
  },
  'p10': {
    input: [
      {
        id: 'p10-in1',
        type: 'DEFERRED_WORK',
        payload: { type: 'housekeeping', priority: 'low' },
        timestamp: '2023-06-16T15:15:00Z',
        status: 'pending',
        source: 'kernel',
        target: 'p10'
      }
    ],
    output: []
  }
}

// Define the interface for process state
interface ProcessesState {
  processes: Process[]
  selectedProcessId: string | null
  expandedProcessIds: Set<string>
  searchTerm: string
  viewType: 'tree' | 'list'
  showFileDetails: boolean
  showEnvVars: boolean
  showLogs: boolean
  currentTabName: 'overview' | 'files' | 'env' | 'logs' | 'messages'
}

// Define the interface for process actions
interface ProcessesActions {
  selectProcess: (id: string | null) => void
  toggleExpandProcess: (id: string) => void
  expandAllProcesses: () => void
  collapseAllProcesses: () => void
  setSearchTerm: (term: string) => void
  setViewType: (type: 'tree' | 'list') => void
  toggleFileDetails: () => void
  toggleEnvVars: () => void
  toggleLogs: () => void
  setCurrentTab: (tab: 'overview' | 'files' | 'env' | 'logs' | 'messages') => void
  getProcessById: (id: string) => Process | undefined
  getProcessFiles: (id: string) => ProcessFile[]
  getProcessLogs: (id: string) => ProcessLog[]
  getProcessEnv: (id: string) => ProcessEnvironment[]
  getProcessMessageQueue: (id: string) => MessageQueue | undefined
  filterProcesses: (term: string) => Process[]
  getFilteredProcesses: () => Process[]
}

// Recursive function to find a process by ID
const findProcessById = (
  processes: Process[],
  id: string
): Process | undefined => {
  for (const process of processes) {
    if (process.id === id) {
      return process
    }
    if (process.children && process.children.length > 0) {
      const found = findProcessById(process.children, id)
      if (found) {
        return found
      }
    }
  }
  return undefined
}

// Recursive function to get all process IDs for expanding
const getAllProcessIds = (processes: Process[]): string[] => {
  let ids: string[] = []
  processes.forEach(process => {
    ids.push(process.id)
    if (process.children && process.children.length > 0) {
      ids = [...ids, ...getAllProcessIds(process.children)]
    }
  })
  return ids
}

// Recursive function to search processes
const searchProcesses = (processes: Process[], term: string): Process[] => {
  return processes
    .map(process => {
      // Check if this process matches the search term
      const matches =
        process.name.toLowerCase().includes(term.toLowerCase()) ||
        process.command.toLowerCase().includes(term.toLowerCase()) ||
        process.user.toLowerCase().includes(term.toLowerCase()) ||
        process.pid.toString().includes(term)

      // Make a copy of the process
      const processCopy: Process = { ...process }

      if (process.children && process.children.length > 0) {
        // Recursively search children
        const matchingChildren = searchProcesses(process.children, term)
        
        // If there are matching children, include them
        if (matchingChildren.length > 0) {
          processCopy.children = matchingChildren
          return processCopy
        }
      }

      // Return the process if it matches, otherwise return null
      return matches ? processCopy : null
    })
    .filter((process): process is Process => process !== null)
}

// Create the Zustand store
export const useProcessesStore = create<ProcessesState & ProcessesActions>((set, get) => ({
  // State
  processes: mockProcesses,
  selectedProcessId: null,
  expandedProcessIds: new Set(getAllProcessIds(mockProcesses)),
  searchTerm: '',
  viewType: 'tree',
  showFileDetails: false,
  showEnvVars: false,
  showLogs: false,
  currentTabName: 'overview',

  // Actions
  selectProcess: (id) => set({ selectedProcessId: id }),
  
  toggleExpandProcess: (id) => {
    set(state => {
      const newSet = new Set(state.expandedProcessIds)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return { expandedProcessIds: newSet }
    })
  },
  
  expandAllProcesses: () => {
    set(state => ({
      expandedProcessIds: new Set(getAllProcessIds(state.processes))
    }))
  },
  
  collapseAllProcesses: () => {
    set({ expandedProcessIds: new Set() })
  },
  
  setSearchTerm: (term) => set({ searchTerm: term }),
  
  setViewType: (type) => set({ viewType: type }),
  
  toggleFileDetails: () => set(state => ({ showFileDetails: !state.showFileDetails })),
  
  toggleEnvVars: () => set(state => ({ showEnvVars: !state.showEnvVars })),
  
  toggleLogs: () => set(state => ({ showLogs: !state.showLogs })),
  
  setCurrentTab: (tab) => set({ currentTabName: tab }),
  
  getProcessById: (id) => {
    return findProcessById(get().processes, id)
  },
  
  getProcessFiles: (id) => {
    return mockProcessFiles[id] || []
  },
  
  getProcessLogs: (id) => {
    return mockProcessLogs[id] || []
  },
  
  getProcessEnv: (id) => {
    return mockProcessEnv[id] || []
  },
  
  getProcessMessageQueue: (id) => {
    return mockMessageQueues[id]
  },
  
  filterProcesses: (term) => {
    if (!term.trim()) return mockProcesses
    return searchProcesses(mockProcesses, term)
  },
  
  getFilteredProcesses: () => {
    const { searchTerm, processes } = get()
    if (!searchTerm.trim()) return processes
    return searchProcesses(processes, searchTerm)
  }
}))