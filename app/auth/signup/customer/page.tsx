'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authApi, usersApi } from '../../../../lib/api'
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  MapPin,
  Home,
  ShoppingBag,
  Video,
  Clock,
  Sparkles,
  Check,
  ArrowRight,
  Utensils,
  CheckCircle,
  Store,
  Shield,
  Zap,
  Award,
  X,
  Loader2,
} from 'lucide-react'

const cuisineOptions = ['Italian', 'Japanese', 'American', 'Thai', 'Mexican', 'Mediterranean', 'Indian', 'Chinese']

export default function CustomerSignUpPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [progress, setProgress] = useState(0)
  const [userName, setUserName] = useState('')

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    address: '',
    city: '',
    deliveryNotes: '',
  })
  const [favorites, setFavorites] = useState<string[]>([])

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const toggleCuisine = (cuisine: string) => {
    setFavorites((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    )
  }

  const validateStep = () => {
    if (step === 0) {
      if (!form.firstName || !form.lastName || !form.email || !form.phone || !form.password) {
        setError('Please fill in all account fields.')
        return false
      }
      if (form.password.length < 8) {
        setError('Password must be at least 8 characters.')
        return false
      }
    }
    if (step === 1) {
      if (!form.address || !form.city) {
        setError('Please add your delivery address.')
        return false
      }
    }
    setError('')
    return true
  }

  const handleNext = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, 1))
  }

  const handleBack = () => {
    setError('')
    setStep((s) => Math.max(s - 0, 0))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep()) return
    
    setLoading(true)
    setError('')
    const name = `${form.firstName} ${form.lastName}`
    setUserName(name)
    
    try {
      const res = await authApi.register({
        email: form.email,
        password: form.password,
        name,
        phone: form.phone,
        role: 'CUSTOMER',
      })

      localStorage.setItem('token', res.accessToken)
      localStorage.setItem('accessToken', res.accessToken)
      localStorage.setItem('user', JSON.stringify({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        phone: form.phone,
        role: 'customer',
        isLoggedIn: true,
      }))

      // Save initial address if provided
      if (form.address) {
        const addrObj = {
          id: 'signup-addr-1',
          label: 'Home',
          street: form.address,
          apt: '',
          city: form.city || 'New York',
          zip: '10001',
          isDefault: true
        }
        localStorage.setItem('customerAddresses', JSON.stringify([addrObj]))
        try {
          await usersApi.addAddress({
            street: form.address,
            city: form.city || 'New York',
            zip: '10001',
            label: 'Home',
            isDefault: true
          })
        } catch (addrErr) {
          console.log('Address saved to local storage')
        }
      }

      setLoading(false)
      setShowModal(true)
      setProgress(0)
      
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 5
        })
      }, 50)

      setTimeout(() => {
        router.push('/customer/dashboard')
      }, 2000)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Registration failed. Please check your details.')
      setLoading(false)
    }
  }

  return (
    <>
      <div 
        className="min-h-screen relative overflow-hidden flex items-center justify-center p-4"
        style={{
          backgroundImage: `url('/images/food-collegee.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <div className="absolute inset-0 bg-linear-to-t from-black/40 via-black/10 to-black/20" />
        <div className="absolute inset-0 bg-linear-to-r from-black/30 via-transparent to-black/20" />
        <div className="absolute inset-0 -z-10 bg-linear-to-br from-gray-900 via-gray-800 to-gray-900" />

        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 relative z-20 items-center">
          {/* Left Side - Brand & Benefits */}
          <div className="hidden lg:flex flex-col justify-center text-white space-y-6 p-8 bg-black/40 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
                <Utensils className="w-4 h-4" />
                Food Lover
              </div>
              <h1 className="text-5xl font-bold leading-tight mb-4">
                Order food,
                <br />
                <span className="bg-linear-to-r from-orange-400 via-rose-400 to-pink-400 bg-clip-text text-transparent">
                  watch it live
                </span>
              </h1>
              <p className="text-white/90 text-lg max-w-md font-medium">
                Create your account to order from top restaurants and follow every step from kitchen to your door.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: Video, title: 'Live kitchen streams', desc: 'Watch chefs prepare your order in real time' },
                { icon: Clock, title: 'Fast delivery', desc: 'Track your order with 30-minute delivery' },
                { icon: Sparkles, title: 'Made for you', desc: 'Recommendations based on your favourite cuisines' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/20 transition-colors border border-white/5">
                  <div className="p-2 rounded-lg bg-white/20">
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm text-white/95">{item.title}</p>
                    <p className="text-white/80 text-xs">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 text-white/60 text-xs border-t border-white/10 pt-4">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3" />
                Secure
              </span>
              <span className="w-px h-3 bg-white/20" />
              <span className="flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Fast setup
              </span>
              <span className="w-px h-3 bg-white/20" />
              <span className="flex items-center gap-1">
                <Award className="w-3 h-3" />
                24/7 support
              </span>
            </div>
          </div>

          {/* Right Side - Glassmorphism Form */}
          <div className="relative">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-linear-to-br from-orange-400 to-rose-400 rounded-full opacity-20 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-linear-to-br from-blue-400 to-purple-400 rounded-full opacity-20 blur-2xl" />
            
            <div className="relative bg-black/30 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8">
              <div className="lg:hidden mb-6">
                <h2 className="text-2xl font-bold text-white">Create your account</h2>
                <p className="text-white/60 text-sm">Order food & watch it cooked live</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  {[0, 1].map((i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        i === step 
                          ? 'bg-white text-gray-900 shadow-lg shadow-white/20' 
                          : i < step 
                            ? 'bg-emerald-400/30 text-white border border-white/30' 
                            : 'bg-white/10 text-white/40 border border-white/10'
                      }`}>
                        {i < step ? <Check className="w-4 h-4" /> : i + 1}
                      </div>
                      {i < 1 && (
                        <div className={`w-12 h-px ${i < step ? 'bg-emerald-400/30' : 'bg-white/10'}`} />
                      )}
                    </div>
                  ))}
                  <span className="text-white/30 text-xs ml-2">
                    Step {step + 1} of 2
                  </span>
                </div>

                {step === 0 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Your account</h3>
                      <p className="text-white/40 text-sm">Let's start with the basics.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1.5">First name</label>
                        <input
                          name="firstName"
                          value={form.firstName}
                          onChange={update}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white font-bold placeholder-white/50 focus:border-red-500 transition-all outline-none"
                          placeholder="John"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1.5">Last name</label>
                        <input
                          name="lastName"
                          value={form.lastName}
                          onChange={update}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white font-bold placeholder-white/50 focus:border-red-500 transition-all outline-none"
                          placeholder="Doe"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={update}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white font-bold placeholder-white/50 focus:border-red-500 transition-all outline-none"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Phone number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={update}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white font-bold placeholder-white/50 focus:border-red-500 transition-all outline-none"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={form.password}
                          onChange={update}
                          className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-black/70 border border-white/20 text-white font-bold placeholder-white/50 focus:border-red-500 transition-all outline-none"
                          placeholder="••••••••"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/50 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                      <p className="text-white/30 text-xs mt-1">At least 8 characters</p>
                    </div>
                  </div>
                )}

                {step === 1 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Where should we deliver?</h3>
                      <p className="text-white/40 text-sm">Add your address and tell us what you love to eat.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Delivery address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          name="address"
                          value={form.address}
                          onChange={update}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                          placeholder="123 Main Street, Apt 4B"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">City</label>
                      <div className="relative">
                        <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          name="city"
                          value={form.city}
                          onChange={update}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                          placeholder="New York"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Delivery notes</label>
                      <textarea
                        name="deliveryNotes"
                        value={form.deliveryNotes}
                        onChange={update}
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none resize-none"
                        placeholder="Ring the doorbell twice"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">
                        Favourite cuisines <span className="text-white/30 font-normal">(optional)</span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {cuisineOptions.map((cuisine) => {
                          const selected = favorites.includes(cuisine)
                          return (
                            <button
                              key={cuisine}
                              type="button"
                              onClick={() => toggleCuisine(cuisine)}
                              className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all ${
                                selected
                                  ? 'bg-white text-gray-900 border-white shadow-lg shadow-white/20'
                                  : 'bg-white/10 text-white/70 border-white/10 hover:border-white/30 hover:bg-white/20'
                              }`}
                            >
                              {cuisine}
                            </button>
                          )
                        })}
                      </div>
                      <p className="text-white/30 text-xs mt-2">We'll use these to personalise your home feed.</p>
                    </div>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-200 text-sm rounded-xl backdrop-blur">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  {step > 0 && (
                    <button
                      type="button"
                      onClick={handleBack}
                      className="flex-1 px-6 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white/70 hover:bg-white/20 hover:text-white transition-all font-medium"
                    >
                      Back
                    </button>
                  )}
                  {step < 1 ? (
                    <button
                      type="button"
                      onClick={handleNext}
                      className="flex-1 px-6 py-2.5 rounded-xl bg-white text-gray-900 hover:bg-white/90 transition-all font-medium inline-flex items-center justify-center gap-2 shadow-lg shadow-white/20"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 px-6 py-2.5 rounded-xl bg-white text-gray-900 hover:bg-white/90 transition-all font-medium disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-white/20 inline-flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creating account...
                        </>
                      ) : (
                        'Create account'
                      )}
                    </button>
                  )}
                </div>

                <p className="text-center text-sm text-white/40 mt-4">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="text-white/80 hover:text-white font-medium transition-colors">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal - Slides up on the same page */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowModal(false)}
          />
          
          {/* Modal Content - Slides up from bottom */}
          <div className="relative bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md mx-auto animate-slide-up overflow-hidden shadow-2xl">
            {/* Drag handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>

            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            {/* Content */}
            <div className="p-6 pb-8 text-center">
              {/* Success Icon */}
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center animate-scale-in">
                  <CheckCircle className="w-10 h-10 text-emerald-500" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-emerald-500 rounded-full flex items-center justify-center animate-bounce-in">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Account Created! 🎉
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Welcome to PlatePulse, {userName}! Your account is ready to go.
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500">
                Redirecting to home in {Math.ceil((100 - progress) / 33)}s
              </p>

              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-2 gap-2">
                <button
                  onClick={() => router.push('/restaurants')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-medium text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                >
                  <Store className="w-4 h-4" />
                  Browse Food
                </button>
                <button
                  onClick={() => router.push('/profile')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-medium text-sm hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  Profile
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes scale-in {
          from { transform: scale(0); }
          to { transform: scale(1); }
        }
        @keyframes bounce-in {
          0% { transform: scale(0); }
          60% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.4s ease-out forwards;
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out forwards;
        }
      `}</style>
    </>
  )
}