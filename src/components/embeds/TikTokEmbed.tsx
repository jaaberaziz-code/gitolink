'use client'

import { useEffect, useRef, useState } from 'react'
import { FiMusic, FiExternalLink, FiLoader } from 'react-icons/fi'

interface TikTokEmbedProps {
  url: string
  title?: string
}

export function TikTokEmbed({ url, title }: TikTokEmbedProps) {
  const [loading, setLoading] = useState(true)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const embedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load TikTok embed script
    const loadTikTokScript = () => {
      if (document.getElementById('tiktok-embed-script')) {
        setScriptLoaded(true)
        // Script already loaded
        if ((window as any).TikTokEmbed) {
          (window as any).TikTokEmbed.reload()
        }
        return
      }

      const script = document.createElement('script')
      script.id = 'tiktok-embed-script'
      script.async = true
      script.src = 'https://www.tiktok.com/embed.js'
      script.onload = () => {
        setScriptLoaded(true)
        if ((window as any).TikTokEmbed) {
          (window as any).TikTokEmbed.reload()
        }
      }
      document.body.appendChild(script)
    }

    loadTikTokScript()

    // Hide loading after a reasonable time
    const timer = setTimeout(() => {
      setLoading(false)
    }, 3000)

    return () => clearTimeout(timer)
  }, [url])

  // Reload embed when script is loaded
  useEffect(() => {
    if (scriptLoaded && (window as any).TikTokEmbed) {
      (window as any).TikTokEmbed.reload()
    }
  }, [scriptLoaded, url])

  const videoId = extractTikTokVideoId(url)
  
  if (!videoId) {
    return null
  }

  // Extract username for cleaner display
  const username = extractTikTokUsername(url)

  return (
    <div className="w-full rounded-xl overflow-hidden bg-gray-900">
      <div ref={embedRef} className="relative flex justify-center">
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10 min-h-[300px]">
            <div className="flex flex-col items-center gap-3">
              <FiLoader className="w-8 h-8 text-cyan-400 animate-spin" />
              <span className="text-gray-400 text-sm">Loading TikTok...</span>
            </div>
          </div>
        )}
        
        {/* TikTok embed using blockquote method */}
        <blockquote
          className="tiktok-embed w-full max-w-[325px]"
          cite={url}
          data-video-id={videoId}
          style={{ maxWidth: '325px', minWidth: '325px' }}
        >
          <section>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={url}
              title={title || 'TikTok video'}
            >
              {title || 'Watch on TikTok'}
            </a>
          </section>
        </blockquote>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between p-3 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z"/>
          </svg>
          <span className="text-gray-300 text-sm truncate max-w-[200px] md:max-w-xs">
            {username ? `@${username}` : (title || 'View on TikTok')}
          </span>
        </div>
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
  )
}

function extractTikTokVideoId(url: string): string | null {
  // Handle various TikTok URL formats
  // Format: https://www.tiktok.com/@username/video/1234567890
  const videoMatch = url.match(/tiktok\.com\/@[^\/]+\/video\/(\d+)/)
  if (videoMatch) {
    return videoMatch[1]
  }
  
  // Format: https://vm.tiktok.com/AbCdEfG/ (short URL)
  // Short URLs need to be resolved server-side, but we'll try to handle what we can
  
  // Format: https://www.tiktok.com/t/ZT8xyzABC/ (newer short format)
  const shortMatch = url.match(/tiktok\.com\/[tv]\/[A-Za-z0-9]+/)
  if (shortMatch) {
    // For short URLs, we can't extract the video ID client-side
    // The embed script should handle this
    return 'short-url'
  }
  
  return null
}

function extractTikTokUsername(url: string): string | null {
  const match = url.match(/tiktok\.com\/(@[^\/]+)/)
  return match?.[1]?.replace('@', '') || null
}

export function isTikTokUrl(url: string): boolean {
  return url.includes('tiktok.com')
}

// TypeScript declaration for TikTok embed
declare global {
  interface Window {
    TikTokEmbed?: {
      reload: () => void
    }
  }
}
