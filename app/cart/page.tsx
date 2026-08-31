'use client'

import { useState } from 'react'
import Link from 'next/link'
import Header from '../../components/layout/Header'
import Footer from '../../components/layout/Footer'
import { useCartStore } from '../../store/useCartStore'
import { 
  ShoppingBag, Trash2, Plus, Minus, ArrowRight, ArrowLeft, 
  Tag, ShieldCheck, Clock, Truck, ChefHat, Sparkles, AlertCircle
} from 'lucide-react'

export default function CartPage() {
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore()
  const [promoCode, setPromoCode] = useState('')
  const [discountPercent, setDiscountPercent] = useState(0)
  const [promoError, setPromoError] = useState('')
  const [promoSuccess, setPromoSuccess] = useState('')

  const subtotal = getTotal()
  const deliveryFee = subtotal > 0 ? 2.99 : 0
  const serviceFee = subtotal > 0 ? 1.50 : 0
  const discount = (subtotal * discountPercent) / 100
  const grandTotal = Math.max(0, subtotal + deliveryFee + serviceFee - discount)

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault()
    setPromoError('')
    setPromoSuccess('')

    if (promoCode.trim().toUpperCase() === 'PLATE10') {
      setDiscountPercent(10)
      setPromoSuccess('10% Discount applied successfully!')
    } else if (promoCode.trim().toUpperCase() === 'WELCOME20') {
      setDiscountPercent(20)
      setPromoSuccess('20% Welcome Discount applied!')
    } else {
      setPromoError('Invalid promo code. Try "PLATE10" or "WELCOME20"')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between">
      <Header />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">YOUR BAG</span>
            <h1 className="text-3xl font-extrabold text-gray-900">Shopping Cart</h1>
          </div>
          {items.length > 0 && (
            <button 
              onClick={() => clearCart()}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 px-3.5 py-2 rounded-xl transition flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" /> Clear Cart
            </button>
          )}
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-xs max-w-xl mx-auto my-8 space-y-4">
            <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your cart is currently empty</h2>
            <p className="text-sm text-gray-500 max-w-md mx-auto">
              Looks like you haven't added any delicious meals yet. Explore top wood-fired pizzas, gourmet burgers, and live kitchens nearby!
            </p>
            <div className="pt-2">
              <Link 
                href="/restaurants"
                className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg shadow-red-600/25 transition"
              >
                <span>Explore Restaurants</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left 2 Columns: Items List */}
            <div className="lg:col-span-2 space-y-4">
              {/* Restaurant Header */}
              <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 text-red-600 rounded-xl flex items-center justify-center font-bold">
                    <ChefHat className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">Pizza Heaven</h3>
                    <p className="text-xs text-gray-500">Estimated delivery: 25 - 35 mins</p>
                  </div>
                </div>
                <Link href="/restaurants/1" className="text-xs font-bold text-red-600 hover:underline">
                  + Add More Items
                </Link>
              </div>

              {/* Items Card List */}
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden divide-y divide-gray-100">
                {items.map((item) => (
                  <div key={item.id} className="p-5 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 hover:bg-gray-50/50 transition">
                    <div className="flex items-center gap-4">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-20 h-20 rounded-2xl object-cover ring-1 ring-gray-200" />
                      ) : (
                        <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-gray-400 font-bold text-xs">
                          Food Image
                        </div>
                      )}
                      <div>
                        <h4 className="font-bold text-gray-900 text-base">{item.name}</h4>
                        <p className="text-sm font-extrabold text-red-600 mt-0.5">${item.price.toFixed(2)}</p>
                        {item.specialInstructions && (
                          <p className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md mt-1 inline-block font-medium">
                            Note: {item.specialInstructions}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end w-full sm:w-auto gap-6">
                      {/* Quantity Controls */}
                      <div className="flex items-center gap-3 bg-gray-100 p-1.5 rounded-xl">
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 bg-white text-gray-700 hover:bg-gray-200 rounded-lg flex items-center justify-center shadow-xs transition"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-bold text-sm text-gray-900 w-4 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 bg-white text-gray-700 hover:bg-gray-200 rounded-lg flex items-center justify-center shadow-xs transition"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <span className="font-extrabold text-gray-900 text-base sm:w-20 text-right">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      <button 
                        onClick={() => removeItem(item.id)}
                        className="p-2 text-gray-400 hover:text-rose-600 rounded-lg transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Guarantees Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><ShieldCheck className="w-5 h-5" /></div>
                  <div>
                    <h5 className="font-bold text-xs text-gray-900">Food Safety Seal</h5>
                    <p className="text-[10px] text-gray-500">Tamper-evident packaging</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Truck className="w-5 h-5" /></div>
                  <div>
                    <h5 className="font-bold text-xs text-gray-900">Hot & Fresh</h5>
                    <p className="text-[10px] text-gray-500">Thermal insulated bags</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-xl"><Clock className="w-5 h-5" /></div>
                  <div>
                    <h5 className="font-bold text-xs text-gray-900">On-Time Guarantee</h5>
                    <p className="text-[10px] text-gray-500">Real-time driver GPS tracking</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right 1 Column: Order Summary & Promo Code */}
            <div className="space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-6">
                <h3 className="font-bold text-gray-900 text-lg border-b border-gray-100 pb-4">Order Summary</h3>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyPromo} className="space-y-2">
                  <label className="block text-xs font-bold text-gray-700 uppercase">Promo Code / Voucher</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input 
                        type="text"
                        placeholder="Try PLATE10 or WELCOME20"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 bg-gray-50 border border-gray-300 rounded-xl text-xs uppercase font-black text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="px-4 py-2 bg-gray-900 hover:bg-black text-white font-bold text-xs rounded-xl transition"
                    >
                      Apply
                    </button>
                  </div>
                  {promoSuccess && <p className="text-xs font-bold text-emerald-600">{promoSuccess}</p>}
                  {promoError && <p className="text-xs font-bold text-rose-600">{promoError}</p>}
                </form>

                {/* Breakdown */}
                <div className="space-y-3 text-sm text-gray-600 pt-2 border-t border-gray-100">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span className="font-bold text-gray-900">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee</span>
                    <span className="font-bold text-gray-900">${deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Service Fee</span>
                    <span className="font-bold text-gray-900">${serviceFee.toFixed(2)}</span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>Promo Discount ({discountPercent}%)</span>
                      <span>-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="pt-4 border-t border-gray-200 flex justify-between items-center text-lg font-extrabold text-gray-900">
                    <span>Total Amount</span>
                    <span className="text-xl text-red-600">${grandTotal.toFixed(2)}</span>
                  </div>
                </div>

                <Link
                  href="/checkout"
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-red-600/30 transition flex items-center justify-center gap-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
