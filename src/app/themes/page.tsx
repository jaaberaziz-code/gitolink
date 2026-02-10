'use client'

import { motion } from 'framer-motion'
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
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M12 2l2.4 7.2h7.6l-6 4.8 2.4 7.2-6-4.8-6 4.8 2.4-7.2-6-4.8h7.6z" />
    </svg>
  ),
  circle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  square: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" />
    </svg>
  ),
  hexagon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M21 16V8l-9-5-9 5v8l9 5 9-5z" />
    </svg>
  ),
  terminal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  music: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  diamond: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5">
      <polygon points="12 2 22 12 12 22 2 12" />
    </svg>
  )
}

// Theme categories with icons
const themeCategories = [
  { id: 'all', label: 'All Themes', icon: Icons.grid },
  { id: 'gaming', label: 'Gaming', icon: Icons.sparkles },
  { id: 'minimal', label: 'Minimal', icon: Icons.square },
  { id: 'gradient', label: 'Gradients', icon: Icons.circle },
  { id: 'dark', label: 'Dark', icon: Icons.hexagon },
  { id: 'vibrant', label: 'Vibrant', icon: Icons.star },
]

// Theme metadata with proper categorization
const themeMeta: Record<string, { category: string; icon: React.ReactNode; description: string }> = {
  'cyberpunk': { category: 'gaming', icon: Icons.sparkles, description: 'Neon glow cyber aesthetic' },
  'matrix': { category: 'gaming', icon: Icons.terminal, description: 'Green code rain effect' },
  'sunset': { category: 'gradient', icon: Icons.circle, description: 'Warm orange gradients' },
  'tropical': { category: 'vibrant', icon: Icons.star, description: 'Tropical paradise vibes' },
  'desert': { category: 'vibrant', icon: Icons.circle, description: 'Desert sand dunes' },
  'corporate': { category: 'minimal', icon: Icons.square, description: 'Clean professional look' },
  'minimal': { category: 'minimal', icon: Icons.square, description: 'Ultra minimal white' },
  'executive': { category: 'minimal', icon: Icons.hexagon, description: 'Executive dark blue' },
  'aurora': { category: 'gradient', icon: Icons.circle, description: 'Northern lights effect' },
  'cotton-candy': { category: 'vibrant', icon: Icons.star, description: 'Pink purple soft' },
  'retro': { category: 'vibrant', icon: Icons.diamond, description: 'Retro 80s neon' },
  'forest': { category: 'dark', icon: Icons.hexagon, description: 'Deep forest green' },
  'ocean': { category: 'gradient', icon: Icons.circle, description: 'Deep ocean blue' },
  'lavender': { category: 'gradient', icon: Icons.circle, description: 'Soft purple tones' },
  'gold': { category: 'vibrant', icon: Icons.star, description: 'Luxury gold accent' },
  'rose-gold': { category: 'vibrant', icon: Icons.star, description: 'Elegant rose gold' },
  'midnight': { category: 'dark', icon: Icons.hexagon, description: 'Deep midnight black' },
  'glass': { category: 'minimal', icon: Icons.square, description: 'Glass morphism effect' },
  'rainbow': { category: 'vibrant', icon: Icons.star, description: 'Full spectrum colors' },
}

export default function ThemesPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedTheme, setSelectedTheme] = useState<typeof themes[0] | null>(null)

  const filteredThemes = activeCategory === 'all'
    ? themes
    : themes.filter(theme => themeMeta[theme.id]?.category === activeCategory)

  return (
    <div className="min-h-screen bg-black text-white font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            GitoLink
          </Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">
              Home
            </Link>
            <Link href="/#features" className="text-sm text-gray-400 hover:text-white transition-colors">
              Features
            </Link>
            <Link href="/themes" className="text-sm text-[#00FF41]">
              Themes
            </Link>
            <Link href="/#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">
              Pricing
            </Link>
          </nav>

          <Link 
            href="/register"
            className="px-4 py-2 bg-white text-black text-sm font-medium hover:bg-gray-200 transition-colors"
          >
            Get Started
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              20+ STUNNING
              <span className="text-[#00FF41]"> THEMES</span>
            </h1>
            
            <div className="w-16 h-[2px] bg-[#00FF41] mx-auto mb-6" />
            
            <p className="text-gray-400 font-mono max-w-2xl mx-auto text-lg">
              From cyberpunk neon to minimalist elegance. Find the perfect look for your brand.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-3">
            {themeCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`
                  flex items-center gap-2
                  px-4 py-2
                  font-mono text-sm
                  transition-all duration-200
                  ${activeCategory === category.id
                    ? 'bg-[#00FF41] text-black'
                    : 'bg-gray-900 text-gray-400 border border-gray-800 hover:border-gray-600'
                  }
                `}
              >
                <span className={activeCategory === category.id ? 'text-black' : ''}>
                  {category.icon}
                </span>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredThemes.map((theme, index) => {
              const meta = themeMeta[theme.id] || { category: 'all', icon: Icons.circle, description: 'Custom theme' }
              
              return (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedTheme(theme)}
                >
                  <div className={`
                    relative aspect-[3/4]
                    overflow-hidden
                    border
                    ${selectedTheme?.id === theme.id 
                      ? 'border-[#00FF41] shadow-[0_0_30px_rgba(0,255,65,0.2)]' 
                      : 'border-gray-800 group-hover:border-gray-600'
                    }
                    transition-all duration-300
                  `}>
                    {/* Theme Preview Background */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: theme.gradient || theme.backgroundColor || '#1a1a1a'
                      }}
                    />
                    
                    {/* Mock Content */}
                    <div className="absolute inset-4 flex flex-col">
                      {/* Avatar */}
                      <div className="w-12 h-12 bg-white/10 rounded-full mx-auto mb-3 border-2 border-white/20" />
                      
                      {/* Name */}
                      <div className="h-2 w-20 bg-white/20 rounded mx-auto mb-4" />
                      
                      {/* Links */}
                      <div className="space-y-2 flex-1">
                        <div className="h-8 bg-white/10 rounded" />
                        <div className="h-8 bg-white/10 rounded" />
                        <div className="h-8 bg-white/10 rounded" />
                      </div>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="
                      absolute inset-0
                      bg-black/80
                      flex flex-col items-center justify-center
                      opacity-0 group-hover:opacity-100
                      transition-opacity duration-300
                    ">
                      <div className="text-[#00FF41] mb-2">
                        {Icons.eye}
                      </div>
                      <span className="font-mono text-sm">Preview Theme</span>
                    </div>
                    
                    {/* Selected Indicator */}
                    {selectedTheme?.id === theme.id && (
                      <div className="absolute top-3 right-3 w-6 h-6 bg-[#00FF41] flex items-center justify-center">
                        <span className="text-black">{Icons.check}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Theme Info */}
                  <div className="mt-4">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-gray-500">{meta.icon}</span>
                      <h3 className="font-bold text-white">
                        {theme.name}
                      </h3>
                    </div>
                    
                    <p className="text-sm text-gray-500 font-mono">
                      {meta.description}
                    </p>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 border-t border-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              READY TO CREATE
              <span className="text-[#00FF41]"> YOUR PAGE?</span>
            </h2>
            
            <p className="text-gray-400 font-mono mb-8 max-w-lg mx-auto">
              Choose any theme. Customize everything. Free forever.
            </p>
            
            <Link 
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#00FF41] text-black font-bold text-lg hover:bg-[#00CC33] transition-colors"
            >
              Get Started Free
              <span className="text-black">{Icons.arrowRight}</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="text-xl font-bold">GitoLink</Link>
            
            <div className="flex gap-6 text-sm text-gray-500 font-mono">
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <Link href="/#features" className="hover:text-white transition-colors">Features</Link>
              <Link href="/themes" className="hover:text-white transition-colors">Themes</Link>
              <Link href="/#pricing" className="hover:text-white transition-colors">Pricing</Link>
            </div>
            
            <p className="text-gray-600 font-mono text-sm">
              © 2026 GitoLink
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
