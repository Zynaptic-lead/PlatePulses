'use client'

import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="font-bold text-lg text-gray-900">PlatePulse</span>
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              Watch your food come to life with live kitchen streaming. Fresh, transparent, and delivered to your door.
            </p>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-sm text-gray-500 hover:text-gray-900 transition">About Us</Link></li>
              <li><Link href="/careers" className="text-sm text-gray-500 hover:text-gray-900 transition">Careers</Link></li>
              <li><Link href="/blog" className="text-sm text-gray-500 hover:text-gray-900 transition">Blog</Link></li>
              <li><Link href="/driver/login" className="text-sm text-gray-500 hover:text-gray-900 transition">Become a Driver</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Support</h4>
            <ul className="space-y-2">
              <li><Link href="/help" className="text-sm text-gray-500 hover:text-gray-900 transition">Help Center</Link></li>
              <li><Link href="/safety" className="text-sm text-gray-500 hover:text-gray-900 transition">Safety</Link></li>
              <li><Link href="/contact" className="text-sm text-gray-500 hover:text-gray-900 transition">Contact</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-3 text-sm">Legal</h4>
            <ul className="space-y-2">
              <li><Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900 transition">Terms</Link></li>
              <li><Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900 transition">Privacy</Link></li>
              <li><Link href="/cookies" className="text-sm text-gray-500 hover:text-gray-900 transition">Cookies</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-10 pt-8">
          <p className="text-center text-sm text-gray-400">
            © {new Date().getFullYear()} PlatePulse. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}