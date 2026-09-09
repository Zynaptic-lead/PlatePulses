'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../../components/layout/Header'
import { Search, Star, Clock, Truck, Video, Heart, Filter, MapPin, ChevronDown, ArrowLeft, Utensils } from 'lucide-react'

const restaurants: any[] = []

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [liked, setLiked] = useState<number[]>([])
  const [allRestaurants, setAllRestaurants] = useState<any[]>([])

  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser)
        if (u.restaurantName) {
          const myRest = {
            id: 1,
            name: u.restaurantName,
            cuisine: u.cuisine || 'Gourmet Kitchen',
            rating: 0.0,
            reviews: 0,
            deliveryTime: 20,
            deliveryFee: 2.99,
            minOrder: 15,
            image: u.restaurantImage || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format',
            isLive: true,
            isOpen: true,
            distance: '0.5 km',
            priceRange: '$$',
          }
          setAllRestaurants([myRest])
        }
      } catch (e) {}
    }
  }, [])

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const filteredRestaurants = allRestaurants.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.cuisine.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Home */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
          <p className="text-gray-500 mt-1">Discover the best restaurants near you</p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by restaurant, cuisine, or dish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white"
            />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            <Filter className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Filters</span>
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition">
            <MapPin className="w-5 h-5 text-gray-600" />
            <span className="text-gray-700">Delivery Address</span>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">{filteredRestaurants.length} restaurants found</p>
        </div>

        {/* Restaurant Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant) => (
            <Link
              key={restaurant.id}
              href={`/restaurants/${restaurant.id}`}
              className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition cursor-pointer border border-gray-100"
            >
              <div className="relative h-48 overflow-hidden">
                <img
                  src={restaurant.image}
                  alt={restaurant.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  loading="lazy"
                />
                {restaurant.isLive && (
                  <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-red-600 rounded-lg">
                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-white">LIVE</span>
                    <Video className="w-3 h-3 text-white" />
                  </div>
                )}
                <button
                  onClick={(e) => toggleLike(restaurant.id, e)}
                  className="absolute top-3 right-3 p-1.5 bg-white rounded-full shadow-sm hover:scale-110 transition"
                >
                  <Heart className={`w-4 h-4 ${liked.includes(restaurant.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                </button>
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-xs text-white">
                  {restaurant.distance}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900">{restaurant.name}</h3>
                    <p className="text-sm text-gray-500">{restaurant.cuisine}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{restaurant.rating}</span>
                    <span className="text-xs text-gray-400 ml-0.5">({restaurant.reviews})</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                  <span className="px-2 py-0.5 bg-gray-100 rounded">{restaurant.priceRange}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{restaurant.deliveryTime} min</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5" />
                    <span>${restaurant.deliveryFee}</span>
                  </div>
                </div>
                <button className="w-full mt-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition">
                  View Menu
                </button>
              </div>
            </Link>
          ))}

          {filteredRestaurants.length === 0 && (
            <div className="col-span-full py-16 px-6 text-center bg-white rounded-2xl border border-dashed border-gray-300 space-y-3">
              <Utensils className="w-12 h-12 text-gray-300 mx-auto" />
              <h3 className="text-base font-bold text-gray-900">No restaurants available yet</h3>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">Register your restaurant to publish your digital kitchen storefront!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}