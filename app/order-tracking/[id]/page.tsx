'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'
import { 
  ArrowLeft, MapPin, Clock, Phone, User, CheckCircle, 
  Package, Truck, Bike, LayoutDashboard, Utensils
} from 'lucide-react'

export default function OrderTrackingPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.id as string
  const [orderStatus, setOrderStatus] = useState<'confirmed' | 'preparing' | 'ready' | 'out-for-delivery' | 'delivered'>('preparing')
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setOrderStatus('out-for-delivery')
    }, 4000)
    return () => clearTimeout(timer)
  }, [])

  const statuses = [
    { key: 'confirmed', label: 'Order Confirmed', description: 'Kitchen received your order', icon: CheckCircle },
    { key: 'preparing', label: 'Kitchen Preparing', description: 'Chef is cooking your meal', icon: Package },
    { key: 'ready', label: 'Ready for Driver Pickup', description: 'Driver is arriving at restaurant', icon: Clock },
    { key: 'out-for-delivery', label: 'Out for Delivery', description: 'Driver is on the way to your address', icon: Bike },
    { key: 'delivered', label: 'Delivered Hot & Fresh', description: 'Order completed!', icon: CheckCircle },
  ]

  const currentIndex = statuses.findIndex(s => s.key === orderStatus)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />

      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1 space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link 
            href="/customer/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white font-extrabold text-xs rounded-xl shadow-md transition hover:bg-black"
          >
            <LayoutDashboard className="w-4 h-4 text-red-500" />
            <span>Go to Customer Dashboard</span>
          </Link>

          <Link href="/restaurants" className="text-xs font-bold text-gray-500 hover:text-gray-900">
            Browse More Food →
          </Link>
        </div>

        {/* Order ID Banner */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-extrabold text-red-600 uppercase tracking-widest">LIVE GPS ORDER TRACKER</span>
            <h1 className="text-2xl font-black text-gray-900">Order #{orderId}</h1>
            <p className="text-xs text-gray-500 font-medium pt-0.5">Estimated Arrival: <strong>20 - 30 mins</strong></p>
          </div>

          <div className="px-4 py-2 bg-amber-100 text-amber-900 font-extrabold text-xs rounded-full flex items-center gap-2 animate-pulse">
            <span className="w-2 h-2 bg-amber-600 rounded-full animate-ping" />
            <span>{orderStatus === 'out-for-delivery' ? 'DRIVER ON THE WAY' : 'KITCHEN PREPARING'}</span>
          </div>
        </div>

        {/* Progress Tracker */}
        <div className="bg-white rounded-3xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
          <h2 className="text-lg font-extrabold text-gray-900">Delivery Status Timeline</h2>

          <div className="relative space-y-6">
            {statuses.map((status, idx) => {
              const isCompleted = idx < currentIndex
              const isActive = idx === currentIndex
              
              return (
                <div key={status.key} className="flex items-start gap-4 relative z-10">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-black text-sm shrink-0 shadow-md ${
                    isActive ? 'bg-red-600 text-white ring-4 ring-red-600/30' :
                    isCompleted ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {isCompleted ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                  </div>

                  <div className="flex-1 pt-1">
                    <h3 className={`font-extrabold text-sm ${
                      isActive ? 'text-red-600' : isCompleted ? 'text-emerald-700' : 'text-gray-500'
                    }`}>
                      {status.label}
                    </h3>
                    <p className="text-xs text-gray-400 font-medium">{status.description}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="pt-2 flex flex-col sm:flex-row gap-3">
          <Link 
            href="/customer/dashboard"
            className="flex-1 py-3.5 bg-gray-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <LayoutDashboard className="w-4 h-4 text-red-500" />
            <span>View All Orders in Customer Dashboard</span>
          </Link>

          <Link 
            href="/restaurants"
            className="py-3.5 px-6 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-2"
          >
            <Utensils className="w-4 h-4" /> Order More Food
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}