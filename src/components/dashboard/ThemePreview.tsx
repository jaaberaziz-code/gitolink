'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { User } from '@/types'
import { themes, ThemeId, getThemeById } from '@/lib/utils'
import MobileMockup from './MobileMockup'
import type { Link } from '@/types'

interface ThemePreviewProps {
  user: User
  links: Link[]
  currentTheme: string
  onThemeChange: (themeId: string) => void
}

// SVG Icons
const Icons = {
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  list: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3.01" y2="6" />
      <line x1="3" y1="12" x2="3.01" y2="12" />
      <line x1="3" y1="18" x2="3.01" y2="18" />
    </svg>
  ),
}

// Theme Card Component
function ThemeCard({ 
  theme, 
  isActive, 
  isHovered, 
  onClick, 
  onMouseEnter, 
  onMouseLeave 
}: { 
  theme: typeof themes[0]
  isActive: boolean
  isHovered: boolean
  onClick: () => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}) {
  const getThemePreview = (themeId: ThemeId) => {
    switch (themeId) {
      case 'cyberpunk':
        return (
          <div className="w-full h-full bg-black relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-transparent to-pink-500/20" />
            <div className="absolute top-2 left-2 right-2 h-8 bg-black/50 border border-cyan-400/30 rounded" />
            <div className="absolute top-12 left-2 right-2 space-y-1">
              <div className="h-6 bg-cyan-400/20 border-l-2 border-cyan-400" />
              <div className="h-6 bg-cyan-400/10 border-l-2 border-cyan-400/50" />
              <div className="h-6 bg-cyan-400/10 border-l-2 border-cyan-400/50" />
            </div>
          </div>
        )
      case 'minimalist':
        return (
          <div className="w-full h-full bg-white p-3">
            <div className="text-lg font-bold text-black mb-1">Aa</div>
            <div className="h-4 bg-gray-100 mb-1 border border-black" />
            <div className="h-4 bg-gray-100 mb-1 border border-black" />
            <div className="h-4 bg-black" />
          </div>
        )
      case 'editorial':
        return (
          <div className="w-full h-full bg-stone-50 p-3 font-serif">
            <div className="text-xs text-red-600 uppercase tracking-widest mb-1">Title</div>
            <div className="text-base font-bold text-stone-900 mb-2">Editorial</div>
            <div className="space-y-1 border-t border-stone-200 pt-2">
              <div className="h-3 bg-stone-200" />
              <div className="h-3 bg-stone-200 w-3/4" />
            </div>
          </div>
        )
      case 'gradient-mesh':
        return (
          <div className="w-full h-full bg-slate-900 relative overflow-hidden">
            <div className="absolute -top-4 -left-4 w-16 h-16 rounded-full bg-orange-500/40 blur-xl" />
            <div className="absolute -bottom-4 -right-4 w-16 h-16 rounded-full bg-cyan-500/40 blur-xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-xl bg-gradient-to-br from-orange-500 to-cyan-500" />
          </div>
        )
      case 'retro-terminal':
        return (
          <div className="w-full h-full bg-black p-2 font-mono">
            <div className="text-green-400 text-[8px]">$</div>
            <div className="mt-1 space-y-1">
              <div className="h-3 bg-green-400/20 border border-green-400/30" />
              <div className="h-3 bg-green-400/20 border border-green-400/30" />
              <div className="h-3 bg-green-400/20 border border-green-400/30" />
            </div>
          </div>
        )
      case 'glass-2':
        return (
          <div className="w-full h-full bg-gradient-to-br from-slate-900 to-slate-800 p-3">
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur border border-white/20 mx-auto mb-2" />
            <div className="space-y-2">
              <div className="h-6 rounded-xl bg-white/5 backdrop-blur border border-white/10" />
              <div className="h-6 rounded-xl bg-white/5 backdrop-blur border border-white/10" />
            </div>
          </div>
        )
      case 'nft-gallery':
        return (
          <div className="w-full h-full bg-zinc-950 p-2">
            <div className="grid grid-cols-2 gap-1">
              <div className="aspect-square bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded" />
              <div className="aspect-square bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded" />
              <div className="aspect-square bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded" />
              <div className="aspect-square bg-gradient-to-br from-purple-500/40 to-pink-500/40 rounded" />
            </div>
          </div>
        )
      case 'music-player':
        return (
          <div className="w-full h-full bg-neutral-900 p-3">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-green-500 to-emerald-600" />
              <div className="flex-1">
                <div className="h-2 bg-neutral-700 rounded-full mb-1" />
                <div className="h-2 bg-neutral-700 rounded-full w-2/3" />
              </div>
            </div>
            <div className="h-1 bg-neutral-700 rounded-full" />
          </div>
        )
      case 'portfolio':
        return (
          <div className="w-full h-full bg-gray-50 p-2">
            <div className="flex gap-1 mb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
            <div className="columns-2 gap-1">
              <div className="aspect-video bg-gray-200 rounded mb-1" />
              <div className="aspect-square bg-gray-200 rounded mb-1" />
              <div className="aspect-square bg-gray-200 rounded mb-1" />
              <div className="aspect-video bg-gray-200 rounded mb-1" />
            </div>
          </div>
        )
      case 'hacker':
        return (
          <div className="w-full h-full bg-black p-2 font-mono">
            <div className="text-green-400 text-[8px] mb-1">[SYSTEM]</div>
            <div className="space-y-1">
              <div className="h-3 bg-green-400/10 border border-green-500/30 flex items-center px-1">
                <div className="w-1 h-1 rounded-full bg-green-400" />
              </div>
              <div className="h-3 bg-green-400/10 border border-green-500/30" />
              <div className="h-3 bg-green-400/10 border border-green-500/30" />
            </div>
          </div>
        )
      default:
        return null
    }
  }
  
  return (
    <motion.button
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full aspect-[4/3] rounded-xl overflow-hidden transition-all cursor-pointer ${
        isActive 
          ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-black' 
          : 'hover:ring-1 hover:ring-white/30'
      }`}
    >
      {/* Preview Content */}
      <div className="w-full h-full">
        {getThemePreview(theme.id)}
      </div>
      
      
      {/* Label */}
      <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/90 to-transparent">
        <p className="text-white text-xs font-medium truncate">{theme.name}</p>
      </div>
      
      
      {/* Active Indicator */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute top-2 right-2 w-5 h-5 bg-cyan-400 rounded-full flex items-center justify-center"
          >
            <span className="text-black">{Icons.check}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  )
}

export default function ThemePreview({ 
  user, 
  links, 
  currentTheme, 
  onThemeChange 
}: ThemePreviewProps) {
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'phone' | 'grid'>('phone')
  const displayTheme = hoveredTheme || currentTheme
  
  const activeTheme = getThemeById(displayTheme as ThemeId)
  
  // Group themes by category
  const animatedThemes = themes.filter(t => t.category === 'animated')
  const darkThemes = themes.filter(t => t.category === 'dark')
  const lightThemes = themes.filter(t => t.category === 'light')
  const colorfulThemes = themes.filter(t => t.category === 'colorful')
  
  return (
    <div className="h-full flex flex-col">
      <!-- Header -->
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
            <span className="text-cyan-400">{Icons.phone}</span>
          </div>
          <div>
            <h3 className="text-lg font-bold text-white font-display">Live Preview</h3>
            <motion.p 
              key={displayTheme}
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-sm text-cyan-400 font-mono"
            >
              {activeTheme.name}
            </motion.p>
          </div>
        </div>
        
        
        {/* View Mode Toggle */}
        <div className="flex bg-neutral-900 rounded-lg p-1 border border-neutral-800">
          <button
            onClick={() => setViewMode('phone')}
            className={`p-2 rounded-md transition-all cursor-pointer ${
              viewMode === 'phone' 
                ? 'bg-neutral-800 text-cyan-400' 
                : 'text-neutral-500 hover:text-white'
            }`}
          >
            {Icons.phone}
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`p-2 rounded-md transition-all cursor-pointer ${
              viewMode === 'grid' 
                ? 'bg-neutral-800 text-cyan-400' 
                : 'text-neutral-500 hover:text-white'
            }`}
          >
            {Icons.grid}
          </button>
        </div>
      </div>
      
      
      {/* Content Area -->
      <div className="flex-1 overflow-hidden">
        <AnimatePresence mode="wait">
          {viewMode === 'phone' ? (
            <motion.div
              key="phone"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              className="h-full flex flex-col"
            >
              <!-- Phone Preview -->
              <div className="flex-1 flex items-center justify-center py-4">
                <MobileMockup 
                  user={user} 
                  links={links} 
                  previewTheme={displayTheme}
                />
              </div>
              
              
              {/* Theme Selector -->
              <div className="h-48 overflow-y-auto scrollbar-brutal">
                <div className="space-y-4 pb-4">
                  <!-- Animated Themes -->
                  <div>
                    <h4 className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2 sticky top-0 bg-neutral-900/95 py-1 z-10">
                      Animated
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {animatedThemes.map((theme) => (
                        <ThemeCard
                          key={theme.id}
                          theme={theme}
                          isActive={currentTheme === theme.id}
                          isHovered={hoveredTheme === theme.id}
                          onClick={() => onThemeChange(theme.id)}
                          onMouseEnter={() => setHoveredTheme(theme.id)}
                          onMouseLeave={() => setHoveredTheme(null)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  
                  {/* Dark Themes -->
                  <div>
                    <h4 className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2 sticky top-0 bg-neutral-900/95 py-1 z-10">
                      Dark
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {darkThemes.map((theme) => (
                        <ThemeCard
                          key={theme.id}
                          theme={theme}
                          isActive={currentTheme === theme.id}
                          isHovered={hoveredTheme === theme.id}
                          onClick={() => onThemeChange(theme.id)}
                          onMouseEnter={() => setHoveredTheme(theme.id)}
                          onMouseLeave={() => setHoveredTheme(null)}
                        />
                      ))}
                    </div>
                  </div>
                  
                  
                  {/* Light Themes -->
                  <div>
                    <h4 className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-2 sticky top-0 bg-neutral-900/95 py-1 z-10">
                      Light
                    </h4>
                    <div className="grid grid-cols-3 gap-2">
                      {lightThemes.map((theme) => (
                        <ThemeCard
                          key={theme.id}
                          theme={theme}
                          isActive={currentTheme === theme.id}
                          isHovered={hoveredTheme === theme.id}
                          onClick={() => onThemeChange(theme.id)}
                          onMouseEnter={() => setHoveredTheme(theme.id)}
                          onMouseLeave={() => setHoveredTheme(null)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="h-full overflow-y-auto scrollbar-brutal"
            >
              <div className="space-y-6 pb-4">
                <!-- All Themes Grid -->
                <div>
                  <h4 className="text-xs font-mono text-neutral-500 uppercase tracking-wider mb-3">
                    All Themes
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {themes.map((theme) => (
                      <ThemeCard
                        key={theme.id}
                        theme={theme}
                        isActive={currentTheme === theme.id}
                        isHovered={hoveredTheme === theme.id}
                        onClick={() => onThemeChange(theme.id)}
                        onMouseEnter={() => setHoveredTheme(theme.id)}
                        onMouseLeave={() => setHoveredTheme(null)}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
