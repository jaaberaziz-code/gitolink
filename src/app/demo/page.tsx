'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  FiGlobe, 
  FiExternalLink, 
  FiShare2, 
  FiHeart, 
  FiArrowRight,
  FiSmartphone,
  FiCopy,
  FiCheck,
  FiImage,
  FiStar,
  FiTrendingUp,
  FiZap,
  FiEye
} from 'react-icons/fi'
import { 
  FaTwitter, 
  FaInstagram, 
  FaYoutube, 
  FaTiktok, 
  FaGithub, 
  FaLinkedin,
  FaFacebook,
  FaTwitch,
  FaDiscord,
  FaSpotify,
  FaSnapchat,
  FaPinterest,
  FaReddit,
  FaTelegram,
  FaWhatsapp
} from 'react-icons/fa'
import Link from 'next/link'

// All 20+ Themes
const allThemes = [
  // Gaming & Tech
  { id: 'cyberpunk', name: 'Cyberpunk Neon', category: 'Gaming', gradient: 'from-pink-500 via-purple-500 to-cyan-400', textColor: 'text-white' },
  { id: 'matrix', name: 'Matrix Code', category: 'Gaming', gradient: 'from-green-400 via-emerald-600 to-black', textColor: 'text-green-100' },
  
  // Lifestyle & Travel  
  { id: 'sunset', name: 'Sunset Beach', category: 'Lifestyle', gradient: 'from-orange-400 via-pink-500 to-purple-600', textColor: 'text-white' },
  { id: 'tropical', name: 'Tropical Paradise', category: 'Lifestyle', gradient: 'from-teal-300 via-cyan-400 to-blue-500', textColor: 'text-white' },
  { id: 'desert', name: 'Desert Dunes', category: 'Lifestyle', gradient: 'from-yellow-400 via-orange-400 to-red-400', textColor: 'text-white' },
  
  // Professional
  { id: 'corporate', name: 'Corporate Blue', category: 'Professional', gradient: 'from-blue-600 via-indigo-600 to-slate-700', textColor: 'text-white' },
  { id: 'minimal', name: 'Minimal White', category: 'Professional', gradient: 'bg-gray-50', textColor: 'text-gray-900', isSolid: true },
  { id: 'executive', name: 'Executive Dark', category: 'Professional', gradient: 'from-slate-800 via-gray-900 to-black', textColor: 'text-white' },
  
  // Creative & Arts
  { id: 'aurora', name: 'Aurora Borealis', category: 'Creative', gradient: 'from-green-300 via-blue-500 to-purple-600', textColor: 'text-white' },
  { id: 'cotton-candy', name: 'Cotton Candy', category: 'Creative', gradient: 'from-pink-300 via-purple-300 to-indigo-400', textColor: 'text-white' },
  { id: 'retro', name: 'Retro Wave', category: 'Creative', gradient: 'from-purple-600 via-pink-500 to-orange-400', textColor: 'text-white' },
  
  // Nature
  { id: 'forest', name: 'Deep Forest', category: 'Nature', gradient: 'from-emerald-500 via-teal-600 to-green-700', textColor: 'text-white' },
  { id: 'ocean', name: 'Deep Ocean', category: 'Nature', gradient: 'from-cyan-600 via-blue-700 to-indigo-800', textColor: 'text-white' },
  { id: 'lavender', name: 'Lavender Field', category: 'Nature', gradient: 'from-purple-300 via-purple-400 to-pink-300', textColor: 'text-white' },
  
  // Premium
  { id: 'gold', name: 'Luxury Gold', category: 'Premium', gradient: 'from-yellow-400 via-yellow-500 to-amber-600', textColor: 'text-white' },
  { id: 'rose-gold', name: 'Rose Gold', category: 'Premium', gradient: 'from-rose-300 via-pink-400 to-purple-400', textColor: 'text-white' },
  { id: 'midnight', name: 'Midnight Purple', category: 'Premium', gradient: 'from-indigo-900 via-purple-900 to-slate-900', textColor: 'text-white' },
  
  // Special
  { id: 'glass', name: 'Glass Morphism', category: 'Special', gradient: '', textColor: 'text-white', isGlass: true },
  { id: 'rainbow', name: 'Pride Rainbow', category: 'Special', gradient: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500', textColor: 'text-white' },
]

const categories = ['All', 'Gaming', 'Lifestyle', 'Professional', 'Creative', 'Nature', 'Premium', 'Special']

const demoLinks = [
  { id: '1', title: '🖼️ My Photography Portfolio', url: '#', iconType: 'globe' },
  { id: '2', title: '🎨 Buy My Art Prints', url: '#', iconType: 'heart' },
  { id: '3', title: '📺 YouTube Channel', url: '#', iconType: 'youtube' },
  { id: '4', title: '📸 Instagram', url: '#', iconType: 'instagram' },
  { id: '5', title: '🐦 Twitter/X', url: '#', iconType: 'twitter' },
  { id: '6', title: '💼 LinkedIn', url: '#', iconType: 'linkedin' },
  { id: '7', title: '🎵 TikTok', url: '#', iconType: 'tiktok' },
  { id: '8', title: '☕ Support My Work', url: '#', iconType: 'coffee' },
]

const demoUser = {
  name: 'Alex Creator',
  username: 'alexcreator',
  bio: '🎨 Digital Artist | 📸 Photographer | 🌟 Content Creator\nWelcome to my creative corner!',
  avatar: 'AC'
}

export default function DemoPage() {
  const [selectedTheme, setSelectedTheme] = useState(allThemes[0])
  const [activeCategory, setActiveCategory] = useState('All')
  const [copied, setCopied] = useState(false)
  const [viewMode, setViewMode] = useState<'mobile' | 'desktop'>('mobile')

  const filteredThemes = activeCategory === 'All' 
    ? allThemes 
    : allThemes.filter(t => t.category === activeCategory)

  const handleCopyLink = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Demo Header */}
      <motion.div 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-black/80 border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <FiImage className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-white font-semibold">Theme Showcase</h1>
                <p className="text-gray-400 text-sm">20+ stunning themes for your profile</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5">
                <FiStar className="w-4 h-4 text-yellow-400" />
                <span className="text-gray-300 text-sm">20+ Themes</span>
              </div>
              <Link
                href="/register"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
              >
                Create Yours
                <FiArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-[1fr_400px] gap-8">
            {/* Left: Theme Gallery */}
            <div className="space-y-6">
              {/* Category Filter */}
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <motion.button
                    key={category}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      activeCategory === category
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    {category}
                  </motion.button>
                ))}
              </div>

              {/* Theme Grid */}
              <motion.div 
                layout
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              >
                <AnimatePresence mode="popLayout">
                  {filteredThemes.map((theme, index) => (
                    <motion.button
                      key={theme.id}
                      layout
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ delay: index * 0.03 }}
                      whileHover={{ scale: 1.02, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setSelectedTheme(theme)}
                      className={`relative group rounded-xl overflow-hidden transition-all ${
                        selectedTheme.id === theme.id 
                          ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0a0a0f]' 
                          : ''
                      }`}
                    >
                      {/* Theme Preview */}
                      <div className={`h-24 ${theme.isSolid ? theme.gradient : theme.isGlass ? 'bg-white/10 backdrop-blur-xl border border-white/20' : `bg-gradient-to-br ${theme.gradient}`} relative`}>
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                        
                        {/* Selected Indicator */}
                        {selectedTheme.id === theme.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                          >
                            <FiCheck className="w-4 h-4 text-white" />
                          </motion.div>
                        )}
                      </div>

                      {/* Theme Info */}
                      <div className="bg-[#1a1a24] p-3">
                        <p className="text-white text-sm font-medium truncate">{theme.name}</p>
                        <p className="text-gray-500 text-xs">{theme.category}</p>
                      </div>
                    </motion.button>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Features List */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="glass-card rounded-2xl p-6 mt-8"
              >
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <FiZap className="w-5 h-5 text-yellow-400" />
                  Why GitoLink Themes?
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <FiImage className="w-4 h-4 text-blue-400" />
                    </div>
                    20+ hand-crafted themes
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <FiSmartphone className="w-4 h-4 text-blue-400" />
                    </div>
                    Mobile-optimized designs
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <FiTrendingUp className="w-4 h-4 text-blue-400" />
                    </div>
                    Conversion-focused layouts
                  </div>
                  <div className="flex items-center gap-3 text-gray-300">
                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                      <FiEye className="w-4 h-4 text-blue-400" />
                    </div>
                    Live preview while editing
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Right: Live Preview */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:sticky lg:top-28 lg:h-fit"
            >
              <div className="glass-card rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <FiSmartphone className="w-5 h-5 text-blue-400" />
                    <span className="text-white font-medium">Live Preview</span>
                  </div>
                  <span className="text-sm text-gray-400">{selectedTheme.name}</span>
                </div>

                {/* Mobile Mockup */}
                <div className="flex justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedTheme.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="relative"
                    >
                      {/* Phone Frame */}
                      <div className="w-[300px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl shadow-black/50">
                        <div 
                          className={`relative overflow-hidden rounded-[2.5rem] ${
                            selectedTheme.isGlass 
                              ? 'bg-gradient-to-br from-purple-900/80 to-blue-900/80' 
                              : selectedTheme.isSolid 
                                ? selectedTheme.gradient 
                                : `bg-gradient-to-br ${selectedTheme.gradient}`
                          }`}
                          style={{ height: '600px' }}
                        >
                          {/* Glass overlay for glass theme */}
                          {selectedTheme.isGlass && (
                            <div className="absolute inset-0 bg-white/10 backdrop-blur-xl" />
                          )}
                          
                          {/* Notch */}
                          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-b-xl z-20" />
                          
                          {/* Status Bar */}
                          <div className="absolute top-2 left-4 right-4 z-10 flex justify-between items-center">
                            <span className={`text-xs font-semibold ${selectedTheme.textColor}`}>9:41</span>
                            <div className="flex items-center gap-1">
                              <svg className={`w-4 h-4 ${selectedTheme.textColor}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                              </svg>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="h-full overflow-y-auto scrollbar-hide pt-12 pb-8 px-4">
                            {/* Share Button */}
                            <button 
                              onClick={handleCopyLink}
                              className="absolute top-12 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md transition-all hover:scale-110"
                            >
                              {copied ? <FiCheck className="w-4 h-4 text-green-400" /> : <FiShare2 className={`w-4 h-4 ${selectedTheme.textColor}`} />}
                            </button>

                            {/* Profile Header */}
                            <div className="text-center mb-6">
                              <motion.div 
                                whileHover={{ scale: 1.05 }}
                                className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md border-2 border-white/30 mx-auto mb-3 flex items-center justify-center text-2xl font-bold shadow-lg"
                              >
                                <span className={selectedTheme.textColor}>{demoUser.avatar}</span>
                              </motion.div>
                              
                              <h1 className={`text-lg font-bold ${selectedTheme.textColor} mb-1`}>
                                {demoUser.name}
                              </h1>
                              <p className={`text-sm opacity-80 ${selectedTheme.textColor} mb-2`}>
                                @{demoUser.username}
                              </p>
                              <p className={`text-xs opacity-70 max-w-[200px] mx-auto leading-relaxed ${selectedTheme.textColor}`}>
                                {demoUser.bio}
                              </p>
                            </div>

                            {/* Links */}
                            <div className="space-y-3">
                              {demoLinks.map((link, index) => (
                                <motion.button
                                  key={link.id}
                                  initial={{ opacity: 0, x: -20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: index * 0.05 }}
                                  whileHover={{ scale: 1.02, x: 2 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="w-full bg-white/10 backdrop-blur-md rounded-xl p-3 flex items-center gap-3 group transition-all hover:bg-white/20 hover:shadow-lg"
                                >
                                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                                    {link.iconType === 'globe' && <FiGlobe className={`w-5 h-5 ${selectedTheme.textColor}`} />}
                                    {link.iconType === 'heart' && <FiHeart className={`w-5 h-5 ${selectedTheme.textColor}`} />}
                                    {link.iconType === 'youtube' && <FaYoutube className={`w-5 h-5 ${selectedTheme.textColor}`} />}
                                    {link.iconType === 'instagram' && <FaInstagram className={`w-5 h-5 ${selectedTheme.textColor}`} />}
                                    {link.iconType === 'twitter' && <FaTwitter className={`w-5 h-5 ${selectedTheme.textColor}`} />}
                                    {link.iconType === 'linkedin' && <FaLinkedin className={`w-5 h-5 ${selectedTheme.textColor}`} />}
                                    {link.iconType === 'tiktok' && <FaTiktok className={`w-5 h-5 ${selectedTheme.textColor}`} />}
                                    {link.iconType === 'coffee' && <FiHeart className={`w-5 h-5 ${selectedTheme.textColor}`} />}
                                  </div>
                                  <span className={`flex-1 text-sm font-medium text-left truncate ${selectedTheme.textColor}`}>
                                    {link.title}
                                  </span>
                                  <motion.div 
                                    initial={{ opacity: 0, x: -5 }}
                                    whileHover={{ opacity: 1, x: 0 }}
                                    className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <FiExternalLink className={`w-3 h-3 ${selectedTheme.textColor}`} />
                                  </motion.div>
                                </motion.button>
                              ))}
                            </div>

                            {/* Footer */}
                            <div className="mt-8 text-center">
                              <span className={`text-[10px] opacity-60 ${selectedTheme.textColor}`}>Powered by GitoLink</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Shadow */}
                      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/30 blur-xl rounded-full" />
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Preview Actions */}
                <div className="flex justify-center gap-3 mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setViewMode('mobile')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      viewMode === 'mobile' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10'
                    }`}
                  >
                    Mobile
                  </motion.button>
                  <Link
                    href="/register"
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm font-medium hover:from-blue-500 hover:to-purple-500 transition-all"
                  >
                    Use This Theme
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Floating CTA */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40"
      >
        <Link
          href="/register"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium shadow-2xl shadow-blue-500/25 hover:from-blue-500 hover:to-purple-500 transition-all"
        >
          <FiArrowRight className="w-5 h-5" />
          Create Your Free Profile
        </Link>
      </motion.div>
    </div>
  )
}
