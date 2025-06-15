import React from 'react'
import { Users, Search, Filter } from 'lucide-react'
import { mockCustomers } from '@/shared/mock-data/mockData'

const CustomersView: React.FC = () => {
  return (
    <div className="animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold flex items-center">
          <Users className="mr-2" size={24} />
          Customers
        </h1>

        <div className="flex space-x-2">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search customers..."
              className="pl-9 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button className="border border-gray-200 bg-white hover:bg-gray-50 px-3 py-2 rounded-md flex items-center transition-colors">
            <Filter size={16} className="mr-2" />
            Filter
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="grid grid-cols-12 gap-4 p-4 font-medium text-gray-500 text-sm border-b border-gray-200">
          <div className="col-span-4">Name</div>
          <div className="col-span-4">Email</div>
          <div className="col-span-2">Last Contact</div>
          <div className="col-span-2">Status</div>
        </div>

        {mockCustomers.map((customer) => (
          <div
            key={customer.id}
            className="grid grid-cols-12 gap-4 p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className="col-span-4 flex items-center">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 text-blue-600 font-semibold">
                {customer.name.charAt(0)}
              </div>
              <span>{customer.name}</span>
            </div>
            <div className="col-span-4 text-gray-500 flex items-center">
              {customer.email}
            </div>
            <div className="col-span-2 text-gray-500 flex items-center">
              {customer.lastContact}
            </div>
            <div className="col-span-2 flex items-center">
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  customer.status === 'active'
                    ? 'bg-green-100 text-green-800'
                    : customer.status === 'inactive'
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {customer.status.charAt(0).toUpperCase() +
                  customer.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CustomersView
