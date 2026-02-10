'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { themes } from '@/lib/utils'

// SVG Icons - No emojis
const Icons = {
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" />
    </svg>  
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  share: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  filter: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  )
}

// Demo links with SVG icons
const demoLinks = [
  { id: '1', title: 'My Portfolio', icon: Icons.globe },
  { id: '2', title: 'Instagram', icon: Icons.share },
  { id: '3', title: 'YouTube', icon: Icons.play },
  { id: '4', title: 'Twitter', icon: Icons.share },
  { id: '5', title: 'LinkedIn', icon: Icons.link },
  { id: '6', title: 'TikTok', icon: Icons.play },
]

// Theme categories
const categories = [
  { id: 'all', label: 'All' },
  { id: 'gaming', label: 'Gaming' },
  { id: 'professional', label: 'Professional' },
  { id: 'creative', label: 'Creative' },
  { id: 'minimal', label: 'Minimal' },
]

export default function DemoPage() {
  const [selectedTheme, setSelectedTheme] = useState(themes[0])
  const [activeCategory, setActiveCategory] = useState('all')
  const [copied, setCopied] = useState(false)

  const filteredThemes = activeCategory === 'all'
    ? themes
    : themes.filter(theme => theme.category === activeCategory)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              GitoLink
            </Link>
            <p className="text-xs text-gray-500 font-mono">Theme Showcase</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Link 
              href="/themes" 
              className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors"
            >
              Browse All Themes
            </Link>
            
            <Link 
              href="/register"
              className="px-4 py-2 bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-16 flex flex-col lg:flex-row min-h-screen">
        {/* Left Panel - Theme Selector */}
        <div className="w-full lg:w-[400px] bg-[#0a0a0a] border-r border-gray-800 flex flex-col">
          {/* Categories */}
          <div className="p-4 border-b border-gray-800">
            <div className="flex items-center gap-2 text-gray-400 mb-3">
              <span>{Icons.filter}</span>
              <span className="text-sm font-mono">Filter by Category</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`
                    px-3 py-1.5 text-xs font-mono transition-colors
                    ${activeCategory === cat.id
                      ? 'bg-[#00FF41] text-black'
                      : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600'
                    }
                  `}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Themes Grid */}
          <div className="flex-1 overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-3">
              {filteredThemes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setSelectedTheme(theme)}
                  className={`
                    relative aspect-square overflow-hidden border-2 transition-all
                    ${selectedTheme.id === theme.id
                      ? 'border-[#00FF41]'
                      : 'border-transparent hover:border-gray-600'
                    }
                  `}
                >
                  <div 
                    className="absolute inset-0"
                    style={{ background: theme.gradient || theme.backgroundColor }}
                  />
                  
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
                    <div className="w-6 h-6 bg-white/20 rounded-full mb-1" />
                    <div className="h-1 w-8 bg-white/30 rounded" />
                  </div>
                  
                  {selectedTheme.id === theme.id && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-[#00FF41] flex items-center justify-center">
                      <span className="text-black text-xs">✓</span>
                    </div>
                  )}
                  
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/80">
                    <span className="text-xs font-mono text-white">{theme.name}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel - Preview */}
        <div className="flex-1 bg-black flex flex-col items-center justify-center p-8">
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
              <div className="relative w-[320px] bg-gray-900 rounded-[3rem] p-3 border border-gray-800 shadow-2xl">
                {/* Notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-6 bg-black rounded-full z-10" />
                
                {/* Screen */}
                <div
                  className="w-full aspect-[9/19] rounded-[2.5rem] overflow-hidden"
                  style={{ background: selectedTheme.gradient || selectedTheme.backgroundColor }}
                >
                  {/* Profile */}
                  <div className="p-6 text-center pt-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full mx-auto mb-4 border-2 border-white/20" />
                    
                    <h3 className="font-bold text-white text-lg mb-1">@username</h3>
                    
                    <p className="text-white/60 text-sm">Digital Creator</p>
                  </div>
                  
                  {/* Links */}
                  <div className="px-4 space-y-3">
                    {demoLinks.map((link) => (
                      <div
                        key={link.id}
                        className="
                          flex items-center gap-3
                          p-4
                          bg-white/10 backdrop-blur-sm
                          border border-white/10
                          text-white
                        "
                      >
                        <span className="text-white/60">{link.icon}</span>
                        <span className="font-medium text-sm">{link.title}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Footer */}
                  <div className="absolute bottom-4 left-0 right-0 text-center">
                    <p className="text-white/40 text-xs font-mono">Made with GitoLink</p>
                  </div>
                </div>
              </div>
              
              {/* Theme Info Card */}
              <div className="absolute -right-4 top-1/2 -translate-y-1/2 translate-x-full w-64 bg-gray-900 border border-gray-800 p-6 hidden xl:block">
                <h4 className="font-bold text-white mb-2">{selectedTheme.name}</h4>
                
                <p className="text-gray-400 text-sm mb-4">{selectedTheme.description}</p>
                
                <div className="space-y-2 mb-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Category</span>
                    <span className="text-white capitalize">{selectedTheme.category || 'General'}</span>
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Type</span>
                    <span className="text-white">{selectedTheme.gradient ? 'Gradient' : 'Solid'}</span>
                  </div>
                </div>
                
                <button
                  onClick={handleCopy}
                  className={`
                    w-full py-3 font-bold text-sm transition-colors
                    ${copied 
                      ? 'bg-[#00FF41] text-black' 
                      : 'bg-white text-black hover:bg-gray-200'
                    }
                  `}
                >
                  {copied ? 'Copied!' : 'Use This Theme'}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
          
          {/* Mobile Theme Info */}
          <div className="mt-8 text-center xl:hidden">
            <h4 className="font-bold text-white mb-2">{selectedTheme.name}</h4>
            
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00FF41] text-black font-bold hover:bg-[#00CC33] transition-colors"
            >
              Use This Theme
              <span>{Icons.arrowRight}</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
