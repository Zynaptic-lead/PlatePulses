'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer'
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
  Bike
} from 'lucide-react'

// Restaurant data
const restaurants = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
    name: 'Thai Spice',
    cuisine: 'Thai',
    categories: ['Thai', 'Asian', 'Spicy'],
    rating: 4.6,
    reviews: 1234,
    deliveryTime: 40,
    deliveryFee: 2.49,
    minOrder: 20,
    image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=800&auto=format',
    isLive: false,
    isOpen: true,
    featured: false,
    chef: 'Somchai Rak',
    description: 'Authentic Thai street food recipes. Bold flavors, fresh ingredients.',
  },
  {
    id: 5,
    name: 'Mediterranean Grill',
    cuisine: 'Mediterranean',
    categories: ['Mediterranean', 'Greek', 'Healthy'],
    rating: 4.8,
    reviews: 987,
    deliveryTime: 30,
    deliveryFee: 2.99,
    minOrder: 18,
    image: 'https://images.unsplash.com/photo-1541518763669-27fef04b14d1?w=800&auto=format',
    isLive: true,
    isOpen: true,
    featured: false,
    chef: 'Elena Papadakis',
    description: 'Fresh Mediterranean cuisine with organic ingredients and traditional recipes.',
  },
  {
    id: 6,
    name: 'Taco Fiesta',
    cuisine: 'Mexican',
    categories: ['Mexican', 'Tacos', 'Grill'],
    rating: 4.5,
    reviews: 876,
    deliveryTime: 25,
    deliveryFee: 1.99,
    minOrder: 10,
    image: 'https://images.unsplash.com/photo-1599974579688-8dbdd335c77f?w=800&auto=format',
    isLive: false,
    isOpen: false,
    featured: false,
    chef: 'Carlos Mendez',
    description: 'Authentic Mexican street food. Made fresh daily with family recipes.',
  },
]

const categories = [
  { id: 'all', name: 'All' },
  { id: 'live', name: 'Live Now' },
  { id: 'italian', name: 'Italian' },
  { id: 'japanese', name: 'Japanese' },
  { id: 'american', name: 'American' },
  { id: 'thai', name: 'Thai' },
  { id: 'mexican', name: 'Mexican' },
]

const liveKitchensCount = restaurants.filter(r => r.isLive).length

export default function Home() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [liked, setLiked] = useState<number[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const toggleLike = (id: number, e: React.MouseEvent) => {
    e.stopPropagation()
    setLiked(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const filteredRestaurants = restaurants.filter(r => {
    if (activeCategory === 'live') return r.isLive
    if (activeCategory === 'all') return true
    if (activeCategory === 'italian') return r.cuisine === 'Italian'
    if (activeCategory === 'japanese') return r.cuisine === 'Japanese'
    if (activeCategory === 'american') return r.cuisine === 'American'
    if (activeCategory === 'thai') return r.cuisine === 'Thai'
    if (activeCategory === 'mexican') return r.cuisine === 'Mexican'
    return true
  }).filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()))

  const featuredRestaurants = restaurants.filter(r => r.featured)

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
                  <span className="text-sm font-medium text-red-600">
                    {liveKitchensCount} Kitchens Live Now
                  </span>
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
                    <Play className="w-4 h-4" />
                    Watch Live
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
              
              {/* Live Stream Preview Card */}
              <div className="relative">
                {liveKitchensCount > 0 ? (
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
                          <div className="bg-black/60 backdrop-blur-sm rounded-lg p-3">
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
                ) : (
                  <div className="bg-white rounded-2xl overflow-hidden shadow-xl border border-gray-100">
                    <div className="px-4 py-3 bg-gray-900">
                      <span className="text-xs font-medium text-gray-400">No Active Streams</span>
                    </div>
                    <div className="relative h-64 bg-gray-900 flex items-center justify-center">
                      <div className="text-center">
                        <Video className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400 text-sm">No live kitchens at the moment</p>
                        <p className="text-gray-500 text-xs mt-1">Check back during peak hours</p>
                      </div>
                    </div>
                    <div className="p-4 bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <Bell className="w-5 h-5 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-gray-900">Get notified</p>
                          <p className="text-xs text-gray-500">When kitchens go live</p>
                        </div>
                        <button className="px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg">
                          Notify Me
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute -top-3 -right-3 w-20 h-20 bg-red-500/10 rounded-full blur-xl"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Driver CTA Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                href="/driver/login" 
                className="px-6 py-2.5 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition whitespace-nowrap"
              >
                Apply Now →
              </Link>
            </div>
          </div>
        </section>

        {/* Search */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search restaurants, cuisines, or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </section>

        {/* Stats */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { value: liveKitchensCount.toString(), label: 'Live Kitchens', icon: Video, link: '/live-kitchens' },
              { value: '234', label: 'Active Orders', icon: Clock, link: '#' },
              { value: '10k+', label: 'Customers', icon: Users, link: '#' },
              { value: '4.9', label: 'Rating', icon: Star, link: '#' },
            ].map((stat, i) => (
              <Link
                key={i}
                href={stat.link}
                className="bg-gray-50 rounded-xl p-5 text-center hover:bg-gray-100 transition cursor-pointer"
              >
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center mx-auto mb-3 shadow-sm">
                  <stat.icon className="w-5 h-5 text-gray-700" />
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </Link>
            ))}
          </div>
        </section>

        {/* Categories */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Browse Categories</h2>
            <Link href="/restaurants" className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition ${
                  activeCategory === cat.id
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          {/* Show active filter indicator */}
          {activeCategory !== 'all' && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-500">
              <span>Showing:</span>
              <span className="font-medium text-gray-900">
                {categories.find(c => c.id === activeCategory)?.name}
              </span>
              <button 
                onClick={() => setActiveCategory('all')}
                className="text-red-600 hover:text-red-700 text-xs ml-2"
              >
                Clear filter
              </button>
            </div>
          )}
        </section>

        {/* Featured Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-500" />
              <h2 className="text-xl font-bold text-gray-900">Featured Restaurants</h2>
            </div>
            <Link href="/restaurants" className="text-sm text-gray-500 hover:text-gray-700">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.id}`}
                className="group bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-lg transition cursor-pointer"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
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
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-gray-900">{restaurant.name}</h3>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium text-gray-700">{restaurant.rating}</span>
                      <span className="text-xs text-gray-400 ml-0.5">({restaurant.reviews})</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">{restaurant.cuisine} • {restaurant.categories.slice(0, 2).join(' • ')}</p>
                  <p className="text-xs text-gray-400 mb-3 line-clamp-2">{restaurant.description}</p>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{restaurant.deliveryTime} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Truck className="w-3.5 h-3.5" />
                        <span>${restaurant.deliveryFee}</span>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition">
                      Order Now →
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Live Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link href="/live-kitchens" className="block">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 relative overflow-hidden hover:shadow-xl transition">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-orange-600/10 rounded-full blur-3xl"></div>
              <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
                    <Eye className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Live Kitchen Streaming</h3>
                    <p className="text-gray-400 text-sm">Watch your food being prepared in real-time</p>
                  </div>
                </div>
                <div className="px-6 py-2.5 bg-white text-gray-900 font-medium rounded-lg hover:bg-gray-100 transition">
                  Watch Live Now →
                </div>
              </div>
            </div>
          </Link>
        </section>

        {/* All Restaurants */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-16">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" />
              <h2 className="text-xl font-bold text-gray-900">Popular Near You</h2>
            </div>
            <Link href="/restaurants" className="text-sm text-gray-500 hover:text-gray-700">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                href={`/restaurants/${restaurant.id}`}
                className="group bg-white border border-gray-100 rounded-lg overflow-hidden hover:shadow-md transition cursor-pointer"
              >
                <div className="relative h-36 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  {restaurant.isLive && (
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-red-600 rounded text-[10px] font-medium text-white">
                      LIVE
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-start justify-between">
                    <h4 className="font-semibold text-gray-900 text-sm">{restaurant.name}</h4>
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs font-medium">{restaurant.rating}</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{restaurant.cuisine}</p>
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50">
                    <div className="flex items-center gap-2 text-[11px] text-gray-400">
                      <span>{restaurant.deliveryTime} min</span>
                      <span>•</span>
                      <span>${restaurant.deliveryFee}</span>
                    </div>
                    <div className="text-xs font-medium text-gray-900">Order</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}