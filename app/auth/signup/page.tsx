'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  ArrowLeft,
  Bike,
  ShoppingBag,
  Store,
  Users,
  Shield,
  Zap,
  Award,
  ChevronRight,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'

interface RoleCard {
  href: string
  title: string
  subtitle: string
  description: string
  icon: LucideIcon
  gradient: string
  accent: string
  cta: string
  popular?: boolean
}

const roleCards: RoleCard[] = [
  {
    href: '/auth/signup/customer',
    title: 'Food Lover',
    subtitle: 'Order & Experience',
    description: 'Discover amazing restaurants, watch your meal being prepared live, and enjoy fast delivery. Get personalized recommendations based on your taste.',
    icon: ShoppingBag,
    gradient: 'from-rose-500 to-rose-700',
    accent: 'rose',
    cta: 'Start Ordering',
    popular: true,
  },
  {
    href: '/auth/signup/restaurant',
    title: 'Restaurant Partner',
    subtitle: 'Grow Your Business',
    description: 'List your restaurant, stream your kitchen live, and reach thousands of hungry customers. Get powerful insights and grow your revenue.',
    icon: Store,
    gradient: 'from-orange-500 to-orange-700',
    accent: 'orange',
    cta: 'Partner With Us',
  },
  {
    href: '/auth/signup/driver',
    title: 'Delivery Partner',
    subtitle: 'Earn on Your Terms',
    description: 'Enjoy flexible hours, competitive earnings, and weekly payouts. Join a community of delivery partners and earn on your schedule.',
    icon: Bike,
    gradient: 'from-emerald-500 to-emerald-700',
    accent: 'emerald',
    cta: 'Start Earning',
  },
]

export default function ChooseRolePage() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent -z-10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.03] -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Navigation */}
        <nav className="flex items-center justify-between mb-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to home
          </Link>
          <Link
            href="/auth/signin"
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Sign in →
          </Link>
        </nav>

        {/* Header */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 text-primary text-sm font-medium mb-6">
            <Users className="w-4 h-4" />
            Join 10,000+ happy users
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900 dark:text-white">
            Choose Your
            <span className="block text-primary mt-2">PlatePulse Journey</span>
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto">
            Whether you're craving amazing food, growing a restaurant, or earning on your terms — 
            we've built the perfect experience for you.
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid gap-8 lg:grid-cols-3">
          {roleCards.map((role) => {
            const Icon = role.icon
            const isHovered = hoveredCard === role.title
            const accentColors = {
              rose: 'hover:shadow-rose-200/50 dark:hover:shadow-rose-900/30',
              orange: 'hover:shadow-orange-200/50 dark:hover:shadow-orange-900/30',
              emerald: 'hover:shadow-emerald-200/50 dark:hover:shadow-emerald-900/30',
            }
            const accentBg = {
              rose: 'bg-rose-600 hover:bg-rose-700',
              orange: 'bg-orange-600 hover:bg-orange-700',
              emerald: 'bg-emerald-600 hover:bg-emerald-700',
            }

            return (
              <button
                key={role.href}
                type="button"
                onClick={() => router.push(role.href)}
                onMouseEnter={() => setHoveredCard(role.title)}
                onMouseLeave={() => setHoveredCard(null)}
                className={`group relative text-left bg-white dark:bg-gray-900/80 backdrop-blur-sm rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 ${accentColors[role.accent as keyof typeof accentColors]} border border-gray-200 dark:border-gray-800 flex flex-col ${
                  role.popular ? 'ring-2 ring-primary ring-offset-2 dark:ring-offset-gray-900' : ''
                }`}
              >
                {/* Popular Badge */}
                {role.popular && (
                  <div className="absolute top-4 right-4 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary text-white text-xs font-semibold shadow-lg shadow-primary/25">
                      <Award className="w-3 h-3" />
                      Most Popular
                    </span>
                  </div>
                )}

                {/* Gradient Header */}
                <div className={`relative h-48 bg-gradient-to-br ${role.gradient} overflow-hidden`}>
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0di00aC0ydjRoLTR2Mmg0djRoMnYtNGg0di0yaC00em0wLTMwVjBoLTJ2NGgtNHYyaDR2NGgydi00aDRWNGgtNHpNNiAzNHYtNEg0djRIMHYyaDR2NGgydi00aDR2LTJINnpNNiA0VjBINGg0SDJ2NGg0djJoNHYtNkg2eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20" />
                  <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
                  <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-black/10 rounded-full blur-3xl" />
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-6 rounded-3xl bg-white/20 backdrop-blur-sm shadow-lg">
                      <Icon className="w-20 h-20 text-white" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 flex flex-col flex-1">
                  {/* Title Section */}
                  <div className="mb-3">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      {role.subtitle}
                    </span>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                      {role.title}
                    </h2>
                  </div>

                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8 flex-1">
                    {role.description}
                  </p>

                  {/* CTA */}
                  <div className={`inline-flex items-center justify-between px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-300 ${accentBg[role.accent as keyof typeof accentBg]} shadow-lg shadow-${role.accent}-600/30`}>
                    <span>{role.cta}</span>
                    <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${
                      isHovered ? 'translate-x-1' : ''
                    }`} />
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center space-y-4">
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-primary" />
              Secure & Private
            </span>
            <span className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              Fast Setup
            </span>
            <span className="w-px h-4 bg-gray-300 dark:bg-gray-700" />
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" />
              24/7 Support
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}