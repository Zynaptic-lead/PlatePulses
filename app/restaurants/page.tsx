'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../../components/layout/Header'
import { Search, Star, Clock, Truck, Video, Heart, Filter, MapPin, ChevronDown, ArrowLeft } from 'lucide-react'

const restaurants = [
  {
    id: 1,
    name: 'Pizza Heaven',
    cuisine: 'Italian • Pizza • Pasta',
    rating: 4.8,
    reviews: 2341,
    deliveryTime: 25,
    deliveryFee: 2.99,
    minOrder: 15,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format',
    isLive: true,
    isOpen: true,
    distance: '1.2 km',
    priceRange: '$$',
  },
  {
    id: 2,
    name: 'Sushi Master',
    cuisine: 'Japanese • Sushi • Asian',
    rating: 4.9,
    reviews: 1856,
    deliveryTime: 35,
    deliveryFee: 3.99,
    minOrder: 25,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format',
    isLive: false,
    isOpen: true,
    distance: '2.5 km',
    priceRange: '$$$',
  },
  {
    id: 3,
    name: 'Burger House',
    cuisine: 'American • Burgers • Fast Food',
    rating: 4.7,
    reviews: 3452,
    deliveryTime: 20,
    deliveryFee: 1.99,
    minOrder: 12,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format',
    isLive: true,
    isOpen: true,
    distance: '0.8 km',
    priceRange: '$',
  },
  {
    id: 4,
    name: 'Thai Spice',
    cuisine: 'Thai • Asian • Spicy',
    rating: 4.6,
    reviews: 1234,
    deliveryTime: 40,
    deliveryFee: 2.49,
    minOrder: 20,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format',
    isLive: false,
    isOpen: true,
    distance: '3.0 km',
    priceRange: '$$',
  },
]

export default function RestaurantsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [liked, setLiked] = useState<number[]>([])

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchQuery.toLowerCase())
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
        </div>
      </div>
    </div>
  )
}