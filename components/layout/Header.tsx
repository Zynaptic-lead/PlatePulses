'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Menu, X, User, LogOut, ShoppingBag, Heart, LayoutDashboard } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [user, setUser] = useState<{ name: string; email: string; role: string } | null>(null)
  const [avatar, setAvatar] = useState<string>('')
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    }
    const savedAvatar = localStorage.getItem('customerAvatar')
    if (savedAvatar) {
      setAvatar(savedAvatar)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    router.push('/')
  }

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/restaurants', label: 'Restaurants' },
    { href: '/live-kitchens', label: 'Live Kitchens' },
    { href: '/how-it-works', label: 'How It Works' },
  ]

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl text-gray-900 hidden sm:inline-block">PlatePulse</span>
            <span className="font-bold text-xl text-gray-900 sm:hidden">PP</span>
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition ${
                  isActive(link.href)
                    ? 'text-gray-900 font-semibold'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>
          
          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href={
                    user.role === 'driver' ? '/driver/dashboard' :
                    user.role === 'restaurant_owner' ? '/restaurant/dashboard' :
                    '/customer/dashboard'
                  }
                  className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-md shadow-red-600/20 transition flex items-center gap-1.5"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>My Dashboard</span>
                </Link>

                {user.role === 'customer' && (
                  <>
                    <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-lg transition relative">
                      <ShoppingBag className="w-5 h-5 text-gray-600" />
                    </Link>
                  </>
                )}
                <div className="relative group">
                  <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-xl transition">
                    {avatar ? (
                      <img src={avatar} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-red-600/50 shadow-sm" />
                    ) : (
                      <div className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center font-black text-xs shadow-sm">
                        {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                      </div>
                    )}
                    <span className="text-xs font-bold text-gray-800">{user.name.split(' ')[0]}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden invisible group-hover:visible transition-all">
                    <div className="p-2">
                      <p className="px-3 py-2 text-sm text-gray-500 border-b border-gray-100">
                        Signed in as <span className="font-medium text-gray-900">{user.email}</span>
                      </p>
                      {user.role === 'customer' && (
                        <Link href="/customer/dashboard" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                          My Dashboard
                        </Link>
                      )}
                      {user.role === 'driver' && (
                        <Link href="/driver/dashboard" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                          Dashboard
                        </Link>
                      )}
                      {user.role === 'restaurant_owner' && (
                        <Link href="/restaurant/dashboard" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                          Dashboard
                        </Link>
                      )}
                      <Link href="/profile" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                        Profile
                      </Link>
                      <Link href="/orders" className="block px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg">
                        My Orders
                      </Link>
                      <button 
                        onClick={handleLogout}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-gray-900" /> : <Menu className="w-6 h-6 text-gray-900" />}
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4 space-y-2 bg-white">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className={`block px-4 py-3 text-base font-medium rounded-lg transition ${
                  isActive(link.href)
                    ? 'bg-gray-100 text-gray-900 font-semibold'
                    : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {user ? (
              <>
                <div className="px-4 py-2 border-t border-gray-100 mt-2 pt-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  {user.role === 'customer' && (
                    <div className="flex gap-2 mb-3">
                      <Link href="/customer/dashboard" className="flex-1 text-center px-3 py-2 bg-gray-900 text-white font-bold rounded-lg text-xs">Dashboard</Link>
                      <Link href="/cart" className="flex-1 text-center px-3 py-2 bg-gray-100 rounded-lg text-xs font-bold">Cart</Link>
                      <Link href="/orders" className="flex-1 text-center px-3 py-2 bg-gray-100 rounded-lg text-xs font-bold">Orders</Link>
                    </div>
                  )}
                  {user.role === 'driver' && (
                    <Link href="/driver/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Dashboard</Link>
                  )}
                  {user.role === 'restaurant_owner' && (
                    <Link href="/restaurant/dashboard" className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-lg">Dashboard</Link>
                  )}
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="pt-3 space-y-2 border-t border-gray-100 mt-2">
                <Link
                  href="/auth/signin"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-lg"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-base font-medium bg-gray-900 text-white rounded-lg text-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}