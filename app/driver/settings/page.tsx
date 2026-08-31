'use client'

import { useState } from 'react'
import Link from 'next/link'
import { 
  ChevronLeft, User, Bell, Lock, CreditCard, 
  Car, FileText, HelpCircle, LogOut, ChevronRight,
  Check, Moon, Globe, Shield
} from 'lucide-react'

export default function SettingsPage() {
  const [notifications, setNotifications] = useState(true)
  const [darkMode, setDarkMode] = useState(false)
  const [autoAccept, setAutoAccept] = useState(false)

  const settingsSections = [
    {
      title: 'Account',
      icon: User,
      items: [
        { label: 'Personal Information', value: 'John Driver', type: 'info' },
        { label: 'Payment Details', value: '•••• 1234', type: 'info' },
        { label: 'Vehicle Information', value: 'Honda CBR 150', type: 'info' },
      ]
    },
    {
      title: 'Preferences',
      icon: Bell,
      items: [
        { label: 'Push Notifications', type: 'toggle', value: notifications, onChange: setNotifications },
        { label: 'Dark Mode', type: 'toggle', value: darkMode, onChange: setDarkMode },
        { label: 'Auto Accept Orders', type: 'toggle', value: autoAccept, onChange: setAutoAccept },
        { label: 'Language', value: 'English', type: 'info' },
      ]
    },
    {
      title: 'Support',
      icon: HelpCircle,
      items: [
        { label: 'Help Center', type: 'link', link: '#' },
        { label: 'Report an Issue', type: 'link', link: '#' },
        { label: 'Terms of Service', type: 'link', link: '#' },
        { label: 'Privacy Policy', type: 'link', link: '#' },
      ]
    }
  ]

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
                <span className="font-bold text-xl text-gray-900">Settings</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6 text-center">
          <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-3">
            <User className="w-10 h-10 text-gray-500" />
          </div>
          <h3 className="font-bold text-gray-900">John Driver</h3>
          <p className="text-sm text-gray-500">john.driver@example.com</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Active Driver</span>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Verified</span>
          </div>
        </div>

        {/* Settings Sections */}
        {settingsSections.map((section, idx) => (
          <div key={idx} className="bg-white rounded-xl border border-gray-100 overflow-hidden mb-4">
            <div className="p-4 border-b border-gray-100 flex items-center gap-2">
              <section.icon className="w-5 h-5 text-gray-500" />
              <h3 className="font-semibold text-gray-900">{section.title}</h3>
            </div>
            <div className="divide-y divide-gray-100">
              {section.items.map((item, itemIdx) => (
                <div key={itemIdx} className="p-4 flex items-center justify-between">
                  <span className="text-sm text-gray-700">{item.label}</span>
                  {item.type === 'toggle' ? (
                    <button 
                      onClick={() => (item as any).onChange(!(item as any).value)}
                      className={`w-10 h-5 rounded-full transition ${
                        (item as any).value ? 'bg-red-600' : 'bg-gray-300'
                      }`}
                    >
                      <div className={`w-4 h-4 bg-white rounded-full transition ${
                        (item as any).value ? 'translate-x-5' : 'translate-x-0.5'
                      } mt-0.5`}></div>
                    </button>
                  ) : item.type === 'link' ? (
                    <Link href={(item as any).link} className="text-gray-400 hover:text-gray-600">
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  ) : (
                    <span className="text-sm text-gray-500">{(item as any).value}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Logout Button */}
        <button className="w-full py-3 bg-white border border-red-200 text-red-600 font-medium rounded-xl hover:bg-red-50 transition flex items-center justify-center gap-2">
          <LogOut className="w-4 h-4" />
          Logout
        </button>

        {/* Version */}
        <p className="text-center text-xs text-gray-400 mt-6">Version 1.0.0</p>
      </div>
    </div>
  )
}