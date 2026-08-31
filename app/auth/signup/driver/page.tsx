'use client'

import { useState, useRef } from 'react'
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
  Bike,
  Car,
  Truck,
  MapPin,
  Calendar,
  FileText,
  Shield,
  Upload,
  CheckCircle,
  X,
  DollarSign,
  Clock,
  ArrowRight,
  Check,
  Sparkles,
  Video,
  Utensils,
  Loader2,
  FileCheck,
  Wallet,
  Navigation,
} from 'lucide-react'

const accent = 'emerald'
const steps = ['Personal', 'Vehicle', 'Documents', 'Review']

const vehicleTypes = [
  { id: 'bike', label: 'Bike', icon: Bike },
  { id: 'scooter', label: 'Scooter', icon: Truck },
  { id: 'car', label: 'Car', icon: Car },
]

type DocKey = 'license' | 'registration' | 'insurance'

export default function DriverSignUpPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [progress, setProgress] = useState(0)
  const [userName, setUserName] = useState('')

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    dateOfBirth: '',
    city: '',
    emergencyContact: '',
    vehicleType: 'bike',
    vehicleModel: '',
    vehiclePlate: '',
    licenseNumber: '',
    availability: 'full-time',
    insuranceProvider: '',
    insuranceNumber: '',
  })
  const [docs, setDocs] = useState<Record<DocKey, File | null>>({
    license: null,
    registration: null,
    insurance: null,
  })
  const [agree, setAgree] = useState(false)

  const refs: Record<DocKey, React.RefObject<HTMLInputElement | null>> = {
    license: useRef<HTMLInputElement | null>(null),
    registration: useRef<HTMLInputElement | null>(null),
    insurance: useRef<HTMLInputElement | null>(null),
  }

  const update = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const setDoc = (key: DocKey, file: File | null) => setDocs((prev) => ({ ...prev, [key]: file }))
  const allDocsUploaded = docs.license && docs.registration && docs.insurance

  const validateStep = () => {
    if (step === 0) {
      if (!form.fullName || !form.email || !form.phone || !form.password || !form.dateOfBirth || !form.city || !form.emergencyContact) {
        setError('Please complete all personal details.')
        return false
      }
      if (form.password.length < 8) {
        setError('Password must be at least 8 characters.')
        return false
      }
    }
    if (step === 1) {
      if (!form.vehicleModel || !form.vehiclePlate || !form.licenseNumber) {
        setError('Please complete your vehicle details.')
        return false
      }
    }
    if (step === 2) {
      if (!form.insuranceProvider || !form.insuranceNumber) {
        setError('Please add your insurance details.')
        return false
      }
      if (!allDocsUploaded) {
        setError('Please upload all three required documents.')
        return false
      }
    }
    if (step === 3 && !agree) {
      setError('Please accept the driver agreement to continue.')
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
    setUserName(form.fullName)
    
    try {
      const res = await authApi.register({
        email: form.email,
        password: form.password,
        name: form.fullName,
        phone: form.phone,
        role: 'DRIVER',
      })

      localStorage.setItem('token', res.accessToken)
      localStorage.setItem('accessToken', res.accessToken)
      localStorage.setItem('user', JSON.stringify({
        id: res.user.id,
        name: res.user.name,
        email: res.user.email,
        role: 'driver',
        isLoggedIn: true,
      }))
      localStorage.setItem('driverAuth', 'true')

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
        router.push('/driver/dashboard')
      }, 2000)
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
      setLoading(false)
    }
  }

  const DocUpload = ({ docKey, title }: { docKey: DocKey; title: string }) => {
    const file = docs[docKey]
    return (
      <>
        <input
          type="file"
          ref={refs[docKey]}
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={(e) => setDoc(docKey, e.target.files?.[0] || null)}
        />
        <div
          onClick={() => refs[docKey].current?.click()}
          className={`border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition backdrop-blur-sm ${
            file 
              ? 'border-emerald-400 bg-emerald-500/20' 
              : 'border-white/20 bg-white/5 hover:border-emerald-400 hover:bg-white/10'
          }`}
        >
          {file ? (
            <div>
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-1.5" />
              <p className="text-sm font-medium text-white">{title} uploaded</p>
              <p className="text-xs text-white/60 mt-0.5 truncate">{file.name}</p>
              <span className="mt-1 inline-block text-xs text-emerald-400 underline">Change file</span>
            </div>
          ) : (
            <div>
              <Upload className="w-8 h-8 text-white/40 mx-auto mb-1.5" />
              <p className="text-sm text-white/80">{title}</p>
              <p className="text-xs text-white/40 mt-0.5">JPG, PNG or PDF</p>
            </div>
          )}
        </div>
      </>
    )
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
        {/* Light overlays for readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/10 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-black/20" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900" />

        {/* Main Container */}
        <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 relative z-20 items-start">
          {/* Left Side - Brand & Benefits */}
          <div className="hidden lg:flex flex-col justify-center text-white space-y-6 p-8 bg-black/40 backdrop-blur-md rounded-3xl border border-white/20 shadow-2xl sticky top-8">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-sm font-medium mb-6">
                <Bike className="w-4 h-4" />
                Delivery Partner
              </div>
              <h1 className="text-5xl font-bold leading-tight mb-4">
                Deliver with
                <br />
                <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
                  PlatePulse
                </span>
              </h1>
              <p className="text-white/90 text-lg max-w-md font-medium">
                Earn on your own schedule with reliable weekly payouts and orders near you.
              </p>
            </div>

            <div className="space-y-3">
              {[
                { icon: DollarSign, title: 'Weekly payouts', desc: 'Get paid reliably, every week.' },
                { icon: Clock, title: 'Flexible hours', desc: 'Go online whenever it suits you.' },
                { icon: MapPin, title: 'Nearby orders', desc: 'Smart dispatch keeps trips short.' },
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
              <span className="flex items-center gap-1">💳 Weekly pay</span>
              <span className="w-px h-3 bg-white/20" />
              <span className="flex items-center gap-1">📱 24/7 support</span>
            </div>
          </div>

          {/* Right Side - Glassmorphism Form */}
          <div className="relative">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-full opacity-20 blur-2xl" />
            <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-gradient-to-br from-cyan-400 to-blue-400 rounded-full opacity-20 blur-2xl" />
            
            <div className="relative bg-black/30 backdrop-blur-xl rounded-3xl border border-white/20 shadow-2xl p-6 sm:p-8">
              <div className="lg:hidden mb-6">
                <h2 className="text-2xl font-bold text-white">Become a driver</h2>
                <p className="text-white/60 text-sm">Earn on your own schedule</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Step Indicator */}
                <div className="flex items-center gap-2 mb-6">
                  {steps.map((_, i) => (
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
                      {i < steps.length - 1 && (
                        <div className={`w-8 h-px ${i < step ? 'bg-emerald-400/30' : 'bg-white/10'}`} />
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
                      <h3 className="text-lg font-semibold text-white">Personal information</h3>
                      <p className="text-white/40 text-sm">Tell us a bit about yourself.</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Full name</label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          name="fullName"
                          value={form.fullName}
                          onChange={update}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                          placeholder="John Doe"
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
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1.5">Phone number</label>
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
                        <label className="block text-sm font-medium text-white/80 mb-1.5">Date of birth</label>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input
                            type="date"
                            name="dateOfBirth"
                            value={form.dateOfBirth}
                            onChange={update}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                          />
                        </div>
                      </div>
                    </div>

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
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Emergency contact</label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          name="emergencyContact"
                          value={form.emergencyContact}
                          onChange={update}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                          placeholder="Jane Doe • +1 234 567 8900"
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
                      <h3 className="text-lg font-semibold text-white">Vehicle details</h3>
                      <p className="text-white/40 text-sm">What will you be delivering with?</p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-2">Vehicle type</label>
                      <div className="grid grid-cols-3 gap-3">
                        {vehicleTypes.map((v) => {
                          const Icon = v.icon
                          const selected = form.vehicleType === v.id
                          return (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => setForm((prev) => ({ ...prev, vehicleType: v.id }))}
                              className={`p-3 rounded-xl border-2 transition ${
                                selected 
                                  ? 'border-emerald-400 bg-emerald-500/20' 
                                  : 'border-white/10 bg-white/5 hover:border-white/30'
                              }`}
                            >
                              <Icon className={`w-6 h-6 mx-auto mb-1 ${selected ? 'text-emerald-400' : 'text-white/60'}`} />
                              <span className={`text-xs ${selected ? 'text-white' : 'text-white/60'}`}>{v.label}</span>
                            </button>
                          )
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Vehicle model</label>
                      <input
                        name="vehicleModel"
                        value={form.vehicleModel}
                        onChange={update}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                        placeholder="Honda Activa / Toyota Corolla"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">License plate number</label>
                      <input
                        name="vehiclePlate"
                        value={form.vehiclePlate}
                        onChange={update}
                        className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                        placeholder="ABC-1234"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Driver's license number</label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <input
                          name="licenseNumber"
                          value={form.licenseNumber}
                          onChange={update}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                          placeholder="DL12345678"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-white/80 mb-1.5">Availability</label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                        <select
                          name="availability"
                          value={form.availability}
                          onChange={update}
                          className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none appearance-none"
                        >
                          <option value="full-time" className="text-gray-900">Full time</option>
                          <option value="part-time" className="text-gray-900">Part time</option>
                          <option value="weekends" className="text-gray-900">Weekends only</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Documents & insurance</h3>
                      <p className="text-white/40 text-sm">Required to keep you and customers safe.</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1.5">Insurance provider</label>
                        <div className="relative">
                          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                          <input
                            name="insuranceProvider"
                            value={form.insuranceProvider}
                            onChange={update}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                            placeholder="ABC Insurance"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-white/80 mb-1.5">Insurance number</label>
                        <input
                          name="insuranceNumber"
                          value={form.insuranceNumber}
                          onChange={update}
                          className="w-full px-4 py-2.5 rounded-xl bg-white/10 border border-white/10 text-white placeholder-white/30 focus:border-white/40 focus:ring-2 focus:ring-white/20 transition-all outline-none"
                          placeholder="INS-87654"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <DocUpload docKey="license" title="Driver's license (front & back)" />
                      <DocUpload docKey="registration" title="Vehicle registration" />
                      <DocUpload docKey="insurance" title="Insurance certificate" />
                    </div>

                    <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-4 text-sm text-emerald-200 backdrop-blur-sm">
                      📋 Documents must be clear and valid. Our team reviews applications within 24–48 hours.
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-lg font-semibold text-white">Review your application</h3>
                      <p className="text-white/40 text-sm">Make sure everything looks right.</p>
                    </div>

                    <div className="rounded-2xl bg-white/5 backdrop-blur-sm p-4 text-sm border border-white/10">
                      <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Personal</p>
                      <SummaryRow label="Name" value={form.fullName} />
                      <SummaryRow label="Email" value={form.email} />
                      <SummaryRow label="Phone" value={form.phone} />
                      <SummaryRow label="City" value={form.city} />
                      <SummaryRow label="Emergency contact" value={form.emergencyContact} />
                    </div>

                    <div className="rounded-2xl bg-white/5 backdrop-blur-sm p-4 text-sm border border-white/10">
                      <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Vehicle</p>
                      <SummaryRow label="Type" value={form.vehicleType} />
                      <SummaryRow label="Model" value={form.vehicleModel} />
                      <SummaryRow label="Plate" value={form.vehiclePlate} />
                      <SummaryRow label="License" value={form.licenseNumber} />
                      <SummaryRow label="Availability" value={form.availability} />
                    </div>

                    <div className="rounded-2xl bg-white/5 backdrop-blur-sm p-4 text-sm border border-white/10">
                      <p className="text-xs uppercase tracking-wide text-white/40 mb-2">Documents</p>
                      {(['license', 'registration', 'insurance'] as DocKey[]).map((key) => (
                        <div key={key} className="flex items-center gap-2 py-1">
                          {docs[key] ? (
                            <CheckCircle className="w-4 h-4 text-emerald-400" />
                          ) : (
                            <X className="w-4 h-4 text-red-400" />
                          )}
                          <span className="text-white/80 capitalize">{key}</span>
                        </div>
                      ))}
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="w-4 h-4 mt-0.5 rounded border-white/20 bg-white/10 accent-emerald-500"
                      />
                      <span className="text-sm text-white/70">
                        I confirm my details are accurate and agree to the PlatePulse{' '}
                        <span className="text-emerald-400 font-medium">Driver Agreement</span>.
                      </span>
                    </label>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-500/20 border border-red-500/30 text-red-200 text-sm rounded-xl backdrop-blur">
                    {error}
                  </div>
                )}

                {/* Navigation Buttons */}
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
                  Already driving with us?{' '}
                  <Link href="/driver/login" className="text-white/80 hover:text-white font-medium transition-colors">
                    Driver sign in
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
                Application Submitted! 🚗
              </h3>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">
                Thanks {userName}! Your driver application is being reviewed.
              </p>

              {/* Progress Bar */}
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-4 overflow-hidden">
                <div 
                  className="h-full bg-emerald-500 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="text-xs text-gray-400 dark:text-gray-500">
                Redirecting to dashboard in {Math.ceil((100 - progress) / 33)}s
              </p>

              {/* Quick Actions */}
              <div className="mt-6 grid grid-cols-2 gap-2">
                <button
                  onClick={() => router.push('/driver/dashboard')}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl font-medium text-sm hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                >
                  <Navigation className="w-4 h-4" />
                  Go to Dashboard
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