'use client'

import React, { useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowRight, Play, Shield, Clock, Users, Video } from 'lucide-react'
import { Hero3DCanvas } from '../3d/Hero3DCanvas'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

interface Hero3DSectionProps {
  liveKitchensCount: number
}

export function Hero3DSection({ liveKitchensCount }: Hero3DSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const scrollProgressRef = useRef<number>(0)

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)

    if (!containerRef.current) return

    // Master ScrollTrigger timeline for 3D Camera progression
    const st = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: '+=150%',
      pin: true,
      scrub: 0.8,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress
      },
    })

    return () => {
      st.kill()
    }
  }, [])

  return (
    <div ref={containerRef} className="relative w-full h-screen bg-gray-950 overflow-hidden text-white">
      {/* Background 3D Interactive WebGL Environment */}
      <div className="absolute inset-0 z-0">
        <Hero3DCanvas scrollProgressRef={scrollProgressRef} />
      </div>

      {/* Subtle Dark Vignette & Gradient Overlay for Contrast */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-gray-950/85 via-gray-950/40 to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 z-10 bg-gradient-to-t from-gray-950 to-transparent pointer-events-none" />

      {/* Responsive HTML Content Overlay */}
      <div className="relative z-20 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-8 lg:py-12 pointer-events-none">
        {/* Top Announcement Tag */}
        <div className="pt-16 sm:pt-4 pointer-events-auto">
          <Link
            href="/live-kitchens"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-red-950/80 border border-red-500/30 backdrop-blur-md rounded-full hover:bg-red-900/60 transition shadow-lg"
          >
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping" />
            <span className="text-xs font-bold text-red-400 tracking-wide uppercase">
              {liveKitchensCount} Kitchens Broadcasting Live Now
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-red-400" />
          </Link>
        </div>

        {/* Hero Headline & Supporting Copy */}
        <div className="max-w-xl my-auto space-y-6 pointer-events-auto">
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-red-500 flex items-center gap-2">
              <span className="w-6 h-0.5 bg-red-600" />
              Live Food Stream Platform
            </span>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08]">
              Watch Your Food <br />
              <span className="bg-gradient-to-r from-red-500 via-amber-400 to-orange-400 bg-clip-text text-transparent">
                Come to Life
              </span>
            </h1>
          </div>

          <p className="text-sm sm:text-base text-gray-300 font-medium leading-relaxed max-w-md">
            Experience real-time culinary transparency. Watch master chefs stretch, bake, and plate your dish live before it arrives hot at your doorstep.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link
              href="/restaurants"
              className="px-7 py-3.5 bg-red-600 hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-xl shadow-red-600/30 transition transform hover:-translate-y-0.5"
            >
              Order Food Now
            </Link>

            <Link
              href="/live-kitchens"
              className="px-6 py-3.5 bg-gray-900/80 hover:bg-gray-800 border border-gray-700 text-white font-bold text-xs rounded-xl backdrop-blur-md transition flex items-center gap-2"
            >
              <Play className="w-4 h-4 text-red-500 fill-red-500" /> Watch Live Streams
            </Link>
          </div>

          {/* Trust Highlights */}
          <div className="pt-6 border-t border-white/10 flex flex-wrap items-center gap-6 text-xs text-gray-300 font-semibold">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>100% Verified Kitchens</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>30-Min Delivery</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-400" />
              <span>10,000+ Active Foodies</span>
            </div>
          </div>
        </div>

        {/* Scroll Indicator Prompt */}
        <div className="pb-4 flex items-center justify-between text-xs text-gray-400 font-bold pointer-events-auto">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-gray-300">Interactive 3D Stage</span>
          </div>

          <div className="flex items-center gap-2 text-gray-400">
            <span>Scroll to Explore Open Kitchen</span>
            <div className="w-4 h-7 border-2 border-gray-600 rounded-full flex justify-center p-1">
              <div className="w-1 h-1.5 bg-red-500 rounded-full animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
