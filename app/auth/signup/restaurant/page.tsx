'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authApi } from '../../../../lib/api'
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Store,
  MapPin,
  Utensils,
  Clock,
  FileText,
  Receipt,
  BarChart3,
  Video,
  DollarSign,
  Check,
  ArrowRight,
  Shield,
  Zap,
  Award,
  Loader2,
  CheckCircle,
  X,
  Store as StoreIcon,
  TrendingUp,
  Sparkles,
} from 'lucide-react'

const steps = ['Owner account', 'Restaurant', 'Verification', 'Review']

const cuisines = ['Italian', 'Japanese', 'American', 'Thai', 'Mexican', 'Mediterranean', 'Indian', 'Chinese', 'Other']
const priceRanges = [
  { value: '$', label: '$ · Budget' },
  { value: '$$', label: '$$ · Mid-range' },
  { value: '$$$', label: '$$$ · Premium' },
]

export default function RestaurantSignUpPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [progress, setProgress] = useState(0)
  const [restaurantName, setRestaurantName] = useState('')
  const [ownerName, setOwnerName] = useState('')

  const [form, setForm] = useState({
    ownerName: '',
    email: '',
    phone: '',
    password: '',
    restaurantName: '',
    cuisine: '',
    priceRange: '$$',
    restaurantPhone: '',
    address: '',
    city: '',
    openingHours: '',
    description: '',
    businessLicenseNumber: '',
    taxIdNumber: '',
    bankAccountName: '',
  })
  const [liveKitchen, setLiveKitchen] = useState(true)
  const [agree, setAgree] = useState(false)

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const validateStep = () => {
    if (step === 0) {
      if (!form.ownerName || !form.email || !form.phone || !form.password) {
        setError('Please complete your owner account details.')
        return false
      }
      if (form.password.length < 8) {
        setError('Password must be at least 8 characters.')
        return false
      }
    }
    if (step === 1) {
      if (!form.restaurantName || !form.cuisine || !form.restaurantPhone || !form.address || !form.city) {
        setError('Please complete your restaurant details.')
        return false
      }
    }
    if (step === 2) {
      if (!form.businessLicenseNumber || !form.taxIdNumber || !form.bankAccountName) {
        setError('Please complete the verification and payout details.')
        return false
      }
    }
    if (step === 3 && !agree) {
      setError('Please accept the partner terms to continue.')
      return false
    }
    setError('')
    return true
  }

  const handleNext = () => {
    if (validateStep()) setStep((s) => Math.min(s + 1, steps.length - 1))
  }
  const handleBack = () => {
    setError('')
    setStep((s) => Math.max(s - 1, 0))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateStep()) return
    
    setLoading(true)
    setError('')
    setRestaurantName(form.restaurantName)
    setOwnerName(form.ownerName)
    
    try {
      const res = await authApi.register({
        email: form.email,
        password: form.password,
        name: form.ownerName,
        phone: form.phone,
        role: 'RESTAURANT_OWNER',
      })

      localStorage.setItem('token', res.accessToken)
      localStorage.setItem('accessToken', res.accessToken)
      localStorage.setItem('user', JSON.stringify({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: 'restaurant_owner',
        restaurantName: form.restaurantName || `${res.user.name}'s Kitchen`,
        cuisine: form.cuisine || 'Gourmet',
        address: form.address ? `${form.address}, ${form.city}` : '',
        phone: form.phone,
        description: form.description || `Freshly prepared gourmet dishes made to order.`,
        isLoggedIn: true,
      }))

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
        router.push('/restaurant/dashboard')
      }, 2000)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Registration failed. Please check your details.')
      setLoading(false)
    }
  }

  const SummaryRow = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex justify-between gap-4 py-1">
      <span className="text-white/60">{label}</span>
      <span className="text-white text-right font-medium">{value || '—'}</span>
    </div>
  )

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
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 relative z-20 items-start">
          {/* Left Side - Brand & Benefits */}
          <div className="hidden lg:flex flex-col justify-center text-white space-y-6 p-8 bg-black/40 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl sticky top-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
                <Store className="w-4 h-4" />
                Restaurant Partner
              </div>
              <h1 className="text-5xl font-bold leading-tight mb-4">
                Partner your
                <br />
                <span className="bg-gradient-to-r from-orange-400 via-amber-400 to-yellow-400 bg-clip-text text-transparent">
                  Restaurant
                </span>
              </h1>
              <p className="text-white/90 text-lg max-w-md font-medium">
                Reach thousands of nearby diners, stream your kitchen live, and manage everything from one dashboard.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: Video, title: 'Go live', desc: 'Stream your kitchen and build customer trust.' },
                { icon: BarChart3, title: 'Powerful insights', desc: 'Track sales, ratings and popular dishes.' },
                { icon: DollarSign, title: 'Fast payouts', desc: 'Reliable weekly deposits to your account.' },
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

            <div className="flex items-center gap-4 text-white/60 text-xs pt-2 border-t border-white/10 pt-4">
              <span className="flex items-center gap-1">🛡️ Verified</span>
              <span className="w-px h-3 bg-white/20" />
              <span className="flex items-center gap-1">💰 Fast payouts</span>
              <span className="w-px h-3 bg-white/20" />
              <span className="flex items-center gap-1">📱 24/7 support</span>
            </div>
          </div>

          {/* Right Side - Glassmorphism Form */}
          <div className="relative">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-orange-400 to-amber-400 rounded-full opacity-20 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-400 rounded-full opacity-20 blur-2xl" />
            
            <div className="relative bg-black/30 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8">
              <div className="lg:hidden mb-6">
                <h2 className="text-2xl font-bold text-white">Partner your restaurant</h2>
                <p className="text-white/60 text-sm">Reach thousands of diners</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center gap-2 mb-6">
                  {steps.map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                        i === step 
                          ? 'bg-white text-gray-900 shadow-lg shadow-white/20' 
                          : i < step 
                            ? 'bg-orange-400/30 text-white border border-white/30' 
                            : 'bg-white/10 text-white/40 border border-white/10'
                      }`}>
                        {i < step ? <Check className="w-4 h-4" /> : i + 1}
                      </div>
                      {i < steps.length - 1 && (
                        <div className={`w-8 h-px ${i < step ? 'bg-orange-400/30' : 'bg-white/10'}`} />
                      )}
                    </div>
                  ))}
                  <span className="text-white/30 text-xs ml-2">
                    {step + 1} of {steps.length}
                  </span>
                </div>

                {step === 0 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Owner account</h3>
                      <p className="text-white/40 text-sm">This is who manages the restaurant on PlatePulse.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Owner full name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          name="ownerName"
                          value={form.ownerName}
                          onChange={update}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                          placeholder="Jane Owner"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={update}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                          placeholder="owner@restaurant.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Mobile number</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={update}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Password</label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type={showPassword ? 'text' : 'password'}
                          name="password"
                          value={form.password}
                          onChange={update}
                          className="w-full pl-10 pr-12 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
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
                      <h3 className="text-lg font-semibold text-white">About your restaurant</h3>
                      <p className="text-white/40 text-sm">Tell customers what makes your place special.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Restaurant name</label>
                      <div className="relative">
                        <StoreIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          name="restaurantName"
                          value={form.restaurantName}
                          onChange={update}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                          placeholder="Pizza Heaven"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1.5">Cuisine type</label>
                        <div className="relative">
                          <Utensils className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <select
                            name="cuisine"
                            value={form.cuisine}
                            onChange={update}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none appearance-none"
                          >
                            <option value="" className="text-gray-900">Select cuisine</option>
                            {cuisines.map((c) => (
                              <option key={c} value={c} className="text-gray-900">{c}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1.5">Price range</label>
                        <select
                          name="priceRange"
                          value={form.priceRange}
                          onChange={update}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none appearance-none"
                        >
                          {priceRanges.map((p) => (
                            <option key={p.value} value={p.value} className="text-gray-900">{p.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Restaurant phone</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          type="tel"
                          name="restaurantPhone"
                          value={form.restaurantPhone}
                          onChange={update}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                          placeholder="+1 234 567 8900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Street address</label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          name="address"
                          value={form.address}
                          onChange={update}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                          placeholder="123 Main Street"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1.5">City</label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
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
                        <label className="block text-sm font-medium text-white/80 mb-1.5">Opening hours</label>
                        <div className="relative">
                          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input
                            name="openingHours"
                            value={form.openingHours}
                            onChange={update}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                            placeholder="10:00 AM – 11:00 PM"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Short description</label>
                      <textarea
                        name="description"
                        value={form.description}
                        onChange={update}
                        rows={2}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none resize-none"
                        placeholder="Authentic wood-fired pizzas since 1985."
                      />
                    </div>

                    <label className="flex items-start gap-3 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 cursor-pointer backdrop-blur-sm">
                      <input
                        type="checkbox"
                        checked={liveKitchen}
                        onChange={(e) => setLiveKitchen(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/10 accent-orange-500"
                      />
                      <span className="text-sm text-white/80">
                        <span className="font-semibold flex items-center gap-1.5 text-white/90">
                          <Video className="w-4 h-4 text-orange-400" />
                          Enable live kitchen streaming
                        </span>
                        Let customers watch their food being prepared — our top-converting feature.
                      </span>
                    </label>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Verification & payouts</h3>
                      <p className="text-white/40 text-sm">We use this to verify your business and send your earnings.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Business license number</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          name="businessLicenseNumber"
                          value={form.businessLicenseNumber}
                          onChange={update}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                          placeholder="BL-2025-12345"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Tax ID number</label>
                      <div className="relative">
                        <Receipt className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          name="taxIdNumber"
                          value={form.taxIdNumber}
                          onChange={update}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                          placeholder="TAX-88901"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Bank account holder name</label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          name="bankAccountName"
                          value={form.bankAccountName}
                          onChange={update}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                          placeholder="Pizza Heaven LLC"
                        />
                      </div>
                    </div>

                    <div className="rounded-xl bg-blue-500/10 border border-blue-500/20 p-4 text-sm text-blue-200 backdrop-blur-sm">
                      🔒 Your documents are encrypted and only used for verification. A specialist will confirm your
                      account within 24–48 hours.
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Review your application</h3>
                      <p className="text-white/40 text-sm">Please double-check before submitting.</p>
                    </div>

                    <div className="rounded-2xl bg-white/5 backdrop-blur-sm p-4 text-sm border border-white/10">
                      <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Owner</p>
                      <SummaryRow label="Name" value={form.ownerName} />
                      <SummaryRow label="Email" value={form.email} />
                      <SummaryRow label="Phone" value={form.phone} />
                    </div>

                    <div className="rounded-2xl bg-white/5 backdrop-blur-sm p-4 text-sm border border-white/10">
                      <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Restaurant</p>
                      <SummaryRow label="Name" value={form.restaurantName} />
                      <SummaryRow label="Cuisine" value={form.cuisine} />
                      <SummaryRow label="Price range" value={form.priceRange} />
                      <SummaryRow label="Address" value={`${form.address}, ${form.city}`} />
                      <SummaryRow label="Hours" value={form.openingHours} />
                      <SummaryRow label="Live streaming" value={liveKitchen ? 'Enabled ✅' : 'Disabled'} />
                    </div>

                    <div className="rounded-2xl bg-white/5 backdrop-blur-sm p-4 text-sm border border-white/10">
                      <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Verification</p>
                      <SummaryRow label="Business license" value={form.businessLicenseNumber} />
                      <SummaryRow label="Tax ID" value={form.taxIdNumber} />
                      <SummaryRow label="Payout account" value={form.bankAccountName} />
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/10 accent-orange-500"
                      />
                      <span className="text-sm text-white/70">
                        I confirm the information is accurate and agree to the PlatePulse{' '}
                        <span className="text-orange-400 font-medium">Partner Terms</span> and commission structure.
                      </span>
                    </label>
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
                  {step < steps.length - 1 ? (
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
                          Submitting...
                        </>
                      ) : (
                        'Submit application'
                      )}
                    </button>
                  )}
                </div>

                <p className="text-center text-sm text-white/40 mt-4">
                  Already a partner?{' '}
                  <Link href="/auth/signin" className="text-white/80 hover:text-white font-medium transition-colors">
                    Sign in
                  </Link>
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setShowModal(false)}
          />
          
          <div className="relative bg-white dark:bg-gray-900 rounded-t-3xl w-full max-w-md mx-auto animate-slide-up overflow-hidden shadow-2xl">
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full" />
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-4 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            </button>

            <div className="p-6 pb-8 text-center">
              <div className="relative inline-block mb-4">
                <div className="w-20 h-20 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center animate-scale-in">
                  <Store className="w-10 h-10 text-orange-500" strokeWidth={1.5} />
                </div>
                <div className="absolute -top-1 -right-1 w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center animate-bounce-in">
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                </div>
              </div>

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                Application Received! 🍽️
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Thanks {ownerName}! <span className="font-semibold text-gray-700 dark:text-gray-300">{restaurantName}</span> is being reviewed.
              </p>

              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4 overflow-hidden">
                <div 
                  className="h-full bg-orange-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500">
                Redirecting to dashboard in {Math.ceil((100 - progress) / 33)}s
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2">
                <button
                  onClick={() => router.push('/restaurants')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 rounded-xl font-medium text-sm hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors"
                >
                  <TrendingUp className="w-4 h-4" />
                  View Dashboard
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