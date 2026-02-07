'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiFilter, FiGrid, FiList } from 'react-icons/fi'
import { themes } from '@/lib/utils'

interface ThemeGridProps {
  currentTheme: string
  onThemeChange: (themeId: string) => void
}

type ThemeCategory = 'all' | 'gaming' | 'lifestyle' | 'professional' | 'creative' | 'nature' | 'premium'

const themeCategories: { id: ThemeCategory; label: string }[] = [
  { id: 'all', label: 'All Themes' },
  { id: 'gaming', label: 'Gaming & Tech' },
  { id: 'lifestyle', label: 'Lifestyle & Travel' },
  { id: 'professional', label: 'Professional' },
  { id: 'creative', label: 'Creative & Arts' },
  { id: 'nature', label: 'Nature' },
  { id: 'premium', label: 'Premium' },
]

const themeCategoryMap: Record<string, ThemeCategory[]> = {
  'cyberpunk': ['gaming', 'creative'],
  'matrix': ['gaming'],
  'sunset': ['lifestyle', 'creative'],
  'tropical': ['lifestyle', 'nature'],
  'desert': ['lifestyle', 'nature'],
  'corporate': ['professional'],
  'minimal': ['professional'],
  'executive': ['professional', 'premium'],
  'aurora': ['creative', 'nature'],
  'cotton-candy': ['creative', 'lifestyle'],
  'retro': ['creative', 'gaming'],
  'forest': ['nature'],
  'ocean': ['nature'],
  'lavender': ['nature', 'creative'],
  'gold': ['premium'],
  'rose-gold': ['premium', 'creative'],
  'midnight': ['premium', 'professional'],
  'glass': ['creative', 'professional'],
  'rainbow': ['creative'],
}

export function ThemeGrid({ currentTheme, onThemeChange }: ThemeGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<ThemeCategory>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null)

  const filteredThemes = selectedCategory === 'all' 
    ? themes 
    : themes.filter(theme => {
        const categories = themeCategoryMap[theme.id]
        return categories?.includes(selectedCategory)
      })

  return (
    <div className="space-y-6">
      {/* Header with filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <FiFilter className="w-4 h-4 text-gray-400" />
          <div className="flex flex-wrap gap-2">
            {themeCategories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`
                  px-3 py-1.5 rounded-full text-xs font-medium transition-all
                  ${selectedCategory === cat.id
                    ? 'bg-blue-600 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                  }
                `}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
          <button
            onClick={() => setViewMode('grid')}
            className={`
              p-2 rounded-md transition-all
              ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}
            `}
          >
            <FiGrid className="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`
              p-2 rounded-md transition-all
              ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-white'}
            `}
          >
            <FiList className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Theme Grid */}
      <div className={`
        ${viewMode === 'grid' 
          ? 'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4' 
          : 'space-y-3'
        }
      `}
      >
        {filteredThemes.map((theme, index) => {
          const isSelected = currentTheme === theme.id
          const isHovered = hoveredTheme === theme.id

          if (viewMode === 'list') {
            return (
              <motion.button
                key={theme.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.03 }}
                onClick={() => onThemeChange(theme.id)}
                onMouseEnter={() => setHoveredTheme(theme.id)}
                onMouseLeave={() => setHoveredTheme(null)}
                className={`
                  w-full flex items-center gap-4 p-3 rounded-xl transition-all
                  ${isSelected 
                    ? 'bg-white/10 ring-2 ring-blue-500' 
                    : 'bg-white/5 hover:bg-white/10'
                  }
                `}
              >
                <div className={`w-16 h-16 rounded-lg ${theme.class} flex-shrink-0`} />
                <div className="flex-1 text-left">
                  <p className="text-white font-medium">{theme.name}</p>
                  <p className="text-gray-500 text-sm">
                    {themeCategoryMap[theme.id]?.join(', ') || 'General'}
                  </p>
                </div>
                {isSelected && (
                  <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                    <FiCheck className="w-4 h-4 text-white" />
                  </div>
                )}
              </motion.button>
            )
          }

          return (
            <motion.button
              key={theme.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onThemeChange(theme.id)}
              onMouseEnter={() => setHoveredTheme(theme.id)}
              onMouseLeave={() => setHoveredTheme(null)}
              whileHover={{ scale: 1.05, y: -5 }}
              whileTap={{ scale: 0.95 }}
              className={`
                relative group overflow-hidden rounded-xl transition-all
                ${isSelected 
                  ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0a0a0f]' 
                  : ''
                }
              `}
            >
              {/* Preview Card */}
              <div className={`aspect-[4/5] ${theme.class} relative`}>
                {/* Mock Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  <div className={`
                    w-12 h-12 rounded-full mb-3
                    ${theme.id === 'minimal' ? 'bg-gray-200' : 'bg-white/20'}
                  `} />
                  <div className={`
                    w-20 h-3 rounded mb-2
                    ${theme.id === 'minimal' ? 'bg-gray-300' : 'bg-white/30'}
                  `} />
                  <div className={`
                    w-16 h-2 rounded mb-4
                    ${theme.id === 'minimal' ? 'bg-gray-200' : 'bg-white/20'}
                  `} />
                  
                  {/* Mock Links */}
                  <div className="w-full space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`
                          w-full h-8 rounded-lg
                          ${theme.id === 'minimal' ? 'bg-white/60' : 'bg-white/10'}
                        `}
                      />
                    ))}
                  </div>
                </div>

                {/* Overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent
                  flex flex-col justify-end p-4
                  transition-opacity
                  ${isSelected || isHovered ? 'opacity-100' : 'opacity-0'}
                `}>
                  <p className="text-white font-medium text-sm mb-1">{theme.name}</p>
                  <p className="text-white/60 text-xs">
                    {themeCategoryMap[theme.id]?.[0] || 'Theme'}
                  </p>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <FiCheck className="w-4 h-4 text-white" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          )
        })}
      </div>

      {filteredThemes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-400">No themes found in this category</p>
        </div>
      )}
    </div>
  )
}