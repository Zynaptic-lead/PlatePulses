'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import EmptyLiveState from '../../components/live/EmptyLiveState'
import { restaurantsApi } from '../../lib/api'
import { Video, Eye, Clock, Play, Star, ArrowLeft, Users, Flame } from 'lucide-react'

export default function LiveKitchensPage() {
  const [kitchens, setKitchens] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchLiveKitchens() {
      let liveKitchensList: any[] = []
      try {
        const data = await restaurantsApi.getAll()
        if (data && data.length > 0) {
          const liveOnly = data.filter((r: any) => r.isLive || r.liveStream?.isBroadcasting)
          if (liveOnly.length > 0) liveKitchensList = liveOnly
        }
      } catch (err) {}

      // Check registered user's custom kitchen live stream status
      const savedUser = localStorage.getItem('user')
      const savedLive = localStorage.getItem('liveStreamSettings')
      if (savedUser) {
        try {
          const u = JSON.parse(savedUser)
          if (u.restaurantName) {
            let isBroadcasting = true
            let caption = '🔥 Preparing fresh signature dishes live right now!'
            if (savedLive) {
              try {
                const parsedLive = JSON.parse(savedLive)
                isBroadcasting = parsedLive.isBroadcasting !== false
                if (parsedLive.caption) caption = parsedLive.caption
              } catch (e) {}
            }
            if (isBroadcasting) {
              const myKitchen = {
                id: '1',
                name: u.restaurantName,
                chefName: u.name || 'Head Chef',
                cuisine: u.cuisine || 'Gourmet Kitchen',
                rating: 'New Kitchen',
                image: u.restaurantImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format',
                isLive: true,
                liveStream: {
                  viewerCount: 1,
                  announcementText: caption
                }
              }
              liveKitchensList = [myKitchen, ...liveKitchensList.filter((k: any) => k.id !== '1')]
            }
          }
        } catch (e) {}
      }

      setKitchens(liveKitchensList)
      setLoading(false)
    }
    fetchLiveKitchens()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/" className="text-sm font-bold text-gray-500 hover:text-gray-900 flex items-center gap-1">
                <ArrowLeft className="w-4 h-4" /> Home
              </Link>
              <span className="text-gray-300">•</span>
              <span className="text-sm font-bold text-red-600 uppercase tracking-wider">Live Streams</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 tracking-tight">Live Kitchen Feeds</h1>
            <p className="text-sm text-gray-500 font-medium pt-1">
              Watch real-time HD kitchen streams from top local partner chefs as your food is prepared.
            </p>
          </div>

          <div className="px-4 py-2 bg-red-600 text-white font-extrabold text-xs rounded-full flex items-center gap-2 shadow-lg shadow-red-600/30 animate-pulse">
            <Video className="w-4 h-4" />
            <span>{kitchens.length} KITCHENS BROADCASTING</span>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-sm font-bold text-gray-500">Connecting to live kitchen camera feeds...</p>
          </div>
        ) : kitchens.length === 0 ? (
          <EmptyLiveState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {kitchens.map((kitchen) => (
              <div 
                key={kitchen.id}
                className="bg-white rounded-3xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col justify-between"
              >
                {/* Stream Video Thumbnail */}
                <div className="relative h-56 bg-gray-900 overflow-hidden">
                  <img 
                    src={kitchen.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format'} 
                    alt={kitchen.name} 
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />

                  {/* Live Badge Top Left */}
                  <div className="absolute top-4 left-4 px-3 py-1 bg-red-600 text-white font-black text-[11px] rounded-full flex items-center gap-1.5 shadow-lg">
                    <span className="w-2 h-2 bg-white rounded-full animate-ping" />
                    LIVE HD
                  </div>

                  {/* Viewer Count Top Right */}
                  <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 backdrop-blur-md text-white font-extrabold text-xs rounded-full flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-red-400" />
                    <span>{kitchen.liveStream?.viewerCount || 234} watching</span>
                  </div>

                  {/* Play Button Overlay */}
                  <Link 
                    href={`/live/${kitchen.id}`}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-14 h-14 bg-red-600/90 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl transition transform group-hover:scale-110">
                      <Play className="w-6 h-6 fill-white ml-1" />
                    </div>
                  </Link>
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <h3 className="text-xl font-extrabold text-gray-900 group-hover:text-red-600 transition">{kitchen.name}</h3>
                      <div className="flex items-center gap-1 text-xs font-extrabold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{kitchen.rating || 4.8}</span>
                      </div>
                    </div>
                    <p className="text-xs font-semibold text-gray-500 pt-0.5">{kitchen.chefName || 'Head Chef Mario'} • {kitchen.cuisine || 'Italian'}</p>
                  </div>

                  <div className="p-3 bg-red-50/60 rounded-2xl border border-red-100/60 text-xs font-bold text-red-900 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-red-600 shrink-0" />
                    <span className="truncate">{kitchen.liveStream?.announcementText || '🔥 Preparing fresh signature dishes live right now!'}</span>
                  </div>

                  <Link 
                    href={`/live/${kitchen.id}`}
                    className="w-full py-3 bg-gray-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
                  >
                    <Video className="w-4 h-4" /> Watch Live Stream & Order
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}