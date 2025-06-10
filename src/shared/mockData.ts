import { Customer, WeatherData } from '@/shared/types'

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

export const mockWeatherData: WeatherData = {
  location: 'San Francisco, CA',
  temperature: 68,
  condition: 'Partly Cloudy',
  high: 72,
  low: 58,
  precipitation: 10
}
