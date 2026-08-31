'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Bike, Mail, Lock, Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function DriverLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === 'driver@platepulse.com' && password === 'driver123') {
      localStorage.setItem('driverAuth', 'true')
      router.push('/driver/dashboard')
    } else {
      setError('Invalid email or password. Use driver@platepulse.com / driver123')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="max-w-md mx-auto w-full px-4 py-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-red-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Bike className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Driver Login</h1>
            <p className="text-gray-500 mt-1">Sign in to start delivering</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  placeholder="driver@platepulse.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-gray-900"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
            >
              Sign In
            </button>

            <div className="text-center text-sm text-gray-500">
              <p>Demo Credentials:</p>
              <p className="text-xs">Email: driver@platepulse.com</p>
              <p className="text-xs">Password: driver123</p>
            </div>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <Link href="/auth/signup/driver" className="text-sm text-red-600 hover:text-red-700">
              Don't have an account? Apply to become a driver
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}