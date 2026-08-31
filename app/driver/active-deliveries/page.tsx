'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronLeft, MapPin, Phone, User, 
  Clock, DollarSign, CheckCircle, Package,
  MessageCircle, Truck
} from 'lucide-react'

const activeDelivery = {
  id: 1,
  restaurant: {
    name: 'Pizza Heaven',
    address: '456 Oak Avenue, New York, NY 10001',
    phone: '+1 (555) 123-4567',
    pickupCode: 'PP-2341',
    instructions: 'Enter through the back door, ask for Manager John'
  },
  customer: {
    name: 'John Smith',
    phone: '+1 (555) 987-6543',
    address: '123 Main Street, Apt 4B, New York, NY 10001',
    instructions: 'Ring bell 4B, building has intercom',
    landmark: 'Next to Starbucks coffee shop'
  },
  order: {
    items: [
      { name: 'Margherita Pizza', quantity: 1, price: 15.99 },
      { name: 'Pepperoni Pizza', quantity: 1, price: 18.99 }
    ],
    total: 34.98,
    deliveryFee: 8.50,
    orderNumber: 'PP-2341'
  },
  distance: '1.2 km',
  estimatedTime: '15 min',
  earnings: 8.50,
}

export default function ActiveDeliveriesPage() {
  const [step, setStep] = useState<'pickup' | 'delivery' | 'complete'>('pickup')
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  const handleNextStep = () => {
    setShowConfirmModal(true)
  }

  const confirmAction = () => {
    if (step === 'pickup') {
      setStep('delivery')
    } else if (step === 'delivery') {
      setStep('complete')
    }
    setShowConfirmModal(false)
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-2xl mx-auto px-4 py-12 text-center">
          <div className="bg-white rounded-2xl p-8 shadow-sm">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Delivery Complete!</h2>
            <p className="text-gray-500 mb-4">You've successfully delivered to {activeDelivery.customer.name}</p>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-600">Earnings from this delivery</p>
              <p className="text-3xl font-bold text-green-600">${activeDelivery.earnings}</p>
            </div>
            <div className="flex gap-3">
              <Link href="/driver/available-orders" className="flex-1 px-4 py-3 bg-gray-900 text-white font-medium rounded-lg hover:bg-gray-800">
                Take Another Order
              </Link>
              <Link href="/driver/dashboard" className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50">
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Helper function to determine step status
    const getStepStatus = (stepValue: string) => {
    if (step === stepValue) return 'active'
    if (step === 'delivery' && stepValue === 'pickup') return 'completed'
    if ((step as 'pickup' | 'delivery' | 'complete') === 'complete' && (stepValue === 'pickup' || stepValue === 'delivery')) return 'completed'
    return 'pending'
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link href="/driver/dashboard" className="p-2 hover:bg-gray-100 rounded-lg transition">
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-lg">P</span>
                </div>
                <span className="font-bold text-xl text-gray-900">Active Delivery</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-green-700 font-medium">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[
              { label: 'Pick Up', stepValue: 'pickup' },
              { label: 'Deliver', stepValue: 'delivery' },
              { label: 'Complete', stepValue: 'complete' }
            ].map((s, idx) => {
              const status = getStepStatus(s.stepValue)
              
              return (
                <div key={idx} className="flex-1 relative">
                  <div className="flex flex-col items-center">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      status === 'completed' ? 'bg-green-500 text-white' :
                      status === 'active' ? 'bg-red-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}>
                      {status === 'completed' ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                    </div>
                    <span className={`text-xs mt-2 ${status === 'active' ? 'text-red-600 font-medium' : 'text-gray-500'}`}>{s.label}</span>
                  </div>
                  {idx < 2 && (
                    <div className={`absolute top-5 left-1/2 w-full h-0.5 ${
                      status === 'completed' ? 'bg-green-500' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Rest of the component remains the same */}
        {/* Pickup Section */}
        {step === 'pickup' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-red-600 to-orange-500 p-4 text-white">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5" />
                  <span className="font-semibold">Pick Up from Restaurant</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{activeDelivery.restaurant.name}</p>
                    <p className="text-sm text-gray-500 mt-1">{activeDelivery.restaurant.address}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{activeDelivery.restaurant.phone}</span>
                    </div>
                    {activeDelivery.restaurant.instructions && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded-lg">
                        <p className="text-xs text-yellow-700">{activeDelivery.restaurant.instructions}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-2">
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <p className="text-sm text-gray-600 mb-2">Show this code to restaurant staff:</p>
                    <p className="text-3xl font-mono font-bold text-gray-900 tracking-wider">
                      {activeDelivery.restaurant.pickupCode}
                    </p>
                  </div>
                </div>

                <button 
                  onClick={handleNextStep}
                  className="w-full mt-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition"
                >
                  Confirm Pickup
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Delivery Section */}
        {step === 'delivery' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span className="font-semibold">Deliver to Customer</span>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-start gap-3 mb-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">{activeDelivery.customer.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Phone className="w-3 h-3 text-gray-400" />
                      <span className="text-sm text-gray-500">{activeDelivery.customer.phone}</span>
                    </div>
                    <div className="mt-3">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                        <div>
                          <p className="text-sm text-gray-700">{activeDelivery.customer.address}</p>
                          {activeDelivery.customer.landmark && (
                            <p className="text-xs text-gray-500 mt-1">Landmark: {activeDelivery.customer.landmark}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {activeDelivery.customer.instructions && (
                      <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                        <p className="text-xs text-blue-700">{activeDelivery.customer.instructions}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-4 mt-2">
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                      <Phone className="w-4 h-4" />
                      <span className="text-sm">Call Customer</span>
                    </button>
                    <button className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition">
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">Message</span>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleNextStep}
                  className="w-full mt-4 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
                >
                  Mark as Delivered
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-xl border border-gray-100 p-5">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Package className="w-4 h-4" />
                Order Summary
              </h3>
              <div className="space-y-2">
                {activeDelivery.order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-gray-600">{item.quantity}x {item.name}</span>
                    <span className="text-gray-900">${item.price}</span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-2 mt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">${activeDelivery.order.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-green-600 font-medium">+${activeDelivery.earnings}</span>
                  </div>
                  <div className="flex justify-between font-bold mt-2 pt-2 border-t border-gray-100">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">${(activeDelivery.order.total + activeDelivery.earnings).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {step === 'pickup' ? 'Confirm Pickup' : 'Confirm Delivery'}
            </h3>
            <p className="text-gray-500 text-sm mb-6">
              {step === 'pickup' 
                ? 'Have you picked up the food from the restaurant?'
                : 'Have you delivered the food to the customer?'}
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAction}
                className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
              >
                Yes, Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}