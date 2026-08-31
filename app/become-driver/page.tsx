'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

// The driver application now lives in the dedicated, role-specific
// registration flow at /auth/signup/driver. This page redirects there
// so any old links keep working.
export default function BecomeDriverRedirect() {
  const router = useRouter()

  useEffect(() => {
    router.replace('/auth/signup/driver')
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500">Taking you to the driver sign-up…</p>
      </div>
    </div>
  )
}
