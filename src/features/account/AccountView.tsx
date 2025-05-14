import React, { useState } from 'react'
import { User, Camera, Edit, CheckCircle, X, CreditCard, Link, ExternalLink, Plus, Wallet, Landmark } from 'lucide-react'
import { useNavigationStore } from '@/features/navigation/state'
import { useChatStore } from '@/features/chat/state'
import { useRepoStore } from '@/features/repos/state'

// Mock data for user account
const mockUserProfile = {
  name: 'John Doe',
  email: 'john.doe@example.com',
  profilePicture: ''
}

// Mock data for payment methods
const mockPaymentMethods = [
  {
    id: 'eth1',
    type: 'ethereum',
    name: 'Ethereum Wallet',
    value: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
    isConnected: true
  },
  {
    id: 'wise1',
    type: 'wise',
    name: 'Wise Account',
    value: 'john.doe@example.com',
    isConnected: true
  },
  {
    id: 'bank1',
    type: 'bank',
    name: 'Bank Account',
    value: 'XXXX-XXXX-XXXX-4321',
    isConnected: false
  }
]

const AccountView: React.FC = () => {
  const [userProfile, setUserProfile] = useState(mockUserProfile)
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState(userProfile.name)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
  const [newPaymentType, setNewPaymentType] = useState('ethereum')
  const [newPaymentValue, setNewPaymentValue] = useState('')

  const setCurrentView = useNavigationStore((state) => state.setCurrentView)
  const navigateTo = useChatStore((state) => state.navigateTo)
  const { selectHomeRepository } = useRepoStore()

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

  const togglePaymentConnection = (id: string) => {
    setPaymentMethods(methods => 
      methods.map(method => 
        method.id === id 
          ? { ...method, isConnected: !method.isConnected } 
          : method
      )
    )
  }

  const handleAddPayment = () => {
    if (!newPaymentValue.trim()) return

    const newPayment = {
      id: `${newPaymentType}${Date.now()}`,
      type: newPaymentType,
      name: newPaymentType === 'ethereum' 
        ? 'Ethereum Wallet' 
        : newPaymentType === 'wise' 
          ? 'Wise Account' 
          : 'Bank Account',
      value: newPaymentValue,
      isConnected: true
    }

    setPaymentMethods([...paymentMethods, newPayment])
    setNewPaymentValue('')
    setShowAddPaymentModal(false)
  }

  const navigateToWalletNapp = () => {
    // Select home repository
    selectHomeRepository()
    
    // Navigate to the napps view
    setCurrentView('napps')
    
    // Create a navigation marker
    navigateTo({
      title: 'Wallet Manager',
      icon: 'Package',
      view: 'napps'
    })
  }

  const getPaymentIcon = (type: string) => {
    switch(type) {
      case 'ethereum':
        return <Wallet className="text-purple-600" size={24} />
      case 'wise':
        return <CreditCard className="text-green-600" size={24} />
      case 'bank':
        return <Landmark className="text-blue-600" size={24} />
      default:
        return <CreditCard className="text-gray-600" size={24} />
    }
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

      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Payment Methods</h2>
          <button 
            onClick={() => setShowAddPaymentModal(true)}
            className="px-3 py-1.5 bg-blue-500 text-white rounded flex items-center text-sm hover:bg-blue-600"
          >
            <Plus size={14} className="mr-1" />
            Add Payment Method
          </button>
        </div>

        {paymentMethods.length > 0 ? (
          <div className="space-y-4">
            {paymentMethods.map(method => (
              <div 
                key={method.id} 
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {getPaymentIcon(method.type)}
                    <div className="ml-4">
                      <div className="font-medium">{method.name}</div>
                      <div className="text-sm text-gray-600 font-mono">{method.value}</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={() => navigateToWalletNapp()}
                      className="p-2 text-blue-500 hover:text-blue-700 flex items-center"
                    >
                      <ExternalLink size={16} className="mr-1" />
                      <span className="text-sm">Open Wallet App</span>
                    </button>
                    <button 
                      onClick={() => togglePaymentConnection(method.id)}
                      className={`px-3 py-1.5 rounded text-sm ${
                        method.isConnected 
                          ? 'bg-red-50 text-red-600 hover:bg-red-100' 
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {method.isConnected ? 'Disconnect' : 'Connect'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Wallet size={32} className="mx-auto mb-2 text-gray-300" />
            <p>No payment methods connected yet.</p>
            <p className="text-sm">Add a payment method to get started.</p>
          </div>
        )}
      </div>

      <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-medium mb-4">Account Security</h2>

        <div className="space-y-4">
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

      {/* Add Payment Method Modal */}
      {showAddPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add Payment Method</h3>
              <button
                onClick={() => setShowAddPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payment Type
                </label>
                <select
                  value={newPaymentType}
                  onChange={(e) => setNewPaymentType(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="ethereum">Ethereum Wallet</option>
                  <option value="wise">Wise Account</option>
                  <option value="bank">Bank Account</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {newPaymentType === 'ethereum' 
                    ? 'Ethereum Address' 
                    : newPaymentType === 'wise' 
                      ? 'Wise Email' 
                      : 'Account Number'}
                </label>
                <input
                  type="text"
                  value={newPaymentValue}
                  onChange={(e) => setNewPaymentValue(e.target.value)}
                  placeholder={
                    newPaymentType === 'ethereum' 
                      ? '0x...' 
                      : newPaymentType === 'wise' 
                        ? 'email@example.com' 
                        : 'XXXX-XXXX-XXXX-XXXX'
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={() => setShowAddPaymentModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPayment}
                  disabled={!newPaymentValue.trim()}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                >
                  Add Payment Method
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountView