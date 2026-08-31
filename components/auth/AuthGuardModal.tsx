'use client'

import Link from 'next/link'
import { ShoppingBag, Lock, X, ArrowRight, UserPlus, LogIn } from 'lucide-react'

interface AuthGuardModalProps {
  isOpen: boolean
  onClose: () => void
  itemName?: string
}

export default function AuthGuardModal({ isOpen, onClose, itemName }: AuthGuardModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 bg-gray-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100 text-center animate-in fade-in zoom-in duration-200 relative">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-900 rounded-full hover:bg-gray-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-red-50/50 shadow-inner">
          <Lock className="w-8 h-8 text-red-600" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold text-red-600 uppercase tracking-wider">SIGN IN REQUIRED</span>
          <h3 className="text-2xl font-extrabold text-gray-900">Sign In to Add to Cart</h3>
          <p className="text-xs text-gray-500 max-w-xs mx-auto leading-relaxed">
            {itemName ? (
              <>Sign in to add <strong className="text-gray-900">{itemName}</strong> to your shopping bag and place your order.</>
            ) : (
              <>Browse restaurants and watch live streams freely! To order meals and add items to your cart, please sign in to your account.</>
            )}
          </p>
        </div>

        <div className="space-y-3 pt-2">
          <Link
            href="/auth/signin"
            onClick={onClose}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-red-600/25 transition flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In to Continue</span>
          </Link>

          <Link
            href="/auth/signup"
            onClick={onClose}
            className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-extrabold text-sm rounded-xl shadow-md transition flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create New Free Account</span>
          </Link>
        </div>

        <p className="text-[11px] text-gray-400 font-medium">
          New users receive a <strong className="text-emerald-600">$50 Welcome Bonus</strong> in their digital wallet! 🎁
        </p>
      </div>
    </div>
  )
}
