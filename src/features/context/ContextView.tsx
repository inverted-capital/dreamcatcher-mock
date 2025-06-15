import React, { useState } from 'react'
import {
  Clipboard,
  Trash2,
  Plus,
  Edit,
  Copy,
  Camera,
  Image,
  X,
  Info
} from 'lucide-react'
import { useChatStore } from '@/features/chat/state'
import { useContextStore } from './state'

const ContextView: React.FC = () => {
  const navigationHistory = useChatStore((state) => state.navigationHistory)
  const { snapshots, addSnapshot, removeSnapshot } = useContextStore()

  const [showSnapshotForm, setShowSnapshotForm] = useState(false)
  const [snapshotTitle, setSnapshotTitle] = useState('')
  const [snapshotDesc, setSnapshotDesc] = useState('')
  const [activeTab, setActiveTab] = useState<'context' | 'snapshots'>('context')
  const [expandedSnapshot, setExpandedSnapshot] = useState<string | null>(null)

  const handleCreateSnapshot = () => {
    // In a real app, we would take an actual screenshot of the app here
    // For now, we'll use a placeholder image
    addSnapshot({
      imageUrl:
        'https://images.pexels.com/photos/5926398/pexels-photo-5926398.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      title: snapshotTitle || `App Snapshot ${snapshots.length + 1}`,
      description: snapshotDesc || undefined
    })

    setShowSnapshotForm(false)
    setSnapshotTitle('')
    setSnapshotDesc('')

    // Switch to snapshots tab to show the new snapshot
    setActiveTab('snapshots')
  }

  const toggleExpandSnapshot = (id: string) => {
    if (expandedSnapshot === id) {
      setExpandedSnapshot(null)
    } else {
      setExpandedSnapshot(id)
    }
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <Clipboard className="mr-2" size={24} />
        Context Manager
      </h1>

      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium text-sm border-b-2 ${activeTab === 'context' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('context')}
          >
            Context Items
          </button>
          <button
            className={`px-4 py-2 font-medium text-sm border-b-2 ${activeTab === 'snapshots' ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
            onClick={() => setActiveTab('snapshots')}
          >
            App Snapshots
          </button>
        </div>
      </div>

      {activeTab === 'context' ? (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Current Context</h2>
            <div className="flex space-x-2">
              <button className="px-3 py-1.5 bg-blue-50 text-blue-600 rounded flex items-center text-sm hover:bg-blue-100">
                <Plus size={16} className="mr-2" />
                Add Context
              </button>
              <button className="px-3 py-1.5 bg-red-50 text-red-600 rounded flex items-center text-sm hover:bg-red-100">
                <Trash2 size={16} className="mr-2" />
                Clear All
              </button>
            </div>
          </div>

          <p className="text-gray-600 mb-4">
            The following context will be included in your conversations. You
            can add, edit, or remove context items as needed.
          </p>

          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Active Context Items
            </h3>

            {navigationHistory.length > 0 ? (
              <div className="space-y-3">
                {navigationHistory.map((navItem) => (
                  <div
                    key={navItem.id}
                    className="bg-white p-3 rounded border border-gray-200 flex justify-between items-start"
                  >
                    <div>
                      <div className="font-medium flex items-center">
                        {navItem.title}
                        <span className="ml-2 px-1.5 py-0.5 bg-gray-100 text-gray-700 text-xs rounded">
                          {navItem.view}
                        </span>
                      </div>

                      {navItem.context && navItem.context.length > 0 && (
                        <div className="mt-1 space-y-1">
                          {navItem.context.map((ctxPart, idx) => (
                            <div
                              key={idx}
                              className="text-sm text-gray-600 flex items-center"
                            >
                              <span className="text-xs bg-blue-50 text-blue-700 rounded px-1 mr-1">
                                {ctxPart.type}
                              </span>
                              {ctxPart.value}
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="text-xs text-gray-500 mt-1">
                        {new Date(navItem.timestamp).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex space-x-1">
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Edit"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        className="p-1 text-gray-400 hover:text-gray-600"
                        title="Copy"
                      >
                        <Copy size={14} />
                      </button>
                      <button
                        className="p-1 text-red-400 hover:text-red-600"
                        title="Remove"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No context items have been added yet.
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Application Snapshots</h2>
            <button
              onClick={() => setShowSnapshotForm(true)}
              className="px-3 py-1.5 bg-blue-500 text-white rounded flex items-center text-sm hover:bg-blue-600"
            >
              <Camera size={16} className="mr-2" />
              Take Snapshot
            </button>
          </div>

          <p className="text-gray-600 mb-4">
            Snapshots capture the current state of the application to provide
            visual context for your conversations.
          </p>

          {showSnapshotForm && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Take New Snapshot
                </h3>
                <button
                  onClick={() => setShowSnapshotForm(false)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={snapshotTitle}
                    onChange={(e) => setSnapshotTitle(e.target.value)}
                    placeholder="Enter a title for this snapshot"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={snapshotDesc}
                    onChange={(e) => setSnapshotDesc(e.target.value)}
                    placeholder="Add a description to provide more context"
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowSnapshotForm(false)}
                    className="px-3 py-1.5 border border-gray-300 text-gray-700 rounded text-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleCreateSnapshot}
                    className="px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600"
                  >
                    Capture Snapshot
                  </button>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {snapshots.length > 0 ? (
              snapshots.map((snapshot) => (
                <div
                  key={snapshot.id}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white hover:shadow-md transition-shadow"
                >
                  <div className="relative aspect-video overflow-hidden bg-gray-100">
                    <img
                      src={snapshot.imageUrl}
                      alt={snapshot.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 hover:bg-opacity-50 transition-opacity group">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                        <button className="p-2 bg-white rounded-full text-blue-600">
                          <Image size={18} />
                        </button>
                        <button className="p-2 bg-white rounded-full text-green-600">
                          <Plus size={18} />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-3">
                    <div className="flex justify-between items-start">
                      <h3 className="font-medium">{snapshot.title}</h3>
                      <button
                        onClick={() => toggleExpandSnapshot(snapshot.id)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Info size={16} />
                      </button>
                    </div>

                    <div className="text-xs text-gray-500 mt-1">
                      {new Date(snapshot.timestamp).toLocaleString()}
                    </div>

                    {expandedSnapshot === snapshot.id && (
                      <div className="mt-2 pt-2 border-t border-gray-100">
                        <p className="text-sm text-gray-600">
                          {snapshot.description || 'No description provided.'}
                        </p>

                        <div className="mt-2 flex justify-end space-x-1">
                          <button
                            className="p-1 text-blue-500 hover:text-blue-700"
                            title="Add to context"
                          >
                            <Plus size={14} />
                          </button>
                          <button
                            className="p-1 text-gray-500 hover:text-gray-700"
                            title="Edit"
                          >
                            <Edit size={14} />
                          </button>
                          <button
                            className="p-1 text-red-500 hover:text-red-700"
                            title="Remove"
                            onClick={() => removeSnapshot(snapshot.id)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center py-10 border border-dashed border-gray-300 rounded-lg">
                <Camera size={40} className="mx-auto text-gray-400 mb-2" />
                <h3 className="text-lg font-medium text-gray-700 mb-1">
                  No Snapshots Yet
                </h3>
                <p className="text-gray-500 mb-4">
                  Take a snapshot to capture the current state of the
                  application
                </p>
                <button
                  onClick={() => setShowSnapshotForm(true)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 inline-flex items-center"
                >
                  <Camera size={16} className="mr-2" />
                  Take First Snapshot
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium mb-4">Saved Context Templates</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer">
            <h3 className="font-medium">Development Environment</h3>
            <p className="text-sm text-gray-600 mt-1">
              Repository, branch, and file context for development tasks
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer">
            <h3 className="font-medium">Customer Support</h3>
            <p className="text-sm text-gray-600 mt-1">
              Customer data and recent interactions for support queries
            </p>
          </div>

          <div className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer">
            <h3 className="font-medium">Project Planning</h3>
            <p className="text-sm text-gray-600 mt-1">
              Project details, milestones, and team information
            </p>
          </div>

          <div className="border border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-center text-gray-500">
            <Plus size={16} className="mr-2" />
            <span>Create New Template</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContextView
