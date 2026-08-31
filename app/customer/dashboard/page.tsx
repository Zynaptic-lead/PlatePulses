'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '../../../store/useCartStore'
import { usersApi, ordersApi } from '../../../lib/api'
import { 
  User, MapPin, CreditCard, Wallet, ShoppingBag, Clock, 
  CheckCircle2, Plus, Edit, Trash2, Heart, Video, Star, 
  RotateCcw, Phone, ArrowRight, ShieldCheck, Settings, X, 
  Bell, ChevronRight, Sparkles, Lock, ArrowUpRight, Truck,
  Camera, Home, LogOut, LayoutDashboard, Utensils
} from 'lucide-react'

interface Address {
  id: string
  label: 'Home' | 'Work' | 'Other'
  street: string
  apt?: string
  city: string
  zip: string
  isDefault?: boolean
}

interface CustomerOrder {
  id: string
  restaurantName: string
  restaurantImage: string
  restaurantId: string
  date: string
  totalAmount: number
  status: 'active' | 'completed' | 'cancelled'
  pickupPin?: string
  items: { id: string; name: string; quantity: number; price: number }[]
}

export default function CustomerDashboardPage() {
  const router = useRouter()
  const { addItem } = useCartStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'addresses' | 'profile' | 'wallet'>('overview')
  const [walletBalance, setWalletBalance] = useState(50.00) // Default $50 welcome bonus
  const [showTopupModal, setShowTopupModal] = useState(false)
  const [topupAmount, setTopupAmount] = useState('50')
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [reorderMessage, setReorderMessage] = useState<string | null>(null)

  // Profile info state (Initialized with real user data or fallback)
  const [profile, setProfile] = useState({
    name: 'Valued Customer',
    email: 'customer@platepulse.com',
    phone: '+1 (555) 000-0000',
    avatar: ''
  })

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([])
  const [newAddr, setNewAddr] = useState({ label: 'Home' as 'Home' | 'Work' | 'Other', street: '', apt: '', city: '', zip: '' })
  const [orders, setOrders] = useState<CustomerOrder[]>([])

  // Load User Data & Addresses on Mount
  useEffect(() => {
    // 1. Load User Profile from localStorage
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser)
        setProfile(prev => ({
          ...prev,
          name: u.name || prev.name,
          email: u.email || prev.email,
          phone: u.phone || prev.phone,
        }))
      } catch (e) {}
    }

    // 2. Load Saved Profile Avatar
    const savedAvatar = localStorage.getItem('customerAvatar')
    if (savedAvatar) {
      setProfile(prev => ({ ...prev, avatar: savedAvatar }))
    }

    // 3. Load Saved Addresses from localStorage or Backend
    // Load local customer orders from checkout session
    const localOrdersRaw = localStorage.getItem('customerOrders')
    let initialOrders: CustomerOrder[] = []
    if (localOrdersRaw) {
      try { initialOrders = JSON.parse(localOrdersRaw) } catch (e) {}
    }
    setOrders(initialOrders)

    async function loadData() {
      // Fetch profile & backend addresses
      try {
        const userProfile = await usersApi.getProfile()
        setProfile(prev => ({
          name: userProfile.name || prev.name,
          email: userProfile.email || prev.email,
          phone: userProfile.phone || prev.phone,
          avatar: userProfile.avatar || prev.avatar
        }))
        if (userProfile.wallet) {
          setWalletBalance(userProfile.wallet.balance)
        }
        if (userProfile.addresses && userProfile.addresses.length > 0) {
          setAddresses(userProfile.addresses)
        }
      } catch (err) {
        console.log('Backend profile sync note: using local session')
      }

      // Fetch customer orders
      try {
        const myOrders = await ordersApi.getMyOrders()
        if (myOrders && myOrders.length > 0) {
          const mapped = myOrders.map((o: any) => ({
            id: o.id.substring(0, 8),
            restaurantName: o.restaurant?.name || 'Pizza Heaven',
            restaurantImage: o.restaurant?.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format',
            restaurantId: o.restaurantId,
            date: new Date(o.createdAt).toLocaleDateString() + ' at ' + new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            totalAmount: o.totalAmount,
            status: o.status === 'OUT_FOR_DELIVERY' || o.status === 'PREPARING' || o.status === 'PENDING' ? 'active' : 'completed',
            pickupPin: o.pickupPin,
            items: o.items.map((i: any) => ({
              id: i.menuItemId,
              name: i.menuItem?.name || 'Dish Item',
              quantity: i.quantity,
              price: i.price
            }))
          }))
          setOrders(prev => {
            const ids = new Set(prev.map(p => p.id))
            const newBackendOnly = mapped.filter((m: any) => !ids.has(m.id))
            return [...prev, ...newBackendOnly]
          })
        }
      } catch (err) {
        console.log('Backend order sync note: using local order state')
      }
    }

    loadData()
  }, [])

  // Handle Profile Picture File Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64Data = reader.result as string
        setProfile(prev => ({ ...prev, avatar: base64Data }))
        localStorage.setItem('customerAvatar', base64Data)
        alert('Profile picture updated successfully!')
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Add Address
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddr.street) return

    const created: Address = {
      id: 'addr-' + Date.now(),
      label: newAddr.label,
      street: newAddr.street,
      apt: newAddr.apt,
      city: newAddr.city,
      zip: newAddr.zip || '10001',
      isDefault: addresses.length === 0
    }

    const updatedAddrs = [...addresses, created]
    setAddresses(updatedAddrs)
    localStorage.setItem('customerAddresses', JSON.stringify(updatedAddrs))

    try {
      await usersApi.addAddress(newAddr)
    } catch (err) {}

    setShowAddressModal(false)
    setNewAddr({ label: 'Home', street: '', apt: '', city: '', zip: '' })
  }

  // Handle Delete Address
  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter(a => a.id !== id)
    setAddresses(updated)
    localStorage.setItem('customerAddresses', JSON.stringify(updated))
  }

  // Handle Wallet Top-Up
  const handleTopup = async (e: React.FormEvent) => {
    e.preventDefault()
    const val = parseFloat(topupAmount)
    if (val > 0) {
      try {
        const res = await usersApi.topupWallet(val)
        setWalletBalance(res.balance)
      } catch (err) {
        setWalletBalance(prev => prev + val)
      }
      setShowTopupModal(false)
      alert(`$${val.toFixed(2)} added to your PlatePulse Digital Wallet!`)
    }
  }

  // Handle Reorder
  const handleReorder = (order: CustomerOrder) => {
    order.items.forEach(item => {
      addItem({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        restaurantId: order.restaurantId,
        image: order.restaurantImage
      })
    })

    setReorderMessage(`Added items from ${order.restaurantName} to your cart!`)
    setTimeout(() => setReorderMessage(null), 4000)
  }

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    localStorage.removeItem('accessToken')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* ── LEFT SIDEBAR NAVIGATION ── */}
      <aside className="w-full md:w-72 bg-gray-900 text-white flex-shrink-0 md:min-h-screen flex flex-col justify-between p-6 shadow-2xl">
        <div className="space-y-8">
          {/* Brand Header */}
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center font-black text-xl text-white shadow-lg shadow-red-600/30">
                P
              </div>
              <div>
                <h1 className="font-black text-lg tracking-tight">PlatePulse</h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Customer Portal</p>
              </div>
            </Link>
          </div>

          {/* User Profile Card with Photo Upload */}
          <div className="bg-gray-800/80 p-4 rounded-2xl border border-gray-700/60 text-center space-y-3 relative group">
            <div className="relative w-20 h-20 mx-auto">
              {profile.avatar ? (
                <img 
                  src={profile.avatar} 
                  alt={profile.name} 
                  className="w-20 h-20 rounded-full object-cover ring-4 ring-red-600/40 shadow-lg"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-rose-700 text-white rounded-full flex items-center justify-center font-extrabold text-2xl ring-4 ring-red-600/30 shadow-lg">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}

              {/* Upload Photo Button */}
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="absolute bottom-0 right-0 p-2 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-md transition transform hover:scale-110"
                title="Upload Profile Picture"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageUpload} 
                accept="image/*" 
                className="hidden" 
              />
            </div>

            <div>
              <h2 className="font-extrabold text-base text-white">{profile.name}</h2>
              <p className="text-xs text-gray-400 font-medium truncate">{profile.email}</p>
            </div>

            <div className="pt-2 border-t border-gray-700/50 flex items-center justify-between text-xs text-gray-300">
              <span className="font-semibold">Wallet:</span>
              <span className="font-black text-emerald-400">${walletBalance.toFixed(2)}</span>
            </div>
          </div>

          {/* Sidebar Navigation Items */}
          <nav className="space-y-1.5 font-bold text-sm">
            <button
              onClick={() => setActiveTab('overview')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'overview' ? 'bg-red-600 text-white shadow-lg shadow-red-600/25' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Overview & Activity
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'orders' ? 'bg-red-600 text-white shadow-lg shadow-red-600/25' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" /> My Orders & History
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'addresses' ? 'bg-red-600 text-white shadow-lg shadow-red-600/25' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <MapPin className="w-4 h-4" /> Saved Addresses ({addresses.length})
            </button>

            <button
              onClick={() => setActiveTab('wallet')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'wallet' ? 'bg-red-600 text-white shadow-lg shadow-red-600/25' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Wallet className="w-4 h-4" /> Digital Wallet (${walletBalance.toFixed(0)})
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                activeTab === 'profile' ? 'bg-red-600 text-white shadow-lg shadow-red-600/25' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Settings className="w-4 h-4" /> Account Settings
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Buttons */}
        <div className="pt-6 border-t border-gray-800 space-y-2">
          <Link
            href="/"
            className="w-full py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4 text-red-500" />
            <span>Back to Marketplace</span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full py-2.5 bg-red-950/40 hover:bg-red-900/60 text-red-400 text-xs font-bold rounded-xl transition flex items-center justify-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 p-6 md:p-10 max-w-6xl space-y-8 overflow-y-auto">
        {/* Reorder Toast Banner */}
        {reorderMessage && (
          <div className="p-4 bg-emerald-500 text-white text-xs font-bold rounded-2xl shadow-xl flex items-center justify-between animate-in fade-in slide-in-from-top duration-300">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5" />
              <span>{reorderMessage}</span>
            </div>
            <Link href="/cart" className="px-3 py-1 bg-white text-emerald-700 font-extrabold rounded-lg hover:bg-emerald-50">
              View Cart
            </Link>
          </div>
        )}

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-gray-900">Welcome Back, {profile.name.split(' ')[0]}! 👋</h1>
                <p className="text-xs text-gray-500 font-medium">Manage your delivery addresses, track orders, and top up your PlatePulse digital wallet.</p>
              </div>
              <Link href="/restaurants" className="px-5 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/25 transition flex items-center gap-2">
                <Utensils className="w-4 h-4" /> Order Food Now
              </Link>
            </div>

            {/* Quick Metrics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-gray-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Wallet Balance</span>
                  <Wallet className="w-5 h-5 text-emerald-600" />
                </div>
                <p className="text-3xl font-black text-gray-900">${walletBalance.toFixed(2)}</p>
                <button onClick={() => setShowTopupModal(true)} className="text-xs font-bold text-red-600 hover:underline">
                  + Top Up Wallet
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-gray-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Total Orders</span>
                  <ShoppingBag className="w-5 h-5 text-red-600" />
                </div>
                <p className="text-3xl font-black text-gray-900">{orders.length}</p>
                <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-gray-500 hover:text-gray-900">
                  View Order History →
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-gray-500">
                  <span className="text-xs font-bold uppercase tracking-wider">Saved Addresses</span>
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <p className="text-3xl font-black text-gray-900">{addresses.length}</p>
                <button onClick={() => setActiveTab('addresses')} className="text-xs font-bold text-blue-600 hover:underline">
                  Manage Addresses →
                </button>
              </div>
            </div>

            {/* Primary Delivery Address Box */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <h2 className="text-lg font-extrabold text-gray-900">Primary Delivery Address</h2>
                </div>
                <button onClick={() => setActiveTab('addresses')} className="text-xs font-bold text-red-600 hover:underline">
                  Change Address
                </button>
              </div>

              {addresses.length > 0 ? (
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-between">
                  <div>
                    <span className="px-2.5 py-0.5 bg-red-100 text-red-700 text-[10px] font-bold rounded-md">
                      {addresses[0].label}
                    </span>
                    <p className="text-sm font-bold text-gray-900 pt-1">{addresses[0].street} {addresses[0].apt && `, ${addresses[0].apt}`}</p>
                    <p className="text-xs text-gray-500">{addresses[0].city}, {addresses[0].zip}</p>
                  </div>
                  <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                </div>
              ) : (
                <div className="p-6 text-center border-2 border-dashed border-gray-200 rounded-2xl space-y-3">
                  <p className="text-xs text-gray-500 font-medium">No saved addresses yet! Add your home or office address for 1-click checkout.</p>
                  <button 
                    onClick={() => setShowAddressModal(true)}
                    className="px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-xl"
                  >
                    + Add New Delivery Address
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY ORDERS */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900">My Orders & Reorders</h2>
            {orders.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-4">
                <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto" />
                <h3 className="text-lg font-bold text-gray-900">No Orders Yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto">Explore delicious dishes from top local restaurants and place your first order!</p>
                <Link href="/restaurants" className="px-6 py-3 bg-red-600 text-white font-bold text-xs rounded-xl inline-block">
                  Browse Restaurants
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => (
                  <div key={order.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-3">
                        <img src={order.restaurantImage} alt={order.restaurantName} className="w-12 h-12 rounded-2xl object-cover" />
                        <div>
                          <h3 className="font-extrabold text-gray-900 text-base">{order.restaurantName}</h3>
                          <p className="text-xs text-gray-400 font-medium">Order #{order.id} • {order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`px-3 py-1 font-extrabold text-xs rounded-full ${
                          order.status === 'active' ? 'bg-amber-100 text-amber-800 animate-pulse' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {order.status === 'active' ? '⚡ OUT FOR DELIVERY' : '🟢 COMPLETED'}
                        </span>
                        <button 
                          onClick={() => handleReorder(order)}
                          className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-600 font-extrabold text-xs rounded-xl transition flex items-center gap-1.5"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Reorder 1-Click
                        </button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs font-semibold text-gray-700">
                          <span>{item.quantity}x {item.name}</span>
                          <span>${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                      <span className="text-gray-400 font-medium">Total Paid</span>
                      <span className="text-base font-black text-gray-900">${order.totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: SAVED ADDRESSES */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-gray-900">Saved Delivery Addresses</h2>
              <button 
                onClick={() => setShowAddressModal(true)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" /> Add Address
              </button>
            </div>

            {addresses.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-4">
                <MapPin className="w-12 h-12 text-gray-300 mx-auto" />
                <p className="text-sm font-bold text-gray-700">No saved addresses</p>
                <button onClick={() => setShowAddressModal(true)} className="px-5 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl">
                  + Add Address Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {addresses.map(addr => (
                  <div key={addr.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-3 relative">
                    <div className="flex justify-between items-start">
                      <span className="px-3 py-1 bg-red-50 text-red-600 font-extrabold text-xs rounded-lg uppercase">
                        {addr.label}
                      </span>
                      <button onClick={() => handleDeleteAddress(addr.id)} className="p-1.5 text-gray-400 hover:text-rose-600">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm font-bold text-gray-900">{addr.street} {addr.apt && `, ${addr.apt}`}</p>
                    <p className="text-xs text-gray-500">{addr.city}, {addr.zip}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 4: WALLET */}
        {activeTab === 'wallet' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900">PlatePulse Digital Wallet</h2>
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-950 p-8 rounded-3xl text-white shadow-2xl space-y-6 relative overflow-hidden">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Available Balance</p>
                  <p className="text-4xl font-black text-emerald-400 pt-1">${walletBalance.toFixed(2)}</p>
                </div>
                <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-emerald-400" />
                </div>
              </div>

              <div className="pt-4 border-t border-gray-700/60 flex items-center justify-between">
                <p className="text-xs text-gray-400">Enjoy 1-click instant checkout with your PlatePulse Balance</p>
                <button onClick={() => setShowTopupModal(true)} className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition">
                  + Add Funds
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: PROFILE SETTINGS */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-extrabold text-gray-900">Account Settings</h2>
            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
              {/* Photo Upload Section */}
              <div className="flex items-center gap-6 border-b border-gray-100 pb-6">
                <div className="relative">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt="Avatar" className="w-20 h-20 rounded-full object-cover ring-4 ring-red-600/30" />
                  ) : (
                    <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center font-black text-2xl">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 p-2 bg-red-600 text-white rounded-full shadow-md">
                    <Camera className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div>
                  <h3 className="font-extrabold text-gray-900 text-base">{profile.name}</h3>
                  <p className="text-xs text-gray-500">Upload your profile picture to customize your experience.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-semibold">
                <div>
                  <label className="block text-gray-500 uppercase mb-1">Full Name</label>
                  <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold" />
                </div>
                <div>
                  <label className="block text-gray-500 uppercase mb-1">Email Address</label>
                  <input type="email" value={profile.email} disabled className="w-full p-3 bg-gray-100 border border-gray-200 rounded-xl outline-none font-bold text-gray-500" />
                </div>
                <div>
                  <label className="block text-gray-500 uppercase mb-1">Phone Number</label>
                  <input type="text" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none font-bold" />
                </div>
              </div>

              <button 
                onClick={() => {
                  localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user') || '{}'), name: profile.name, phone: profile.phone }))
                  alert('Profile details saved successfully!')
                }} 
                className="px-6 py-3 bg-gray-900 text-white font-extrabold text-xs rounded-xl shadow-md"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Modal: Add Address */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900">Add New Delivery Address</h3>
              <button onClick={() => setShowAddressModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleAddAddress} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-gray-500 uppercase mb-1">Label</label>
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map(lbl => (
                    <button type="button" key={lbl} onClick={() => setNewAddr({...newAddr, label: lbl})} className={`px-4 py-2 rounded-xl border ${newAddr.label === lbl ? 'bg-red-600 text-white border-red-600' : 'bg-gray-50 text-gray-700'}`}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-gray-500 uppercase mb-1">Street Address</label>
                <input type="text" required placeholder="e.g. 742 Evergreen Terrace" value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl outline-none" />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-gray-500 uppercase mb-1">Apt / Suite</label>
                  <input type="text" placeholder="Apt 4B" value={newAddr.apt} onChange={e => setNewAddr({...newAddr, apt: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl outline-none" />
                </div>
                <div>
                  <label className="block text-gray-500 uppercase mb-1">City</label>
                  <input type="text" required placeholder="New York" value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl outline-none" />
                </div>
              </div>

              <button type="submit" className="w-full py-3.5 bg-red-600 text-white font-extrabold rounded-xl shadow-lg">Save Address</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Top Up Wallet */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-100 pb-4">
              <h3 className="text-lg font-bold text-gray-900">Top Up Wallet</h3>
              <button onClick={() => setShowTopupModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            <form onSubmit={handleTopup} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {['25', '50', '100'].map(val => (
                  <button type="button" key={val} onClick={() => setTopupAmount(val)} className={`py-2.5 font-bold text-sm rounded-xl border ${topupAmount === val ? 'bg-gray-900 text-white border-gray-900' : 'bg-gray-50 text-gray-700'}`}>
                    ${val}
                  </button>
                ))}
              </div>

              <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-lg">
                Confirm Top Up (${topupAmount})
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
