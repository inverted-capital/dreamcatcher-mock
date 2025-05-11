import React, { useState } from 'react'
import {
  Package,
  Search,
  Download,
  ToggleLeft,
  ToggleRight,
  Settings,
  ExternalLink,
  Play,
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react'
import { useNappsStore } from '../state'
import { useRepoStore } from '@/features/repos/state'
import { Napp } from '@/shared/types'

const NappsView: React.FC = () => {
  const { currentRepoId, getRepositoryById } = useRepoStore()
  const {
    installedNapps,
    availableNapps,
    expandedConfig,
    runningNapp,
    toggleNappStatus,
    installNapp,
    uninstallNapp,
    toggleConfigPanel,
    runNapp
  } = useNappsStore()

  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState<'installed' | 'explore'>(
    'installed'
  )

  const currentRepo = currentRepoId ? getRepositoryById(currentRepoId) : null

  // Filter napps based on search term
  const filteredInstalledNapps = installedNapps.filter(
    (napp) =>
      napp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      napp.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredAvailableNapps = availableNapps.filter(
    (napp) =>
      napp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      napp.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Package className="mr-2" size={24} />
        Natural Applications
      </h1>

      {currentRepo ? (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-lg font-medium">{currentRepo.name}</h2>
                <p className="text-sm text-gray-600">
                  {currentRepo.description}
                </p>
              </div>
              <div className="mt-3 md:mt-0">
                <div className="text-sm bg-blue-50 text-blue-800 px-3 py-1 rounded-full">
                  {installedNapps.length} Napps Installed
                </div>
              </div>
            </div>
          </div>

          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex mb-4 md:mb-0">
              <button
                className={`px-4 py-2 mr-2 rounded-md ${
                  activeTab === 'installed'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('installed')}
              >
                Installed
              </button>
              <button
                className={`px-4 py-2 rounded-md ${
                  activeTab === 'explore'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('explore')}
              >
                Explore
              </button>
            </div>

            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search natural applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-4 py-2 w-full md:w-64 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {activeTab === 'installed' ? (
            <div className="space-y-4">
              {filteredInstalledNapps.length > 0 ? (
                filteredInstalledNapps.map((napp) => (
                  <div
                    key={napp.id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden"
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center mr-3">
                            <Package size={20} className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium flex items-center">
                              {napp.name}
                              <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                                v{napp.version}
                              </span>
                            </h3>
                            <p className="text-sm text-gray-600">
                              {napp.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center">
                          <button
                            onClick={() => runNapp(napp.id)}
                            disabled={!napp.isEnabled || runningNapp !== null}
                            className={`mr-2 p-1.5 rounded-md ${
                              napp.isEnabled
                                ? runningNapp === napp.id
                                  ? 'bg-yellow-100 text-yellow-700 animate-pulse'
                                  : 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            }`}
                            title={
                              napp.isEnabled
                                ? 'Run this application'
                                : 'Enable to run'
                            }
                          >
                            {runningNapp === napp.id ? (
                              <AlertCircle size={18} />
                            ) : (
                              <Play size={18} />
                            )}
                          </button>

                          <button
                            onClick={() => toggleNappStatus(napp.id)}
                            className="mr-2 text-gray-400 hover:text-gray-600"
                            title={napp.isEnabled ? 'Disable' : 'Enable'}
                          >
                            {napp.isEnabled ? (
                              <ToggleRight
                                size={20}
                                className="text-green-500"
                              />
                            ) : (
                              <ToggleLeft size={20} />
                            )}
                          </button>

                          <button
                            onClick={() => toggleConfigPanel(napp.id)}
                            className="mr-2 text-gray-400 hover:text-gray-600"
                            title="Settings"
                          >
                            {expandedConfig === napp.id ? (
                              <ChevronUp size={20} />
                            ) : (
                              <ChevronDown size={20} />
                            )}
                          </button>
                        </div>
                      </div>

                      <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                        <div>Installed: {napp.installDate}</div>
                        <div
                          className={
                            napp.isEnabled ? 'text-green-500' : 'text-gray-500'
                          }
                        >
                          {napp.isEnabled ? 'Enabled' : 'Disabled'}
                        </div>
                      </div>
                    </div>

                    {expandedConfig === napp.id && (
                      <div className="bg-gray-50 p-4 border-t border-gray-200">
                        <div className="flex justify-between mb-3">
                          <h4 className="text-sm font-medium">Configuration</h4>
                          <div className="flex space-x-2">
                            <button className="text-xs px-2 py-1 bg-blue-50 text-blue-600 rounded hover:bg-blue-100">
                              <Settings size={12} className="inline mr-1" />
                              Configure
                            </button>
                            <button
                              className="text-xs px-2 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100"
                              onClick={() => uninstallNapp(napp.id)}
                            >
                              Uninstall
                            </button>
                          </div>
                        </div>

                        <div className="text-sm text-gray-600">
                          <p>
                            Application settings and permissions can be
                            configured here.
                          </p>
                          <div className="mt-2 grid grid-cols-2 gap-2">
                            <div className="bg-white p-2 rounded border border-gray-200">
                              <div className="text-xs font-medium">
                                Auto-run on commit
                              </div>
                              <div className="text-xs text-gray-500">No</div>
                            </div>
                            <div className="bg-white p-2 rounded border border-gray-200">
                              <div className="text-xs font-medium">
                                Required permissions
                              </div>
                              <div className="text-xs text-gray-500">
                                Read, Write
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <Package size={32} className="mx-auto text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                    No applications installed
                  </h3>
                  <p className="text-gray-500 mb-4">
                    {searchTerm
                      ? `No applications match "${searchTerm}"`
                      : 'Install natural applications to enhance your repository'}
                  </p>
                  {!searchTerm && (
                    <button
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                      onClick={() => setActiveTab('explore')}
                    >
                      Explore Applications
                    </button>
                  )}
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredAvailableNapps.length > 0 ? (
                filteredAvailableNapps.map((napp) => (
                  <div
                    key={napp.id}
                    className="bg-white rounded-lg border border-gray-200 p-4"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center mr-3">
                          <Package size={20} className="text-gray-600" />
                        </div>
                        <div>
                          <h3 className="font-medium flex items-center">
                            {napp.name}
                            <span className="ml-2 text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
                              v{napp.version}
                            </span>
                          </h3>
                          <p className="text-sm text-gray-600">
                            {napp.description}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => installNapp(napp)}
                        className="flex items-center px-3 py-1.5 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-600"
                      >
                        <Download size={14} className="mr-1" />
                        Install
                      </button>
                    </div>

                    <div className="mt-3 flex items-center text-xs text-blue-500 hover:text-blue-700">
                      <ExternalLink size={12} className="mr-1" />
                      <a href="#" onClick={(e) => e.preventDefault()}>
                        View documentation
                      </a>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <Search size={32} className="mx-auto text-gray-400 mb-2" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">
                    No applications found
                  </h3>
                  <p className="text-gray-500">
                    {searchTerm
                      ? `No applications match "${searchTerm}"`
                      : 'There are no applications available right now'}
                  </p>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="text-gray-400 mb-2">
            <Package size={40} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No Repository Selected
          </h3>
          <p className="text-gray-500 mb-4">
            Please select a repository to view and manage its natural
            applications
          </p>
        </div>
      )}
    </div>
  )
}

export default NappsView
