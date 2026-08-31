'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronLeft, DollarSign, Calendar, TrendingUp, 
  ArrowUpRight, ArrowDownRight, Download, Filter,
  ChevronRight, Star, Clock, Truck
} from 'lucide-react'

const earningsData = {
  today: 68.50,
  week: 342.00,
  month: 1245.00,
  total: 4567.89,
  weeklyData: [
    { day: 'Mon', earnings: 45.50, deliveries: 3, color: '#ef4444' },
    { day: 'Tue', earnings: 52.00, deliveries: 4, color: '#f97316' },
    { day: 'Wed', earnings: 68.50, deliveries: 5, color: '#eab308' },
    { day: 'Thu', earnings: 42.00, deliveries: 3, color: '#22c55e' },
    { day: 'Fri', earnings: 0, deliveries: 0, color: '#6b7280' },
    { day: 'Sat', earnings: 0, deliveries: 0, color: '#6b7280' },
    { day: 'Sun', earnings: 0, deliveries: 0, color: '#6b7280' },
  ],
  transactions: [
    { id: 1, date: 'Today, 2:30 PM', restaurant: 'Pizza Heaven', amount: 8.50, type: 'delivery', rating: 5 },
    { id: 2, date: 'Today, 1:15 PM', restaurant: 'Burger House', amount: 7.50, type: 'delivery', rating: 5 },
    { id: 3, date: 'Today, 12:00 PM', restaurant: 'Sushi Master', amount: 10.50, type: 'delivery', rating: 4 },
    { id: 4, date: 'Yesterday, 7:30 PM', restaurant: 'Mediterranean Grill', amount: 9.00, type: 'delivery', rating: 5 },
    { id: 5, date: 'Yesterday, 6:00 PM', restaurant: 'Pizza Heaven', amount: 8.50, type: 'delivery', rating: 5 },
  ],
}

export default function EarningsPage() {
  const [period, setPeriod] = useState('week')
  const maxEarnings = Math.max(...earningsData.weeklyData.map(d => d.earnings))

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
                <span className="font-bold text-xl text-gray-900">Earnings</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition">
                <Filter className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Earnings Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-4 text-white shadow-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs opacity-80">Today</span>
              <TrendingUp className="w-4 h-4 opacity-80" />
            </div>
            <div className="text-3xl font-bold">${earningsData.today}</div>
            <div className="text-xs opacity-80 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +12% from yesterday
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">This Week</span>
              <Calendar className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">${earningsData.week}</div>
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +8% from last week
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">This Month</span>
              <DollarSign className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">${earningsData.month}</div>
            <div className="text-xs text-green-600 mt-1 flex items-center gap-1">
              <ArrowUpRight className="w-3 h-3" /> +15% from last month
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-gray-500">Total Earnings</span>
              <TrendingUp className="w-4 h-4 text-gray-400" />
            </div>
            <div className="text-2xl font-bold text-gray-900">${earningsData.total}</div>
            <div className="text-xs text-gray-500 mt-1">Since joining</div>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-6">
          {['day', 'week', 'month', 'year'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                period === p
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
              }`}
            >
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        {/* Enhanced Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold text-gray-900">Weekly Earnings</h3>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-xs">Earnings</span>
              </div>
              <div className="flex items-center gap-1 ml-2">
                <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                <span className="text-xs">Deliveries</span>
              </div>
            </div>
          </div>
          
          {/* Bar Chart */}
          <div className="relative h-64">
            <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between h-52">
              {earningsData.weeklyData.map((day, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                  <div className="relative w-full flex justify-center gap-1">
                    <div 
                      className="w-6 bg-red-500 rounded-t-lg transition-all duration-500 hover:bg-red-600 cursor-pointer group relative"
                      style={{ height: `${(day.earnings / maxEarnings) * 140}px` }}
                    >
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                        ${day.earnings}
                      </div>
                    </div>
                    {day.deliveries > 0 && (
                      <div 
                        className="w-6 bg-blue-400 rounded-t-lg transition-all duration-500"
                        style={{ height: `${(day.deliveries / 5) * 140}px` }}
                      />
                    )}
                  </div>
                  <span className="text-xs text-gray-500 font-medium">{day.day}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Stats Summary */}
          <div className="grid grid-cols-3 gap-4 mt-8 pt-6 border-t border-gray-100">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">$208.00</p>
              <p className="text-xs text-gray-500">Total This Week</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">15</p>
              <p className="text-xs text-gray-500">Total Deliveries</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">4.9</p>
              <p className="text-xs text-gray-500">Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <h3 className="font-bold text-gray-900">Recent Transactions</h3>
            <button className="text-sm text-red-600 hover:text-red-700 flex items-center gap-1">
              View All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-gray-100">
            {earningsData.transactions.map((tx) => (
              <div key={tx.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{tx.restaurant}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500">{tx.date}</span>
                      <span className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-3 h-3 ${i < tx.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-green-600">+${tx.amount}</p>
                  <p className="text-xs text-gray-400 capitalize">{tx.type}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}