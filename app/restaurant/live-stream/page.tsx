'use client'

import { useState, useEffect } from 'react'
import { 
  Video, VideoOff, Mic, MicOff, Eye, MessageSquare, 
  Send, Sparkles, Flame, Heart, Settings, Radio, 
  Camera, ShieldCheck, RefreshCw, AlertCircle, Share2, Award, X
} from 'lucide-react'

interface ChatMessage {
  id: string
  user: string
  avatar: string
  message: string
  time: string
  isChef?: boolean
}

export default function LiveBroadcastStudio() {
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  const [showStartModal, setShowStartModal] = useState(false)
  const [liveCaption, setLiveCaption] = useState('🔥 Preparing fresh signature dishes live right now!')
  const [liveDescription, setLiveDescription] = useState('Watch our kitchen team prepare gourmet dishes live in real-time. Ask questions and order directly!')
  const [selectedCamera, setSelectedCamera] = useState('cam1')
  const [isMicMuted, setIsMicMuted] = useState(false)
  const [viewerCount, setViewerCount] = useState(0)
  const [reactionHearts, setReactionHearts] = useState(0)
  const [reactionFires, setReactionFires] = useState(0)
  const [announcementText, setAnnouncementText] = useState('🔥 Kitchen live stream broadcast is ready!')
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([])
  const [inputMessage, setInputMessage] = useState('')

  // Load existing stream settings
  useEffect(() => {
    const saved = localStorage.getItem('liveStreamSettings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        if (parsed.caption) setLiveCaption(parsed.caption)
        if (parsed.description) setLiveDescription(parsed.description)
        if (parsed.caption) setAnnouncementText(parsed.caption)
        if (parsed.isBroadcasting) setIsBroadcasting(true)
      } catch (e) {}
    }
  }, [])

  // Start live stream broadcast handler
  const handleStartBroadcast = (e: React.FormEvent) => {
    e.preventDefault()
    setIsBroadcasting(true)
    setAnnouncementText(liveCaption)
    setShowStartModal(false)
    localStorage.setItem('liveStreamSettings', JSON.stringify({
      isBroadcasting: true,
      caption: liveCaption,
      description: liveDescription
    }))
  }

  // End stream broadcast handler
  const handleEndBroadcast = () => {
    setIsBroadcasting(false)
    localStorage.setItem('liveStreamSettings', JSON.stringify({
      isBroadcasting: false,
      caption: liveCaption,
      description: liveDescription
    }))
  }

  // Simulate viewer fluctuation when stream is broadcasting
  useEffect(() => {
    if (!isBroadcasting) {
      setViewerCount(0)
      return
    }
    setViewerCount(1)

    const interval = setInterval(() => {
      setViewerCount(prev => Math.max(1, prev + Math.floor(Math.random() * 3) - 1))
      setReactionHearts(prev => prev + Math.floor(Math.random() * 2))
    }, 4000)

    return () => clearInterval(interval)
  }, [isBroadcasting])

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      user: 'Chef Mario (Kitchen Host)',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=100&auto=format',
      message: inputMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isChef: true
    }

    setChatMessages(prev => [...prev, newMsg])
    setInputMessage('')
  }

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${isBroadcasting ? 'bg-red-600 animate-ping' : 'bg-gray-400'}`} />
            <h2 className="text-xl font-bold text-gray-900">Live Kitchen Broadcast Studio</h2>
            {isBroadcasting && (
              <span className="px-2.5 py-0.5 bg-red-600 text-white text-[10px] font-extrabold rounded-full tracking-wider animate-pulse">
                BROADCASTING LIVE
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 mt-1">Stream live kitchen preparation to customers to build trust & boost orders</p>
        </div>

        {/* Toggle Broadcast Button */}
        <button 
          onClick={() => {
            if (isBroadcasting) {
              handleEndBroadcast()
            } else {
              setShowStartModal(true)
            }
          }}
          className={`px-6 py-2.5 font-bold text-sm rounded-xl shadow-md transition flex items-center gap-2 ${
            isBroadcasting 
              ? 'bg-gray-900 hover:bg-black text-white' 
              : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'
          }`}
        >
          {isBroadcasting ? (
            <>
              <VideoOff className="w-4 h-4 text-red-400" /> End Broadcast Stream
            </>
          ) : (
            <>
              <Radio className="w-4 h-4 text-white animate-pulse" /> Start Live Stream
            </>
          )}
        </button>
      </div>

      {/* Grid: Left Video Studio, Right Live Customer Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns: Video Feed & Studio Controls */}
        <div className="lg:col-span-2 space-y-4">
          {/* Main Camera Viewport */}
          <div className="relative rounded-3xl overflow-hidden bg-gray-950 aspect-video shadow-2xl border border-gray-800 flex items-center justify-center">
            {isBroadcasting ? (
              <>
                {/* Simulated Camera Video Feed */}
                <img 
                  src={
                    selectedCamera === 'cam1' 
                      ? 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200&auto=format'
                      : selectedCamera === 'cam2'
                      ? 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=1200&auto=format'
                      : 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=1200&auto=format'
                  }
                  alt="Live Kitchen Feed"
                  className="w-full h-full object-cover"
                />

                {/* Top Overlay Badges */}
                <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-red-600/90 backdrop-blur-md text-white font-extrabold text-xs rounded-full flex items-center gap-1.5 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" /> LIVE
                    </span>
                    <span className="px-3 py-1 bg-gray-900/80 backdrop-blur-md text-white font-bold text-xs rounded-full flex items-center gap-1 shadow-lg">
                      <Eye className="w-3.5 h-3.5 text-red-400" /> {viewerCount} Viewers
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-black/70 backdrop-blur-md text-emerald-400 font-mono font-bold text-xs rounded-full shadow-lg">
                      1080p • 60 FPS
                    </span>
                  </div>
                </div>

                {/* Bottom Announcement Banner */}
                <div className="absolute bottom-4 left-4 right-4 bg-gray-900/85 backdrop-blur-md p-3 rounded-2xl border border-gray-700/60 text-white flex items-center justify-between shadow-xl">
                  <p className="text-xs font-semibold truncate text-amber-300">{announcementText}</p>
                  <div className="flex items-center gap-3 text-xs font-bold shrink-0 ml-2">
                    <span className="flex items-center gap-1 text-rose-400"><Heart className="w-3.5 h-3.5 fill-rose-400" /> {reactionHearts}</span>
                    <span className="flex items-center gap-1 text-amber-400"><Flame className="w-3.5 h-3.5 fill-amber-400" /> {reactionFires}</span>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center p-8 space-y-3">
                <div className="w-16 h-16 rounded-full bg-gray-900 text-gray-500 flex items-center justify-center mx-auto border border-gray-800">
                  <VideoOff className="w-8 h-8" />
                </div>
                <h3 className="text-white font-bold text-lg">Broadcast Stream Offline</h3>
                <p className="text-xs text-gray-400 max-w-sm mx-auto">Click "Start Live Stream" above to enable your kitchen camera feed for customers</p>
              </div>
            )}
          </div>

          {/* Studio Hardware Controls & Settings */}
          <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-xs space-y-4">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <Camera className="w-4 h-4 text-red-600" /> Camera & Broadcast Hardware Switch
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Camera Selector */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Active Camera Angle</label>
                <select 
                  value={selectedCamera}
                  onChange={(e) => setSelectedCamera(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none focus:border-gray-900"
                >
                  <option value="cam1">🎥 Cam 01: Pizza Prep Table</option>
                  <option value="cam2">🔥 Cam 02: Wood-Fired Oven</option>
                  <option value="cam3">🍽️ Cam 03: Plating & Handover</option>
                </select>
              </div>

              {/* Audio Controls */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Kitchen Ambience Mic</label>
                <button 
                  onClick={() => setIsMicMuted(!isMicMuted)}
                  className={`w-full py-2 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition ${
                    isMicMuted 
                      ? 'bg-rose-50 text-rose-600 border-rose-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}
                >
                  {isMicMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  <span>{isMicMuted ? 'Mic Muted' : 'Mic Active (Live Audio)'}</span>
                </button>
              </div>

              {/* Share Stream */}
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Promote Broadcast</label>
                <button className="w-full py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition">
                  <Share2 className="w-4 h-4" /> Copy Stream Link
                </button>
              </div>
            </div>

            {/* Announcement Banner Editor */}
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Live Announcement Ticker</label>
              <input 
                type="text"
                value={announcementText}
                onChange={(e) => setAnnouncementText(e.target.value)}
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium outline-none focus:border-gray-900"
              />
            </div>
          </div>
        </div>

        {/* Right 1 Column: Real-Time Customer Chat Room */}
        <div className="bg-white rounded-3xl border border-gray-200 shadow-xs flex flex-col h-[560px] overflow-hidden">
          {/* Chat Header */}
          <div className="p-4 bg-gray-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-red-400" />
              <h3 className="font-bold text-sm">Customer Live Chat</h3>
            </div>
            <span className="text-[11px] bg-gray-800 text-gray-300 px-2.5 py-0.5 rounded-full font-medium">
              {chatMessages.length} Messages
            </span>
          </div>

          {/* Chat Stream List */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
            {chatMessages.map(msg => (
              <div 
                key={msg.id} 
                className={`p-3 rounded-2xl text-xs space-y-1 ${
                  msg.isChef 
                    ? 'bg-red-600 text-white ml-4 shadow-sm' 
                    : 'bg-white text-gray-900 border border-gray-100 mr-4 shadow-2xs'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 font-bold">
                    <img src={msg.avatar} alt={msg.user} className="w-5 h-5 rounded-full object-cover" />
                    <span>{msg.user}</span>
                    {msg.isChef && <span className="text-[9px] bg-black/30 px-1.5 py-0.2 rounded-full font-mono">HOST</span>}
                  </div>
                  <span className={`text-[10px] ${msg.isChef ? 'text-red-200' : 'text-gray-400'}`}>{msg.time}</span>
                </div>
                <p className="leading-relaxed font-medium">{msg.message}</p>
              </div>
            ))}

            {chatMessages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400 text-xs">
                <MessageSquare className="w-8 h-8 mb-2 text-gray-300" />
                <p className="font-bold text-gray-600">No chat messages yet</p>
                <p className="text-[11px] mt-0.5">Comments from customers watching your stream will appear here in real time!</p>
              </div>
            )}
          </div>

          {/* Chat Input Box */}
          <form onSubmit={handleSendChat} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2">
            <input 
              type="text"
              placeholder="Reply to viewers as Kitchen Host..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs outline-none focus:border-gray-900"
            />
            <button 
              type="submit"
              className="p-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-sm transition"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Start Live Stream Broadcast Modal */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 bg-gray-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="p-6 bg-gray-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Radio className="w-5 h-5 text-red-500 animate-pulse" />
                <h3 className="text-lg font-bold">Start Live Broadcast</h3>
              </div>
              <button onClick={() => setShowStartModal(false)} className="p-1.5 text-gray-400 hover:text-white rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleStartBroadcast} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Live Caption / Stream Title</label>
                <input 
                  type="text"
                  required
                  placeholder="e.g. 🔥 Sizzling Wood-Fired Margherita Pizza Live!"
                  value={liveCaption}
                  onChange={(e) => setLiveCaption(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase mb-1">Live Stream Description</label>
                <textarea 
                  rows={3}
                  required
                  placeholder="Describe what your kitchen is preparing live..."
                  value={liveDescription}
                  onChange={(e) => setLiveDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none focus:border-gray-900 focus:bg-white"
                />
              </div>

              <div className="p-4 bg-red-50 rounded-2xl border border-red-100 text-xs text-red-800 space-y-1">
                <p className="font-bold flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-red-600" /> Pro Tip for Kitchen Hosts</p>
                <p className="text-red-700">Customers watching your stream will see this caption & description directly on their live video feed and can order food in real time!</p>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setShowStartModal(false)}
                  className="px-5 py-2.5 border border-gray-200 text-gray-700 font-bold text-sm rounded-xl hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-2.5 bg-red-600 text-white font-bold text-sm rounded-xl hover:bg-red-700 shadow-md shadow-red-600/20 flex items-center gap-2"
                >
                  <Radio className="w-4 h-4" /> Go Live Now 🔴
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
