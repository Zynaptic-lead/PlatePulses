'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, Bike, Package, DollarSign, 
  Star, Settings, LogOut, ChevronRight, 
  MapPin, Clock, TrendingUp, Award, Calendar,
  Bell, User, Navigation, Phone, MessageCircle,
  CheckCircle, AlertCircle, X
} from 'lucide-react'

// Mock data
const driverStats = {
  todayEarnings: 68.50,
  weekEarnings: 342.00,
  monthEarnings: 1245.00,
  deliveriesToday: 4,
  totalDeliveries: 128,
  rating: 4.92,
  acceptanceRate: 94,
  onlineTime: '4h 32m',
}

const activeDelivery = {
  id: 1,
  restaurant: 'Pizza Heaven',
  restaurantAddress: '456 Oak Ave',
  customer: 'John Smith',
  customerAddress: '123 Main St, Apt 4B',
  customerPhone: '+1 (555) 123-4567',
  items: 'Margherita Pizza, Pepperoni Pizza',
  distance: '1.2 km',
  estimatedTime: '15 min',
  earnings: 8.50,
  status: 'pickup',
  pickupCode: 'PP-2341',
}

const recentActivities = [
  { id: 1, type: 'completed', restaurant: 'Burger House', amount: 7.50, time: '2:30 PM', date: 'Today' },
  { id: 2, type: 'completed', restaurant: 'Sushi Master', amount: 10.50, time: '1:15 PM', date: 'Today' },
  { id: 3, type: 'completed', restaurant: 'Mediterranean Grill', amount: 9.00, time: '12:00 PM', date: 'Today' },
]

const upcomingSchedule = [
  { id: 1, shift: 'Morning Shift', time: '8:00 AM - 12:00 PM', status: 'upcoming' },
  { id: 2, shift: 'Evening Shift', time: '4:00 PM - 8:00 PM', status: 'upcoming' },
]

export default function DriverDashboard() {
  const pathname = usePathname()
  const router = useRouter()
  const [showPickupModal, setShowPickupModal] = useState(false)
  const [showDeliveryModal, setShowDeliveryModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    // Check if driver is logged in
    const auth = localStorage.getItem('driverAuth')
    if (!auth) {
      router.push('/driver/login')
    } else {
      setIsAuthenticated(true)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('driverAuth')
    router.push('/driver/login')
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Checking authentication...</p>
        </div>
      </div>
    )
  }

  const navItems = [
    { href: '/driver/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/driver/active-deliveries', label: 'Active Deliveries', icon: Package, badge: activeDelivery ? 1 : 0 },
    { href: '/driver/available-orders', label: 'Available Orders', icon: Bike },
    { href: '/driver/earnings', label: 'Earnings', icon: DollarSign },
    { href: '/driver/schedule', label: 'Schedule', icon: Calendar },
    { href: '/driver/settings', label: 'Settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-xl text-gray-900">Driver Portal</span>
            </Link>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-medium">Online</span>
              </div>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700 hidden sm:block">John Driver</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Sidebar */}
          <div className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-xl border border-gray-100 p-4 sticky top-24">
              <div className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition ${
                        isActive
                          ? 'bg-red-50 text-red-600'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon className="w-5 h-5" />
                        <span className="font-medium text-sm">{item.label}</span>
                      </div>
                      {item.badge ? (
                        <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      ) : null}
                    </Link>
                  )
                })}
              </div>
              <div className="border-t border-gray-100 mt-4 pt-4">
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-red-600 hover:bg-red-50 transition"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium text-sm">Logout</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content - Rest of the dashboard remains the same */}
          <div className="flex-1 space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <span className="text-xs text-gray-400">Today</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">${driverStats.todayEarnings}</div>
                <div className="text-xs text-gray-500 mt-1">+12% from yesterday</div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Package className="w-5 h-5 text-blue-600" />
                  </div>
                  <span className="text-xs text-gray-400">Today</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">{driverStats.deliveriesToday}</div>
                <div className="text-xs text-gray-500 mt-1">Deliveries completed</div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-yellow-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{driverStats.rating}</div>
                <div className="text-xs text-gray-500 mt-1">Rating ({driverStats.totalDeliveries} deliveries)</div>
              </div>
              
              <div className="bg-white rounded-xl p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-purple-600" />
                  </div>
                </div>
                <div className="text-2xl font-bold text-gray-900">{driverStats.onlineTime}</div>
                <div className="text-xs text-gray-500 mt-1">Online time</div>
              </div>
            </div>

            {/* Active Delivery Card */}
            {activeDelivery && (
              <div className="bg-gradient-to-r from-red-600 to-orange-500 rounded-xl p-5 text-white">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium">ACTIVE DELIVERY</span>
                  </div>
                  <span className="text-xs bg-white/20 px-2 py-1 rounded-full">Order #{activeDelivery.id}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-white/80">Pickup from</p>
                      <p className="font-medium">{activeDelivery.restaurant}</p>
                      <p className="text-xs text-white/70">{activeDelivery.restaurantAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <Navigation className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-white/80">Deliver to</p>
                      <p className="font-medium">{activeDelivery.customer}</p>
                      <p className="text-xs text-white/70">{activeDelivery.customerAddress}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between pt-4 border-t border-white/20">
                  <div>
                    <p className="text-xs text-white/80">Earnings</p>
                    <p className="font-bold text-lg">${activeDelivery.earnings}</p>
                  </div>
                  <div>
                    <p className="text-xs text-white/80">Pickup Code</p>
                    <p className="font-mono font-bold text-lg">{activeDelivery.pickupCode}</p>
                  </div>
                  <button 
                    onClick={() => setShowPickupModal(true)}
                    className="px-5 py-2 bg-white text-red-600 font-medium rounded-lg hover:bg-gray-100 transition"
                  >
                    {activeDelivery.status === 'pickup' ? 'Pick Up Order' : 'Start Delivery'}
                  </button>
                </div>
              </div>
            )}

            {/* Recent Earnings */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="flex items-center justify-between p-5 border-b border-gray-100">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  <h3 className="font-bold text-gray-900">Recent Earnings</h3>
                </div>
                <Link href="/driver/earnings" className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
                  View All <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
              <div className="divide-y divide-gray-100">
                {recentActivities.map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{activity.restaurant}</p>
                        <p className="text-xs text-gray-500">{activity.time} • {activity.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-600">+${activity.amount}</p>
                      <p className="text-xs text-gray-400">Completed</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Schedule & Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="w-5 h-5 text-gray-500" />
                  <h3 className="font-bold text-gray-900">Today's Schedule</h3>
                </div>
                <div className="space-y-3">
                  {upcomingSchedule.map((shift) => (
                    <div key={shift.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{shift.shift}</p>
                        <p className="text-xs text-gray-500">{shift.time}</p>
                      </div>
                      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full">Upcoming</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-white rounded-xl border border-gray-100 p-5">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="w-5 h-5 text-gray-500" />
                  <h3 className="font-bold text-gray-900">Performance</h3>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Acceptance Rate</span>
                      <span className="font-medium text-gray-900">{driverStats.acceptanceRate}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: `${driverStats.acceptanceRate}%` }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Completion Rate</span>
                      <span className="font-medium text-gray-900">100%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <span className="text-gray-600">This Week</span>
                    <span className="font-bold text-gray-900">${driverStats.weekEarnings}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">This Month</span>
                    <span className="font-bold text-gray-900">${driverStats.monthEarnings}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals remain the same as before */}
      {showPickupModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Pick Up Order</h3>
              <button onClick={() => setShowPickupModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Restaurant Location</span>
              </div>
              <p className="text-blue-700 text-sm">{activeDelivery.restaurantAddress}</p>
              <button className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700">
                <Navigation className="w-4 h-4" />
                Open in Maps
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Show this code to restaurant staff:</p>
              <p className="text-3xl font-mono font-bold text-gray-900 tracking-wider text-center py-2">
                {activeDelivery.pickupCode}
              </p>
            </div>
            <button 
              onClick={() => {
                setShowPickupModal(false)
                setShowDeliveryModal(true)
              }}
              className="w-full py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
            >
              Confirm Pickup
            </button>
          </div>
        </div>
      )}

      {showDeliveryModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Deliver to Customer</h3>
              <button onClick={() => setShowDeliveryModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <Navigation className="w-4 h-4 text-blue-600" />
                <span className="font-medium text-blue-900">Delivery Address</span>
              </div>
              <p className="text-blue-700 text-sm">{activeDelivery.customerAddress}</p>
              <div className="flex items-center gap-2 mt-3 pt-2 border-t border-blue-200">
                <Phone className="w-4 h-4 text-blue-600" />
                <span className="text-blue-700 text-sm">{activeDelivery.customerPhone}</span>
              </div>
              <button className="mt-3 flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 w-full justify-center">
                <Navigation className="w-4 h-4" />
                Start Navigation
              </button>
            </div>
            <button 
              onClick={() => {
                setShowDeliveryModal(false)
                setShowCompleteModal(true)
              }}
              className="w-full py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
            >
              Mark as Delivered
            </button>
          </div>
        </div>
      )}

      {showCompleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Delivery Complete!</h3>
            <p className="text-gray-500 mb-4">You earned <span className="font-bold text-green-600">${activeDelivery.earnings}</span></p>
            <button 
              onClick={() => setShowCompleteModal(false)}
              className="w-full py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}