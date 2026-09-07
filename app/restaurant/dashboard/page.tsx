'use client'

import { useState, useEffect } from 'react'
import { 
  DollarSign, ShoppingBag, Clock, Users, Video, CheckCircle2, 
  AlertCircle, ChevronRight, Search, Filter, Phone, MessageCircle, 
  Bike, Eye, X, Flame, Shield, ArrowUpRight, Check, Play, AlertTriangle
} from 'lucide-react'
import { restaurantsApi, ordersApi } from '../../../lib/api'

interface Order {
  id: string
  customerName: string
  customerPhone: string
  customerAddress: string
  items: Array<{ name: string; quantity: number; price: number; notes?: string }>
  totalAmount: number
  paymentMethod: string
  status: 'new' | 'preparing' | 'ready' | 'completed'
  placedAt: string
  estimatedPrepTime: number // in minutes
  assignedDriver?: { name: string; phone: string; avatar: string; eta: string }
  pickupPin: string
  specialInstructions?: string
}

const initialOrders: Order[] = []

export default function RestaurantDashboard() {
  const [orders, setOrders] = useState<Order[]>([])
  const [activeTab, setActiveTab] = useState<'all' | 'new' | 'preparing' | 'ready' | 'completed'>('all')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [restaurantName, setRestaurantName] = useState('My Kitchen')
  const [ownerName, setOwnerName] = useState('Kitchen Owner')

  // Fetch real store data, owner profile, and live orders
  useEffect(() => {
    // 1. Owner Profile
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser)
        setOwnerName(u.name || 'Kitchen Owner')
        setRestaurantName(u.restaurantName || (u.name ? `${u.name}'s Kitchen` : 'My Kitchen'))
      } catch (e) {}
    }

    // 2. Load Local Customer Orders
    const localRaw = localStorage.getItem('customerOrders')
    let localOrders: Order[] = []
    if (localRaw) {
      try {
        const parsed = JSON.parse(localRaw)
        localOrders = parsed.map((o: any) => ({
          id: o.id || 'ORD-9821',
          customerName: o.customerName || 'Sarah Jenkins',
          customerPhone: o.customerPhone || '+1 (555) 349-2019',
          customerAddress: o.deliveryAddress || o.address || '742 Evergreen Terrace, Apt 3B',
          items: o.items || [{ name: 'Margherita Pizza', quantity: 2, price: 18.50 }],
          totalAmount: o.totalAmount || 55.00,
          paymentMethod: 'PlatePulse Digital Wallet (Paid)',
          status: o.status || 'new',
          placedAt: o.date || 'Just now',
          estimatedPrepTime: 20,
          pickupPin: o.pickupPin || '4892'
        }))
      } catch (e) {}
    }
    setOrders(localOrders)

    // 3. Fetch from NestJS backend API
    async function fetchStoreData() {
      try {
        const store = await restaurantsApi.getMyStore()
        if (store && store.name) {
          setRestaurantName(store.name)
        }
        if (store && store.orders && store.orders.length > 0) {
          const mapped = store.orders.map((o: any) => ({
            id: o.id.substring(0, 8),
            customerName: o.customer?.name || 'Customer',
            customerPhone: o.customer?.phone || '+1 (555) 349-2019',
            customerAddress: o.deliveryAddress || '742 Evergreen Terrace',
            items: o.items.map((i: any) => ({
              name: i.menuItem?.name || 'Dish Item',
              quantity: i.quantity,
              price: i.price
            })),
            totalAmount: o.totalAmount,
            paymentMethod: 'PlatePulse Digital Wallet (Paid)',
            status: o.status === 'PENDING' ? 'new' : o.status === 'PREPARING' ? 'preparing' : o.status === 'READY' ? 'ready' : 'completed',
            placedAt: new Date(o.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            estimatedPrepTime: 20,
            pickupPin: o.pickupPin || '4892'
          }))
          setOrders(prev => {
            const ids = new Set(prev.map(p => p.id))
            const newOnly = mapped.filter((m: any) => !ids.has(m.id))
            return [...prev, ...newOnly]
          })
        }
      } catch (err) {}
    }
    fetchStoreData()
  }, [])

  // Move order status forward & persist to customer tracking
  const updateOrderStatus = (orderId: string, newStatus: 'preparing' | 'ready' | 'completed') => {
    const updated = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    )
    setOrders(updated)
    
    // Update local customerOrders for live tracking map
    const localRaw = localStorage.getItem('customerOrders')
    if (localRaw) {
      try {
        const parsed = JSON.parse(localRaw)
        const updatedLocal = parsed.map((o: any) => 
          o.id === orderId ? { ...o, status: newStatus } : o
        )
        localStorage.setItem('customerOrders', JSON.stringify(updatedLocal))
      } catch (e) {}
    }

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null)
    }

    ordersApi.updateStatus(orderId, newStatus.toUpperCase()).catch(() => {})
  }

  // Reject order
  const handleRejectOrder = (orderId: string) => {
    const updated = orders.filter(o => o.id !== orderId)
    setOrders(updated)
    if (selectedOrder?.id === orderId) setSelectedOrder(null)

    const localRaw = localStorage.getItem('customerOrders')
    if (localRaw) {
      try {
        const parsed = JSON.parse(localRaw)
        const updatedLocal = parsed.filter((o: any) => o.id !== orderId)
        localStorage.setItem('customerOrders', JSON.stringify(updatedLocal))
      } catch (e) {}
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesTab = activeTab === 'all' || order.status === activeTab
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          order.customerName.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const newCount = orders.filter(o => o.status === 'new').length
  const prepCount = orders.filter(o => o.status === 'preparing').length
  const readyCount = orders.filter(o => o.status === 'ready').length
  const completedCount = orders.filter(o => o.status === 'completed').length

  const todayRevenue = orders.reduce((acc, o) => acc + (o.totalAmount || 0), 0)
  const fulfillmentRate = orders.length > 0 ? Math.round((completedCount / orders.length) * 100) : 0

  return (
    <div className="space-y-8">
      {/* Top Banner Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Today's Revenue</p>
            <h3 className="text-2xl font-bold text-gray-900">${todayRevenue.toFixed(2)}</h3>
            <span className="text-[11px] text-emerald-600 font-semibold flex items-center gap-0.5">
              <ArrowUpRight className="w-3 h-3" /> {orders.length} order{orders.length === 1 ? '' : 's'} recorded
            </span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Orders Today</p>
            <h3 className="text-2xl font-bold text-gray-900">{orders.length}</h3>
            <span className="text-[11px] text-blue-600 font-semibold">{fulfillmentRate}% Fulfilled</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Active Kitchen Orders</p>
            <h3 className="text-2xl font-bold text-gray-900">{newCount + prepCount}</h3>
            <span className="text-[11px] text-amber-600 font-semibold">{newCount} Needs Acceptance</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Avg Kitchen Prep Time</p>
            <h3 className="text-2xl font-bold text-gray-900">{orders.length > 0 ? '18 min' : '--'}</h3>
            <span className="text-[11px] text-purple-600 font-semibold">Target: &lt;20 min</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold relative">
            <Video className="w-6 h-6" />
            <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-600 rounded-full animate-ping" />
          </div>
          <div>
            <p className="text-xs text-gray-500 font-medium">Live Kitchen Stream</p>
            <h3 className="text-2xl font-bold text-red-600">Active</h3>
            <span className="text-[11px] text-gray-500 font-semibold">Camera Ready</span>
          </div>
        </div>
      </div>

      {/* Main Order Pipeline & Tabs */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        {/* Navigation & Action Header */}
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {[
              { id: 'all', label: 'All Orders', count: orders.length },
              { id: 'new', label: 'New Orders', count: newCount, alert: newCount > 0 },
              { id: 'preparing', label: 'In Kitchen', count: prepCount },
              { id: 'ready', label: 'Ready for Pickup', count: readyCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition
                  ${activeTab === tab.id 
                    ? 'bg-gray-900 text-white shadow-sm' 
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}
                `}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeTab === tab.id ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-700'
                }`}>
                  {tab.count}
                </span>
                {tab.alert && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                )}
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Search by Order ID or Name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-gray-900 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Kanban Columns Grid */}
        <div className="p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* New Orders Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-red-500" />
                <h3 className="font-bold text-gray-900 text-sm">New Incoming ({newCount})</h3>
              </div>
              <span className="text-xs text-red-600 font-semibold bg-red-50 px-2 py-0.5 rounded-full">Requires Acceptance</span>
            </div>

            <div className="space-y-4">
              {orders.filter(o => o.status === 'new').map(order => (
                <div key={order.id} className="bg-red-50/50 border-2 border-red-200 rounded-2xl p-5 hover:shadow-md transition relative">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-gray-900">{order.id}</span>
                    <span className="text-xs font-semibold text-red-600 bg-white px-2.5 py-1 rounded-full shadow-xs flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {order.placedAt}
                    </span>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-bold text-gray-900">{order.customerName}</h4>
                    <p className="text-xs text-gray-500">{order.items.length} items • ${order.totalAmount.toFixed(2)} ({order.paymentMethod})</p>
                  </div>

                  <div className="bg-white/80 rounded-xl p-3 mb-4 space-y-1 text-xs border border-red-100">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between font-medium text-gray-800">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {order.specialInstructions && (
                      <p className="text-xs text-amber-700 bg-amber-50 p-2 rounded-lg mt-2 font-medium flex items-start gap-1">
                        <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-amber-600 mt-0.5" />
                        <span>Note: {order.specialInstructions}</span>
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button 
                      onClick={() => handleRejectOrder(order.id)}
                      className="py-2 px-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-bold text-xs transition"
                    >
                      Decline
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="py-2 px-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs shadow-md shadow-red-600/20 transition flex items-center justify-center gap-1"
                    >
                      <Check className="w-4 h-4" /> Accept Order
                    </button>
                  </div>
                </div>
              ))}
              {newCount === 0 && (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-xs">
                  No new incoming orders right now
                </div>
              )}
            </div>
          </div>

          {/* In Preparation Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <h3 className="font-bold text-gray-900 text-sm">Cooking & Prep ({prepCount})</h3>
              </div>
              <span className="text-xs text-amber-600 font-semibold bg-amber-50 px-2 py-0.5 rounded-full">Kitchen Active</span>
            </div>

            <div className="space-y-4">
              {orders.filter(o => o.status === 'preparing').map(order => (
                <div key={order.id} className="bg-white border border-gray-200 rounded-2xl p-5 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-gray-900">{order.id}</span>
                    <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                      <Flame className="w-3 h-3 text-amber-600 animate-bounce" /> {order.estimatedPrepTime} min prep target
                    </span>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-bold text-gray-900">{order.customerName}</h4>
                    <p className="text-xs text-gray-500">{order.items.length} items • ${order.totalAmount.toFixed(2)}</p>
                  </div>

                  {/* Driver Assign Status */}
                  {order.assignedDriver ? (
                    <div className="flex items-center gap-2 bg-blue-50 p-2.5 rounded-xl mb-4 text-xs text-blue-900 border border-blue-100">
                      <img src={order.assignedDriver.avatar} alt={order.assignedDriver.name} className="w-7 h-7 rounded-full object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold truncate">{order.assignedDriver.name}</p>
                        <p className="text-[10px] text-blue-600">{order.assignedDriver.eta}</p>
                      </div>
                      <a href={`tel:${order.assignedDriver.phone}`} className="p-1.5 bg-white rounded-lg text-blue-600 hover:bg-blue-100">
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  ) : (
                    <div className="p-2 bg-gray-50 rounded-xl mb-4 text-[11px] text-gray-500 flex items-center gap-1.5">
                      <Bike className="w-3.5 h-3.5 text-gray-400" /> Searching nearby drivers...
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 font-bold text-xs rounded-xl transition"
                    >
                      View Items
                    </button>
                    <button 
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Ready for Pickup
                    </button>
                  </div>
                </div>
              ))}
              {prepCount === 0 && (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-xs">
                  Kitchen queue is clean
                </div>
              )}
            </div>
          </div>

          {/* Ready for Pickup Column */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500" />
                <h3 className="font-bold text-gray-900 text-sm">Ready for Handover ({readyCount})</h3>
              </div>
              <span className="text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded-full">Packed & Sealed</span>
            </div>

            <div className="space-y-4">
              {orders.filter(o => o.status === 'ready').map(order => (
                <div key={order.id} className="bg-emerald-50/40 border-2 border-emerald-300 rounded-2xl p-5 hover:shadow-md transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold text-sm text-gray-900">{order.id}</span>
                    <span className="text-xs font-bold text-emerald-800 bg-white px-3 py-1 rounded-full border border-emerald-200 shadow-xs">
                      PIN: {order.pickupPin}
                    </span>
                  </div>

                  <div className="mb-3">
                    <h4 className="font-bold text-gray-900">{order.customerName}</h4>
                    <p className="text-xs text-gray-600">{order.customerAddress}</p>
                  </div>

                  {order.assignedDriver && (
                    <div className="flex items-center justify-between bg-white p-3 rounded-xl mb-4 border border-emerald-100 shadow-xs">
                      <div className="flex items-center gap-2">
                        <img src={order.assignedDriver.avatar} alt={order.assignedDriver.name} className="w-8 h-8 rounded-full object-cover" />
                        <div>
                          <p className="font-bold text-xs text-gray-900">{order.assignedDriver.name}</p>
                          <p className="text-[10px] text-emerald-600 font-semibold">{order.assignedDriver.eta}</p>
                        </div>
                      </div>
                      <a href={`tel:${order.assignedDriver.phone}`} className="p-2 bg-emerald-50 rounded-lg text-emerald-700 hover:bg-emerald-100">
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  )}

                  <button 
                    onClick={() => updateOrderStatus(order.id, 'completed')}
                    className="w-full py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Confirm Driver Pickup
                  </button>
                </div>
              ))}
              {readyCount === 0 && (
                <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-xs">
                  No orders waiting at counter
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Order Detail Inspection Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-gray-900 text-white flex items-center justify-between">
              <div>
                <span className="text-xs text-red-400 font-semibold tracking-wider">ORDER DETAILS</span>
                <h3 className="text-xl font-bold">{selectedOrder.id}</h3>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-2 text-gray-400 hover:text-white rounded-full hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Customer Info */}
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer Information</h4>
                <p className="font-bold text-gray-900">{selectedOrder.customerName}</p>
                <p className="text-xs text-gray-600">{selectedOrder.customerAddress}</p>
                <p className="text-xs text-gray-600 mt-1">{selectedOrder.customerPhone}</p>
              </div>

              {/* Items Table */}
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Order Items</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex items-start justify-between pb-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-bold text-sm text-gray-900">{item.quantity}x {item.name}</p>
                        {item.notes && (
                          <p className="text-xs text-red-600 mt-0.5 font-medium">★ {item.notes}</p>
                        )}
                      </div>
                      <span className="font-bold text-sm text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-900 text-white p-4 rounded-2xl space-y-2 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Payment Method:</span>
                  <span className="text-white font-medium">{selectedOrder.paymentMethod}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Pickup Security Code:</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm">{selectedOrder.pickupPin}</span>
                </div>
                <div className="pt-2 border-t border-gray-800 flex justify-between text-sm font-bold">
                  <span>Total Amount</span>
                  <span className="text-emerald-400">${selectedOrder.totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-end">
              <button 
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 bg-gray-900 text-white font-bold text-sm rounded-xl hover:bg-black transition"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
