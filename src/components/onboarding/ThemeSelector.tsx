'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { FiCheck, FiFilter } from 'react-icons/fi'
import { themes } from '@/lib/utils'

type ThemeCategory = 'all' | 'gaming' | 'lifestyle' | 'professional' | 'creative' | 'nature' | 'premium'

interface ThemeCategoryOption {
  id: ThemeCategory
  label: string
}

const themeCategories: ThemeCategoryOption[] = [
  { id: 'all', label: 'All' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'lifestyle', label: 'Lifestyle' },
  { id: 'professional', label: 'Professional' },
  { id: 'creative', label: 'Creative' },
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

interface ThemeSelectorProps {
  selected: string
  onSelect: (themeId: string) => void
}

export function ThemeSelector({ selected, onSelect }: ThemeSelectorProps) {
  const [activeCategory, setActiveCategory] = useState<ThemeCategory>('all')
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null)

  const filteredThemes = activeCategory === 'all'
    ? themes
    : themes.filter(theme => {
        const categories = themeCategoryMap[theme.id]
        return categories?.includes(activeCategory)
      })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl sm:text-4xl font-bold text-white"
        >
          Choose your theme
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-lg"
        >
          Pick a style that represents you
        </motion.p>
      </div>

      {/* Category Filters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide"
      >
        <FiFilter className="w-4 h-4 text-gray-500 flex-shrink-0" />
        <div className="flex gap-2">
          {themeCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all
                ${activeCategory === category.id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              {category.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Theme Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
      >
        {filteredThemes.map((theme, index) => {
          const isSelected = selected === theme.id
          const isHovered = hoveredTheme === theme.id

          return (
            <motion.button
              key={theme.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => onSelect(theme.id)}
              onMouseEnter={() => setHoveredTheme(theme.id)}
              onMouseLeave={() => setHoveredTheme(null)}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative group overflow-hidden rounded-2xl transition-all
                ${isSelected
                  ? 'ring-3 ring-blue-500 shadow-xl shadow-blue-500/30'
                  : 'ring-1 ring-gray-700 hover:ring-gray-600'
                }
              `}
            >
              {/* Theme Preview Card */}
              <div className={`aspect-[4/5] ${theme.class} relative overflow-hidden`}>
                {/* Mock Profile Preview */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                  {/* Avatar */}
                  <div className={`
                    w-14 h-14 rounded-full mb-3
                    ${theme.id === 'minimal' ? 'bg-gray-300' : 'bg-white/20 backdrop-blur-sm'}
                  `} />
                  
                  {/* Name */}
                  <div className={`
                    w-24 h-3 rounded mb-2
                    ${theme.id === 'minimal' ? 'bg-gray-400' : 'bg-white/30'}
                  `} />
                  
                  {/* Bio */}
                  <div className={`
                    w-16 h-2 rounded mb-4
                    ${theme.id === 'minimal' ? 'bg-gray-300' : 'bg-white/20'}
                  `} />
                  
                  {/* Mock Links */}
                  <div className="w-full space-y-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className={`
                          w-full h-7 rounded-lg
                          ${theme.id === 'minimal' 
                            ? 'bg-white/80 shadow-sm' 
                            : 'bg-white/10 backdrop-blur-sm'
                          }
                        `}
                      />
                    ))}
                  </div>
                </div>

                {/* Gradient Overlay */}
                <div className={`
                  absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent
                  flex flex-col justify-end p-4
                  transition-opacity duration-300
                  ${isSelected || isHovered ? 'opacity-100' : 'opacity-0'}
                `}>
                  <p className="text-white font-semibold text-sm">{theme.name}</p>
                  <p className="text-white/60 text-xs">
                    {themeCategoryMap[theme.id]?.[0] || 'Theme'}
                  </p>
                </div>

                {/* Selected Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-3 right-3 w-7 h-7 bg-blue-500 rounded-full flex items-center justify-center shadow-lg"
                  >
                    <FiCheck className="w-4 h-4 text-white" />
                  </motion.div>
                )}

                {/* Hover Overlay */}
                {isHovered && !isSelected && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute inset-0 bg-white/10 backdrop-blur-[2px] flex items-center justify-center"
                  >
                    <span className="px-4 py-2 bg-white/90 text-gray-900 rounded-full text-sm font-medium">
                      Select
                    </span>
                  </motion.div>
                )}
              </div>
            </motion.button>
          )
        })}
      </motion.div>

      {/* Empty State */}
      {filteredThemes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No themes found in this category</p>
        </div>
      )}

      {/* Preview Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-4"
      >
        <p className="text-gray-500 text-sm">
          You can customize colors, fonts, and more in your dashboard after setup.
        </p>
      </motion.div>
    </div>
  )
}
