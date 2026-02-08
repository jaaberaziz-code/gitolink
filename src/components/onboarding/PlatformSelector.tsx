'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  FiTwitter, 
  FiInstagram, 
  FiYoutube, 
  FiGithub, 
  FiLinkedin, 
  FiFacebook,
  FiMusic,
  FiMessageCircle,
  FiGlobe,
  FiSearch,
  FiCheck,
} from 'react-icons/fi'
import { 
  FaTiktok, 
  FaTwitch, 
  FaDiscord, 
  FaSpotify, 
  FaSnapchat,
  FaPinterest,
  FaReddit,
  FaTelegram,
  FaWhatsapp,
} from 'react-icons/fa'

interface Platform {
  id: string
  name: string
  icon: React.ReactNode
  color: string
  category: string
}

const platforms: Platform[] = [
  // Social Media
  { id: 'twitter', name: 'Twitter/X', icon: <FiTwitter className="w-6 h-6" />, color: 'bg-black', category: 'Social' },
  { id: 'instagram', name: 'Instagram', icon: <FiInstagram className="w-6 h-6" />, color: 'bg-gradient-to-br from-purple-600 to-pink-500', category: 'Social' },
  { id: 'facebook', name: 'Facebook', icon: <FiFacebook className="w-6 h-6" />, color: 'bg-blue-600', category: 'Social' },
  { id: 'tiktok', name: 'TikTok', icon: <FaTiktok className="w-6 h-6" />, color: 'bg-black', category: 'Social' },
  { id: 'snapchat', name: 'Snapchat', icon: <FaSnapchat className="w-6 h-6" />, color: 'bg-yellow-400', category: 'Social' },
  
  // Content Creation
  { id: 'youtube', name: 'YouTube', icon: <FiYoutube className="w-6 h-6" />, color: 'bg-red-600', category: 'Content' },
  { id: 'twitch', name: 'Twitch', icon: <FaTwitch className="w-6 h-6" />, color: 'bg-purple-600', category: 'Content' },
  
  // Professional
  { id: 'linkedin', name: 'LinkedIn', icon: <FiLinkedin className="w-6 h-6" />, color: 'bg-blue-700', category: 'Professional' },
  { id: 'github', name: 'GitHub', icon: <FiGithub className="w-6 h-6" />, color: 'bg-gray-800', category: 'Professional' },
  
  // Community
  { id: 'discord', name: 'Discord', icon: <FaDiscord className="w-6 h-6" />, color: 'bg-indigo-500', category: 'Community' },
  { id: 'telegram', name: 'Telegram', icon: <FaTelegram className="w-6 h-6" />, color: 'bg-blue-500', category: 'Community' },
  { id: 'whatsapp', name: 'WhatsApp', icon: <FaWhatsapp className="w-6 h-6" />, color: 'bg-green-500', category: 'Community' },
  { id: 'reddit', name: 'Reddit', icon: <FaReddit className="w-6 h-6" />, color: 'bg-orange-600', category: 'Community' },
  
  // Creative
  { id: 'spotify', name: 'Spotify', icon: <FaSpotify className="w-6 h-6" />, color: 'bg-green-600', category: 'Creative' },
  { id: 'pinterest', name: 'Pinterest', icon: <FaPinterest className="w-6 h-6" />, color: 'bg-red-600', category: 'Creative' },
  
  // Other
  { id: 'website', name: 'Website', icon: <FiGlobe className="w-6 h-6" />, color: 'bg-gray-600', category: 'Other' },
]

const categories = ['All', 'Social', 'Content', 'Professional', 'Community', 'Creative', 'Other']

interface PlatformSelectorProps {
  selected: string[]
  onChange: (platforms: string[]) => void
}

export function PlatformSelector({ selected, onChange }: PlatformSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const togglePlatform = (platformId: string) => {
    if (selected.includes(platformId)) {
      onChange(selected.filter(id => id !== platformId))
    } else {
      onChange([...selected, platformId])
    }
  }

  const filteredPlatforms = platforms.filter(platform => {
    const matchesSearch = platform.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = activeCategory === 'All' || platform.category === activeCategory
    return matchesSearch && matchesCategory
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
          Where are you active?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-400 text-lg"
        >
          Select the platforms you want to share
        </motion.p>
      </div>

      {/* Search & Categories */}
      <div className="space-y-4">
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="relative"
        >
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search platforms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="flex flex-wrap gap-2"
        >
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`
                px-4 py-2 rounded-full text-sm font-medium transition-all
                ${activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white'
                }
              `}
            >
              {category}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Selected Count */}
      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center justify-center gap-2 text-blue-400 font-medium"
        >
          <FiCheck className="w-5 h-5" />
          {selected.length} platform{selected.length !== 1 ? 's' : ''} selected
        </motion.div>
      )}

      {/* Platform Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
      >
        {filteredPlatforms.map((platform, index) => {
          const isSelected = selected.includes(platform.id)
          
          return (
            <motion.button
              key={platform.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.03 }}
              onClick={() => togglePlatform(platform.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`
                relative p-4 rounded-xl transition-all duration-200
                ${isSelected
                  ? 'bg-gray-800 ring-2 ring-blue-500 shadow-lg shadow-blue-500/20'
                  : 'bg-gray-800/50 hover:bg-gray-800 ring-1 ring-gray-700 hover:ring-gray-600'
                }
              `}
            >
              <div className="flex flex-col items-center gap-3">
                {/* Icon */}
                <div className={`
                  w-12 h-12 rounded-xl ${platform.color}
                  flex items-center justify-center text-white
                  ${isSelected ? 'shadow-lg scale-110' : ''}
                  transition-transform duration-200
                `}>
                  {platform.icon}
                </div>
                
                {/* Name */}
                <span className={`
                  text-sm font-medium
                  ${isSelected ? 'text-white' : 'text-gray-400'}
                `}>
                  {platform.name}
                </span>
              </div>

              {/* Selection Check */}
              {isSelected && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center"
                >
                  <FiCheck className="w-3 h-3 text-white" />
                </motion.div>
              )}
            </motion.button>
          )
        })}
      </motion.div>

      {/* Empty State */}
      {filteredPlatforms.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No platforms found matching your search</p>
        </div>
      )}

      {/* Skip Option */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center pt-4"
      >
        <p className="text-gray-500 text-sm">
          Don't see your platform? You can add custom links later in your dashboard.
        </p>
      </motion.div>
    </div>
  )
}
