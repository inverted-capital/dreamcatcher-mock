import { Customer, Repository, WeatherData } from '@/shared/types'

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    lastContact: '2023-06-15',
    status: 'active'
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    lastContact: '2023-05-20',
    status: 'active'
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    lastContact: '2023-04-10',
    status: 'inactive'
  },
  {
    id: '4',
    name: 'Bob Miller',
    email: 'bob.miller@example.com',
    lastContact: '2023-06-01',
    status: 'pending'
  },
  {
    id: '5',
    name: 'Carol Williams',
    email: 'carol.williams@example.com',
    lastContact: '2023-06-05',
    status: 'active'
  }
]


export const mockRepositories: Repository[] = [
  {
    id: 'repo-1',
    name: 'frontend-app',
    description: 'Main frontend application',
    stars: 24,
    lastUpdated: '2023-06-12',
    language: 'TypeScript'
  },
  {
    id: 'repo-2',
    name: 'api-server',
    description: 'Backend API server',
    stars: 16,
    lastUpdated: '2023-06-05',
    language: 'Python'
  },
  {
    id: 'repo-3',
    name: 'documentation',
    description: 'Project documentation',
    stars: 8,
    lastUpdated: '2023-05-22',
    language: 'Markdown',
    isLinked: true
  },
  {
    id: 'repo-4',
    name: 'design-system',
    description: 'UI component library',
    stars: 32,
    lastUpdated: '2023-06-10',
    language: 'TypeScript'
  },
  {
    id: 'repo-5',
    name: 'mobile-app',
    description: 'Native mobile application',
    stars: 19,
    lastUpdated: '2023-06-08',
    language: 'Swift',
    isLinked: true
  }
]

export const mockWeatherData: WeatherData = {
  location: 'San Francisco, CA',
  temperature: 68,
  condition: 'Partly Cloudy',
  high: 72,
  low: 58,
  precipitation: 10
}
