'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
import { restaurantsApi } from '../lib/api'
import { 
  Search, 
  Star, 
  Clock, 
  Truck, 
  Video, 
  Heart, 
  Eye,
  Shield,
  Users,
  TrendingUp,
  Flame,
  Play,
  ArrowRight,
  Bell,
  Bike,
  Utensils
} from 'lucide-react'

// Default fallback restaurants data
const defaultRestaurants = [
  {
    id: '1',
    name: 'Pizza Heaven',
    cuisine: 'Italian',
    categories: ['Pizza', 'Pasta', 'Italian'],
    rating: 4.8,
    reviews: 2341,
    deliveryTime: 25,
    deliveryFee: 2.99,
    minOrder: 15,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format',
    isLive: true,
    isOpen: true,
    featured: true,
    chef: 'Mario Rossi',
    description: 'Authentic Neapolitan pizzas baked in wood-fired oven. Family recipe since 1985.',
  },
  {
    id: '2',
    name: 'Sushi Master',
    cuisine: 'Japanese',
    categories: ['Sushi', 'Japanese', 'Asian'],
    rating: 4.9,
    reviews: 1856,
    deliveryTime: 35,
    deliveryFee: 3.99,
    minOrder: 25,
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&auto=format',
    isLive: false,
    isOpen: true,
    featured: true,
    chef: 'Kenji Tanaka',
    description: 'Premium sushi made with fresh fish flown in daily from Tokyo markets.',
  },
  {
    id: '3',
    name: 'Burger House',
    cuisine: 'American',
    categories: ['Burgers', 'American', 'Fast Food'],
    rating: 4.7,
    reviews: 3452,
    deliveryTime: 20,
    deliveryFee: 1.99,
    minOrder: 12,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&auto=format',
    isLive: true,
    isOpen: true,
    featured: true,
    chef: 'Sarah Johnson',
    description: 'Gourmet burgers with grass-fed beef, fresh toppings, and secret sauce.',
  },
  {
    id: '4',
    name: 'Thai Spice',
    cuisine: 'Thai',
    categories: ['Thai', 'Asian', 'Curry'],
    rating: 4.6,
    reviews: 980,
    deliveryTime: 40,
    deliveryFee: 2.49,
    minOrder: 20,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format',
    isLive: false,
    isOpen: true,
    featured: false,
    chef: 'Somchai Prasert',
    description: 'Authentic Thai street food with traditional herbs and custom spice levels.',
  },
  {
    id: '5',
    name: 'Mediterranean Grill',
    cuisine: 'Mediterranean',
    categories: ['Greek', 'Mediterranean', 'Healthy'],
    rating: 4.8,
    reviews: 1420,
    deliveryTime: 30,
    deliveryFee: 2.99,
    minOrder: 18,
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14d1?w=800&auto=format',
    isLive: true,
    isOpen: true,
    featured: true,
    chef: 'Elena Papadopoulos',
    description: 'Fresh gyro platters, falafel, hummus, and house-made pita bread.',
  },
  {
    id: '6',
    name: 'Taco Fiesta',
    cuisine: 'Mexican',
    categories: ['Mexican', 'Tacos', 'Burritos'],
    rating: 4.5,
    reviews: 2100,
    deliveryTime: 25,
    deliveryFee: 1.99,
    minOrder: 10,
    image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800&auto=format',
    isLive: false,
    isOpen: true,
    featured: false,
    chef: 'Carlos Rodriguez',
    description: 'Street-style tacos with slow-cooked meats, fresh salsas, and hand-pressed tortillas.',
  },
]

const categories = [
  { id: 'all', name: 'All' },
  { id: 'live', name: 'Live Now 🔴' },
  { id: 'Italian', name: 'Italian 🍕' },
  { id: 'Japanese', name: 'Japanese 🍣' },
  { id: 'American', name: 'American 🍔' },
  { id: 'Thai', name: 'Thai 🍜' },
  { id: 'Mexican', name: 'Mexican 🌮' },
  { id: 'Mediterranean', name: 'Mediterranean 🥙' },
]

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [liked, setLiked] = useState<string[]>([])
  const [restaurantsList, setRestaurantsList] = useState<any[]>(defaultRestaurants)

  // Fetch live backend restaurants if available
  useEffect(() => {
    async function loadRestaurants() {
      try {
        const liveData = await restaurantsApi.getAll()
        if (liveData && liveData.length > 0) {
          const formatted = liveData.map((r: any) => ({
            id: r.id.toString(),
            name: r.name,
            cuisine: r.cuisine || 'Italian',
            categories: [r.cuisine || 'Food', 'Popular'],
            rating: r.rating || 4.8,
            reviews: r.reviewsCount || 1200,
            deliveryTime: r.deliveryTime || 25,
            deliveryFee: r.deliveryFee || 2.99,
            minOrder: r.minOrder || 15,
            image: r.image || 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format',
            isLive: r.isLive || r.liveStream?.isBroadcasting || false,
            isOpen: r.isOpen !== undefined ? r.isOpen : true,
            featured: true,
            chef: r.chefName || 'Head Chef',
            description: r.description || 'Authentic gourmet food made fresh to order.',
          }))
        }
      } catch (err) {
        console.log('Using default client restaurants list')
      }

      // Merge user custom restaurant if logged in as restaurant
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        try {
          const u = JSON.parse(savedUser)
          if (u.restaurantName) {
            const myRest = {
              id: '1',
              name: u.restaurantName,
              cuisine: u.cuisine || 'Gourmet',
              categories: [u.cuisine || 'Gourmet', 'Popular'],
              rating: 0.0,
              reviews: 0,
              deliveryTime: 20,
              deliveryFee: 2.99,
              minOrder: 15,
              image: u.restaurantImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format',
              isLive: true,
              isOpen: true,
              featured: true,
              chef: u.name || 'Head Chef',
              description: u.description || 'Freshly prepared gourmet dishes made to order.',
            }
            setRestaurantsList(prev => [myRest, ...prev.filter(r => r.id !== '1')])
          }
        } catch (e) {}
      }
    }
    loadRestaurants()
  }, [])

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    setLiked((prev) => 
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    )
  }

  // Unified Filter logic
  const filteredRestaurants = restaurantsList.filter((restaurant) => {
    // Search query filter
    const matchesSearch = 
      restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.cuisine.toLowerCase().includes(searchQuery.toLowerCase()) ||
      restaurant.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    // Category pill filter
    if (activeCategory === 'all') return matchesSearch
    if (activeCategory === 'live') return matchesSearch && restaurant.isLive
    return matchesSearch && (restaurant.cuisine.toLowerCase() === activeCategory.toLowerCase() || restaurant.categories.includes(activeCategory))
  })

  const liveKitchensCount = restaurantsList.filter(r => r.isLive).length

  // Reliable image fallback handler
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format'
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <Link 
                  href="/live-kitchens"
                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 rounded-full mb-6 hover:bg-red-100 transition"
                >
                  <div className="w-2 h-2 bg-red-600 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-red-600">{liveKitchensCount} Kitchens Live Now</span>
                  <ArrowRight className="w-3 h-3 text-red-600" />
                </Link>

                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 tracking-tight mb-4">
                  Watch Your Food
                  <span className="text-red-600 block">Come to Life</span>
                </h1>

                <p className="text-lg text-gray-600 mb-8 max-w-lg">
                  Experience live kitchen streaming. Watch chefs prepare your meal in real-time. Fresh, transparent, and delivered to your door.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/restaurants"
                    className="px-6 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition shadow-sm"
                  >
                    Order Now
                  </Link>
                  <Link
                    href="/live-kitchens"
                    className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-xl hover:bg-gray-50 transition flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" /> Watch Live
                  </Link>
                </div>

                <div className="flex items-center gap-6 mt-8">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">100% Secure</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">30-min Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-green-600" />
                    <span className="text-sm text-gray-600">10k+ Customers</span>
                  </div>
                </div>
              </div>

              {/* Featured Live Preview Card */}
              <div className="relative">
                <Link href="/live-kitchens" className="block">
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100 hover:shadow-2xl transition">
                    <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-xs font-medium text-white">LIVE STREAM</span>
                      </div>
                      <span className="text-xs text-gray-400">{liveKitchensCount} active kitchens</span>
                    </div>
                    <div className="relative h-64 bg-gray-900">
                      <img 
                        src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format" 
                        onError={handleImageError}
                        alt="Chef preparing pizza" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-red-600 rounded-lg">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-white">LIVE</span>
                        <Video className="w-3 h-3 text-white" />
                      </div>
                      <div className="absolute bottom-3 left-3 right-3">
                        <div className="bg-black/60 backdrop-blur-xs rounded-lg p-3">
                          <p className="text-white font-medium text-sm">Chef Mario preparing Margherita Pizza</p>
                          <p className="text-gray-300 text-xs mt-0.5">Order #PP-2341 • Ready in 8 min</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Eye className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Watch live kitchen streams</p>
                          <p className="text-xs text-gray-500">See your food being prepared in real-time</p>
                        </div>
                        <div className="px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg">
                          Watch Now
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className="absolute -top-3 -right-3 w-20 h-20 bg-red-500/10 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Driver Recruitment Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-red-600/20 rounded-full blur-3xl"></div>
            <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                  <Bike className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">Earn Money as a Driver</h3>
                  <p className="text-gray-300 text-sm">Flexible hours, weekly payouts, and great earnings</p>
                </div>
              </div>
              <Link
                href="/become-driver"
                className="px-6 py-2.5 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100 transition whitespace-nowrap text-xs"
              >
                Apply Now →
              </Link>
            </div>
          </div>
        </section>

        {/* Search Bar */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search restaurants, cuisines, or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-400 font-medium"
            />
          </div>
        </section>

        {/* ── UNIFIED CATEGORIES & RESTAURANTS SECTION ── */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gray-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <Flame className="w-5 h-5 text-orange-500" />
                <h2 className="text-2xl font-extrabold text-gray-900">Explore Restaurants & Cuisines</h2>
              </div>
              <p className="text-xs text-gray-500 font-medium pt-1">Filter top restaurants by cuisine or click any category to view menu choices.</p>
            </div>
            <Link href="/restaurants" className="text-xs font-extrabold text-red-600 hover:underline flex items-center gap-1">
              View All Restaurants ({restaurantsList.length}) <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Category Filter Pills */}
          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold whitespace-nowrap transition-all shadow-xs ${
                  activeCategory === cat.id
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/25 ring-2 ring-red-600'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Filter Status Badge */}
          {activeCategory !== 'all' && (
            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl border border-red-100 text-xs font-bold text-red-800">
              <span>Showing results for: <strong>{categories.find(c => c.id === activeCategory)?.name}</strong> ({filteredRestaurants.length} found)</span>
              <button onClick={() => setActiveCategory('all')} className="underline font-bold text-red-600">Show All</button>
            </div>
          )}

          {/* Filtered Restaurants Grid */}
          {filteredRestaurants.length === 0 ? (
            <div className="py-16 text-center space-y-3 bg-gray-50 rounded-3xl border border-gray-200">
              <Utensils className="w-12 h-12 text-gray-300 mx-auto" />
              <p className="text-sm font-bold text-gray-700">No restaurants match your selected filter.</p>
              <button onClick={() => { setActiveCategory('all'); setSearchQuery(''); }} className="px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-xl">
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRestaurants.map((restaurant) => (
                <Link
                  key={restaurant.id}
                  href={`/restaurants/${restaurant.id}`}
                  className="group bg-white border border-gray-200 rounded-3xl overflow-hidden hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  <div className="relative h-48 overflow-hidden bg-gray-100">
                    <img
                      src={restaurant.image}
                      onError={handleImageError}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    {restaurant.isLive && (
                      <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 bg-red-600 text-white font-extrabold text-[10px] rounded-full shadow-lg">
                        <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                        <span>LIVE STREAM</span>
                        <Video className="w-3 h-3 text-white" />
                      </div>
                    )}
                    <button
                      onClick={(e) => toggleLike(restaurant.id, e)}
                      className="absolute top-3 right-3 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition transform hover:scale-110"
                    >
                      <Heart className={`w-4 h-4 ${liked.includes(restaurant.id) ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-red-600 transition">{restaurant.name}</h3>
                      <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-100 text-xs font-extrabold text-amber-700">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{restaurant.rating}</span>
                      </div>
                    </div>

                    <p className="text-xs font-semibold text-gray-500">{restaurant.cuisine} • {restaurant.chef}</p>
                    <p className="text-xs text-gray-400 line-clamp-2">{restaurant.description}</p>

                    <div className="flex items-center justify-between pt-3 border-t border-gray-100 text-xs text-gray-500 font-semibold">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-gray-400" /> {restaurant.deliveryTime} min</span>
                        <span className="flex items-center gap-1"><Truck className="w-3.5 h-3.5 text-gray-400" /> ${restaurant.deliveryFee.toFixed(2)}</span>
                      </div>
                      <span className="font-extrabold text-red-600 group-hover:underline">Order Now →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  )
}