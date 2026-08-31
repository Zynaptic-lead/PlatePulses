'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, MapPin, CreditCard, 
  Truck, Clock, CheckCircle, Edit, Plus,
  Home, Building, X, Wallet, Banknote, Package, LayoutDashboard
} from 'lucide-react'
import { useCartStore } from '../../store/useCartStore'
import { ordersApi, usersApi } from '../../lib/api'

interface AddressItem {
  id: string
  type: string
  address: string
  isDefault: boolean
}

export default function CheckoutPage() {
  const router = useRouter()
  const { items, restaurantId, getTotal, clearCart } = useCartStore()

  // Addresses state initialized from user session
  const [addresses, setAddresses] = useState<AddressItem[]>([
    { id: 'addr-1', type: 'Home', address: '742 Evergreen Terrace, Springfield', isDefault: true }
  ])
  const [selectedAddress, setSelectedAddress] = useState<AddressItem>(addresses[0])

  // Auth Protection Guard for Checkout & Address Loader
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const userRaw = localStorage.getItem('user')
      if (!userRaw) {
        router.push('/auth/signin')
        return
      }

      // Load saved addresses from signup or profile
      const localAddrs = localStorage.getItem('customerAddresses')
      if (localAddrs) {
        try {
          const parsed = JSON.parse(localAddrs)
          if (parsed && parsed.length > 0) {
            const mapped = parsed.map((a: any) => ({
              id: a.id || 'addr-' + Math.random(),
              type: a.label || 'Home',
              address: `${a.street}${a.apt ? `, ${a.apt}` : ''}, ${a.city} ${a.zip || ''}`,
              isDefault: a.isDefault || false
            }))
            setAddresses(mapped)
            setSelectedAddress(mapped[0])
          }
        } catch (e) {}
      }

      // Fetch latest profile addresses from backend
      usersApi.getProfile().then(userProfile => {
        if (userProfile.addresses && userProfile.addresses.length > 0) {
          const mapped = userProfile.addresses.map((a: any) => ({
            id: a.id,
            type: a.label || 'Home',
            address: `${a.street}${a.apt ? `, ${a.apt}` : ''}, ${a.city} ${a.zip || ''}`,
            isDefault: a.isDefault || false
          }))
          setAddresses(mapped)
          setSelectedAddress(mapped[0])
        }
      }).catch(() => {})
    }
  }, [router])

  const [step, setStep] = useState<'address' | 'payment' | 'confirm'>('address')
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [newAddrInput, setNewAddrInput] = useState({ label: 'Home', street: '', city: '' })
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'card' | 'cash'>('wallet')
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [placedOrderId, setPlacedOrderId] = useState('PP-2341')

  const deliveryFee = 2.99
  const subtotalAmt = items.length > 0 ? getTotal() : 25.00
  const taxAmt = subtotalAmt * 0.08
  const grandTotalAmt = subtotalAmt + deliveryFee + taxAmt

  // Handle Placing Order & Balance Deduction
  const handlePlaceOrder = async () => {
    const orderIdCode = 'ORD-' + Math.floor(1000 + Math.random() * 9000)
    const newOrderObj = {
      id: orderIdCode,
      restaurantName: 'Pizza Heaven',
      restaurantImage: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format',
      restaurantId: restaurantId || '1',
      date: new Date().toLocaleDateString() + ' at ' + new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      totalAmount: grandTotalAmt,
      status: 'active',
      pickupPin: '4892',
      items: items.length > 0 ? items.map(i => ({ id: i.id, name: i.name, quantity: i.quantity, price: i.price })) : [
        { id: '1', name: 'Margherita Pizza', quantity: 1, price: 18.50 }
      ]
    }

    // 1. Immediately deduct wallet balance if paying via digital wallet
    if (paymentMethod === 'wallet') {
      const currentBalance = parseFloat(localStorage.getItem('customerWallet') || '50.00')
      const updatedBalance = Math.max(0, currentBalance - grandTotalAmt)
      localStorage.setItem('customerWallet', updatedBalance.toFixed(2))

      try {
        await usersApi.topupWallet(-grandTotalAmt)
      } catch (err) {}
    }

    // 2. Persist order to localStorage immediately for instant dashboard visibility
    const existingOrders = JSON.parse(localStorage.getItem('customerOrders') || '[]')
    localStorage.setItem('customerOrders', JSON.stringify([newOrderObj, ...existingOrders]))
    setPlacedOrderId(orderIdCode)

    // 3. Post to NestJS backend
    try {
      const orderPayload = {
        restaurantId: restaurantId || '1',
        items: items.map(i => ({
          menuItemId: i.id,
          quantity: i.quantity,
          price: i.price
        })),
        totalAmount: grandTotalAmt,
        paymentMethod: paymentMethod === 'wallet' ? 'WALLET' : 'CREDIT_CARD',
        deliveryAddress: selectedAddress.address,
      }
      await ordersApi.create(orderPayload)
    } catch (err) {}

    clearCart()
    setOrderPlaced(true)
  }

  // Handle Add Address Modal
  const handleAddNewAddress = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newAddrInput.street) return
    const created: AddressItem = {
      id: 'addr-' + Date.now(),
      type: newAddrInput.label,
      address: `${newAddrInput.street}, ${newAddrInput.city || 'New York'}`,
      isDefault: addresses.length === 0
    }
    const updated = [...addresses, created]
    setAddresses(updated)
    setSelectedAddress(created)
    localStorage.setItem('customerAddresses', JSON.stringify(updated.map(a => ({ id: a.id, label: a.type, street: a.address, city: '' }))))
    setShowAddressModal(false)
    setNewAddrInput({ label: 'Home', street: '', city: '' })
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl max-w-md w-full p-8 text-center space-y-6 shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-300">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto ring-8 ring-emerald-50">
            <CheckCircle className="w-8 h-8" />
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-gray-900">Order Successfully Placed!</h2>
            <p className="text-xs text-gray-500 font-medium">Your kitchen order has been received and is being prepared hot & fresh.</p>
          </div>

          <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 text-xs font-semibold text-gray-700 space-y-1">
            <p className="font-extrabold text-gray-900 text-sm">Order #{placedOrderId}</p>
            <p className="text-gray-500">Estimated Delivery: 25-35 minutes</p>
            <p className="text-emerald-600 font-bold pt-1">Total Paid: ${grandTotalAmt.toFixed(2)}</p>
          </div>

          <div className="space-y-2 pt-2">
            <Link 
              href={`/order-tracking/${placedOrderId}`}
              className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg shadow-red-600/25 transition flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" /> Track Live GPS Delivery
            </Link>

            <Link 
              href="/customer/dashboard"
              className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-extrabold text-xs rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <LayoutDashboard className="w-4 h-4" /> Go to Customer Dashboard
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16 justify-between">
            <div className="flex items-center gap-3">
              <Link href="/cart" className="p-2 hover:bg-gray-100 rounded-xl transition">
                <ArrowLeft className="w-5 h-5 text-gray-700" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-black text-lg">P</span>
                </div>
                <span className="font-extrabold text-xl text-gray-900">Checkout</span>
              </div>
            </div>
            <Link href="/customer/dashboard" className="text-xs font-bold text-gray-600 hover:text-gray-900">
              My Dashboard →
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-xs">
              <div className="flex items-center justify-between">
                {['Address', 'Payment', 'Confirm'].map((s, idx) => (
                  <div key={idx} className="flex-1 relative">
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                        step === 'address' && idx === 0 ? 'bg-red-600 text-white' :
                        step === 'payment' && idx === 1 ? 'bg-red-600 text-white' :
                        step === 'confirm' && idx === 2 ? 'bg-red-600 text-white' :
                        idx < (step === 'address' ? 0 : step === 'payment' ? 1 : 2) ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-500'
                      }`}>
                        {idx < (step === 'address' ? 0 : step === 'payment' ? 1 : 2) ? <CheckCircle className="w-4 h-4" /> : idx + 1}
                      </div>
                      <span className="text-[11px] font-bold text-gray-600 mt-1 uppercase">{s}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Address Section */}
            {step === 'address' && (
              <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-xs">
                <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-red-600" />
                  Select Delivery Address
                </h3>
                
                {addresses.map((addr) => (
                  <div 
                    key={addr.id}
                    onClick={() => setSelectedAddress(addr)}
                    className={`border-2 rounded-2xl p-4 cursor-pointer transition flex items-start justify-between gap-3 ${
                      selectedAddress.id === addr.id 
                        ? 'border-red-600 bg-red-50/50' 
                        : 'border-gray-200 hover:border-red-200'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {addr.type === 'Home' ? <Home className="w-5 h-5 text-red-600 mt-0.5" /> : <Building className="w-5 h-5 text-gray-600 mt-0.5" />}
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-extrabold text-gray-900 text-sm">{addr.type}</p>
                          {addr.isDefault && <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-md">Default</span>}
                        </div>
                        <p className="text-xs text-gray-600 font-medium pt-0.5">{addr.address}</p>
                      </div>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddress.id === addr.id ? 'border-red-600 bg-red-600' : 'border-gray-300'}`}>
                      {selectedAddress.id === addr.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </div>
                ))}

                <button 
                  onClick={() => setShowAddressModal(true)}
                  className="w-full py-3 border-2 border-dashed border-gray-300 hover:border-gray-900 text-gray-700 font-bold text-xs rounded-xl transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  + Add New Address
                </button>

                <button 
                  onClick={() => setStep('payment')}
                  className="w-full py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs rounded-xl shadow-lg transition"
                >
                  Continue to Payment →
                </button>
              </div>
            )}

            {/* Payment Section */}
            {step === 'payment' && (
              <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-4 shadow-xs">
                <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-red-600" />
                  Choose Payment Method
                </h3>
                
                {/* PlatePulse Digital Wallet */}
                <div 
                  onClick={() => setPaymentMethod('wallet')}
                  className={`border-2 rounded-2xl p-4 cursor-pointer transition flex items-center justify-between ${
                    paymentMethod === 'wallet' ? 'border-emerald-600 bg-emerald-50/50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Wallet className="w-6 h-6 text-emerald-600" />
                    <div>
                      <p className="font-extrabold text-gray-900 text-sm">PlatePulse Digital Wallet</p>
                      <p className="text-xs text-gray-500 font-medium">Instant 1-click payment using your digital wallet</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'wallet' ? 'border-emerald-600 bg-emerald-600' : 'border-gray-300'}`}>
                    {paymentMethod === 'wallet' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>

                {/* Credit Card */}
                <div 
                  onClick={() => setPaymentMethod('card')}
                  className={`border-2 rounded-2xl p-4 cursor-pointer transition flex items-center justify-between ${
                    paymentMethod === 'card' ? 'border-red-600 bg-red-50/50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-6 h-6 text-red-600" />
                    <div>
                      <p className="font-extrabold text-gray-900 text-sm">Credit or Debit Card</p>
                      <p className="text-xs text-gray-500 font-medium">Visa, Mastercard, American Express</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-red-600 bg-red-600' : 'border-gray-300'}`}>
                    {paymentMethod === 'card' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>

                {/* Cash on Delivery */}
                <div 
                  onClick={() => setPaymentMethod('cash')}
                  className={`border-2 rounded-2xl p-4 cursor-pointer transition flex items-center justify-between ${
                    paymentMethod === 'cash' ? 'border-gray-900 bg-gray-50' : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Banknote className="w-6 h-6 text-gray-700" />
                    <div>
                      <p className="font-extrabold text-gray-900 text-sm">Cash on Delivery</p>
                      <p className="text-xs text-gray-500 font-medium">Pay cash directly to driver upon arrival</p>
                    </div>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cash' ? 'border-gray-900 bg-gray-900' : 'border-gray-300'}`}>
                    {paymentMethod === 'cash' && <div className="w-2 h-2 bg-white rounded-full" />}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <button onClick={() => setStep('address')} className="w-1/3 py-3 bg-gray-100 font-bold text-xs rounded-xl">Back</button>
                  <button onClick={() => setStep('confirm')} className="w-2/3 py-3 bg-red-600 text-white font-extrabold text-xs rounded-xl shadow-lg">Review Order →</button>
                </div>
              </div>
            )}

            {/* Confirm Section */}
            {step === 'confirm' && (
              <div className="bg-white rounded-3xl border border-gray-200 p-6 space-y-6 shadow-xs">
                <h3 className="font-extrabold text-gray-900 text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-red-600" />
                  Review & Confirm Order
                </h3>

                <div className="p-4 bg-gray-50 rounded-2xl space-y-2 text-xs font-medium">
                  <p><strong className="text-gray-900">Delivery Address:</strong> {selectedAddress.address}</p>
                  <p><strong className="text-gray-900">Payment Method:</strong> {paymentMethod === 'wallet' ? 'PlatePulse Digital Wallet' : paymentMethod === 'card' ? 'Credit Card' : 'Cash on Delivery'}</p>
                </div>

                <button 
                  onClick={handlePlaceOrder}
                  className="w-full py-4 bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-red-600/30 transition flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" /> Confirm & Pay ${grandTotalAmt.toFixed(2)}
                </button>
              </div>
            )}
          </div>

          {/* Right Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-xs space-y-4">
              <h3 className="font-extrabold text-gray-900 text-base border-b border-gray-100 pb-3">Summary</h3>

              <div className="space-y-2 text-xs font-medium text-gray-600">
                <div className="flex justify-between"><span>Subtotal</span><span className="font-bold text-gray-900">${subtotalAmt.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Delivery Fee</span><span className="font-bold text-gray-900">${deliveryFee.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Taxes</span><span className="font-bold text-gray-900">${taxAmt.toFixed(2)}</span></div>
                <div className="pt-2 border-t flex justify-between text-sm font-black text-gray-900">
                  <span>Grand Total</span>
                  <span className="text-red-600">${grandTotalAmt.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-gray-900">Add New Address</h3>
              <button onClick={() => setShowAddressModal(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>
            <form onSubmit={handleAddNewAddress} className="space-y-3 text-xs font-semibold">
              <div>
                <label className="block text-gray-500 uppercase mb-1">Street Address</label>
                <input type="text" required placeholder="742 Evergreen Terrace" value={newAddrInput.street} onChange={e => setNewAddrInput({...newAddrInput, street: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl outline-none" />
              </div>
              <div>
                <label className="block text-gray-500 uppercase mb-1">City</label>
                <input type="text" required placeholder="New York" value={newAddrInput.city} onChange={e => setNewAddrInput({...newAddrInput, city: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl outline-none" />
              </div>
              <button type="submit" className="w-full py-3 bg-red-600 text-white font-extrabold rounded-xl">Save & Select Address</button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}