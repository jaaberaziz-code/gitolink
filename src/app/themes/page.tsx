'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { themes } from '@/lib/utils'

// SVG Icons
const Icons = {
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} className="w-5 h-5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  eye: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  star: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  ),
  hexagon: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M21 16V8l-9-5-9 5v8l9 5 9-5z" />
    </svg>
  ),
  terminal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  square: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" />
    </svg>
  ),
  circle: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
    </svg>
  ),
  diamond: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <polygon points="12 2 22 12 12 22 2 12" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  ),
  music: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
  zap: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
  )
}

// Theme categories
const themeCategories = [
  { id: 'all', label: 'ALL THEMES', icon: Icons.grid },
  { id: 'gaming', label: 'GAMING', icon: Icons.zap },
  { id: 'minimal', label: 'MINIMAL', icon: Icons.square },
  { id: 'gradient', label: 'GRADIENTS', icon: Icons.circle },
  { id: 'dark', label: 'DARK', icon: Icons.hexagon },
  { id: 'vibrant', label: 'VIBRANT', icon: Icons.star },
]

// Theme metadata with unique preview configs
const themeMeta: Record<string, { 
  category: string
  icon: React.ReactNode
  description: string
  accentColor: string
  buttonStyle: string
  textColor: string
}> = {
  'cyberpunk': { 
    category: 'gaming', 
    icon: Icons.zap, 
    description: 'Neon cyber aesthetic',
    accentColor: '#00FF41',
    buttonStyle: 'border-[#00FF41] text-[#00FF41]',
    textColor: 'text-white'
  },
  'matrix': { 
    category: 'gaming', 
    icon: Icons.terminal, 
    description: 'Green code rain',
    accentColor: '#00FF41',
    buttonStyle: 'bg-[#00FF41] text-black',
    textColor: 'text-[#00FF41]'
  },
  'sunset': { 
    category: 'gradient', 
    icon: Icons.circle, 
    description: 'Warm orange vibes',
    accentColor: '#F97316',
    buttonStyle: 'bg-white text-orange-600',
    textColor: 'text-white'
  },
  'tropical': { 
    category: 'vibrant', 
    icon: Icons.star, 
    description: 'Beach paradise',
    accentColor: '#06B6D4',
    buttonStyle: 'bg-white text-cyan-600',
    textColor: 'text-white'
  },
  'desert': { 
    category: 'vibrant', 
    icon: Icons.diamond, 
    description: 'Golden sand dunes',
    accentColor: '#F59E0B',
    buttonStyle: 'bg-amber-500 text-white',
    textColor: 'text-white'
  },
  'corporate': { 
    category: 'minimal', 
    icon: Icons.square, 
    description: 'Clean professional',
    accentColor: '#3B82F6',
    buttonStyle: 'bg-blue-600 text-white',
    textColor: 'text-white'
  },
  'minimal': { 
    category: 'minimal', 
    icon: Icons.square, 
    description: 'Ultra minimal',
    accentColor: '#000000',
    buttonStyle: 'border-black text-black',
    textColor: 'text-black'
  },
  'executive': { 
    category: 'dark', 
    icon: Icons.hexagon, 
    description: 'Executive dark',
    accentColor: '#64748B',
    buttonStyle: 'bg-slate-500 text-white',
    textColor: 'text-white'
  },
  'aurora': { 
    category: 'gradient', 
    icon: Icons.circle, 
    description: 'Northern lights',
    accentColor: '#A855F7',
    buttonStyle: 'bg-purple-500 text-white',
    textColor: 'text-white'
  },
  'cotton-candy': { 
    category: 'vibrant', 
    icon: Icons.star, 
    description: 'Pink purple soft',
    accentColor: '#EC4899',
    buttonStyle: 'bg-pink-500 text-white',
    textColor: 'text-white'
  },
  'retro': { 
    category: 'vibrant', 
    icon: Icons.diamond, 
    description: '80s neon wave',
    accentColor: '#F472B6',
    buttonStyle: 'bg-pink-400 text-white',
    textColor: 'text-white'
  },
  'forest': { 
    category: 'dark', 
    icon: Icons.hexagon, 
    description: 'Deep forest',
    accentColor: '#10B981',
    buttonStyle: 'bg-emerald-500 text-white',
    textColor: 'text-white'
  },
  'ocean': { 
    category: 'gradient', 
    icon: Icons.circle, 
    description: 'Deep ocean blue',
    accentColor: '#0EA5E9',
    buttonStyle: 'bg-sky-500 text-white',
    textColor: 'text-white'
  },
  'lavender': { 
    category: 'gradient', 
    icon: Icons.circle, 
    description: 'Soft purple',
    accentColor: '#A855F7',
    buttonStyle: 'bg-purple-400 text-white',
    textColor: 'text-purple-900'
  },
  'gold': { 
    category: 'vibrant', 
    icon: Icons.star, 
    description: 'Luxury gold',
    accentColor: '#EAB308',
    buttonStyle: 'bg-yellow-500 text-black',
    textColor: 'text-yellow-900'
  },
  'rose-gold': { 
    category: 'vibrant', 
    icon: Icons.star, 
    description: 'Elegant rose',
    accentColor: '#FB7185',
    buttonStyle: 'bg-rose-400 text-white',
    textColor: 'text-rose-900'
  },
  'midnight': { 
    category: 'dark', 
    icon: Icons.hexagon, 
    description: 'Midnight purple',
    accentColor: '#8B5CF6',
    buttonStyle: 'bg-violet-500 text-white',
    textColor: 'text-white'
  },
  'glass': { 
    category: 'minimal', 
    icon: Icons.square, 
    description: 'Glass morphism',
    accentColor: '#FFFFFF',
    buttonStyle: 'bg-white/20 backdrop-blur border border-white/40 text-white',
    textColor: 'text-white'
  },
  'rainbow': { 
    category: 'vibrant', 
    icon: Icons.star, 
    description: 'Full spectrum',
    accentColor: '#EC4899',
    buttonStyle: 'bg-white text-pink-600',
    textColor: 'text-white'
  },
}

// Theme Preview Component - Renders unique visual for each theme
function ThemePreview({ theme, meta }: { theme: typeof themes[0], meta: typeof themeMeta[string] }) {
  return (
    <div className="absolute inset-4 flex flex-col">
      {/* Avatar - varies by theme */}
      <div 
        className={`w-12 h-12 mx-auto mb-3 flex items-center justify-center text-lg font-bold
          ${theme.id === 'matrix' ? 'bg-[#00FF41] text-black' : 
            theme.id === 'cyberpunk' ? 'border-2 border-[#00FF41] text-[#00FF41]' :
            theme.id === 'minimal' ? 'bg-black text-white' :
            theme.id === 'glass' ? 'bg-white/20 backdrop-blur border border-white/30' :
            'bg-white/90 text-black'}`}
        style={{ borderRadius: theme.id === 'minimal' ? '0' : theme.id === 'corporate' ? '4px' : '9999px' }}
      >
        {theme.id === 'matrix'
          ? '01' 
          : theme.id === 'cyberpunk' 
            ? <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>
            : theme.id === 'gaming' 
              ? <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm-10 7H8v3H6v-3H3v-2h3V8h2v3h3v2zm4.5 2c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zm4-3c-.83 0-1.5-.67-1.5-1.5S18.67 9 19.5 9s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/></svg>
              : 'A'}
      </div>
      
      {/* Name */}
      <div 
        className={`h-2 w-16 mx-auto mb-4 ${meta?.textColor?.includes('black') ? 'bg-black/20' : 'bg-white/30'}`}
      />
      
      {/* Links - varies by theme */}
      <div className="space-y-2 flex-1">
        {[1, 2, 3].map((i) => (
          <div 
            key={i}
            className={`h-8 text-xs flex items-center justify-center font-medium
              ${theme.id === 'cyberpunk' ? 'border border-[#00FF41]/50 text-[#00FF41]' :
                theme.id === 'matrix' ? 'bg-[#00FF41]/20 text-[#00FF41] font-mono' :
                theme.id === 'minimal' ? 'border border-black/20 text-black' :
                theme.id === 'glass' ? 'bg-white/10 backdrop-blur text-white border border-white/20' :
                'bg-white/90 text-black'}`}
            style={{ 
              borderRadius: theme.id === 'minimal' ? '0' : theme.id === 'corporate' ? '4px' : '9999px',
              opacity: i === 3 ? 0.5 : 1 
            }}
          >
            {theme.id === 'matrix'
              ? `${101 + i}` 
              : theme.id === 'cyberpunk' 
                ? `[ LINK_${i} ]`
                : 'LINK'}
          </div>
        ))}
      </div>
    </div>
  )
}

export default function ThemesPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedTheme, setSelectedTheme] = useState<typeof themes[0] | null>(null)

  const filteredThemes = activeCategory === 'all'
    ? themes
    : themes.filter(theme => themeMeta[theme.id]?.category === activeCategory)

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">GITOLINK</Link>
          
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm text-gray-400 hover:text-white transition-colors">HOME</Link>
            <Link href="/#features" className="text-sm text-gray-400 hover:text-white transition-colors">FEATURES</Link>
            <Link href="/themes" className="text-sm text-[#00FF41]">THEMES</Link>
            <Link href="/#pricing" className="text-sm text-gray-400 hover:text-white transition-colors">PRICING</Link>
          </nav>

          <Link 
            href="/register"
            className="px-4 py-2 bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors"
          >
            GET STARTED
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl md:text-6xl font-bold mb-4">
              20+ STUNNING
              <span className="text-[#00FF41]"> THEMES</span>
            </h1>
            
            <div className="w-16 h-[2px] bg-[#00FF41] mx-auto mb-6" />
            
            <p className="text-gray-400 font-mono max-w-2xl mx-auto text-lg">
              From cyberpunk neon to minimalist elegance. Find the perfect look.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Filter */}
      <section className="px-6 pb-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2">
            {themeCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-4 py-2 font-mono text-sm transition-all
                  ${activeCategory === category.id
                    ? 'bg-[#00FF41] text-black'
                    : 'bg-[#0a0a0a] text-gray-400 border border-gray-800 hover:border-gray-600'
                  }`}
              >
                <span>{category.icon}</span>
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Themes Grid */}
      <section className="px-6 pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredThemes.map((theme, index) => {
              const meta = themeMeta[theme.id] || { 
                category: 'all', 
                icon: Icons.circle, 
                description: 'Custom theme',
                accentColor: '#ffffff',
                buttonStyle: 'bg-white text-black',
                textColor: 'text-white'
              }
              
              return (
                <motion.div
                  key={theme.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                  className="group cursor-pointer"
                  onClick={() => setSelectedTheme(theme)}
                >
                  <div className={`relative aspect-[3/4] overflow-hidden border transition-all duration-300
                    ${selectedTheme?.id === theme.id 
                      ? 'border-[#00FF41] shadow-[0_0_30px_rgba(0,255,65,0.2)]' 
                      : 'border-gray-800 group-hover:border-gray-600'}`}
                  >
                    {/* Theme Background */}
                    <div 
                      className="absolute inset-0"
                      style={{
                        background: theme.gradient || theme.backgroundColor || '#1a1a1a'
                      }}
                    />
                    
                    {/* Unique Preview Content */}
                    <ThemePreview theme={theme} meta={meta} />
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <div className="text-[#00FF41] mb-2">{Icons.eye}</div>
                      <span className="font-mono text-sm">PREVIEW THEME</span>
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
                      <h3 className="font-bold">{theme.name.toUpperCase()}</h3>
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
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              READY TO CREATE
              <span className="text-[#00FF41]"> YOUR PAGE?</span>
            </h2>
            
            <p className="text-gray-400 font-mono mb-8 max-w-lg mx-auto">
              Choose any theme. Customize everything. Free forever.
            </p>
            
            <Link 
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#00FF41] text-black font-bold hover:bg-[#00CC33] transition-colors"
            >
              GET STARTED FREE
              <span className="text-black">{Icons.arrowRight}</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <Link href="/" className="text-xl font-bold">GITOLINK</Link>
            
            <div className="flex gap-6 text-sm text-gray-500 font-mono">
              <Link href="/" className="hover:text-white transition-colors">HOME</Link>
              <Link href="/#features" className="hover:text-white transition-colors">FEATURES</Link>
              <Link href="/themes" className="hover:text-white transition-colors">THEMES</Link>
              <Link href="/#pricing" className="hover:text-white transition-colors">PRICING</Link>
            </div>
            
            <p className="text-gray-600 font-mono text-sm">© 2026 GITOLINK</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
