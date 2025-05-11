import React, { useState } from 'react'
import { User, Camera, Edit, CheckCircle, X } from 'lucide-react'

// Mock data for user account
const mockUserProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  profilePicture: ''
}

const AccountView: React.FC = () => {
  const [userProfile, setUserProfile] = useState(mockUserProfile)
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState(userProfile.name)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const handleProfilePictureChange = () => {
    // In a real app, this would open a file picker
    alert('This would open a file picker to select a new profile picture')
  }

  const startEditingName = () => {
    setTempName(userProfile.name)
    setEditingName(true)
  }

  const saveName = () => {
    if (tempName.trim()) {
      setUserProfile({
        ...userProfile,
        name: tempName
      })
    }
    setEditingName(false)
  }

  const cancelNameEdit = () => {
    setEditingName(false)
  }

  const showDeleteAccountConfirm = () => {
    setShowDeleteConfirm(true)
  }

  const dismissDeleteConfirm = () => {
    setShowDeleteConfirm(false)
  }

  return (
    <div className="animate-fadeIn">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <User className="mr-2" size={24} />
        Account
      </h1>

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Profile Information</h2>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              {userProfile.profilePicture ? (
                <img
                  src={userProfile.profilePicture}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={40} className="text-gray-400" />
              )}
            </div>
            <button
              onClick={handleProfilePictureChange}
              className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full hover:bg-blue-600 transition-colors"
            >
              <Camera size={14} />
            </button>
          </div>

          <div className="flex-1">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              {editingName ? (
                <div className="flex items-center">
                  <input
                    type="text"
                    value={tempName}
                    onChange={(e) => setTempName(e.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <button
                    onClick={saveName}
                    className="p-2 text-green-500 hover:text-green-700"
                  >
                    <CheckCircle size={18} />
                  </button>
                  <button
                    onClick={cancelNameEdit}
                    className="p-2 text-red-500 hover:text-red-700"
                  >
                    <X size={18} />
                  </button>
                </div>
              ) : (
                <div className="flex items-center">
                  <div className="text-lg font-medium">{userProfile.name}</div>
                  <button
                    onClick={startEditingName}
                    className="ml-2 p-1 text-gray-500 hover:text-gray-700"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="text-gray-600">{userProfile.email}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium mb-4">Account Security</h2>

        <div className="space-y-4">
          <div>
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
              Change Password
            </button>
          </div>

          <div>
            <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
              Enable Two-Factor Authentication
            </button>
          </div>

          <div>
            <button
              className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 rounded-md hover:bg-red-100 flex items-center"
              onClick={showDeleteAccountConfirm}
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>

      {/* Delete Account Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-medium mb-4">Delete Account</h3>
            <p className="mb-6 text-gray-700">
              You can check out anytime you like, but you can never leave.
            </p>

            <div className="flex justify-end">
              <button
                onClick={dismissDeleteConfirm}
                className="px-4 py-2 text-gray-700 hover:text-gray-900"
              >
                Okay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountView
