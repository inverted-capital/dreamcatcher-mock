import React, { useState } from 'react'
import { User, Camera, Edit, CheckCircle, X, CreditCard, Link, ExternalLink, Plus, Wallet, Landmark, Calendar, DollarSign, HardDrive, Cpu, RefreshCw, Wifi, PenTool } from 'lucide-react'
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

// Mock billing data
const mockBillingData = {
  balance: 125.78,
  currency: 'USD',
  usageHistory: [
    {
      period: '2023-06-01',
      storage: {
        gained: 1.23, // GB
        lost: 0.34, // GB
        gainedCost: 0.62, // USD
        lostRefund: 0.17, // USD
      },
      compute: 420, // Processor units
      computeCost: 0.84,
      bandwidth: 5.67, // GB
      bandwidthCost: 1.13,
      aiTokens: 15320, // Tokens
      aiTokensCost: 0.31
    },
    {
      period: '2023-05-01',
      storage: {
        gained: 2.45, // GB
        lost: 0.12, // GB
        gainedCost: 1.23, // USD
        lostRefund: 0.06, // USD
      },
      compute: 830, // Processor units
      computeCost: 1.66,
      bandwidth: 12.34, // GB
      bandwidthCost: 2.47,
      aiTokens: 45670, // Tokens
      aiTokensCost: 0.91
    },
    {
      period: '2023-04-01',
      storage: {
        gained: 0.87, // GB
        lost: 1.45, // GB
        gainedCost: 0.44, // USD
        lostRefund: 0.73, // USD
      },
      compute: 640, // Processor units
      computeCost: 1.28,
      bandwidth: 8.92, // GB
      bandwidthCost: 1.78,
      aiTokens: 28940, // Tokens
      aiTokensCost: 0.58
    }
  ]
}

const AccountView: React.FC = () => {
  const [userProfile, setUserProfile] = useState(mockUserProfile)
  const [editingName, setEditingName] = useState(false)
  const [tempName, setTempName] = useState(userProfile.name)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods)
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false)
  const [newPaymentType, setNewPaymentType] = useState('ethereum')
  const [newPaymentValue, setNewPaymentValue] = useState('')
  
  // Billing related state
  const [billingData, setBillingData] = useState(mockBillingData)
  const [selectedPeriod, setSelectedPeriod] = useState('current')
  const [showTopUpModal, setShowTopUpModal] = useState(false)
  const [topUpAmount, setTopUpAmount] = useState('10')
  const [customAmount, setCustomAmount] = useState('')

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
  
  const handleTopUp = () => {
    // In a real app, this would process payment and update balance
    const amount = topUpAmount === 'custom' ? (parseFloat(customAmount) || 0) : parseFloat(topUpAmount)
    
    if (amount > 0) {
      setBillingData({
        ...billingData,
        balance: billingData.balance + amount
      })
      setShowTopUpModal(false)
      setTopUpAmount('10')
      setCustomAmount('')
    }
  }
  
  const getCurrentBillingPeriod = () => {
    const today = new Date()
    const startDate = selectedPeriod === 'current' 
      ? new Date(today.getFullYear(), today.getMonth(), 1) 
      : selectedPeriod === 'previous'
        ? new Date(today.getFullYear(), today.getMonth() - 1, 1)
        : new Date(today.getFullYear(), today.getMonth() - 2, 1)
        
    let endDate
    if (selectedPeriod === 'current') {
      endDate = today
    } else if (selectedPeriod === 'previous') {
      endDate = new Date(today.getFullYear(), today.getMonth(), 0)
    } else {
      endDate = new Date(today.getFullYear(), today.getMonth() - 1, 0)
    }
    
    return {
      start: startDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      end: endDate.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
    }
  }
  
  const getPeriodData = () => {
    const index = selectedPeriod === 'current' ? 0 : selectedPeriod === 'previous' ? 1 : 2
    return billingData.usageHistory[index] || billingData.usageHistory[0]
  }
  
  const periodData = getPeriodData()
  const billingPeriod = getCurrentBillingPeriod()
  
  const totalCost = (
    periodData.storage.gainedCost - 
    periodData.storage.lostRefund + 
    periodData.computeCost + 
    periodData.bandwidthCost + 
    periodData.aiTokensCost
  ).toFixed(2)
  
  const netStorageCost = (periodData.storage.gainedCost - periodData.storage.lostRefund).toFixed(2)

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
      
      <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-medium flex items-center">
              <DollarSign size={20} className="mr-2 text-green-600" />
              Billing & Usage
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Pay only for resources you use
            </p>
          </div>
          
          <div className="flex items-center">
            <div className="mr-4 text-right">
              <div className="text-sm text-gray-500">Current Balance</div>
              <div className="font-medium text-xl text-green-600">
                ${billingData.balance.toFixed(2)}
              </div>
            </div>
            
            <button 
              onClick={() => setShowTopUpModal(true)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-md flex items-center"
            >
              <Plus size={16} className="mr-2" />
              Top Up
            </button>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">Usage Period</h3>
            <div className="flex items-center">
              <Calendar size={16} className="mr-2 text-gray-500" />
              <div>
                {billingPeriod.start} - {billingPeriod.end}
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3 flex justify-between">
            <button
              onClick={() => setSelectedPeriod('current')}
              className={`px-3 py-1.5 rounded ${selectedPeriod === 'current' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Current Month
            </button>
            <button
              onClick={() => setSelectedPeriod('previous')}
              className={`px-3 py-1.5 rounded ${selectedPeriod === 'previous' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Previous Month
            </button>
            <button
              onClick={() => setSelectedPeriod('older')}
              className={`px-3 py-1.5 rounded ${selectedPeriod === 'older' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              2 Months Ago
            </button>
          </div>
        </div>
        
        <div>
          <div className="mb-4">
            <h3 className="font-medium mb-2">Usage Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <HardDrive size={18} className="text-blue-500 mr-2" />
                    <span className="font-medium">Storage</span>
                  </div>
                  <span className="text-sm px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                    ${netStorageCost} net
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-green-500 mr-1">+</span>
                      {periodData.storage.gained.toFixed(2)} GB gained
                    </div>
                    <div className="text-gray-500">
                      ${periodData.storage.gainedCost.toFixed(2)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <span className="text-red-500 mr-1">-</span>
                      {periodData.storage.lost.toFixed(2)} GB deleted
                    </div>
                    <div className="text-gray-500">
                      -${periodData.storage.lostRefund.toFixed(2)}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Cpu size={18} className="text-purple-500 mr-2" />
                    <span className="font-medium">Compute</span>
                  </div>
                  <span className="text-sm px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
                    ${periodData.computeCost.toFixed(2)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>{periodData.compute} processor units</div>
                    <div className="text-gray-500">${periodData.computeCost.toFixed(2)}</div>
                  </div>
                </div>
              </div>
              
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center">
                    <Wifi size={18} className="text-green-500 mr-2" />
                    <span className="font-medium">Bandwidth</span>
                  </div>
                  <span className="text-sm px-2 py-1 bg-green-50 text-green-700 rounded-full">
                    ${periodData.bandwidthCost.toFixed(2)}
                  </span>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div>{periodData.bandwidth.toFixed(2)} GB transferred</div>
                    <div className="text-gray-500">${periodData.bandwidthCost.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">AI Token Usage</h3>
              <span className="text-sm px-2 py-1 bg-indigo-50 text-indigo-700 rounded-full">
                ${periodData.aiTokensCost.toFixed(2)}
              </span>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4 flex items-center justify-between">
              <div className="flex items-center">
                <PenTool size={18} className="text-indigo-500 mr-2" />
                <span>{periodData.aiTokens.toLocaleString()} tokens consumed</span>
              </div>
              <div className="text-gray-500">${periodData.aiTokensCost.toFixed(2)}</div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
            <div>
              <span className="text-sm text-gray-500">Total for period:</span>
              <span className="ml-2 font-medium text-lg">${totalCost}</span>
            </div>
            
            <div className="flex items-center text-sm text-gray-600">
              <RefreshCw size={14} className="mr-1" />
              Updated {new Date().toLocaleDateString()}
            </div>
          </div>
        </div>
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
      
      {/* Top Up Balance Modal */}
      {showTopUpModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Top Up Balance</h3>
              <button
                onClick={() => setShowTopUpModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            
            <div>
              <p className="mb-4 text-gray-600">
                Current balance: <span className="font-medium text-green-600">${billingData.balance.toFixed(2)}</span>
              </p>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Choose amount to add:
                </label>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {['10', '25', '50', '100'].map(amount => (
                    <button
                      key={amount}
                      onClick={() => setTopUpAmount(amount)}
                      className={`py-2 border ${topUpAmount === amount ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-gray-400'} rounded-md`}
                    >
                      ${amount}
                    </button>
                  ))}
                  <button
                    onClick={() => setTopUpAmount('custom')}
                    className={`py-2 border ${topUpAmount === 'custom' ? 'border-blue-500 bg-blue-50 text-blue-600' : 'border-gray-300 hover:border-gray-400'} rounded-md`}
                  >
                    Custom
                  </button>
                </div>
                
                {topUpAmount === 'custom' && (
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">
                      Enter amount:
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="0.00"
                        min="1"
                        step="0.01"
                        className="w-full pl-8 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment method:
                </label>
                <select className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {paymentMethods
                    .filter(method => method.isConnected)
                    .map(method => (
                      <option key={method.id} value={method.id}>
                        {method.name} ({method.value.slice(0, 10)}...)
                      </option>
                    ))}
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => setShowTopUpModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleTopUp}
                disabled={topUpAmount === 'custom' && (!customAmount.trim() || parseFloat(customAmount) <= 0)}
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50 flex items-center"
              >
                <Plus size={16} className="mr-2" />
                Add ${topUpAmount === 'custom' ? customAmount : topUpAmount}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AccountView