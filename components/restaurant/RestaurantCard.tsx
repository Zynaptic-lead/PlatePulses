'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { 
  Star, 
  Clock, 
  Truck, 
  Video, 
  Heart, 
  MapPin,
  ChevronRight 
} from 'lucide-react'
import { cn, formatPrice, formatDistance } from '../../lib/utils'

interface RestaurantCardProps {
  id: string
  name: string
  description: string
  cuisine: string[]
  rating: number
  deliveryTime: number
  deliveryFee: number
  minOrderAmount: number
  imageUrl: string
  isLive?: boolean
  distance?: number
  isOpen?: boolean
  onClick?: () => void
}

export function RestaurantCard({
  id,
  name,
  description,
  cuisine,
  rating,
  deliveryTime,
  deliveryFee,
  minOrderAmount,
  imageUrl,
  isLive = false,
  distance,
  isOpen = true,
  onClick
}: RestaurantCardProps) {
  const [isLiked, setIsLiked] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "group cursor-pointer rounded-2xl bg-white shadow-lg transition-all duration-300",
        "hover:shadow-2xl dark:bg-gray-800",
        isHovered && "scale-[1.02]"
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      {/* Image Container */}
      <div className="relative h-48 w-full overflow-hidden rounded-t-2xl">
        <Image
          src={imageUrl}
          alt={name}
          fill
          className={cn(
            "object-cover transition-transform duration-500",
            isHovered && "scale-110"
          )}
        />
        
        {/* Live Badge - UNIQUE FEATURE */}
        {isLive && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-red-600 px-3 py-1.5 shadow-lg"
          >
            <div className="relative flex h-2 w-2">
              <div className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></div>
              <div className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></div>
            </div>
            <span className="text-xs font-semibold text-white">LIVE KITCHEN</span>
            <Video className="h-3 w-3 text-white" />
          </motion.div>
        )}
        
        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
          }}
          className="absolute right-3 top-3 rounded-full bg-white/90 p-2 backdrop-blur-sm transition-all hover:scale-110 dark:bg-gray-800/90"
        >
          <Heart
            className={cn(
              "h-5 w-5 transition-colors",
              isLiked ? "fill-red-500 text-red-500" : "text-gray-600 dark:text-gray-300"
            )}
          />
        </button>
        
        {/* Closed Badge */}
        {!isOpen && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <span className="rounded-full bg-gray-900 px-4 py-2 text-sm font-semibold text-white">
              Closed Now
            </span>
          </div>
        )}
      </div>
      
      {/* Content */}
      <div className="p-4">
        {/* Restaurant Name & Rating */}
        <div className="mb-2 flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1">
              {name}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
              {cuisine.join(' • ')}
            </p>
          </div>
          <div className="flex items-center gap-1 rounded-lg bg-green-50 px-2 py-1 dark:bg-green-900/30">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {rating.toFixed(1)}
            </span>
          </div>
        </div>
        
        {/* Description */}
        <p className="mb-3 text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {description}
        </p>
        
        {/* Delivery Info */}
        <div className="mb-3 flex flex-wrap items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
          <div className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            <span>{deliveryTime} mins</span>
          </div>
          <div className="flex items-center gap-1">
            <Truck className="h-3.5 w-3.5" />
            <span>{deliveryFee === 0 ? 'Free' : formatPrice(deliveryFee)} delivery</span>
          </div>
          {distance && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3.5 w-3.5" />
              <span>{formatDistance(distance)} away</span>
            </div>
          )}
        </div>
        
        {/* Min Order & Action */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-3 dark:border-gray-700">
          <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
            Min. order {formatPrice(minOrderAmount)}
          </span>
          <motion.div
            whileHover={{ x: 4 }}
            className="flex items-center gap-1 text-sm font-semibold text-orange-600 dark:text-orange-500"
          >
            <span>View Menu</span>
            <ChevronRight className="h-4 w-4" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}