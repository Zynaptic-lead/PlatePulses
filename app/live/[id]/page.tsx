'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter } from 'next/navigation'
import Header from '../../../components/layout/Header'
import Footer from '../../../components/layout/Footer'
import { 
  ArrowLeft, Video, Eye, Heart, Share2, Maximize2, 
  Volume2, VolumeX, MessageCircle, ThumbsUp, Send, Star,
  MoreVertical, Clock, Users, ChefHat, User, Play, Pause,
  Link2, Twitter, Facebook, Copy, Check, Flag, X,
  Home, ShoppingBag, Info
} from 'lucide-react'

// Mock data
const getLiveStream = async (id: string) => {
  const streams: Record<string, any> = {
    '1': {
      id: 1,
      restaurantName: 'Pizza Heaven',
      chef: 'Chef Mario Rossi',
      dish: 'Margherita Pizza',
      orderId: 'PP-2341',
      readyTime: 8,
      videoUrl: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format',
      thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format',
      rating: 4.8,
      viewers: 234,
      likes: 1234,
      description: 'Watch Chef Mario prepare authentic Neapolitan pizzas in our wood-fired oven. Using fresh mozzarella, San Marzano tomatoes, and basil from our garden. Learn the secrets of perfect pizza making!',
      streamStarted: '2 hours ago',
      category: 'Cooking',
      tags: ['pizza', 'italian', 'cooking', 'live'],
      recommendedVideos: [
        { id: 2, title: 'Burger House Live', chef: 'Chef Sarah', viewers: 156, thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&auto=format', isLive: true },
        { id: 3, title: 'Mediterranean Grill', chef: 'Chef Elena', viewers: 89, thumbnail: 'https://images.unsplash.com/photo-1541518763669-27fef04b14d1?w=400&auto=format', isLive: true },
      ],
      comments: [
        { id: 1, user: 'FoodLover', avatar: 'F', text: 'That pizza looks amazing! 🍕 The crust is perfect!', time: '2 min ago', likes: 12, replies: 3 },
        { id: 2, user: 'ChefFan', avatar: 'C', text: 'Chef Mario is the best! Love watching these streams.', time: '5 min ago', likes: 8, replies: 1 },
      ]
    },
    '2': {
      id: 2,
      restaurantName: 'Burger House',
      chef: 'Chef Sarah Johnson',
      dish: 'Classic Cheeseburger',
      orderId: 'PP-2342',
      readyTime: 12,
      videoUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&auto=format',
      thumbnail: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=1200&auto=format',
      rating: 4.7,
      viewers: 156,
      likes: 892,
      description: 'Watch Chef Sarah grill the perfect burger with our secret sauce, fresh lettuce, and house-made brioche buns.',
      streamStarted: '1 hour ago',
      category: 'Grilling',
      tags: ['burger', 'american', 'grilling', 'live'],
      recommendedVideos: [
        { id: 1, title: 'Pizza Heaven', chef: 'Chef Mario', viewers: 234, thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format', isLive: true },
      ],
      comments: [
        { id: 1, user: 'BurgerKing', avatar: 'B', text: 'That sizzle though! 🔥 Making me hungry!', time: '3 min ago', likes: 15, replies: 2 },
      ]
    },
    '3': {
      id: 3,
      restaurantName: 'Mediterranean Grill',
      chef: 'Chef Elena Papadakis',
      dish: 'Chicken Souvlaki',
      orderId: 'PP-2343',
      readyTime: 15,
      videoUrl: 'https://images.unsplash.com/photo-1541518763669-27fef04b14d1?w=1200&auto=format',
      thumbnail: 'https://images.unsplash.com/photo-1541518763669-27fef04b14d1?w=1200&auto=format',
      rating: 4.8,
      viewers: 89,
      likes: 567,
      description: 'Fresh Mediterranean cuisine with organic ingredients and traditional Greek recipes.',
      streamStarted: '3 hours ago',
      category: 'Mediterranean',
      tags: ['greek', 'mediterranean', 'healthy', 'live'],
      recommendedVideos: [
        { id: 1, title: 'Pizza Heaven', chef: 'Chef Mario', viewers: 234, thumbnail: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&auto=format', isLive: true },
      ],
      comments: [],
    },
  }
  return streams[id] || null
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default function LiveStreamPage({ params }: PageProps) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const returnUrl = searchParams.get('returnTo') || '/'
  
  const [stream, setStream] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState<any[]>([])
  const [showControls, setShowControls] = useState(true)
  const [showShareDropdown, setShowShareDropdown] = useState(false)
  const [showMoreDropdown, setShowMoreDropdown] = useState(false)
  const [showCommentsMoreDropdown, setShowCommentsMoreDropdown] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [likeAnimation, setLikeAnimation] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const shareRef = useRef<HTMLDivElement>(null)
  const moreRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    params.then(async ({ id }) => {
      const data = await getLiveStream(id)
      setStream(data)
      if (data?.comments) {
        setComments(data.comments)
      }
      if (data?.likes) {
        setLikeCount(data.likes)
      }
      setLoading(false)
    })
  }, [params])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (shareRef.current && !shareRef.current.contains(event.target as Node)) {
        setShowShareDropdown(false)
      }
      if (moreRef.current && !moreRef.current.contains(event.target as Node)) {
        setShowMoreDropdown(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    let timeout: NodeJS.Timeout
    if (showControls) {
      timeout = setTimeout(() => setShowControls(false), 3000)
    }
    return () => clearTimeout(timeout)
  }, [showControls])

  const handleAddComment = () => {
    if (!comment.trim()) return
    const newComment = {
      id: comments.length + 1,
      user: 'You',
      avatar: 'Y',
      text: comment,
      time: 'Just now',
      likes: 0,
      replies: 0
    }
    setComments([newComment, ...comments])
    setComment('')
  }

  const handleLike = () => {
    if (!isLiked) {
      setLikeCount(prev => prev + 1)
      setLikeAnimation(true)
      setTimeout(() => setLikeAnimation(false), 500)
    } else {
      setLikeCount(prev => prev - 1)
    }
    setIsLiked(!isLiked)
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleCommentLike = (commentId: number) => {
    setComments(prev => prev.map(c => 
      c.id === commentId ? { ...c, likes: c.likes + 1 } : c
    ))
  }

  const handleBack = () => {
    router.push(returnUrl)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-center">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p>Loading stream...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!stream) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-32 text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Stream Not Found</h1>
          <Link href="/live-kitchens" className="text-red-500 hover:text-red-400">
            Back to Live Kitchens
          </Link>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Custom Live Stream Header */}
      <div className="sticky top-0 z-50 bg-black/95 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <button 
                onClick={handleBack}
                className="flex items-center gap-1 sm:gap-2 text-white hover:text-gray-300 transition"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm hidden sm:inline">Back</span>
              </button>
              <div className="w-px h-5 bg-gray-700 hidden sm:block"></div>
              <Link 
                href="/"
                className="flex items-center gap-1 sm:gap-2 text-white hover:text-gray-300 transition"
              >
                <Home className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm hidden sm:inline">Home</span>
              </Link>
              <Link 
                href="/cart"
                className="flex items-center gap-1 sm:gap-2 text-white hover:text-gray-300 transition"
              >
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="text-xs sm:text-sm hidden sm:inline">Cart</span>
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 bg-red-600 rounded-full">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-[10px] sm:text-xs font-medium text-white">LIVE</span>
              </div>
              <div className="flex items-center gap-1 text-white/60 text-xs">
                <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{stream.viewers}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="max-w-[1800px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex flex-col xl:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1">
            {/* Video Player */}
            <div 
              className="relative rounded-2xl overflow-hidden bg-black aspect-video cursor-pointer"
              onMouseEnter={() => setShowControls(true)}
              onMouseLeave={() => setShowControls(false)}
            >
              <img
                src={stream.videoUrl}
                alt={stream.restaurantName}
                className="w-full h-full object-cover"
              />
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              
              {/* Live Badge */}
              <div className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-1.5 bg-red-600 rounded-lg shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="text-sm font-bold text-white">LIVE</span>
                <Eye className="w-3.5 h-3.5 text-white" />
                <span className="text-xs text-white/90">{stream.viewers} watching</span>
              </div>
              
              {/* Video Controls */}
              {showControls && (
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent z-20">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition"
                      >
                        {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                      </button>
                      <button 
                        onClick={() => setIsMuted(!isMuted)}
                        className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition"
                      >
                        {isMuted ? <VolumeX className="w-5 h-5 text-white" /> : <Volume2 className="w-5 h-5 text-white" />}
                      </button>
                      <div className="text-white text-sm hidden sm:block">
                        <span>00:00</span>
                        <span className="mx-1">/</span>
                        <span>00:00</span>
                      </div>
                    </div>
                    <button className="p-2 bg-white/20 hover:bg-white/30 rounded-full transition">
                      <Maximize2 className="w-5 h-5 text-white" />
                    </button>
                  </div>
                  <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
                    <div className="w-0 h-full bg-red-600 rounded-full"></div>
                  </div>
                </div>
              )}
            </div>
            
            {/* Video Info */}
            <div className="mt-4">
              <h1 className="text-xl sm:text-2xl font-bold text-white">{stream.restaurantName} Live: {stream.dish}</h1>
              
              {/* Channel Info */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                    <ChefHat className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{stream.chef}</h3>
                    <p className="text-xs text-gray-400">{stream.restaurantName}</p>
                  </div>
                  <button
                    onClick={() => setIsSubscribed(!isSubscribed)}
                    className={`ml-2 px-4 py-1.5 text-sm font-medium rounded-full transition ${
                      isSubscribed 
                        ? 'bg-gray-700 text-white hover:bg-gray-600' 
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {isSubscribed ? 'Subscribed' : 'Subscribe'}
                  </button>
                </div>
                
                <div className="flex items-center gap-2">
                  {/* Like Button with Animation */}
                  <button 
                    onClick={handleLike}
                    className={`relative flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition ${likeAnimation ? 'scale-125' : ''}`}
                  >
                    <ThumbsUp className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                    <span className="text-white text-sm">{likeCount}</span>
                    {likeAnimation && (
                      <div className="absolute inset-0 bg-red-500/20 rounded-full animate-ping"></div>
                    )}
                  </button>
                  
                  {/* Share Button with Dropdown */}
                  <div className="relative" ref={shareRef}>
                    <button 
                      onClick={() => setShowShareDropdown(!showShareDropdown)}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-full transition"
                    >
                      <Share2 className="w-4 h-4 text-white" />
                      <span className="text-white text-sm hidden sm:inline">Share</span>
                    </button>
                    
                    {showShareDropdown && (
                      <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-xl shadow-lg border border-gray-700 z-30 overflow-hidden">
                        <div className="p-2">
                          <button 
                            onClick={handleShare}
                            className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-lg transition"
                          >
                            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            {copied ? 'Copied!' : 'Copy link'}
                          </button>
                          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-lg transition">
                            <Twitter className="w-4 h-4" />
                            Share on Twitter
                          </button>
                          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-lg transition">
                            <Facebook className="w-4 h-4" />
                            Share on Facebook
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* More Button with Dropdown */}
                  <div className="relative" ref={moreRef}>
                    <button 
                      onClick={() => setShowMoreDropdown(!showMoreDropdown)}
                      className="p-2 bg-gray-800 hover:bg-gray-700 rounded-full transition"
                    >
                      <MoreVertical className="w-5 h-5 text-white" />
                    </button>
                    
                    {showMoreDropdown && (
                      <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-xl shadow-lg border border-gray-700 z-30 overflow-hidden">
                        <div className="p-2">
                          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-lg transition">
                            <Flag className="w-4 h-4" />
                            Report
                          </button>
                          <button className="flex items-center gap-3 w-full px-3 py-2 text-sm text-white hover:bg-gray-700 rounded-lg transition">
                            <X className="w-4 h-4" />
                            Not interested
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Description */}
              <div className="mt-4 p-4 bg-gray-900/50 rounded-xl">
                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mb-3">
                  <span className="flex items-center gap-1">
                    <Eye className="w-4 h-4" />
                    {stream.viewers} watching
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Started {stream.streamStarted}
                  </span>
                  <span className="flex items-center gap-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    {stream.rating} rating
                  </span>
                  <span className="flex items-center gap-1">
                    <Info className="w-4 h-4" />
                    Order #{stream.orderId}
                  </span>
                </div>
                <p className="text-gray-300 text-sm">{stream.description}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {stream.tags.map((tag: string, i: number) => (
                    <span key={i} className="text-xs text-blue-400 hover:text-blue-300 cursor-pointer">#{tag}</span>
                  ))}
                </div>
              </div>
              
              {/* Order Button */}
              <div className="mt-4 p-4 bg-gradient-to-r from-red-600 to-orange-500 rounded-xl">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <h3 className="text-white font-semibold">Want to try this dish?</h3>
                    <p className="text-white/80 text-sm">Order now and get it delivered in {stream.readyTime} minutes</p>
                  </div>
                  <Link 
                    href={`/restaurants/${stream.id}`}
                    className="px-6 py-2.5 bg-white text-red-600 font-semibold rounded-lg hover:bg-gray-100 transition whitespace-nowrap"
                  >
                    Order This Dish
                  </Link>
                </div>
              </div>
            </div>
          </div>
          
          {/* Comments Sidebar */}
          <div className="w-full xl:w-96">
            <div className="bg-gray-900/50 rounded-xl overflow-hidden sticky top-24">
              <div className="flex items-center justify-between p-4 border-b border-gray-800">
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-white" />
                  <h3 className="font-semibold text-white">{comments.length} Comments</h3>
                </div>
              </div>
              
              {/* Comment Input */}
              <div className="p-4 border-b border-gray-800">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      placeholder="Add a comment..."
                      className="w-full bg-transparent text-white placeholder:text-gray-500 border-b border-gray-700 focus:border-red-500 outline-none py-2"
                    />
                  </div>
                  {comment.trim() && (
                    <button
                      onClick={handleAddComment}
                      className="text-red-500 font-medium text-sm hover:text-red-400"
                    >
                      Post
                    </button>
                  )}
                </div>
              </div>
              
              {/* Comments List */}
              <div className="max-h-[500px] overflow-y-auto">
                {comments.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>No comments yet. Be the first to chat!</p>
                  </div>
                ) : (
                  comments.map((c) => (
                    <div key={c.id} className="p-4 border-b border-gray-800 hover:bg-gray-800/50 transition">
                      <div className="flex gap-3">
                        <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="text-xs font-bold text-white">{c.avatar}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between flex-wrap gap-2 mb-1">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-white text-sm">{c.user}</span>
                              <span className="text-xs text-gray-500">{c.time}</span>
                            </div>
                            <div className="relative">
                              <button 
                                onClick={() => setShowCommentsMoreDropdown(showCommentsMoreDropdown === c.id ? null : c.id)}
                                className="text-gray-500 hover:text-white"
                              >
                                <MoreVertical className="w-3 h-3" />
                              </button>
                              {showCommentsMoreDropdown === c.id && (
                                <div className="absolute right-0 mt-1 w-36 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-20">
                                  <button className="w-full px-3 py-1.5 text-xs text-white hover:bg-gray-700 text-left">Report</button>
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm">{c.text}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <button 
                              onClick={() => handleCommentLike(c.id)}
                              className="flex items-center gap-1 text-gray-500 hover:text-white transition"
                            >
                              <ThumbsUp className="w-3 h-3" />
                              <span className="text-xs">{c.likes}</span>
                            </button>
                            <button className="text-xs text-gray-500 hover:text-white transition">Reply</button>
                            {c.replies > 0 && (
                              <button className="text-xs text-gray-500 hover:text-white transition">
                                View {c.replies} replies
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Recommended Videos */}
        {stream.recommendedVideos && stream.recommendedVideos.length > 0 && (
          <div className="mt-8">
            <h3 className="text-lg font-semibold text-white mb-4">Live Now • Recommended</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {stream.recommendedVideos.map((video: any) => (
                <Link key={video.id} href={`/live/${video.id}`} className="group">
                  <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video">
                    <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
                    {video.isLive && (
                      <div className="absolute top-2 left-2 flex items-center gap-1 px-1.5 py-0.5 bg-red-600 rounded text-[10px] font-bold text-white">
                        <div className="w-1 h-1 bg-white rounded-full animate-pulse"></div>
                        LIVE
                      </div>
                    )}
                    <div className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-black/60 rounded text-[10px] text-white">
                      {video.viewers} watching
                    </div>
                  </div>
                  <div className="mt-2">
                    <h4 className="text-white text-sm font-medium group-hover:text-red-500 transition line-clamp-1">{video.title}</h4>
                    <p className="text-gray-400 text-xs mt-1">Chef {video.chef}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  )
}