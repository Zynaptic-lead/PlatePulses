'use client'

import Link from 'next/link'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { Smartphone, Store, Bike, Eye, CreditCard, Package, ArrowLeft } from 'lucide-react'

const steps = [
  {
    icon: Eye,
    title: '1. Watch Live',
    description: 'Browse restaurants with live kitchen streams and watch chefs prepare your food in real-time.',
    color: 'bg-red-500',
  },
  {
    icon: CreditCard,
    title: '2. Order',
    description: 'Select your favorite dishes, customize your order, and pay securely.',
    color: 'bg-orange-500',
  },
  {
    icon: Package,
    title: '3. Track',
    description: 'Watch your order being prepared live, then track your delivery driver in real-time.',
    color: 'bg-green-500',
  },
  {
    icon: Bike,
    title: '4. Enjoy',
    description: 'Receive your fresh, hot meal and enjoy knowing exactly how it was prepared.',
    color: 'bg-blue-500',
  },
]

const roles = [
  {
    title: 'For Customers',
    icon: Smartphone,
    features: [
      'Watch live kitchen streams',
      'Real-time order tracking',
      'Save favorite restaurants',
      'Rate your experience',
    ],
  },
  {
    title: 'For Restaurants',
    icon: Store,
    features: [
      'Stream your kitchen live',
      'Manage menu and orders',
      'Reach more customers',
      'Build trust and transparency',
    ],
  },
  {
    title: 'For Drivers',
    icon: Bike,
    features: [
      'Flexible delivery hours',
      'Real-time earnings',
      'In-app navigation',
      'Weekly payouts',
    ],
  },
]

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Hero */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="text-4xl font-bold mb-4">How PlatePulse Works</h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            The simplest way to order food with full transparency. Watch, order, track, and enjoy.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, i) => (
            <div key={i} className="text-center">
              <div className={`w-16 h-16 ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                <step.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-gray-500 text-sm">{step.description}</p>
            </div>
          ))}
        </div>

        {/* Roles */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, i) => (
            <div key={i} className="bg-gray-50 rounded-2xl p-6">
              <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center mb-4">
                <role.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">{role.title}</h3>
              <ul className="space-y-2">
                {role.features.map((feature, j) => (
                  <li key={j} className="text-gray-600 text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/auth/signup"
            className="px-8 py-3 bg-gray-900 text-white font-medium rounded-xl hover:bg-gray-800 transition inline-block"
          >
            Get Started Today
          </Link>
        </div>
      </div>
      
      <Footer />
    </div>
  )
}