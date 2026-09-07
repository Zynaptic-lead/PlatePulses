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
  Camera, Home, LogOut, LayoutDashboard, Utensils, ArrowDownRight,
  Receipt
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

interface WalletTransaction {
  id: string
  type: 'TOPUP' | 'PURCHASE' | 'REFUND'
  title: string
  amount: number
  date: string
  orderId?: string
}

interface WishlistItem {
  id: string
  name: string
  cuisine: string
  image: string
  rating: number
  type: 'restaurant' | 'dish'
}

export default function CustomerDashboardPage() {
  const router = useRouter()
  const { addItem } = useCartStore()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'wishlist' | 'wallet' | 'addresses' | 'profile'>('overview')
  const [walletBalance, setWalletBalance] = useState(50.00)
  const [showTopupModal, setShowTopupModal] = useState(false)
  const [topupAmount, setTopupAmount] = useState('50')
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [reorderMessage, setReorderMessage] = useState<string | null>(null)

  // Profile info state (Initialized with real user data or fallback)
  const [profile, setProfile] = useState({
    name: 'Valued Customer',
    email: 'customer@platepulse.com',
    phone: '+1 (555) 349-2019',
    avatar: ''
  })

  // Addresses state
  const [addresses, setAddresses] = useState<Address[]>([
    { id: 'addr-1', label: 'Home', street: '742 Evergreen Terrace', apt: 'Apt 4B', city: 'Springfield', zip: '97477', isDefault: true }
  ])
  const [newAddr, setNewAddr] = useState({ label: 'Home' as 'Home' | 'Work' | 'Other', street: '', apt: '', city: '', zip: '' })
  
  // Orders & Wishlist & Transactions state
  const [orders, setOrders] = useState<CustomerOrder[]>([])
  const [wishlist, setWishlist] = useState<WishlistItem[]>([])
  const [transactions, setTransactions] = useState<WalletTransaction[]>([])

  // Load User Data, Addresses, Orders & Transactions on Mount
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

    // 2. Load Avatar
    const savedAvatar = localStorage.getItem('customerAvatar')
    if (savedAvatar) {
      setProfile(prev => ({ ...prev, avatar: savedAvatar }))
    }

    // 3. Load Wallet Balance
    const savedWallet = localStorage.getItem('customerWallet')
    if (savedWallet) {
      setWalletBalance(parseFloat(savedWallet))
    }

    // 4. Load Saved Addresses
    const savedAddressesRaw = localStorage.getItem('customerAddresses')
    if (savedAddressesRaw) {
      try { setAddresses(JSON.parse(savedAddressesRaw)) } catch (e) {}
    }

    // 5. Load Customer Orders
    const localOrdersRaw = localStorage.getItem('customerOrders')
    if (localOrdersRaw) {
      try { setOrders(JSON.parse(localOrdersRaw)) } catch (e) {}
    }

    // 6. Load Customer Wishlist
    const localWishlistRaw = localStorage.getItem('customerWishlist')
    if (localWishlistRaw) {
      try { setWishlist(JSON.parse(localWishlistRaw)) } catch (e) {}
    } else {
      // Default initial wishlist sample
      const sampleWishlist: WishlistItem[] = [
        { id: '1', name: 'Pizza Heaven', cuisine: 'Italian • Wood-fired Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format', rating: 4.8, type: 'restaurant' },
        { id: '2', name: 'Sushi Master', cuisine: 'Japanese • Fresh Sashimi', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format', rating: 4.9, type: 'restaurant' }
      ]
      setWishlist(sampleWishlist)
      localStorage.setItem('customerWishlist', JSON.stringify(sampleWishlist))
    }

    // 7. Load Wallet Transactions
    const localTxRaw = localStorage.getItem('customerTransactions')
    if (localTxRaw) {
      try { setTransactions(JSON.parse(localTxRaw)) } catch (e) {}
    } else {
      const defaultTx: WalletTransaction[] = [
        { id: 'TX-1001', type: 'TOPUP', title: 'Welcome Account Bonus Credit', amount: 50.00, date: 'Today at 09:00 AM' }
      ]
      setTransactions(defaultTx)
      localStorage.setItem('customerTransactions', JSON.stringify(defaultTx))
    }

    async function loadBackendProfile() {
      try {
        const userProfile = await usersApi.getProfile()
        setProfile(prev => ({
          name: userProfile.name || prev.name,
          email: userProfile.email || prev.email,
          phone: userProfile.phone || prev.phone,
          avatar: userProfile.avatar || prev.avatar
        }))
      } catch (err) {}
    }
    loadBackendProfile()
  }, [])

  // Profile Picture Upload Handler
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setProfile(prev => ({ ...prev, avatar: base64 }))
        localStorage.setItem('customerAvatar', base64)
      }
      reader.readAsDataURL(file)
    }
  }

  // Add Address Handler
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddr.street || !newAddr.city) return

    const created: Address = {
      id: 'addr-' + Date.now(),
      label: newAddr.label,
      street: newAddr.street,
      apt: newAddr.apt,
      city: newAddr.city,
      zip: newAddr.zip || '10001',
      isDefault: addresses.length === 0
    }

    const updated = [...addresses, created]
    setAddresses(updated)
    localStorage.setItem('customerAddresses', JSON.stringify(updated))
    setNewAddr({ label: 'Home', street: '', apt: '', city: '', zip: '' })
    setShowAddressModal(false)
  }

  // Delete Address Handler
  const handleDeleteAddress = (id: string) => {
    const updated = addresses.filter(a => a.id !== id)
    setAddresses(updated)
    localStorage.setItem('customerAddresses', JSON.stringify(updated))
  }

  // Remove Wishlist Item Handler
  const handleRemoveWishlist = (id: string) => {
    const updated = wishlist.filter(w => w.id !== id)
    setWishlist(updated)
    localStorage.setItem('customerWishlist', JSON.stringify(updated))
  }

  // Top Up Wallet Handler
  const handleTopupWallet = (e: React.FormEvent) => {
    e.preventDefault()
    const amt = parseFloat(topupAmount)
    if (isNaN(amt) || amt <= 0) return

    const newBalance = walletBalance + amt
    setWalletBalance(newBalance)
    localStorage.setItem('customerWallet', newBalance.toFixed(2))

    const newTx: WalletTransaction = {
      id: 'TX-' + Math.floor(1000 + Math.random() * 9000),
      type: 'TOPUP',
      title: 'Digital Wallet Credit Top-Up',
      amount: amt,
      date: 'Just now'
    }
    const updatedTx = [newTx, ...transactions]
    setTransactions(updatedTx)
    localStorage.setItem('customerTransactions', JSON.stringify(updatedTx))

    setShowTopupModal(false)
    setTopupAmount('50')
  }

  // 1-Click Reorder Handler
  const handleReorder = (order: CustomerOrder) => {
    order.items.forEach(item => {
      addItem({
        id: item.id,
        restaurantId: order.restaurantId,
        restaurantName: order.restaurantName,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: order.restaurantImage
      })
    })
    setReorderMessage(`Added ${order.items.length} items from ${order.restaurantName} to your cart!`)
    setTimeout(() => setReorderMessage(null), 4000)
    router.push('/cart')
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* ── STICKY LEFT SIDEBAR (FIXED SCROLL) ── */}
      <aside className="w-64 bg-white border-r border-gray-200 sticky top-0 h-screen overflow-y-auto flex flex-col justify-between p-5 shrink-0 z-30 shadow-xs">
        <div className="space-y-6">
          {/* Brand Header */}
          <Link href="/" className="flex items-center gap-2 px-2">
            <div className="w-9 h-9 bg-red-600 rounded-xl flex items-center justify-center shadow-md shadow-red-600/30">
              <span className="text-white font-black text-xl">P</span>
            </div>
            <div>
              <span className="font-extrabold text-lg text-gray-900 block leading-tight">PlatePulse</span>
              <span className="text-[10px] font-bold text-red-600 tracking-wide uppercase">Customer Hub</span>
            </div>
          </Link>

          {/* User Mini Avatar Card */}
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-200 flex items-center gap-3">
            <div className="relative shrink-0">
              {profile.avatar ? (
                <img src={profile.avatar} alt={profile.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-red-600/40" />
              ) : (
                <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-black text-sm shadow-xs">
                  {profile.name.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            <div className="overflow-hidden">
              <p className="font-extrabold text-xs text-gray-900 truncate">{profile.name}</p>
              <p className="text-[11px] text-gray-500 truncate">{profile.email}</p>
              <p className="text-[10px] font-semibold text-gray-400 truncate">{profile.phone}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 text-xs font-bold">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'orders', label: 'My Orders', icon: ShoppingBag, badge: orders.length },
              { id: 'wishlist', label: 'Saved Favorites', icon: Heart, badge: wishlist.length },
              { id: 'wallet', label: 'Wallet & History', icon: Wallet, badge: `$${walletBalance.toFixed(0)}` },
              { id: 'addresses', label: 'Delivery Addresses', icon: MapPin, badge: addresses.length },
              { id: 'profile', label: 'Account Profile', icon: User },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl transition ${
                  activeTab === tab.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/20 font-extrabold'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                <div className="flex items-center gap-3">
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </div>
                {tab.badge !== undefined && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                    activeTab === tab.id ? 'bg-white text-red-600' : 'bg-gray-200 text-gray-700'
                  }`}>
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Actions */}
        <div className="space-y-2 pt-4 border-t border-gray-100">
          <Link href="/" className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-gray-600 hover:bg-gray-100 rounded-xl transition">
            <Home className="w-4 h-4 text-gray-500" />
            <span>Back to Marketplace</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition">
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto overflow-y-auto">
        {/* Reorder Success Banner */}
        {reorderMessage && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-xs font-bold flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>{reorderMessage}</span>
            </div>
            <Link href="/cart" className="px-3 py-1.5 bg-emerald-600 text-white font-extrabold text-xs rounded-xl shadow-xs">View Cart →</Link>
          </div>
        )}

        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Header Banner */}
            <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-red-950 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl" />
              <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="flex items-center gap-5">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    {profile.avatar ? (
                      <img src={profile.avatar} alt={profile.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-white/20 shadow-xl" />
                    ) : (
                      <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center font-black text-2xl ring-4 ring-white/20 shadow-xl">
                        {profile.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                      <Camera className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-2xl lg:text-3xl font-extrabold tracking-tight">Welcome back, {profile.name}!</h1>
                    <p className="text-gray-300 text-xs mt-1 font-medium">{profile.email} • {profile.phone}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-red-600/80 text-white text-[10px] font-extrabold rounded-full uppercase tracking-wider">PlatePulse VIP Customer</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setActiveTab('wallet')} className="px-5 py-3 bg-white text-gray-900 font-extrabold text-xs rounded-2xl shadow-lg hover:bg-gray-100 transition flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-600" /> ${walletBalance.toFixed(2)} Wallet
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Digital Wallet Balance</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">${walletBalance.toFixed(2)}</p>
                </div>
                <button onClick={() => setShowTopupModal(true)} className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl hover:bg-emerald-100 transition">
                  <Plus className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Total Orders Placed</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{orders.length}</p>
                </div>
                <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase">Saved Delivery Addresses</p>
                  <p className="text-2xl font-black text-gray-900 mt-1">{addresses.length}</p>
                </div>
                <button onClick={() => setShowAddressModal(true)} className="p-3 bg-gray-100 text-gray-700 rounded-2xl hover:bg-gray-200 transition">
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Recent Orders Overview */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-red-600" />
                  Recent Activity & Orders
                </h3>
                <button onClick={() => setActiveTab('orders')} className="text-xs font-bold text-red-600 hover:underline">
                  View All ({orders.length}) →
                </button>
              </div>

              {orders.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <Utensils className="w-10 h-10 text-gray-300 mx-auto" />
                  <p className="text-sm font-bold text-gray-700">No orders placed yet.</p>
                  <Link href="/restaurants" className="inline-block px-5 py-2.5 bg-gray-900 text-white font-extrabold text-xs rounded-xl shadow-md">
                    Explore Restaurants & Order Now
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.slice(0, 3).map((order) => (
                    <div key={order.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex items-center gap-3">
                        <img src={order.restaurantImage} alt={order.restaurantName} className="w-12 h-12 rounded-xl object-cover" />
                        <div>
                          <p className="font-extrabold text-sm text-gray-900">{order.restaurantName}</p>
                          <p className="text-xs text-gray-500 font-medium">{order.date} • {order.items.length} items</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-black text-sm text-gray-900">${order.totalAmount.toFixed(2)}</span>
                        <button onClick={() => handleReorder(order)} className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white text-xs font-extrabold rounded-xl transition">
                          Reorder
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 2. ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">My Orders</h1>
                <p className="text-xs text-gray-500 font-medium pt-1">Track active deliveries and view your order history.</p>
              </div>
              <Link href="/restaurants" className="px-4 py-2.5 bg-red-600 text-white font-extrabold text-xs rounded-xl shadow-md">
                + New Order
              </Link>
            </div>

            {orders.length === 0 ? (
              <div className="py-20 bg-white rounded-3xl border border-gray-200 text-center space-y-4 shadow-xs">
                <ShoppingBag className="w-14 h-14 text-gray-300 mx-auto" />
                <h3 className="text-base font-extrabold text-gray-900">No Orders Placed Yet</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto font-medium">When you order from restaurants, your live tracking and item receipts will appear here.</p>
                <Link href="/restaurants" className="inline-block px-6 py-3 bg-gray-900 text-white font-extrabold text-xs rounded-xl shadow-lg">
                  Browse Restaurants
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-gray-100 pb-4">
                      <div className="flex items-center gap-3">
                        <img src={order.restaurantImage} alt={order.restaurantName} className="w-12 h-12 rounded-2xl object-cover" />
                        <div>
                          <h3 className="font-extrabold text-gray-900 text-base">{order.restaurantName}</h3>
                          <p className="text-xs text-gray-500 font-medium">Order #{order.id} • {order.date}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                          order.status === 'active' ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {order.status === 'active' ? 'Out for Delivery' : 'Completed'}
                        </span>
                        {order.pickupPin && (
                          <span className="px-3 py-1 bg-gray-900 text-white text-xs font-black rounded-full">
                            PIN: {order.pickupPin}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Order Items List */}
                    <div className="space-y-2">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center text-xs font-semibold text-gray-700 py-1">
                          <span>{item.quantity}x {item.name}</span>
                          <span className="text-gray-900 font-extrabold">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-sm font-black text-gray-900">Total: ${order.totalAmount.toFixed(2)}</span>
                      <div className="flex gap-2">
                        {order.status === 'active' && (
                          <Link href={`/order-tracking/${order.id}`} className="px-4 py-2 bg-red-600 text-white font-extrabold text-xs rounded-xl shadow-md">
                            Live GPS Map →
                          </Link>
                        )}
                        <button onClick={() => handleReorder(order)} className="px-4 py-2 bg-gray-900 text-white font-extrabold text-xs rounded-xl shadow-md">
                          Reorder Item
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 3. WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Saved Favorites</h1>
              <p className="text-xs text-gray-500 font-medium pt-1">Restaurants and dishes you liked with the heart icon.</p>
            </div>

            {wishlist.length === 0 ? (
              <div className="py-20 bg-white rounded-3xl border border-gray-200 text-center space-y-4 shadow-xs">
                <Heart className="w-14 h-14 text-gray-300 mx-auto" />
                <h3 className="text-base font-extrabold text-gray-900">Your Wishlist is Empty</h3>
                <p className="text-xs text-gray-500 max-w-sm mx-auto font-medium">Click the heart icon on any restaurant or dish to save it here for quick access.</p>
                <Link href="/restaurants" className="inline-block px-6 py-3 bg-red-600 text-white font-extrabold text-xs rounded-xl shadow-lg">
                  Explore Restaurants
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {wishlist.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-xs flex flex-col justify-between">
                    <div className="relative h-44">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      <button onClick={() => handleRemoveWishlist(item.id)} className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:scale-110 transition">
                        <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                      </button>
                    </div>
                    <div className="p-5 space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-extrabold text-gray-900 text-base">{item.name}</h3>
                          <p className="text-xs text-gray-500 font-semibold">{item.cuisine}</p>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-100 text-xs font-extrabold text-amber-700">
                          <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                          <span>{item.rating}</span>
                        </div>
                      </div>
                      <Link href={`/restaurants/${item.id}`} className="w-full py-2.5 bg-gray-900 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2">
                        View Menu & Order →
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* 4. WALLET & HISTORY TAB */}
        {activeTab === 'wallet' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">Digital Wallet & Spending History</h1>
                <p className="text-xs text-gray-500 font-medium pt-1">Manage your PlatePulse wallet balance and view detailed transaction receipts.</p>
              </div>
              <button onClick={() => setShowTopupModal(true)} className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center gap-2">
                <Plus className="w-4 h-4" /> Top Up Balance
              </button>
            </div>

            {/* Balance Card */}
            <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-gray-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl">
              <div className="relative flex justify-between items-center">
                <div>
                  <p className="text-xs font-extrabold uppercase text-emerald-300 tracking-wider">Available Digital Wallet Balance</p>
                  <h2 className="text-4xl font-black mt-1">${walletBalance.toFixed(2)}</h2>
                  <p className="text-xs text-emerald-200 mt-2 font-medium">Instant 1-click checkout enabled for all food orders</p>
                </div>
                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Wallet className="w-8 h-8 text-emerald-400" />
                </div>
              </div>
            </div>

            {/* Transaction Ledger Table */}
            <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-xs space-y-4">
              <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                <h3 className="font-extrabold text-gray-900 text-base flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-600" />
                  Transaction History & Spending Logs
                </h3>
                <span className="text-xs font-bold text-gray-500">{transactions.length} records</span>
              </div>

              {transactions.length === 0 ? (
                <p className="text-xs text-gray-500 font-medium py-8 text-center">No transaction records found.</p>
              ) : (
                <div className="space-y-3">
                  {transactions.map((tx) => (
                    <div key={tx.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl ${tx.type === 'TOPUP' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                          {tx.type === 'TOPUP' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownRight className="w-5 h-5" />}
                        </div>
                        <div>
                          <p className="font-extrabold text-xs text-gray-900">{tx.title}</p>
                          <p className="text-[11px] text-gray-500 font-medium">{tx.date} • ID: {tx.id}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-black text-sm ${tx.type === 'TOPUP' ? 'text-emerald-600' : 'text-gray-900'}`}>
                          {tx.type === 'TOPUP' ? '+' : '-'}${tx.amount.toFixed(2)}
                        </p>
                        <span className="text-[10px] font-bold text-gray-400 uppercase">{tx.type}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 5. ADDRESSES TAB */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">Saved Delivery Addresses</h1>
                <p className="text-xs text-gray-500 font-medium pt-1">Manage your saved home, work, and custom delivery spots.</p>
              </div>
              <button onClick={() => setShowAddressModal(true)} className="px-5 py-2.5 bg-gray-900 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center gap-2">
                <Plus className="w-4 h-4" /> Add New Address
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {addresses.map((addr) => (
                <div key={addr.id} className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-3 relative">
                  <div className="flex justify-between items-start">
                    <span className="px-3 py-1 bg-red-50 text-red-600 font-extrabold text-xs rounded-full border border-red-100 uppercase">
                      {addr.label}
                    </span>
                    <button onClick={() => handleDeleteAddress(addr.id)} className="p-1.5 text-gray-400 hover:text-rose-600 transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div>
                    <p className="font-extrabold text-sm text-gray-900">{addr.street} {addr.apt}</p>
                    <p className="text-xs text-gray-500 font-medium">{addr.city}, Zip {addr.zip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 6. PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-2xl">
            <div>
              <h1 className="text-2xl font-extrabold text-gray-900">Account Profile Settings</h1>
              <p className="text-xs text-gray-500 font-medium pt-1">Update your personal details, profile picture, and contact information.</p>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-xs space-y-6">
              {/* Photo Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-20 h-20 rounded-full object-cover ring-4 ring-red-600/30 shadow-md" />
                  ) : (
                    <div className="w-20 h-20 bg-red-600 text-white rounded-full flex items-center justify-center font-black text-2xl shadow-md">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                    <Camera className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div>
                  <button onClick={() => fileInputRef.current?.click()} className="px-4 py-2 bg-gray-900 text-white font-extrabold text-xs rounded-xl shadow-xs">
                    Upload Profile Picture
                  </button>
                  <p className="text-[11px] text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                </div>
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
              </div>

              {/* Form Inputs */}
              <div className="space-y-4 text-xs font-semibold">
                <div>
                  <label className="block text-gray-600 uppercase mb-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name} 
                    onChange={e => setProfile({...profile, name: e.target.value})} 
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-gray-900 placeholder:text-gray-400 focus:border-gray-900" 
                  />
                </div>
                <div>
                  <label className="block text-gray-600 uppercase mb-1">Email Address</label>
                  <input 
                    type="email" 
                    value={profile.email} 
                    disabled 
                    className="w-full p-3.5 bg-gray-100 border border-gray-200 rounded-xl font-bold text-gray-500 cursor-not-allowed" 
                  />
                </div>
                <div>
                  <label className="block text-gray-600 uppercase mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    value={profile.phone} 
                    onChange={e => setProfile({...profile, phone: e.target.value})} 
                    className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-gray-900 placeholder:text-gray-400 focus:border-gray-900" 
                  />
                </div>
              </div>

              <button 
                onClick={() => {
                  localStorage.setItem('user', JSON.stringify({ ...JSON.parse(localStorage.getItem('user') || '{}'), name: profile.name, phone: profile.phone }))
                  alert('Profile updated successfully!')
                }} 
                className="px-6 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
              >
                Save Profile Changes
              </button>
            </div>
          </div>
        )}
      </main>

      {/* MODAL: ADD ADDRESS */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-5 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-gray-900">Add New Delivery Address</h3>
              <button onClick={() => setShowAddressModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddAddress} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-gray-600 uppercase mb-1">Label</label>
                <div className="flex gap-2">
                  {(['Home', 'Work', 'Other'] as const).map(lbl => (
                    <button type="button" key={lbl} onClick={() => setNewAddr({...newAddr, label: lbl})} className={`px-4 py-2 rounded-xl border ${newAddr.label === lbl ? 'bg-red-600 text-white border-red-600 font-extrabold' : 'bg-gray-50 text-gray-700 border-gray-300'}`}>
                      {lbl}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-gray-600 uppercase mb-1">Street Address</label>
                <input type="text" required placeholder="e.g. 742 Evergreen Terrace" value={newAddr.street} onChange={e => setNewAddr({...newAddr, street: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-gray-900 placeholder:text-gray-400" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-gray-600 uppercase mb-1">Apt / Suite</label>
                  <input type="text" placeholder="Apt 4B" value={newAddr.apt} onChange={e => setNewAddr({...newAddr, apt: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-gray-900 placeholder:text-gray-400" />
                </div>
                <div>
                  <label className="block text-gray-600 uppercase mb-1">City</label>
                  <input type="text" required placeholder="Springfield" value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-bold text-gray-900 placeholder:text-gray-400" />
                </div>
              </div>
              <button type="submit" className="w-full py-3.5 bg-red-600 text-white font-extrabold rounded-xl shadow-lg hover:bg-red-700 transition">Save Delivery Address</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: TOP UP WALLET */}
      {showTopupModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 space-y-5 shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-extrabold text-gray-900">Top Up Digital Wallet</h3>
              <button onClick={() => setShowTopupModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleTopupWallet} className="space-y-4 text-xs font-semibold">
              <div>
                <label className="block text-gray-600 uppercase mb-1">Enter Top-Up Amount ($)</label>
                <input type="number" min="5" step="5" required value={topupAmount} onChange={e => setTopupAmount(e.target.value)} className="w-full p-3.5 bg-gray-50 border border-gray-300 rounded-xl outline-none font-black text-gray-900 text-lg" />
              </div>
              <div className="flex gap-2">
                {['20', '50', '100'].map(val => (
                  <button type="button" key={val} onClick={() => setTopupAmount(val)} className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl font-extrabold text-gray-800">
                    +${val}
                  </button>
                ))}
              </div>
              <button type="submit" className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold rounded-xl shadow-lg transition">
                Add Credit to Wallet
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
