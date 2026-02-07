'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiSmartphone } from 'react-icons/fi'
import type { User } from '@/types'
import { themes } from '@/lib/utils'
import MobileMockup from './MobileMockup'
import type { Link } from '@/types'

interface ThemePreviewProps {
  user: User
  links: Link[]
  currentTheme: string
  onThemeChange: (themeId: string) => void
}

export default function ThemePreview({ 
  user, 
  links, 
  currentTheme, 
  onThemeChange 
}: ThemePreviewProps) {
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null)
  const displayTheme = hoveredTheme || currentTheme

  // Group themes by category
  const gradientThemes = themes.filter(t => t.id.startsWith('gradient'))
  const solidThemes = themes.filter(t => !t.id.startsWith('gradient'))

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <FiSmartphone className="w-5 h-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Live Preview</h3>
        </div>
        <motion.div
          key={displayTheme}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-gray-400"
        >
          {themes.find(t => t.id === displayTheme)?.name}
        </motion.div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Phone Preview */}
        <div className="flex-shrink-0">
          <motion.div
            key={displayTheme}
            initial={{ opacity: 0.8, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <MobileMockup 
              user={user} 
              links={links} 
              previewTheme={displayTheme}
            />
          </motion.div>
        </div>

        {/* Theme Selector */}
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-thin">
          <div className="space-y-6">
            {/* Gradient Themes */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Gradients</h4>
              <div className="grid grid-cols-2 gap-2">
                {gradientThemes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => onThemeChange(theme.id)}
                    onMouseEnter={() => setHoveredTheme(theme.id)}
                    onMouseLeave={() => setHoveredTheme(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative h-14 rounded-lg overflow-hidden transition-all duration-200 group ${
                      currentTheme === theme.id
                        ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900'
                        : 'hover:ring-1 hover:ring-white/30'
                    }`}
                  >
                    <div className={`absolute inset-0 ${theme.class}`} />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white drop-shadow-md">
                      {theme.name}
                    </span>
                    
                    {currentTheme === theme.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                      >
                        <FiCheck className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Solid Themes */}
            <div>
              <h4 className="text-sm font-medium text-gray-400 mb-3 uppercase tracking-wider">Solid Colors</h4>
              <div className="grid grid-cols-2 gap-2">
                {solidThemes.map((theme) => (
                  <motion.button
                    key={theme.id}
                    onClick={() => onThemeChange(theme.id)}
                    onMouseEnter={() => setHoveredTheme(theme.id)}
                    onMouseLeave={() => setHoveredTheme(null)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`relative h-14 rounded-lg overflow-hidden transition-all duration-200 ${
                      currentTheme === theme.id
                        ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900'
                        : 'hover:ring-1 hover:ring-white/30'
                    }`}
                  >
                    <div className={`absolute inset-0 ${theme.class}`} />
                    <span className={`absolute inset-0 flex items-center justify-center text-xs font-medium drop-shadow-md ${
                      theme.id === 'white' ? 'text-gray-900' : 'text-white'
                    }`}>
                      {theme.name}
                    </span>
                    
                    {currentTheme === theme.id && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1 right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                      >
                        <FiCheck className="w-3 h-3 text-white" />
                      </motion.div>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
