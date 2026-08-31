'use client'

import Link from 'next/link'
import { ArrowLeft, Check, CheckCircle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

export type AccentName = 'blue' | 'orange' | 'green'

export interface Accent {
  gradient: string
  solid: string
  solidText: string
  text: string
  softBg: string
  softBorder: string
  chip: string
}

export const accents: Record<AccentName, Accent> = {
  blue: {
    gradient: 'from-blue-600 via-blue-600 to-indigo-700',
    solid: 'bg-blue-600 hover:bg-blue-700',
    solidText: 'text-blue-600',
    text: 'text-blue-600',
    softBg: 'bg-blue-50',
    softBorder: 'border-blue-100',
    chip: 'bg-blue-500',
  },
  orange: {
    gradient: 'from-orange-500 via-orange-500 to-red-600',
    solid: 'bg-orange-500 hover:bg-orange-600',
    solidText: 'text-orange-600',
    text: 'text-orange-600',
    softBg: 'bg-orange-50',
    softBorder: 'border-orange-100',
    chip: 'bg-orange-500',
  },
  green: {
    gradient: 'from-emerald-500 via-green-600 to-teal-700',
    solid: 'bg-emerald-600 hover:bg-emerald-700',
    solidText: 'text-emerald-600',
    text: 'text-emerald-600',
    softBg: 'bg-emerald-50',
    softBorder: 'border-emerald-100',
    chip: 'bg-emerald-500',
  },
}

// Shared input styling. Inputs use a neutral focus ring so accent colors
// can be applied reliably to buttons/branding without dynamic Tailwind classes.
export const baseInput =
  'w-full py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent text-gray-900 placeholder:text-gray-400 transition'
export const inputWithIcon = `pl-10 pr-3 ${baseInput}`
export const inputNoIcon = `px-3 ${baseInput}`

interface FieldShellProps {
  label: string
  icon?: LucideIcon
  hint?: string
  required?: boolean
  children: ReactNode
}

export function FieldShell({ label, icon: Icon, hint, required, children }: FieldShellProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        )}
        {children}
      </div>
      {hint && <p className="text-xs text-gray-400 mt-1.5">{hint}</p>}
    </div>
  )
}

interface Benefit {
  icon: LucideIcon
  title: string
  desc: string
}

interface RegistrationShellProps {
  accent: Accent
  icon: LucideIcon
  roleTitle: string
  tagline: string
  benefits: Benefit[]
  steps: string[]
  currentStep: number
  children: ReactNode
}

export function RegistrationShell({
  accent,
  icon: Icon,
  roleTitle,
  tagline,
  benefits,
  steps,
  currentStep,
  children,
}: RegistrationShellProps) {
  const progress = Math.round(((currentStep + 1) / steps.length) * 100)

  return (
    <div className="min-h-screen bg-gray-50 lg:grid lg:grid-cols-5">
      {/* Brand / info panel */}
      <aside
        className={`hidden lg:flex lg:col-span-2 flex-col justify-between p-10 bg-gradient-to-br ${accent.gradient} text-white relative overflow-hidden`}
      >
        <div className="absolute -top-16 -right-16 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -left-16 w-64 h-64 bg-black/10 rounded-full blur-3xl" />

        <div className="relative">
          <Link href="/" className="flex items-center gap-2 mb-12">
            <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">P</span>
            </div>
            <span className="font-bold text-xl">PlatePulse</span>
          </Link>

          <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mb-5">
            <Icon className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-3xl font-bold leading-tight">{roleTitle}</h1>
          <p className="text-white/80 mt-3 max-w-sm">{tagline}</p>

          <ul className="mt-8 space-y-4">
            {benefits.map((benefit) => {
              const BenefitIcon = benefit.icon
              return (
                <li key={benefit.title} className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-white/15 rounded-lg flex items-center justify-center shrink-0">
                    <BenefitIcon className="w-4.5 h-4.5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">{benefit.title}</p>
                    <p className="text-white/70 text-sm">{benefit.desc}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Vertical stepper */}
        <ol className="relative mt-10 space-y-4">
          {steps.map((step, index) => {
            const done = index < currentStep
            const active = index === currentStep
            return (
              <li key={step} className="flex items-center gap-3">
                <span
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                    done
                      ? 'bg-white text-gray-900'
                      : active
                        ? 'bg-white/90 text-gray-900 ring-4 ring-white/25'
                        : 'border border-white/40 text-white/70'
                  }`}
                >
                  {done ? <Check className="w-4 h-4" /> : index + 1}
                </span>
                <span className={`text-sm ${active ? 'font-semibold' : 'text-white/70'}`}>{step}</span>
              </li>
            )
          })}
        </ol>
      </aside>

      {/* Form area */}
      <main className="lg:col-span-3 flex flex-col">
        <div className="max-w-xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10 flex-1">
          <Link
            href="/auth/signup"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to role selection
          </Link>

          {/* Mobile progress */}
          <div className="lg:hidden mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="font-semibold text-gray-900">{steps[currentStep]}</span>
              <span className="text-gray-400">
                Step {currentStep + 1} of {steps.length}
              </span>
            </div>
            <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${accent.solid} rounded-full transition-all duration-300`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {children}
        </div>
      </main>
    </div>
  )
}

interface RegistrationSuccessProps {
  accent: Accent
  title: string
  message: string
  redirectText: string
}

export function RegistrationSuccess({ accent, title, message, redirectText }: RegistrationSuccessProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-8 text-center shadow-sm border border-gray-100">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
        <p className="text-gray-500 mb-4">{message}</p>
        <div className="bg-gray-50 rounded-xl p-4">
          <p className="text-sm text-gray-600">{redirectText}</p>
          <div className="w-full h-1 bg-gray-200 rounded-full mt-3 overflow-hidden">
            <div className={`h-full w-full ${accent.solid} rounded-full animate-pulse`} />
          </div>
        </div>
      </div>
    </div>
  )
}

interface NavButtonsProps {
  accent: Accent
  currentStep: number
  totalSteps: number
  loading?: boolean
  submitLabel: string
  onBack: () => void
  onNext: () => void
}

export function NavButtons({
  accent,
  currentStep,
  totalSteps,
  loading,
  submitLabel,
  onBack,
  onNext,
}: NavButtonsProps) {
  const isLast = currentStep === totalSteps - 1
  return (
    <div className="mt-8 flex flex-col-reverse sm:flex-row gap-3">
      {currentStep > 0 && (
        <button
          type="button"
          onClick={onBack}
          className="flex-1 py-2.5 border border-gray-200 rounded-lg text-gray-700 hover:bg-gray-50 transition"
        >
          Back
        </button>
      )}
      <button
        type={isLast ? 'submit' : 'button'}
        onClick={isLast ? undefined : onNext}
        disabled={loading}
        className={`flex-1 py-2.5 ${accent.solid} text-white font-medium rounded-lg transition disabled:opacity-50`}
      >
        {isLast ? (loading ? 'Submitting…' : submitLabel) : 'Continue'}
      </button>
    </div>
  )
}
