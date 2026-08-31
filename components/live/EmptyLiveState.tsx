'use client'

import Link from 'next/link'
import { Video, Clock, Bell } from 'lucide-react'

export default function EmptyLiveState() {
  return (
    <div className="text-center py-16">
      <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <Video className="w-12 h-12 text-gray-400" />
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">No Live Streams Right Now</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">
        No restaurants are currently streaming. Check back later or explore our restaurants.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href="/restaurants"
          className="px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
        >
          Browse Restaurants
        </Link>
        <button className="px-6 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-2">
          <Bell className="w-4 h-4" />
          Notify Me When Live
        </button>
      </div>
    </div>
  )
}