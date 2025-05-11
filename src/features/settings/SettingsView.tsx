import React, { useState } from 'react'
import {
  Settings,
  Server,
  GitBranch,
  Shield,
  UserCheck,
  Package,
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  X,
  Link
} from 'lucide-react'
import { useSettingsStore } from './state'
import { useRepoStore } from '@/features/repos/state'

const SettingsView: React.FC = () => {
  const {
    remotes,
    permissions,
    roles,
    napps,
    addRemote,
    removeRemote,
    addNapp,
    toggleNappStatus
  } = useSettingsStore()

  const { getRepositoryById, currentRepoId, currentBranch } = useRepoStore()

  const [activeTab, setActiveTab] = useState('remotes')
  const [newRemoteName, setNewRemoteName] = useState('')
  const [newRemoteUrl, setNewRemoteUrl] = useState('')
  const [showAddRemote, setShowAddRemote] = useState(false)

  const [newNappName, setNewNappName] = useState('')
  const [showAddNapp, setShowAddNapp] = useState(false)

  const currentRepo = currentRepoId ? getRepositoryById(currentRepoId) : null

  const handleAddRemote = () => {
    if (!newRemoteName.trim() || !newRemoteUrl.trim()) return

    addRemote(newRemoteName, newRemoteUrl)
    setNewRemoteName('')
    setNewRemoteUrl('')
    setShowAddRemote(false)
  }

  const handleAddNapp = () => {
    if (!newNappName.trim()) return

    addNapp(newNappName)
    setNewNappName('')
    setShowAddNapp(false)
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Settings className="mr-2" size={24} />
        Repository Settings
      </h1>

      {currentRepo ? (
        <>
          <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <h2 className="text-lg font-medium">{currentRepo.name}</h2>
                <p className="text-sm text-gray-600">
                  {currentRepo.description}
                </p>
              </div>
              <div className="text-sm">
                <div className="text-gray-600">
                  Current Branch:{' '}
                  <span className="font-medium">{currentBranch}</span>
                </div>
                <div className="text-gray-600">
                  Last Updated:{' '}
                  <span className="font-medium">{currentRepo.lastUpdated}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <div className="flex border-b border-gray-200">
              <button
                className={`px-4 py-3 text-sm font-medium ${activeTab === 'remotes' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setActiveTab('remotes')}
              >
                <div className="flex items-center">
                  <Server size={16} className="mr-2" />
                  Remotes
                </div>
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${activeTab === 'permissions' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setActiveTab('permissions')}
              >
                <div className="flex items-center">
                  <Shield size={16} className="mr-2" />
                  Permissions
                </div>
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${activeTab === 'roles' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setActiveTab('roles')}
              >
                <div className="flex items-center">
                  <UserCheck size={16} className="mr-2" />
                  Roles
                </div>
              </button>
              <button
                className={`px-4 py-3 text-sm font-medium ${activeTab === 'napps' ? 'text-blue-600 border-b-2 border-blue-500' : 'text-gray-600 hover:text-gray-800'}`}
                onClick={() => setActiveTab('napps')}
              >
                <div className="flex items-center">
                  <Package size={16} className="mr-2" />
                  Natural Applications
                </div>
              </button>
            </div>

            <div className="p-6">
              {/* Remotes Tab */}
              {activeTab === 'remotes' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Remote Repositories</h3>
                    <button
                      onClick={() => setShowAddRemote(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md flex items-center text-sm transition-colors"
                    >
                      <Plus size={14} className="mr-1" />
                      Add Remote
                    </button>
                  </div>

                  {showAddRemote && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                      <div className="text-sm font-medium mb-2">
                        Add New Remote
                      </div>
                      <div className="grid grid-cols-12 gap-3">
                        <div className="col-span-3">
                          <input
                            type="text"
                            value={newRemoteName}
                            onChange={(e) => setNewRemoteName(e.target.value)}
                            placeholder="Remote name"
                            className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-7">
                          <input
                            type="text"
                            value={newRemoteUrl}
                            onChange={(e) => setNewRemoteUrl(e.target.value)}
                            placeholder="Remote URL (https://github.com/username/repo.git)"
                            className="w-full border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div className="col-span-2 flex">
                          <button
                            onClick={handleAddRemote}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors mr-2 flex-1"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => setShowAddRemote(false)}
                            className="text-gray-500 hover:text-gray-700"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {remotes.length > 0 ? (
                      remotes.map((remote) => (
                        <div
                          key={remote.id}
                          className="p-3 border border-gray-200 rounded-md flex items-center justify-between hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                              <Link size={18} className="text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium flex items-center">
                                {remote.name}
                                {remote.isDefault && (
                                  <span className="ml-2 px-1.5 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                    Default
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500">
                                {remote.url}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded mr-2">
                              {remote.type === 'both'
                                ? 'Fetch & Push'
                                : remote.type === 'fetch'
                                  ? 'Fetch Only'
                                  : 'Push Only'}
                            </span>
                            <button
                              onClick={() => removeRemote(remote.id)}
                              className="text-red-500 hover:text-red-700 p-1"
                              title="Remove remote"
                              disabled={remote.isDefault}
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-gray-500">
                        No remote repositories configured. Add a remote to get
                        started.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Permissions Tab */}
              {activeTab === 'permissions' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Permissions</h3>

                  <div className="space-y-3">
                    {permissions.map((permission) => (
                      <div
                        key={permission.id}
                        className="p-3 border border-gray-200 rounded-md flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                            <Shield size={18} className="text-purple-600" />
                          </div>
                          <div>
                            <div className="font-medium">{permission.name}</div>
                            <div className="text-xs text-gray-500">
                              {permission.type.charAt(0).toUpperCase() +
                                permission.type.slice(1)}{' '}
                              permission for {permission.scope} level
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs 
                            ${
                              permission.type === 'read'
                                ? 'bg-blue-100 text-blue-800'
                                : permission.type === 'write'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {permission.type.charAt(0).toUpperCase() +
                              permission.type.slice(1)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Roles Tab */}
              {activeTab === 'roles' && (
                <div>
                  <h3 className="text-lg font-medium mb-4">Roles</h3>

                  <div className="space-y-3">
                    {roles.map((role) => (
                      <div
                        key={role.id}
                        className="p-3 border border-gray-200 rounded-md flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mr-3">
                            <UserCheck size={18} className="text-indigo-600" />
                          </div>
                          <div>
                            <div className="font-medium flex items-center">
                              {role.name}
                              {role.isInherited && (
                                <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded-full">
                                  Inherited from {role.inheritedFrom}
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">
                              {role.description}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1">
                          {role.permissions.map((permId) => {
                            const perm = permissions.find(
                              (p) => p.id === permId
                            )
                            return perm ? (
                              <span
                                key={permId}
                                className={`px-2 py-1 text-xs rounded
                                  ${
                                    perm.type === 'read'
                                      ? 'bg-blue-100 text-blue-800'
                                      : perm.type === 'write'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-purple-100 text-purple-800'
                                  }`}
                              >
                                {perm.name}
                              </span>
                            ) : null
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Natural Applications Tab */}
              {activeTab === 'napps' && (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">
                      Natural Applications
                    </h3>
                    <button
                      onClick={() => setShowAddNapp(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1.5 rounded-md flex items-center text-sm transition-colors"
                    >
                      <Plus size={14} className="mr-1" />
                      Install Napp
                    </button>
                  </div>

                  {showAddNapp && (
                    <div className="mb-4 p-3 bg-gray-50 rounded-md border border-gray-200">
                      <div className="text-sm font-medium mb-2">
                        Install New Application
                      </div>
                      <div className="flex items-center">
                        <input
                          type="text"
                          value={newNappName}
                          onChange={(e) => setNewNappName(e.target.value)}
                          placeholder="Enter application name"
                          className="flex-1 border border-gray-300 rounded-md px-3 py-1.5 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button
                          onClick={handleAddNapp}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md text-sm transition-colors"
                        >
                          Install
                        </button>
                        <button
                          onClick={() => setShowAddNapp(false)}
                          className="ml-2 text-gray-500 hover:text-gray-700"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {napps.map((napp) => (
                      <div
                        key={napp.id}
                        className="p-3 border border-gray-200 rounded-md flex items-center justify-between hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mr-3">
                            <Package size={18} className="text-green-600" />
                          </div>
                          <div>
                            <div className="font-medium flex items-center">
                              {napp.name}
                              <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-800 text-xs rounded">
                                v{napp.version}
                              </span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {napp.description}
                            </div>
                            <div className="text-xs text-gray-400">
                              Installed: {napp.installDate}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <button
                            onClick={() => toggleNappStatus(napp.id)}
                            className={`px-2 py-1 rounded text-xs mr-2 ${
                              napp.isEnabled
                                ? 'bg-green-100 text-green-800'
                                : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {napp.isEnabled ? 'Enabled' : 'Disabled'}
                          </button>
                        </div>
                      </div>
                    ))}

                    {napps.length === 0 && (
                      <div className="text-center py-6 text-gray-500">
                        No natural applications installed. Install an
                        application to get started.
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
          <div className="text-gray-400 mb-2">
            <Settings size={40} className="mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">
            No Repository Selected
          </h3>
          <p className="text-gray-500 mb-4">
            Please select a repository to view and manage its settings
          </p>
        </div>
      )}
    </div>
  )
}

export default SettingsView
