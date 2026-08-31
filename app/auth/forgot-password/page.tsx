'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Mail, ArrowLeft } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    console.log('Reset password for:', email)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-md mx-auto px-4 py-16">
        {/* Back Button */}
        <Link href="/auth/signin" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-8">
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-500 mt-1">We'll send you a link to reset your password</p>
        </div>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
            >
              Send Reset Link
            </button>

            <p className="text-center text-sm text-gray-500 mt-6">
              Remember your password?{' '}
              <Link href="/auth/signin" className="text-red-600 hover:text-red-700 font-medium">
                Sign in
              </Link>
            </p>
          </form>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-500 mb-6">
              We've sent a password reset link to <span className="font-medium text-gray-900">{email}</span>
            </p>
            <Link
              href="/auth/signin"
              className="inline-block px-6 py-2.5 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800 transition"
            >
              Back to Sign In
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}