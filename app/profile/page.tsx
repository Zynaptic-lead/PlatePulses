'use client'

import { useState } from 'react'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { 
  User, MapPin, CreditCard, Bell, Shield, Wallet, 
  Plus, Edit, Trash2, CheckCircle2, X, PlusCircle, 
  Heart, Sparkles, Lock, ArrowUpRight
} from 'lucide-react'

interface Address {
  id: string
  label: 'Home' | 'Work' | 'Other'
  street: string
  apt: string
  city: string
  zip: string
  isDefault: boolean
}

export default function CustomerProfilePage() {
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'payment' | 'preferences'>('profile')
  
  // Profile Form
  const [profileData, setProfileData] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@example.com',
    phone: '+1 (555) 349-2019',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format'
  })

  // Saved Addresses
  const [addresses, setAddresses] = useState<Address[]>([
    { id: '1', label: 'Home', street: '742 Evergreen Terrace', apt: 'Apt 3B', city: 'Springfield', zip: '97477', isDefault: true },
    { id: '2', label: 'Work', street: '88 Tech Boulevard', apt: '4th Floor', city: 'Metropolis', zip: '10001', isDefault: false }
  ])

  // Modals
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showTopupModal, setShowTopupModal] = useState(false)
  const [walletBalance, setWalletBalance] = useState(120.50)
  const [topupAmount, setTopupAmount] = useState('50')

  // New Address Form
  const [newAddr, setNewAddr] = useState({ label: 'Home' as const, street: '', apt: '', city: '', zip: '' })

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddr.street) return

    const created: Address = {
      id: Date.now().toString(),
      label: newAddr.label,
      street: newAddr.street,
      apt: newAddr.apt,
      city: newAddr.city,
      zip: newAddr.zip,
      isDefault: addresses.length === 0
    }

    setAddresses(prev => [...prev, created])
    setShowAddressModal(false)
    setNewAddr({ label: 'Home', street: '', apt: '', city: '', zip: '' })
  }

  const handleTopup = (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(topupAmount)
    if (val > 0) {
      setWalletBalance(prev => prev + val)
      setShowTopupModal(false)
      alert(`Successfully added $${val.toFixed(2)} to your PlatePulse Wallet!`)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        {/* Profile Banner Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-gray-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <img 
              src={profileData.avatar} 
              alt={profileData.name} 
              className="w-20 h-20 rounded-full object-cover ring-4 ring-red-500/20 shadow-md"
            />
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">{profileData.name}</h1>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{profileData.email} • {profileData.phone}</p>
              <span className="inline-block mt-2 px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full">
                ⭐ PlatePulse VIP Member
              </span>
            </div>
          </div>

          {/* Wallet Widget */}
          <div className="bg-gray-900 text-white p-5 rounded-2xl w-full sm:w-64 space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-xs text-gray-400 font-medium">
              <span className="flex items-center gap-1.5"><Wallet className="w-4 h-4 text-emerald-400" /> Wallet Balance</span>
              <span className="text-emerald-400 font-bold">Active</span>
            </div>
            <h3 className="text-2xl font-extrabold">${walletBalance.toFixed(2)}</h3>
            <button 
              onClick={() => setShowTopupModal(true)}
              className="w-full py-1.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Top-Up Wallet
            </button>
          </div>
        </div>

        {/* Tabbed Navigation & Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Sidebar Navigation */}
          <div className="bg-white p-3 rounded-2xl border border-gray-200 shadow-xs space-y-1 self-start">
            {[
              { id: 'profile', label: 'Personal Info', icon: User },
              { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
              { id: 'payment', label: 'Wallet & Cards', icon: CreditCard },
              { id: 'preferences', label: 'Preferences', icon: Bell },
            ].map(tab => {
              const Icon = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold transition-all duration-200
                    ${active 
                      ? 'bg-gray-900 text-white shadow-sm' 
                      : 'text-gray-600 hover:bg-gray-100'}
                  `}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-gray-400'}`} />
                  <span>{tab.label}</span>
                </button>
              )
            })}
          </div>

          {/* Right Main Content Card */}
          <div className="lg:col-span-3 bg-white p-6 sm:p-8 rounded-3xl border border-gray-200 shadow-xs min-h-[420px]">
            {/* Tab 1: Personal Info */}
            {activeTab === 'profile' && (
              <div className="space-y-6 max-w-xl">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Personal Information</h3>
                  <p className="text-xs text-gray-500">Update your contact details and account credentials</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Full Name</label>
                    <input 
                      type="text"
                      value={profileData.name}
                      onChange={e => setProfileData({ ...profileData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
                    <input 
                      type="email"
                      value={profileData.email}
                      onChange={e => setProfileData({ ...profileData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900 font-medium"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Phone Number</label>
                    <input 
                      type="tel"
                      value={profileData.phone}
                      onChange={e => setProfileData({ ...profileData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900 font-medium"
                    />
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button 
                      onClick={() => alert('Profile details updated!')}
                      className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-md shadow-red-600/20"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 2: Saved Addresses */}
            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">Delivery Addresses</h3>
                    <p className="text-xs text-gray-500">Manage saved locations for faster checkout delivery</p>
                  </div>
                  <button 
                    onClick={() => setShowAddressModal(true)}
                    className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Address
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map(addr => (
                    <div 
                      key={addr.id}
                      className={`
                        p-5 rounded-2xl border transition relative space-y-2
                        ${addr.isDefault ? 'bg-red-50/40 border-2 border-red-200' : 'bg-white border-gray-200'}
                      `}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-gray-900 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-red-600" /> {addr.label}
                        </span>
                        {addr.isDefault && (
                          <span className="px-2 py-0.5 bg-red-600 text-white text-[10px] font-extrabold rounded-full">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed font-medium">
                        {addr.street}, {addr.apt}<br />
                        {addr.city}, {addr.zip}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: Payment Methods */}
            {activeTab === 'payment' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Payment Cards & Digital Wallet</h3>
                  <p className="text-xs text-gray-500">Manage your saved credit cards and wallet balances</p>
                </div>

                <div className="space-y-4">
                  {/* PlatePulse Wallet Card */}
                  <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white p-6 rounded-3xl space-y-4 shadow-xl border border-gray-700">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold tracking-widest text-red-400 uppercase">PlatePulse Pay</span>
                      <Wallet className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Available Balance</p>
                      <h2 className="text-3xl font-extrabold text-white">${walletBalance.toFixed(2)}</h2>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400 pt-2 border-t border-gray-700/60">
                      <span>Instant 1-Click Checkout Enabled</span>
                      <button 
                        onClick={() => setShowTopupModal(true)}
                        className="text-red-400 hover:text-red-300 font-bold underline"
                      >
                        + Add Money
                      </button>
                    </div>
                  </div>

                  {/* Saved Cards */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Saved Cards</h4>
                    <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex items-center justify-between text-xs font-semibold">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-7 bg-blue-900 text-white font-bold rounded flex items-center justify-center text-[10px]">VISA</div>
                        <span>•••• •••• •••• 4242 (Expires 12/28)</span>
                      </div>
                      <span className="text-emerald-600 font-bold">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Tab 4: Preferences */}
            {activeTab === 'preferences' && (
              <div className="space-y-6 max-w-lg">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Dietary & Notification Preferences</h3>
                  <p className="text-xs text-gray-500">Personalize food recommendations and alert settings</p>
                </div>

                <div className="space-y-4 text-xs font-semibold text-gray-700">
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Vegetarian Recommendations</p>
                      <p className="text-[11px] text-gray-500">Prioritize veg & plant-based dishes</p>
                    </div>
                    <input type="checkbox" className="rounded text-red-600 w-4 h-4" defaultChecked />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">Live Kitchen Stream Notifications</p>
                      <p className="text-[11px] text-gray-500">Notify when favorite chefs start streaming</p>
                    </div>
                    <input type="checkbox" className="rounded text-red-600 w-4 h-4" defaultChecked />
                  </div>

                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-gray-900 text-sm">SMS Order Tracking Alerts</p>
                      <p className="text-[11px] text-gray-500">Receive text updates when driver is near</p>
                    </div>
                    <input type="checkbox" className="rounded text-red-600 w-4 h-4" defaultChecked />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="font-bold text-gray-900 text-base">Add Delivery Address</h3>
              <button onClick={() => setShowAddressModal(false)} className="p-1 text-gray-400 hover:text-gray-900">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Label</label>
                <select 
                  value={newAddr.label}
                  onChange={e => setNewAddr({ ...newAddr, label: e.target.value as any })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Street Address</label>
                <input 
                  type="text" 
                  required
                  placeholder="742 Evergreen Terrace"
                  value={newAddr.street}
                  onChange={e => setNewAddr({ ...newAddr, street: e.target.value })}
                  className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Apt / Suite</label>
                  <input 
                    type="text" 
                    placeholder="Apt 3B"
                    value={newAddr.apt}
                    onChange={e => setNewAddr({ ...newAddr, apt: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">ZIP Code</label>
                  <input 
                    type="text" 
                    placeholder="97477"
                    value={newAddr.zip}
                    onChange={e => setNewAddr({ ...newAddr, zip: e.target.value })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition mt-2"
              >
                Save Delivery Address
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Topup Wallet Modal */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-4 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200 text-center">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <Wallet className="w-7 h-7" />
            </div>

            <div>
              <h3 className="font-bold text-gray-900 text-lg">Top-Up PlatePulse Wallet</h3>
              <p className="text-xs text-gray-500 mt-1">Add funds for instant 1-click checkout</p>
            </div>

            <form onSubmit={handleTopup} className="space-y-4">
              <div className="flex items-center justify-center gap-2">
                {['25', '50', '100'].map(amt => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => setTopupAmount(amt)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition ${
                      topupAmount === amt ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-700 border-gray-200'
                    }`}
                  >
                    +${amt}
                  </button>
                ))}
              </div>

              <input 
                type="number"
                value={topupAmount}
                onChange={e => setTopupAmount(e.target.value)}
                className="w-full text-center text-2xl font-extrabold p-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 outline-none"
              />

              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setShowTopupModal(false)}
                  className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md"
                >
                  Confirm Top-Up
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
