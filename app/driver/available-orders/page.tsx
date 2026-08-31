'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  MapPin, Clock, DollarSign, Bike, Navigation, 
  Phone, ChevronLeft, Star, Truck, CheckCircle,
  X, Filter, Search
} from 'lucide-react'

const availableOrders = [
  {
    id: 1,
    restaurant: 'Pizza Heaven',
    restaurantAddress: '456 Oak Ave',
    customer: 'John Smith',
    customerAddress: '123 Main St, Apt 4B',
    customerPhone: '+1 (555) 123-4567',
    items: 'Margherita Pizza, Pepperoni Pizza',
    distance: '1.2 km',
    estimatedTime: '15 min',
    pickupTime: 'Ready now',
    earnings: 8.50,
    rating: 4.8,
  },
  {
    id: 2,
    restaurant: 'Burger House',
    restaurantAddress: '321 Elm St',
    customer: 'Sarah Johnson',
    customerAddress: '789 Pine St',
    customerPhone: '+1 (555) 234-5678',
    items: 'Classic Cheeseburger, Fries',
    distance: '0.8 km',
    estimatedTime: '10 min',
    pickupTime: 'Ready in 5 min',
    earnings: 7.50,
    rating: 4.7,
  },
  {
    id: 3,
    restaurant: 'Sushi Master',
    restaurantAddress: '789 Cedar Ln',
    customer: 'Mike Wilson',
    customerAddress: '567 Birch Ave',
    customerPhone: '+1 (555) 345-6789',
    items: 'California Roll, Spicy Tuna Roll',
    distance: '2.5 km',
    estimatedTime: '20 min',
    pickupTime: 'Ready in 10 min',
    earnings: 10.50,
    rating: 4.9,
  },
  {
    id: 4,
    restaurant: 'Mediterranean Grill',
    restaurantAddress: '234 Maple Dr',
    customer: 'Emily Brown',
    customerAddress: '432 Elm St',
    customerPhone: '+1 (555) 456-7890',
    items: 'Chicken Souvlaki, Greek Salad',
    distance: '1.8 km',
    estimatedTime: '18 min',
    pickupTime: 'Ready in 8 min',
    earnings: 9.00,
    rating: 4.8,
  },
]

export default function AvailableOrdersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<any>(null)
  const [showAcceptModal, setShowAcceptModal] = useState(false)

  const filteredOrders = availableOrders.filter(order =>
    order.restaurant.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const acceptOrder = (order: any) => {
    setSelectedOrder(order)
    setShowAcceptModal(true)
  }

  const confirmAccept = () => {
    setShowAcceptModal(false)
    router.push('/driver/dashboard')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/driver/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="font-bold text-xl text-gray-900">Available Orders</span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-green-700 font-medium">Online</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by restaurant or customer..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm text-gray-600">Filter</span>
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
            <div className="text-xl font-bold text-gray-900">{filteredOrders.length}</div>
            <div className="text-xs text-gray-500">Available Orders</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
            <div className="text-xl font-bold text-gray-900">${filteredOrders.reduce((sum, o) => sum + o.earnings, 0)}</div>
            <div className="text-xs text-gray-500">Total Earnings</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
            <div className="text-xl font-bold text-gray-900">~{Math.round(filteredOrders.reduce((sum, o) => sum + parseInt(o.distance), 0) / filteredOrders.length * 10) / 10} km</div>
            <div className="text-xs text-gray-500">Avg Distance</div>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
            <div className="text-xl font-bold text-gray-900">~{Math.round(filteredOrders.reduce((sum, o) => sum + parseInt(o.estimatedTime), 0) / filteredOrders.length)} min</div>
            <div className="text-xs text-gray-500">Avg Time</div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid gap-4">
          {filteredOrders.map((order) => (
            <div key={order.id} className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-lg">{order.restaurant}</h3>
                        <div className="flex items-center gap-0.5">
                          <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs text-gray-600">{order.rating}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">To: {order.customer}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-xl font-bold text-green-600">${order.earnings}</div>
                      <div className="text-xs text-gray-400">Delivery fee</div>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Pickup from</p>
                        <p className="text-sm text-gray-700">{order.restaurantAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Navigation className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-xs text-gray-500">Deliver to</p>
                        <p className="text-sm text-gray-700">{order.customerAddress}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {order.estimatedTime}
                    </span>
                    <span className="flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      {order.distance}
                    </span>
                    <span className="flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5 text-green-500" />
                      {order.pickupTime}
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => acceptOrder(order)}
                  className="px-6 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition whitespace-nowrap"
                >
                  Accept Delivery
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Bike className="w-16 h-16 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No available orders at the moment</p>
            <p className="text-sm text-gray-400 mt-1">Check back later for new deliveries</p>
          </div>
        )}
      </div>

      {/* Accept Order Modal */}
      {showAcceptModal && selectedOrder && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Accept Delivery</h3>
              <button onClick={() => setShowAcceptModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            
            <div className="bg-green-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Bike className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-900">Delivery Summary</span>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Restaurant:</span>
                  <span className="font-medium text-green-900">{selectedOrder.restaurant}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Customer:</span>
                  <span className="font-medium text-green-900">{selectedOrder.customer}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Distance:</span>
                  <span className="font-medium text-green-900">{selectedOrder.distance}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Earnings:</span>
                  <span className="font-bold text-green-600">${selectedOrder.earnings}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAcceptModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAccept}
                className="flex-1 px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
              >
                Accept & Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}