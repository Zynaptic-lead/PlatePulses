'use client'

import { useState } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, PieChart, Pie, Cell 
} from 'recharts'
import { 
  DollarSign, TrendingUp, ShoppingBag, Users, Star, 
  Calendar, Download, ArrowUpRight, Award, ShieldCheck, Flame
} from 'lucide-react'

const weeklyRevenueData = [
  { day: 'Mon', revenue: 1420, orders: 42 },
  { day: 'Tue', revenue: 1680, orders: 48 },
  { day: 'Wed', revenue: 1550, orders: 45 },
  { day: 'Thu', revenue: 1890, orders: 54 },
  { day: 'Fri', revenue: 2450, orders: 72 },
  { day: 'Sat', revenue: 3100, orders: 94 },
  { day: 'Sun', revenue: 2800, orders: 82 },
]

const categorySalesData = [
  { name: 'Wood-Fired Pizzas', value: 55, color: '#dc2626' },
  { name: 'Appetizers & Sides', value: 20, color: '#f59e0b' },
  { name: 'Desserts', value: 15, color: '#8b5cf6' },
  { name: 'Drinks & Beverages', value: 10, color: '#10b981' },
]

const peakHoursData = [
  { hour: '11 AM', orders: 12 },
  { hour: '1 PM', orders: 45 },
  { hour: '3 PM', orders: 18 },
  { hour: '5 PM', orders: 32 },
  { hour: '7 PM', orders: 88 },
  { hour: '9 PM', orders: 64 },
]

export default function SalesAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sales & Business Analytics</h2>
          <p className="text-xs text-gray-500 mt-1">Detailed performance report on revenue, top dishes, peak order times, and customer retention</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Time Range Filter */}
          <div className="bg-gray-100 p-1 rounded-xl flex items-center gap-1 text-xs font-bold text-gray-600">
            {(['7d', '30d', '90d'] as const).map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 rounded-lg transition ${timeRange === range ? 'bg-white text-gray-900 shadow-xs' : 'hover:text-gray-900'}`}
              >
                {range === '7d' ? 'Last 7 Days' : range === '30d' ? 'Last 30 Days' : 'Quarterly'}
              </button>
            ))}
          </div>

          <button className="px-4 py-2 bg-gray-900 text-white font-bold text-xs rounded-xl hover:bg-black transition flex items-center gap-2">
            <Download className="w-3.5 h-3.5" /> Export PDF Report
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-2">
            <span>Total Sales Revenue</span>
            <span className="p-2 bg-emerald-50 text-emerald-600 rounded-lg"><DollarSign className="w-4 h-4" /></span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">$14,890.00</h3>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +18.5% compared to previous period
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-2">
            <span>Fulfilled Orders</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShoppingBag className="w-4 h-4" /></span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">467 Orders</h3>
          <p className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> +12.3% order volume growth
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-2">
            <span>Average Ticket Value</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">$31.88</h3>
          <p className="text-xs text-purple-600 font-semibold mt-1">
            Highest category: Wood-Fired Pizzas
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-2">
            <span>Store Satisfaction</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Star className="w-4 h-4" /></span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">4.89 / 5.0</h3>
          <p className="text-xs text-amber-600 font-semibold mt-1">
            Based on 2,341 verified reviews
          </p>
        </div>
      </div>

      {/* Revenue Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Revenue Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base">Daily Revenue Trend</h3>
              <p className="text-xs text-gray-500">Gross revenue earnings per day ($)</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Peak: Saturday ($3,100)
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyRevenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="day" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip 
                  formatter={(value: any) => [`$${value}`, 'Revenue']}
                  contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="revenue" fill="#dc2626" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Category Sales Breakdown</h3>
            <p className="text-xs text-gray-500">Percentage share of total orders</p>
          </div>

          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={categorySalesData}
                  cx="50%" 
                  cy="50%" 
                  innerRadius={55} 
                  outerRadius={80} 
                  paddingAngle={5} 
                  dataKey="value"
                >
                  {categorySalesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 pt-2 border-t border-gray-100">
            {categorySalesData.map(cat => (
              <div key={cat.name} className="flex items-center justify-between text-xs font-semibold">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-gray-700">{cat.name}</span>
                </div>
                <span className="text-gray-900 font-bold">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Peak Order Times & Top Selling Dishes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours Bar Chart */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Peak Kitchen Ordering Hours</h3>
            <p className="text-xs text-gray-500">Order traffic distribution by time slot</p>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={peakHoursData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="hour" tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#6b7280', fontSize: 12 }} />
                <Tooltip contentStyle={{ backgroundColor: '#111827', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
                <Bar dataKey="orders" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Items Table */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-gray-900 text-base">Top Performing Dishes</h3>
            <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">Top Revenue Generators</span>
          </div>

          <div className="space-y-3">
            {[
              { name: 'Wood-Fired Margherita Pizza', count: 284, revenue: '$5,254.00', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=150&auto=format' },
              { name: 'Diablo Spicy Pepperoni', count: 210, revenue: '$4,305.00', image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=150&auto=format' },
              { name: 'Quattro Formaggi Pizza', count: 165, revenue: '$3,465.00', image: 'https://images.unsplash.com/photo-1573821663912-569905455b1c?w=150&auto=format' },
              { name: 'Truffle Garlic Breadsticks', count: 142, revenue: '$1,278.00', image: 'https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?w=150&auto=format' },
            ].map((dish, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-xs text-gray-400 w-4">{i + 1}</span>
                  <img src={dish.image} alt={dish.name} className="w-10 h-10 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">{dish.name}</h4>
                    <p className="text-[10px] text-gray-500">{dish.count} orders sold</p>
                  </div>
                </div>
                <span className="font-bold text-xs text-gray-900">{dish.revenue}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
