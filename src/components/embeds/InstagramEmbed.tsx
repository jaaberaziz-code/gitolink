'use client'

import { useEffect, useRef, useState } from 'react'
import { FiInstagram, FiExternalLink, FiLoader } from 'react-icons/fi'

interface InstagramEmbedProps {
  url: string
  title?: string
}

export function InstagramEmbed({ url, title }: InstagramEmbedProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const embedRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load Instagram embed script
    const loadInstagramScript = () => {
      if (document.getElementById('instagram-embed-script')) {
        // Script already loaded, process embeds
        if ((window as any).instgrm) {
          (window as any).instgrm.Embeds.process()
        }
        return
      }

      const script = document.createElement('script')
      script.id = 'instagram-embed-script'
      script.async = true
      script.defer = true
      script.src = '//www.instagram.com/embed.js'
      script.onload = () => {
        if ((window as any).instgrm) {
          (window as any).instgrm.Embeds.process()
        }
      }
      document.body.appendChild(script)
    }

    loadInstagramScript()

    // Set a timeout to hide loading spinner
    const timer = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [url])

  const postUrl = normalizeInstagramUrl(url)
  
  if (!postUrl) {
    return null
  }

  return (
    <div className="w-full rounded-xl overflow-hidden bg-gray-900">
      <div ref={embedRef} className="relative">
        {/* Loading spinner */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-800 z-10">
            <div className="flex flex-col items-center gap-3">
              <FiLoader className="w-8 h-8 text-pink-500 animate-spin" />
              <span className="text-gray-400 text-sm">Loading Instagram...</span>
            </div>
          </div>
        )}
        
        {/* Instagram embed */}
        <blockquote
          className="instagram-media w-full min-w-0"
          data-instgrm-permalink={postUrl}
          data-instgrm-version="14"
          style={{
            background: '#FFF',
            border: '0',
            borderRadius: '3px',
            boxShadow: '0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15)',
            margin: '1px',
            maxWidth: '540px',
            minWidth: '326px',
            padding: '0',
            width: 'calc(100% - 2px)',
          }}
        >
          <div style={{ padding: '16px' }}>
            <a
              href={postUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: '#FFFFFF',
                lineHeight: '0',
                padding: '0 0',
                textAlign: 'center',
                textDecoration: 'none',
                width: '100%',
              }}
            >
              View this post on Instagram
            </a>
          </div>
        </blockquote>
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between p-3 bg-gray-800/50 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <FiInstagram className="w-5 h-5 text-pink-500" />
          <span className="text-gray-300 text-sm truncate max-w-[200px] md:max-w-xs">
            {title || 'View on Instagram'}
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

function normalizeInstagramUrl(url: string): string | null {
  // Handle various Instagram URL formats
  const postMatch = url.match(/instagram\.com\/p\/([^\/\s?]+)/)
  const reelMatch = url.match(/instagram\.com\/reel\/([^\/\s?]+)/)
  
  const postId = postMatch?.[1] || reelMatch?.[1]
  
  if (postId) {
    return `https://www.instagram.com/p/${postId}/`
  }
  
  // If already a clean URL, return as-is
  if (url.includes('instagram.com')) {
    return url.split('?')[0] // Remove query params
  }
  
  return null
}

export function isInstagramUrl(url: string): boolean {
  return url.includes('instagram.com')
}

// TypeScript declaration for Instagram embed
declare global {
  interface Window {
    instgrm?: {
      Embeds: {
        process: () => void
      }
    }
  }
}
