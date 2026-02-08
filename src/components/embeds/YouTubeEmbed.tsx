'use client'

import { useState } from 'react'
import { FiPlay, FiExternalLink, FiMaximize2, FiMinimize2 } from 'react-icons/fi'

interface YouTubeEmbedProps {
  url: string
  title?: string
  autoplay?: boolean
}

export function YouTubeEmbed({ url, title, autoplay = false }: YouTubeEmbedProps) {
  const [showEmbed, setShowEmbed] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  const videoId = extractYouTubeId(url)
  
  if (!videoId) {
    return null
  }

  const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0${autoplay ? '&autoplay=1' : ''}`

  return (
    <div className={`w-full rounded-xl overflow-hidden bg-gray-900 ${isExpanded ? 'fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4' : ''}`}>
      {isExpanded && (
        <button
          onClick={() => setIsExpanded(false)}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
        >
          <FiMinimize2 className="w-6 h-6" />
        </button>
      )}
      
      <div className={`relative ${isExpanded ? 'w-full max-w-5xl' : ''}`}>
        {!showEmbed ? (
          <div 
            className="relative aspect-video cursor-pointer group"
            onClick={() => setShowEmbed(true)}
          >
            <img
              src={thumbnailUrl}
              alt={title || 'YouTube video thumbnail'}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Fallback to standard quality if maxres doesn't exist
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
              }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors flex items-center justify-center">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-red-600 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                <FiPlay className="w-8 h-8 md:w-10 md:h-10 text-white ml-1" />
              </div>
            </div>
            
            {/* YouTube branding */}
            <div className="absolute top-3 left-3 flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-full">
              <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span className="text-white text-sm font-medium">YouTube</span>
            </div>
          </div>
        ) : (
          <div className={`relative ${isExpanded ? 'aspect-video' : 'aspect-video'}`}>
            <iframe
              src={embedUrl}
              title={title || 'YouTube video'}
              className="absolute inset-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
        
        {/* Controls */}
        <div className="flex items-center justify-between p-3 bg-gray-800/50 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <span className="text-gray-300 text-sm truncate max-w-[200px] md:max-w-xs">
              {title || 'Watch on YouTube'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {!isExpanded && (
              <button
                onClick={() => setIsExpanded(true)}
                className="p-2 text-gray-400 hover:text-white transition-colors"
                title="Expand"
              >
                <FiMaximize2 className="w-4 h-4" />
              </button>
            )}
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Open in new tab"
            >
              <FiExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

function extractYouTubeId(url: string): string | null {
  // Handle various YouTube URL formats
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s?]+)/,
    /youtube\.com\/shorts\/([^&\s?]+)/,
  ]
  
  for (const pattern of patterns) {
    const match = url.match(pattern)
    if (match) {
      return match[1]
    }
  }
  
  return null
}

export function isYouTubeUrl(url: string): boolean {
  return url.includes('youtube.com') || url.includes('youtu.be')
}
