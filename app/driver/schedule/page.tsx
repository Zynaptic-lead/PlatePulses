'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronLeft, Calendar, Clock, Plus, Edit, Trash2, Bell, ChevronRight, CheckCircle, DollarSign } from 'lucide-react'

const schedule = [
  { id: 1, day: 'Monday', shift: 'Morning', time: '8:00 AM - 12:00 PM', status: 'upcoming' },
  { id: 2, day: 'Monday', shift: 'Evening', time: '4:00 PM - 8:00 PM', status: 'upcoming' },
  { id: 3, day: 'Tuesday', shift: 'Morning', time: '8:00 AM - 12:00 PM', status: 'upcoming' },
  { id: 4, day: 'Wednesday', shift: 'Evening', time: '4:00 PM - 8:00 PM', status: 'upcoming' },
  { id: 5, day: 'Thursday', shift: 'Morning', time: '8:00 AM - 12:00 PM', status: 'completed' },
  { id: 6, day: 'Friday', shift: 'Evening', time: '4:00 PM - 8:00 PM', status: 'completed' },
]

const availableShifts = [
  { id: 1, day: 'Tuesday', shift: 'Evening', time: '4:00 PM - 8:00 PM', earnings: '~$45' },
  { id: 2, day: 'Wednesday', shift: 'Morning', time: '8:00 AM - 12:00 PM', earnings: '~$40' },
  { id: 3, day: 'Thursday', shift: 'Evening', time: '4:00 PM - 8:00 PM', earnings: '~$50' },
  { id: 4, day: 'Friday', shift: 'Morning', time: '8:00 AM - 12:00 PM', earnings: '~$42' },
  { id: 5, day: 'Saturday', shift: 'Full Day', time: '8:00 AM - 8:00 PM', earnings: '~$120' },
]

export default function SchedulePage() {
  const [view, setView] = useState<'my' | 'available'>('my')
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedShift, setSelectedShift] = useState<any>(null)

  const addShift = (shift: any) => {
    setSelectedShift(shift)
    setShowAddModal(true)
  }

  const confirmAdd = () => {
    setShowAddModal(false)
    setSelectedShift(null)
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
                <span className="font-bold text-xl text-gray-900">Schedule</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setView('my')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  view === 'my' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                My Schedule
              </button>
              <button 
                onClick={() => setView('available')}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition ${
                  view === 'available' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Available Shifts
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {view === 'my' ? (
          <>
            {/* Schedule Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div className="text-2xl font-bold text-gray-900">6</div>
                <div className="text-xs text-gray-500">Total Shifts</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div className="text-2xl font-bold text-green-600">4</div>
                <div className="text-xs text-gray-500">Completed</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div className="text-2xl font-bold text-orange-500">2</div>
                <div className="text-xs text-gray-500">Upcoming</div>
              </div>
              <div className="bg-white rounded-xl p-4 text-center border border-gray-100">
                <div className="text-2xl font-bold text-gray-900">~$247</div>
                <div className="text-xs text-gray-500">Est. Earnings</div>
              </div>
            </div>

            {/* Schedule List */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">This Week's Schedule</h3>
              </div>
              <div className="divide-y divide-gray-100">
                {schedule.map((shift) => (
                  <div key={shift.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        shift.status === 'completed' ? 'bg-green-100' : 'bg-blue-100'
                      }`}>
                        {shift.status === 'completed' ? (
                          <CheckCircle className="w-5 h-5 text-green-600" />
                        ) : (
                          <Clock className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{shift.day} - {shift.shift} Shift</p>
                        <p className="text-xs text-gray-500">{shift.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {shift.status === 'upcoming' && (
                        <>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                            <Edit className="w-4 h-4 text-gray-500" />
                          </button>
                          <button className="p-1.5 hover:bg-gray-100 rounded-lg transition">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </button>
                        </>
                      )}
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        shift.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {shift.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Available Shifts */}
            <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-bold text-gray-900">Available Shifts</h3>
                <p className="text-xs text-gray-500 mt-1">Select shifts to add to your schedule</p>
              </div>
              <div className="divide-y divide-gray-100">
                {availableShifts.map((shift) => (
                  <div key={shift.id} className="p-4 flex items-center justify-between hover:bg-gray-50 transition">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{shift.day} - {shift.shift} Shift</p>
                        <p className="text-xs text-gray-500">{shift.time}</p>
                        <p className="text-xs text-green-600 mt-1">Est. {shift.earnings}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => addShift(shift)}
                      className="px-3 py-1.5 bg-red-600 text-white text-sm font-medium rounded-lg hover:bg-red-700 transition"
                    >
                      Add Shift
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Earnings Tip */}
            <div className="mt-6 bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">Peak Hours = Higher Earnings</p>
                  <p className="text-xs opacity-90">Evening shifts (5PM-9PM) earn 20% more on average</p>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Add Shift Modal */}
      {showAddModal && selectedShift && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6">
            <div className="text-center mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">Add Shift</h3>
              <p className="text-gray-500 text-sm mt-1">
                {selectedShift.day} - {selectedShift.shift} Shift<br />
                {selectedShift.time}
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-3 mb-4">
              <p className="text-sm text-gray-600 text-center">
                Estimated earnings: <span className="font-bold text-green-600">{selectedShift.earnings}</span>
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmAdd}
                className="flex-1 px-4 py-2 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700"
              >
                Add to Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}