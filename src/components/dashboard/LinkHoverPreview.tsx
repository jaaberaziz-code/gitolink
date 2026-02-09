'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiExternalLink, FiImage } from 'react-icons/fi'
import type { Link } from '@/types'

interface LinkHoverPreviewProps {
  link: Link
  children: React.ReactNode
}

interface Metadata {
  title: string
  description: string
  image: string
}

export default function LinkHoverPreview({ link, children }: LinkHoverPreviewProps) {
  const [metadata, setMetadata] = useState<Metadata | null>(null)
  const [loading, setLoading] = useState(false)
  const [showPreview, setShowPreview] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const timeoutRef = useRef<NodeJS.Timeout>()
  const containerRef = useRef<HTMLDivElement>(null)

  // Use cached metadata if available
  useEffect(() => {
    if (link.ogTitle || link.ogDescription || link.ogImage) {
      setMetadata({
        title: link.ogTitle || link.title,
        description: link.ogDescription || '',
        image: link.ogImage || ''
      })
    }
  }, [link])

  const fetchMetadata = async () => {
    if (metadata || loading) return
    
    setLoading(true)
    try {
      const res = await fetch(`/api/og-metadata?url=${encodeURIComponent(link.url)}&linkId=${link.id}`)
      if (res.ok) {
        const { metadata: data } = await res.json()
        setMetadata(data)
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false)
    }
  }

  const handleMouseEnter = (e: React.MouseEvent) => {
    timeoutRef.current = setTimeout(() => {
      updatePosition(e)
      setShowPreview(true)
      fetchMetadata()
    }, 300)
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    setShowPreview(false)
  }

  const updatePosition = (e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return

    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    
    // Default position (to the right)
    let x = rect.right + 12
    let y = rect.top

    // Check if preview would go off screen
    if (x + 320 > viewportWidth) {
      // Position to the left instead
      x = rect.left - 332
    }

    // Check vertical overflow
    if (y + 200 > viewportHeight) {
      y = Math.max(10, viewportHeight - 210)
    }

    setPosition({ x, y })
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!showPreview) return
    updatePosition(e)
  }

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
    >
      {children}

      <AnimatePresence>
        {showPreview && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: -10 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 w-80 pointer-events-none"
            style={{ 
              left: position.x, 
              top: position.y,
            }}
          >
            <div className="glass-dark rounded-xl p-4 border border-white/10 shadow-2xl">
              {loading ? (
                <div className="flex items-center gap-3 py-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-700 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-700 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ) : metadata ? (
                <div className="space-y-3">
                  {/* Image */}
                  {metadata.image ? (
                    <div className="relative h-32 rounded-lg overflow-hidden bg-gray-800">
                      <img
                        src={metadata.image}
                        alt={metadata.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none'
                        }}
                      />
                    </div>
                  ) : (
                    <div className="h-24 rounded-lg bg-gray-800 flex items-center justify-center">
                      <FiImage className="w-8 h-8 text-gray-600" />
                    </div>
                  )}

                  {/* Title & Description */}
                  <div>
                    <h4 className="font-semibold text-white text-sm line-clamp-2">
                      {metadata.title || link.title}
                    </h4>
                    {metadata.description && (
                      <p className="text-gray-400 text-xs mt-1 line-clamp-2">
                        {metadata.description}
                      </p>
                    )}
                  </div>

                  {/* URL */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <FiExternalLink className="w-3 h-3" />
                    <span className="truncate">{new URL(link.url).hostname}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm">{link.title}</p>
                  <p className="text-gray-500 text-xs mt-1 truncate">{link.url}</p>
                </div>
              )}
            </div>

            {/* Arrow */}
            <div 
              className="absolute top-4 -left-1.5 w-3 h-3 bg-gray-900 border-l border-t border-white/10 transform -rotate-45"
              style={{
                left: position.x > window.innerWidth / 2 ? 'auto' : '-6px',
                right: position.x > window.innerWidth / 2 ? '-6px' : 'auto',
                borderLeft: position.x > window.innerWidth / 2 ? 'none' : undefined,
                borderTop: position.x > window.innerWidth / 2 ? 'none' : undefined,
                borderRight: position.x > window.innerWidth / 2 ? '1px solid rgba(255,255,255,0.1)' : undefined,
                borderBottom: position.x > window.innerWidth / 2 ? '1px solid rgba(255,255,255,0.1)' : undefined,
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
