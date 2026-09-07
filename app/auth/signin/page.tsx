'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Mail, Lock, ArrowLeft, Eye, EyeOff, LogIn } from 'lucide-react'
import { authApi } from '../../../lib/api'

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // Call NestJS Backend Auth REST API
      const res = await authApi.login(email, password)
      
      // Save JWT Token & User Profile in localStorage
      localStorage.setItem('token', res.accessToken)
      localStorage.setItem('accessToken', res.accessToken)
      localStorage.setItem('user', JSON.stringify({
        id: res.user.id,
        email: res.user.email,
        name: res.user.name,
        role: res.user.role.toLowerCase(),
        isLoggedIn: true
      }))

      // Redirect based on role
      const userRole = res.user.role.toUpperCase()
      if (userRole === 'DRIVER') {
        router.push('/driver/dashboard')
      } else if (userRole === 'RESTAURANT_OWNER') {
        router.push('/restaurant/dashboard')
      } else {
        router.push('/customer/dashboard')
      }
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Quick fill demo credentials
  const fillDemo = (demoEmail: string) => {
    setEmail(demoEmail)
    setPassword('password123')
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Back Button */}
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6 font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to home
        </Link>

        {/* Card */}
        <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-red-600/30">
              <span className="text-white font-black text-2xl">P</span>
            </div>
            <h1 className="text-2xl font-extrabold text-gray-900">Welcome Back</h1>
            <p className="text-xs text-gray-500 font-medium">Sign in to access your dashboard, order history & digital wallet</p>
          </div>

          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm outline-none focus:border-gray-900 font-bold text-gray-900 placeholder:text-gray-400"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-xs font-bold text-gray-700 uppercase">Password</label>
                <Link href="/auth/forgot-password" className="text-xs font-bold text-red-600 hover:underline">
                  Forgot Password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-300 rounded-xl text-sm outline-none focus:border-gray-900 font-bold text-gray-900 placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/25 transition flex items-center justify-center gap-2"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Quick Demo Credentials Assistant */}
          <div className="pt-4 border-t border-gray-100 space-y-2 text-center">
            <p className="text-[11px] font-bold text-gray-400 uppercase">Quick Demo Login Shortcuts</p>
            <div className="flex flex-wrap gap-2 justify-center text-xs font-semibold">
              <button 
                onClick={() => fillDemo('customer@platepulse.com')}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                Customer
              </button>
              <button 
                onClick={() => fillDemo('driver@platepulse.com')}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                Driver
              </button>
              <button 
                onClick={() => fillDemo('restaurant@platepulse.com')}
                className="px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
              >
                Restaurant
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 pt-2">
            Don't have an account?{' '}
            <Link href="/auth/signup" className="font-extrabold text-red-600 hover:underline">
              Get Started Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}