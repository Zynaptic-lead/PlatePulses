'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { useCartStore } from '../../store/useCartStore'
import { 
  ShoppingBag, Clock, CheckCircle2, MapPin, Truck, Phone, 
  RotateCcw, Download, Star, ChevronRight, AlertCircle, ChefHat, 
  X, ExternalLink, ShieldCheck, Heart, Search
} from 'lucide-react'

interface PastOrder {
  id: string
  restaurantName: string
  restaurantImage: string
  restaurantId: string
  date: string
  totalAmount: number
  status: 'active' | 'completed' | 'cancelled'
  items: Array<{ id: string; name: string; quantity: number; price: number }>
  driver?: { name: string; avatar: string; phone: string; eta: string }
  rating?: number
  pickupPin?: string
}

const mockCustomerOrders: PastOrder[] = [
  {
    id: 'ORD-9821',
    restaurantName: 'Pizza Heaven',
    restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format',
    restaurantId: '1',
    date: 'Today at 12:42 PM',
    totalAmount: 55.00,
    status: 'active',
    pickupPin: '4892',
    driver: {
      name: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format',
      phone: '+1 (555) 441-9920',
      eta: 'Out for Delivery (ETA: 12 mins)'
    },
    items: [
      { id: 'ITEM-01', name: 'Wood-Fired Margherita Pizza', quantity: 2, price: 18.50 },
      { id: 'ITEM-04', name: 'Truffle Garlic Breadsticks', quantity: 1, price: 9.00 },
      { id: 'ITEM-06', name: 'Italian Sparkling Lemonade', quantity: 2, price: 4.50 }
    ]
  },
  {
    id: 'ORD-8812',
    restaurantName: 'Sushi Master',
    restaurantImage: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format',
    restaurantId: '2',
    date: 'Yesterday at 7:15 PM',
    totalAmount: 64.50,
    status: 'completed',
    rating: 5,
    items: [
      { id: 'ITEM-11', name: 'Dragon Roll (8pcs)', quantity: 2, price: 19.00 },
      { id: 'ITEM-12', name: 'Salmon Nigiri (4pcs)', quantity: 1, price: 14.50 },
      { id: 'ITEM-13', name: 'Miso Soup Special', quantity: 2, price: 6.00 }
    ]
  },
  {
    id: 'ORD-7620',
    restaurantName: 'Burger House',
    restaurantImage: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format',
    restaurantId: '3',
    date: 'Aug 26, 2026 at 1:30 PM',
    totalAmount: 38.00,
    status: 'completed',
    rating: 4,
    items: [
      { id: 'ITEM-21', name: 'Double Bacon Cheeseburger', quantity: 2, price: 14.00 },
      { id: 'ITEM-22', name: 'Truffle Parmesan Fries', quantity: 1, price: 10.00 }
    ]
  },
  {
    id: 'ORD-6510',
    restaurantName: 'Mediterranean Grill',
    restaurantImage: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format',
    restaurantId: '5',
    date: 'Aug 20, 2026 at 6:45 PM',
    totalAmount: 42.00,
    status: 'completed',
    rating: 5,
    items: [
      { id: 'ITEM-31', name: 'Greek Chicken Gyro Platter', quantity: 2, price: 16.00 },
      { id: 'ITEM-32', name: 'Hummus & Warm Pita', quantity: 1, price: 10.00 }
    ]
  }
]

export default function CustomerOrdersPage() {
  const { addItem } = useCartStore()
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'completed'>('all')
  const [reorderSuccess, setReorderSuccess] = useState<string | null>(null)
  const [ratingModalOrder, setRatingModalOrder] = useState<PastOrder | null>(null)
  const [selectedRating, setSelectedRating] = useState(5)

  // 1-Click Reorder Handler
  const handleReorder = (order: PastOrder) => {
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

    setReorderSuccess(`Items from ${order.restaurantName} added to your cart!`)
    setTimeout(() => setReorderSuccess(null), 4000)
  }

  const filteredOrders = mockCustomerOrders.filter(order => {
    if (activeTab === 'active') return order.status === 'active'
    if (activeTab === 'completed') return order.status === 'completed'
    return true
  })

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">MY ACCOUNT</span>
            <h1 className="text-3xl font-extrabold text-gray-900">My Orders & Receipts</h1>
          </div>

          {reorderSuccess && (
            <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 animate-in fade-in slide-in-from-top duration-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>{reorderSuccess}</span>
              <Link href="/cart" className="underline underline-offset-2 ml-1 text-white font-extrabold">View Cart</Link>
            </div>
          )}
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white p-2 rounded-2xl border border-gray-200 shadow-xs inline-flex items-center gap-2">
          {[
            { id: 'all', label: 'All Orders' },
            { id: 'active', label: 'Active Delivery 🚚' },
            { id: 'completed', label: 'Past Orders' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`
                px-5 py-2.5 rounded-xl text-xs font-bold transition
                ${activeTab === tab.id 
                  ? 'bg-gray-900 text-white shadow-sm' 
                  : 'text-gray-600 hover:bg-gray-100'}
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.map(order => (
            <div 
              key={order.id} 
              className={`
                bg-white rounded-3xl border shadow-xs overflow-hidden transition duration-200
                ${order.status === 'active' ? 'border-2 border-red-500 ring-4 ring-red-500/10' : 'border-gray-200'}
              `}
            >
              {/* Active Banner Indicator */}
              {order.status === 'active' && (
                <div className="bg-red-600 text-white px-6 py-2.5 flex items-center justify-between text-xs font-bold">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-white animate-ping" />
                    <span>ORDER IN PROGRESS • DRIVER ON THE WAY</span>
                  </div>
                  <span>Pin: {order.pickupPin}</span>
                </div>
              )}

              {/* Order Content */}
              <div className="p-6 space-y-6">
                {/* Header Row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <img 
                      src={order.restaurantImage} 
                      alt={order.restaurantName} 
                      className="w-14 h-14 rounded-2xl object-cover ring-1 ring-gray-200"
                    />
                    <div>
                      <h3 className="font-extrabold text-lg text-gray-900">{order.restaurantName}</h3>
                      <p className="text-xs text-gray-500 font-medium">{order.date} • Order {order.id}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    {order.status === 'active' ? (
                      <Link 
                        href={`/order-tracking/${order.id}`}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/20 transition flex items-center gap-1.5"
                      >
                        <MapPin className="w-4 h-4" /> Live Map Tracking
                      </Link>
                    ) : (
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-full border border-emerald-200">
                        ✓ Delivered
                      </span>
                    )}
                  </div>
                </div>

                {/* Items Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-2">
                    <h4 className="font-bold text-gray-400 uppercase tracking-wider text-[10px]">Purchased Items</h4>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between font-medium text-gray-800">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Driver Card for Active Order */}
                  {order.status === 'active' && order.driver && (
                    <div className="bg-red-50/60 p-4 rounded-2xl border border-red-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img src={order.driver.avatar} alt={order.driver.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-red-500/30" />
                        <div>
                          <p className="font-bold text-gray-900">{order.driver.name}</p>
                          <p className="text-[11px] text-red-600 font-semibold">{order.driver.eta}</p>
                        </div>
                      </div>
                      <a href={`tel:${order.driver.phone}`} className="p-2.5 bg-white text-red-600 hover:bg-red-100 rounded-xl shadow-xs transition">
                        <Phone className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>

                {/* Footer Controls & Reorder */}
                <div className="pt-4 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Total Paid: </span>
                    <span className="font-extrabold text-gray-900 text-base">${order.totalAmount.toFixed(2)}</span>
                  </div>

                  <div className="flex items-center gap-3">
                    {order.status === 'completed' && (
                      <>
                        <button 
                          onClick={() => setRatingModalOrder(order)}
                          className="px-4 py-2 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl hover:bg-gray-50 transition flex items-center gap-1.5"
                        >
                          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          <span>{order.rating ? `${order.rating}/5 Rated` : 'Rate Order'}</span>
                        </button>

                        <button 
                          onClick={() => handleReorder(order)}
                          className="px-5 py-2.5 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-2"
                        >
                          <RotateCcw className="w-3.5 h-3.5" /> Reorder Items
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Rating & Review Modal */}
      {ratingModalOrder && (
        <div className="fixed inset-0 z-50 bg-gray-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200 text-center">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-full flex items-center justify-center mx-auto">
              <Star className="w-8 h-8 fill-amber-500" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900">Rate Your Meal</h3>
              <p className="text-xs text-gray-500 mt-1">How was your experience with {ratingModalOrder.restaurantName}?</p>
            </div>

            {/* Stars Selector */}
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map(star => (
                <button 
                  key={star}
                  onClick={() => setSelectedRating(star)}
                  className="p-1 hover:scale-110 transition"
                >
                  <Star className={`w-8 h-8 ${star <= selectedRating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>

            <textarea 
              rows={3}
              placeholder="Leave feedback for Chef Mario & the delivery driver..."
              className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-gray-900"
            />

            <div className="flex gap-3">
              <button 
                onClick={() => setRatingModalOrder(null)}
                className="flex-1 py-2.5 border border-gray-200 text-gray-700 font-bold text-xs rounded-xl"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  setRatingModalOrder(null)
                  alert('Thank you for rating your order!')
                }}
                className="flex-1 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-black"
              >
                Submit Review
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}
