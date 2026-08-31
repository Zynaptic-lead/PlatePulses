'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { 
  LayoutDashboard, UtensilsCrossed, Video, BarChart3, 
  Settings, LogOut, Bell, Shield, Radio, CheckCircle2,
  ChevronDown, Menu, X, ChefHat, Store, Clock, Power
} from 'lucide-react'

export default function RestaurantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [kitchenStatus, setKitchenStatus] = useState<'open' | 'busy' | 'closed'>('open')
  const [isLive, setIsLive] = useState(true)
  const [restaurantInfo, setRestaurantInfo] = useState({
    name: 'Pizza Heaven',
    chef: 'Chef Mario Rossi',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format'
  })

  const navigation = [
    { name: 'Order Management', href: '/restaurant/dashboard', icon: LayoutDashboard },
    { name: 'Menu & Inventory', href: '/restaurant/menu', icon: UtensilsCrossed },
    { name: 'Live Broadcast Studio', href: '/restaurant/live-stream', icon: Video, badge: isLive ? 'LIVE' : undefined },
    { name: 'Sales & Analytics', href: '/restaurant/analytics', icon: BarChart3 },
  ]

  const isActive = (path: string) => pathname === path

  const handleLogout = () => {
    localStorage.removeItem('user')
    router.push('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:static inset-y-0 left-0 z-50 w-72 bg-gray-900 text-white flex flex-col justify-between transform transition-transform duration-300 ease-in-out lg:transform-none
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div>
          {/* Brand Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-gray-800">
            <Link href="/restaurant/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/30">
                <ChefHat className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg text-white tracking-tight">PlatePulse</span>
                <span className="text-xs text-red-400 block font-medium">Partner Portal</span>
              </div>
            </Link>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Restaurant Profile Card */}
          <div className="p-4 mx-4 mt-4 bg-gray-800/60 rounded-xl border border-gray-800/80">
            <div className="flex items-center gap-3">
              <img 
                src={restaurantInfo.image} 
                alt={restaurantInfo.name} 
                className="w-12 h-12 rounded-lg object-cover ring-2 ring-red-500/30"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-white truncate">{restaurantInfo.name}</h4>
                <p className="text-xs text-gray-400 truncate">{restaurantInfo.chef}</p>
              </div>
            </div>
            
            {/* Quick Status Control */}
            <div className="mt-3 pt-3 border-t border-gray-800 flex items-center justify-between">
              <span className="text-xs text-gray-400 font-medium">Kitchen Status:</span>
              <select 
                value={kitchenStatus}
                onChange={(e) => setKitchenStatus(e.target.value as any)}
                className={`text-xs font-semibold px-2.5 py-1 rounded-full border border-transparent outline-none cursor-pointer ${
                  kitchenStatus === 'open' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                  kitchenStatus === 'busy' ? 'bg-amber-500/20 text-amber-400 border-amber-500/30' :
                  'bg-rose-500/20 text-rose-400 border-rose-500/30'
                }`}
              >
                <option value="open" className="bg-gray-900 text-emerald-400">🟢 Accepting Orders</option>
                <option value="busy" className="bg-gray-900 text-amber-400">🟡 High Demand</option>
                <option value="closed" className="bg-gray-900 text-rose-400">🔴 Kitchen Closed</option>
              </select>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon
              const active = isActive(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`
                    flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                    ${active 
                      ? 'bg-red-600 text-white shadow-lg shadow-red-600/25 font-semibold' 
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/80'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-gray-400'}`} />
                    <span>{item.name}</span>
                  </div>
                  {item.badge && (
                    <span className="px-2 py-0.5 text-[10px] font-extrabold tracking-wider bg-red-500 text-white rounded-full animate-pulse shadow-sm shadow-red-500">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Partner Management Dashboard</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Manage orders, kitchen staff, live broadcast, and menu listings</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Camera Quick Status */}
            <Link 
              href="/restaurant/live-stream"
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
                isLive 
                  ? 'bg-red-50 text-red-600 border-red-200 hover:bg-red-100' 
                  : 'bg-gray-100 text-gray-600 border-gray-200'
              }`}
            >
              <span className={`w-2.5 h-2.5 rounded-full ${isLive ? 'bg-red-600 animate-ping' : 'bg-gray-400'}`} />
              <Video className="w-3.5 h-3.5" />
              <span>{isLive ? 'Cam 01: Broadcasting' : 'Cam Offline'}</span>
            </Link>

            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full" />
            </button>

            {/* View Public Store */}
            <Link 
              href="/restaurants/1"
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
            >
              <Store className="w-3.5 h-3.5" />
              <span>View Public Store</span>
            </Link>
          </div>
        </header>

        {/* Page Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
