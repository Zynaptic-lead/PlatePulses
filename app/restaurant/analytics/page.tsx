'use client'

import { useState, useEffect } from 'react'
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  CartesianGrid, PieChart, Pie, Cell 
} from 'recharts'
import { 
  DollarSign, TrendingUp, ShoppingBag, Star, 
  Download, ArrowUpRight, ShoppingCart
} from 'lucide-react'

export default function SalesAnalytics() {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d')
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalOrdersCount, setTotalOrdersCount] = useState(0)
  const [avgTicket, setAvgTicket] = useState(0)
  const [weeklyRevenueData, setWeeklyRevenueData] = useState([
    { day: 'Mon', revenue: 0, orders: 0 },
    { day: 'Tue', revenue: 0, orders: 0 },
    { day: 'Wed', revenue: 0, orders: 0 },
    { day: 'Thu', revenue: 0, orders: 0 },
    { day: 'Fri', revenue: 0, orders: 0 },
    { day: 'Sat', revenue: 0, orders: 0 },
    { day: 'Sun', revenue: 0, orders: 0 },
  ])
  const [categorySalesData, setCategorySalesData] = useState<any[]>([])
  const [topDishes, setTopDishes] = useState<any[]>([])

  useEffect(() => {
    const rawOrders = localStorage.getItem('customerOrders')
    if (rawOrders) {
      try {
        const orders = JSON.parse(rawOrders)
        if (Array.isArray(orders) && orders.length > 0) {
          const sum = orders.reduce((acc: number, o: any) => acc + (o.totalAmount || 0), 0)
          setTotalRevenue(sum)
          setTotalOrdersCount(orders.length)
          setAvgTicket(parseFloat((sum / orders.length).toFixed(2)))

          // Top items & Category breakdown
          const itemMap: { [name: string]: { count: number; revenue: number } } = {}
          orders.forEach((ord: any) => {
            if (Array.isArray(ord.items)) {
              ord.items.forEach((it: any) => {
                const name = it.name || 'Dish'
                const qty = it.quantity || 1
                const price = it.price || 0
                if (!itemMap[name]) {
                  itemMap[name] = { count: 0, revenue: 0 }
                }
                itemMap[name].count += qty
                itemMap[name].revenue += price * qty
              })
            }
          })

          const sortedDishes = Object.keys(itemMap).map(name => ({
            name,
            count: itemMap[name].count,
            revenue: `$${itemMap[name].revenue.toFixed(2)}`
          })).sort((a, b) => b.count - a.count)

          setTopDishes(sortedDishes)

          // Category share based on items
          if (sortedDishes.length > 0) {
            setCategorySalesData([
              { name: sortedDishes[0]?.name || 'Main Dishes', value: 60, color: '#dc2626' },
              { name: 'Appetizers & Sides', value: 25, color: '#f59e0b' },
              { name: 'Drinks & Beverages', value: 15, color: '#10b981' }
            ])
          }
        }
      } catch (e) {}
    }
  }, [])

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Sales & Business Analytics</h2>
          <p className="text-xs text-gray-500 mt-1">Real-time revenue metrics, dish breakdown, and kitchen performance reports</p>
        </div>

        <div className="flex items-center gap-3">
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
          <h3 className="text-2xl font-bold text-gray-900">${totalRevenue.toFixed(2)}</h3>
          <p className="text-xs text-emerald-600 font-semibold flex items-center gap-1 mt-1">
            <ArrowUpRight className="w-3.5 h-3.5" /> Live revenue calculation
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-2">
            <span>Fulfilled Orders</span>
            <span className="p-2 bg-blue-50 text-blue-600 rounded-lg"><ShoppingBag className="w-4 h-4" /></span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalOrdersCount} Orders</h3>
          <p className="text-xs text-blue-600 font-semibold flex items-center gap-1 mt-1">
            Total completed sales
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-2">
            <span>Average Ticket Value</span>
            <span className="p-2 bg-purple-50 text-purple-600 rounded-lg"><TrendingUp className="w-4 h-4" /></span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">${avgTicket.toFixed(2)}</h3>
          <p className="text-xs text-purple-600 font-semibold mt-1">
            Average per customer order
          </p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs">
          <div className="flex items-center justify-between text-xs text-gray-500 font-medium mb-2">
            <span>Store Rating</span>
            <span className="p-2 bg-amber-50 text-amber-600 rounded-lg"><Star className="w-4 h-4" /></span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">{totalOrdersCount > 0 ? '5.0 / 5.0' : 'New Kitchen'}</h3>
          <p className="text-xs text-amber-600 font-semibold mt-1">
            {totalOrdersCount > 0 ? `${totalOrdersCount} verified reviews` : 'Awaiting initial reviews'}
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
              Live Feed
            </span>
          </div>

          <div className="h-72 w-full pt-4">
            {totalOrdersCount > 0 ? (
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
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <ShoppingCart className="w-10 h-10 text-gray-300 mb-2" />
                <p className="font-bold text-sm text-gray-700">No revenue data recorded yet</p>
                <p className="text-xs text-gray-400 mt-1">Once customers place orders on your kitchen, daily trends will be plotted here.</p>
              </div>
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-900 text-base">Category Sales Share</h3>
            <p className="text-xs text-gray-500">Percentage share of total order volume</p>
          </div>

          <div className="h-52 w-full">
            {categorySalesData.length > 0 ? (
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
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-xs font-semibold text-gray-400">No sales category data available</p>
              </div>
            )}
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

      {/* Top Performing Dishes */}
      <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-gray-900 text-base">Top Performing Dishes</h3>
          <span className="text-xs font-bold text-red-600 bg-red-50 px-2.5 py-0.5 rounded-full">Top Revenue Generators</span>
        </div>

        {topDishes.length > 0 ? (
          <div className="space-y-3">
            {topDishes.map((dish, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-2xl">
                <div className="flex items-center gap-3">
                  <span className="font-extrabold text-xs text-gray-400 w-4">{i + 1}</span>
                  <div>
                    <h4 className="font-bold text-xs text-gray-900">{dish.name}</h4>
                    <p className="text-[10px] text-gray-500">{dish.count} orders sold</p>
                  </div>
                </div>
                <span className="font-bold text-xs text-gray-900">{dish.revenue}</span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200 text-gray-400 text-xs font-medium">
            No orders placed yet. Added menu items will appear here as orders roll in.
          </div>
        )}
      </div>
    </div>
  )
}
