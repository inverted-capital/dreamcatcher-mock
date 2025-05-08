import { Customer, FileItem, Repository, WeatherData } from '@/shared/types';

export const mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    lastContact: '2023-06-15',
    status: 'active',
  },
  {
    id: '2',
    name: 'John Doe',
    email: 'john.doe@example.com',
    lastContact: '2023-05-20',
    status: 'active',
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    lastContact: '2023-04-10',
    status: 'inactive',
  },
  {
    id: '4',
    name: 'Bob Miller',
    email: 'bob.miller@example.com',
    lastContact: '2023-06-01',
    status: 'pending',
  },
  {
    id: '5',
    name: 'Carol Williams',
    email: 'carol.williams@example.com',
    lastContact: '2023-06-05',
    status: 'active',
  },
];

const mockFiles: FileItem[] = [
  {
    id: 'file-1',
    name: 'Project Proposal.pdf',
    type: 'pdf',
    size: 2500000,
    modified: '2023-06-01',
    path: '/documents/proposals/',
  },
  {
    id: 'file-2',
    name: 'Meeting Notes.docx',
    type: 'docx',
    size: 150000,
    modified: '2023-06-10',
    path: '/documents/meetings/',
  },
  {
    id: 'file-3',
    name: 'Budget 2023.xlsx',
    type: 'xlsx',
    size: 350000,
    modified: '2023-05-15',
    path: '/documents/finance/',
  },
  {
    id: 'file-4',
    name: 'Logo.png',
    type: 'png',
    size: 500000,
    modified: '2023-04-20',
    path: '/images/',
  },
  {
    id: 'file-5',
    name: 'Product Roadmap.pptx',
    type: 'pptx',
    size: 4000000,
    modified: '2023-06-05',
    path: '/documents/planning/',
  },
];

export const mockRepositories: Repository[] = [
  {
    id: 'repo-1',
    name: 'frontend-app',
    description: 'Main frontend application',
    stars: 24,
    lastUpdated: '2023-06-12',
    language: 'TypeScript',
  },
  {
    id: 'repo-2',
    name: 'api-server',
    description: 'Backend API server',
    stars: 16,
    lastUpdated: '2023-06-05',
    language: 'Python',
  },
  {
    id: 'repo-3',
    name: 'documentation',
    description: 'Project documentation',
    stars: 8,
    lastUpdated: '2023-05-22',
    language: 'Markdown',
    isLinked: true,
  },
  {
    id: 'repo-4',
    name: 'design-system',
    description: 'UI component library',
    stars: 32,
    lastUpdated: '2023-06-10',
    language: 'TypeScript',
  },
  {
    id: 'repo-5',
    name: 'mobile-app',
    description: 'Native mobile application',
    stars: 19,
    lastUpdated: '2023-06-08',
    language: 'Swift',
    isLinked: true,
  },
];

export const mockWeatherData: WeatherData = {
  location: 'San Francisco, CA',
  temperature: 68,
  condition: 'Partly Cloudy',
  high: 72,
  low: 58,
  precipitation: 10,
};