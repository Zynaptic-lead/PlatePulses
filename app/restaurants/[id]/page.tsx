'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'
import AuthGuardModal from '../../../components/auth/AuthGuardModal'
import { useCartStore } from '../../../store/useCartStore'
import { restaurantsApi } from '../../../lib/api'
import { 
  ArrowLeft, Star, Clock, Truck, Video, Heart, 
  ShoppingBag, Plus, Minus, MapPin, Phone, Share2,
  Check, AlertCircle, Sparkles, Flame, Search
} from 'lucide-react'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function RestaurantPage({ params }: PageProps) {
  const router = useRouter()
  const { addItem, getItemCount, getTotal } = useCartStore()
  const [restaurant, setRestaurant] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [addedItemName, setAddedItemName] = useState<string | null>(null)

  // Auth Guard Modal State
  const [showAuthGuard, setShowAuthGuard] = useState(false)
  const [targetDishName, setTargetDishName] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    params.then(async ({ id }) => {
      try {
        const data = await restaurantsApi.getById(id)
        setRestaurant(data)
      } catch (err) {
        console.error('Failed to load restaurant from backend:', err)
        // Fallback mock
        setRestaurant({
          id: id,
          name: 'Pizza Heaven',
          cuisine: 'Italian',
          rating: 4.8,
          reviewsCount: 2341,
          deliveryTime: 25,
          deliveryFee: 2.99,
          minOrder: 15,
          image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format',
          isLive: true,
          isOpen: true,
          chefName: 'Chef Mario Rossi',
          description: 'Authentic Neapolitan pizzas baked in wood-fired oven. Family recipe since 1985.',
          menuItems: [
            { id: 'ITEM-01', name: 'Wood-Fired Margherita Pizza', price: 18.50, description: 'San Marzano tomatoes, fresh mozzarella di bufala, organic basil', isPopular: true, inStock: true },
            { id: 'ITEM-02', name: 'Quattro Formaggi Pizza', price: 21.00, description: 'Mozzarella, gorgonzola, parmesan, fontina cheese', isPopular: true, inStock: true },
            { id: 'ITEM-03', name: 'Diablo Spicy Pepperoni', price: 20.50, description: 'Double spicy artisan pepperoni, hot honey drizzle', isSpicy: true, inStock: true },
            { id: 'ITEM-04', name: 'Truffle Garlic Breadsticks', price: 9.00, description: 'Freshly baked dough sticks with black truffle oil', isVegetarian: true, inStock: true },
          ]
        })
      } finally {
        setLoading(false)
      }
    })
  }, [params])

  // Protected Add To Cart Handler
  const handleAddToCart = (item: any) => {
    // Check if user is logged in
    const user = typeof window !== 'undefined' ? localStorage.getItem('user') : null
    if (!user) {
      setTargetDishName(item.name)
      setShowAuthGuard(true)
      return
    }

    // Add item to Zustand cart
    addItem({
      id: item.id.toString(),
      name: item.name,
      price: Number(item.price),
      quantity: 1,
      restaurantId: restaurant.id.toString(),
      image: item.image || restaurant.image
    })

    setAddedItemName(item.name)
    setTimeout(() => setAddedItemName(null), 2000)
  }

  const toggleWishlist = () => {
    setLiked(!liked)
    if (!restaurant) return
    const currentRaw = localStorage.getItem('customerWishlist')
    let current: any[] = []
    if (currentRaw) {
      try { current = JSON.parse(currentRaw) } catch (e) {}
    }

    if (!liked) {
      const newEntry = {
        id: restaurant.id,
        name: restaurant.name,
        cuisine: restaurant.cuisine + ' • ' + (restaurant.description || 'Gourmet cuisine'),
        image: restaurant.image,
        rating: restaurant.rating || 4.8,
        type: 'restaurant'
      }
      const updated = [newEntry, ...current.filter((c: any) => c.id !== restaurant.id)]
      localStorage.setItem('customerWishlist', JSON.stringify(updated))
    } else {
      const updated = current.filter((c: any) => c.id !== restaurant.id)
      localStorage.setItem('customerWishlist', JSON.stringify(updated))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Header />
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-bold text-gray-500">Loading menu & live kitchen status...</p>
        </div>
        <Footer />
      </div>
    )
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
        <Header />
        <div className="max-w-md mx-auto my-16 text-center space-y-4 p-8 bg-white rounded-3xl border border-gray-100 shadow-xs">
          <AlertCircle className="w-12 h-12 text-rose-500 mx-auto" />
          <h2 className="text-xl font-bold text-gray-900">Restaurant Not Found</h2>
          <Link href="/restaurants" className="px-6 py-2.5 bg-gray-900 text-white font-bold text-xs rounded-xl inline-block">
            Back to Directory
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  const menu = (restaurant.menuItems || restaurant.menu || []).filter((item: any) => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />

      <main className="flex-1 pb-16">
        {/* Banner Image */}
        <div className="relative h-72 sm:h-96 w-full bg-gray-900 overflow-hidden">
          <img 
            src={restaurant.image} 
            alt={restaurant.name} 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/40 to-transparent" />

          {/* Top Bar Navigation */}
          <div className="absolute top-6 left-4 right-4 max-w-7xl mx-auto flex items-center justify-between">
            <Link href="/restaurants" className="p-2.5 bg-white/80 hover:bg-white backdrop-blur-md rounded-2xl text-gray-900 shadow-lg transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2">
              <button onClick={toggleWishlist} className="p-2.5 bg-white/80 hover:bg-white backdrop-blur-md rounded-2xl text-rose-600 shadow-lg transition flex items-center gap-1.5 font-bold text-xs">
                <Heart className={`w-5 h-5 ${liked ? 'fill-rose-600' : ''}`} />
                <span>{liked ? 'Saved to Wishlist' : 'Add to Wishlist'}</span>
              </button>
            </div>
          </div>

          {/* Restaurant Overlay Info */}
          <div className="absolute bottom-6 left-4 right-4 max-w-7xl mx-auto text-white space-y-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-red-600 font-extrabold text-[10px] uppercase tracking-wider rounded-full">
                {restaurant.cuisine}
              </span>
              {restaurant.isLive && (
                <Link href={`/live/${restaurant.id}`} className="px-3 py-1 bg-white text-gray-900 font-extrabold text-[10px] uppercase tracking-wider rounded-full flex items-center gap-1.5 hover:bg-gray-100 transition">
                  <div className="w-1.5 h-1.5 bg-red-600 rounded-full animate-ping" />
                  <span>Watch Live Kitchen</span>
                </Link>
              )}
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">{restaurant.name}</h1>
            <p className="text-xs text-gray-300 max-w-xl font-medium">{restaurant.description}</p>
          </div>
        </div>

        {/* Quick Details Bar */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold text-gray-700">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-1.5">
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="font-bold text-gray-900">{restaurant.rating}</span>
                <span className="text-gray-400">({restaurant.reviewsCount || 2341} reviews)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gray-400" />
                <span>{restaurant.deliveryTime} mins</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-gray-400" />
                <span>${restaurant.deliveryFee.toFixed(2)} delivery</span>
              </div>
            </div>

            {restaurant.chefName && (
              <div className="flex items-center gap-2 bg-red-50 px-3 py-1.5 rounded-xl border border-red-100 text-red-700">
                <span className="font-bold">Head Chef: {restaurant.chefName}</span>
              </div>
            )}
          </div>
        </div>

        {/* Notification Toast for Added Item */}
        {addedItemName && (
          <div className="fixed bottom-6 right-6 z-40 bg-gray-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom duration-300">
            <Check className="w-5 h-5 text-emerald-400" />
            <div className="text-xs">
              <p className="font-bold">{addedItemName}</p>
              <p className="text-gray-400">Added to your shopping bag!</p>
            </div>
            <Link href="/cart" className="ml-2 underline font-bold text-red-400 text-xs">View Cart</Link>
          </div>
        )}

        {/* Menu Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-gray-200 pb-4 gap-4">
            <div>
              <h2 className="text-2xl font-extrabold text-gray-900">Menu & Related Food Choices</h2>
              <p className="text-xs text-gray-500 font-medium pt-1">Search or filter through dishes and add your favorites to cart.</p>
            </div>
            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input 
                type="text"
                placeholder="Search related food choices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl text-xs outline-none font-bold text-gray-900 placeholder:text-gray-400 focus:border-gray-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {menu.map((dish: any) => (
              <div 
                key={dish.id}
                className="bg-white p-5 rounded-2xl border border-gray-200 hover:shadow-md transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900 text-base">{dish.name}</h3>
                    {dish.isPopular && (
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[10px] font-extrabold rounded-md flex items-center gap-0.5">
                        <Sparkles className="w-3 h-3 text-amber-600" /> Popular
                      </span>
                    )}
                    {dish.isSpicy && (
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 text-[10px] font-extrabold rounded-md flex items-center gap-0.5">
                        <Flame className="w-3 h-3 text-red-600" /> Spicy
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 line-clamp-2">{dish.description}</p>
                  <p className="text-base font-extrabold text-gray-900 pt-1">${Number(dish.price).toFixed(2)}</p>
                </div>

                <button 
                  onClick={() => handleAddToCart(dish)}
                  className="w-full sm:w-auto px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-xl shadow-md shadow-red-600/20 transition flex items-center justify-center gap-1.5 shrink-0"
                >
                  <Plus className="w-4 h-4" /> Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Floating Bottom Cart Bar */}
      {getItemCount() > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-30 bg-white border-t border-gray-200 p-4 shadow-2xl">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 text-white rounded-xl flex items-center justify-center font-extrabold text-sm shadow-md">
                {getItemCount()}
              </div>
              <div>
                <p className="text-xs text-gray-500">Total Amount</p>
                <p className="text-lg font-extrabold text-gray-900">${getTotal().toFixed(2)}</p>
              </div>
            </div>
            <Link 
              href="/cart"
              className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/25 transition flex items-center gap-2"
            >
              <span>View Shopping Cart</span>
              <ShoppingBag className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Auth Protection Guard Modal */}
      <AuthGuardModal 
        isOpen={showAuthGuard}
        onClose={() => setShowAuthGuard(false)}
        itemName={targetDishName}
      />

      <Footer />
    </div>
  )
}