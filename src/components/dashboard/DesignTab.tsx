'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { themes } from '@/lib/utils'
import { layouts, buttonStyles, googleFonts } from '@/types'
import type { Link } from '@/types'

// SVG Icons
const Icons = {
  layout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
  ),
  type: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <polyline points="4 7 4 4 20 4 20 7" />
      <line x1="9" y1="20" x2="15" y2="20" />
      <line x1="12" y1="4" x2="12" y2="20" />
    </svg>
  ),
  palette: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a10 10 0 0 1 10 10c0 5.523-4.477 10-10 10S2 17.523 2 12" />
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
  image: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  rotate: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <polyline points="23 4 23 10 17 10" />
      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
    </svg>
  ),
  save: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
      <polyline points="17 21 17 13 7 13 7 21" />
      <polyline points="7 3 7 8 15 8" />
    </svg>
  ),
  alert: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12.01" y2="16" />
    </svg>
  ),
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
      <line x1="12" y1="18" x2="12.01" y2="18" />
    </svg>
  ),
  upload: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" y1="3" x2="12" y2="15" />
    </svg>
  )
}

type SectionType = 'layout' | 'typography' | 'colors' | 'buttons' | 'background'

interface DesignUser {
  layout: 'classic' | 'hero' | 'minimal'
  font_family: string
  title_color: string
  button_style: 'rounded' | 'pill' | 'square' | 'glass'
  button_color: string
  theme: string
  background_type: 'gradient' | 'solid' | 'image'
  background_value: string
}

interface DesignTabProps {
  user: DesignUser
  links: Link[]
  onDesignUpdate: (design: Partial<DesignUser>) => Promise<any>
}

const presetColors = [
  '#ffffff', '#000000', '#1a1a1a', '#333333',
  '#ef4444', '#f97316', '#f59e0b', '#84cc16',
  '#22c55e', '#10b981', '#14b8a6', '#06b6d4',
  '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6',
  '#a855f7', '#d946ef', '#ec4899', '#f43f5e',
  '#00FF41', '#00CC33'
]

// Mock links for preview
const mockLinks = [
  { id: '1', title: 'My Website', url: 'https://example.com', icon: 'website' },
  { id: '2', title: 'Twitter', url: 'https://twitter.com', icon: 'twitter' },
  { id: '3', title: 'Instagram', url: 'https://instagram.com', icon: 'instagram' },
]

// Mobile Preview Component
function MobilePreview({ design }: { design: DesignUser }) {
  const getBackgroundStyle = () => {
    if (design.background_type === 'image' && design.background_value) {
      return {
        backgroundImage: `url(${design.background_value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    }
    if (design.background_type === 'solid' && design.background_value) {
      return { backgroundColor: design.background_value }
    }
    const theme = themes.find(t => t.id === design.theme)
    return { background: theme?.gradient || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }
  }

  const getButtonClass = () => {
    const base = 'w-full py-3 px-4 flex items-center justify-center gap-3 transition-all'
    
    if (design.button_style === 'glass') {
      return `${base} bg-white/20 backdrop-blur border border-white/30 rounded-lg`
    }
    
    const radius = {
      rounded: 'rounded-lg',
      pill: 'rounded-full',
      square: 'rounded-none'
    }[design.button_style] || 'rounded-lg'
    
    return `${base} ${radius}`
  }

  const getTextColor = () => {
    const hex = design.button_color.replace('#', '')
    const r = parseInt(hex.substr(0, 2), 16)
    const g = parseInt(hex.substr(2, 2), 16)
    const b = parseInt(hex.substr(4, 2), 16)
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
    return luminance > 0.5 ? '#000000' : '#ffffff'
  }

  const getLayoutClass = () => {
    switch (design.layout) {
      case 'hero':
        return 'pt-8 pb-4'
      case 'minimal':
        return 'pt-4 pb-4'
      default:
        return 'pt-6 pb-4'
    }
  }

  return (
    <div className="flex flex-col items-center">
      {/* Phone Frame */}
      <div className="relative w-[280px] bg-gray-900 rounded-[2.5rem] p-2 border-4 border-gray-800 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-3 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-full z-10" />
        
        {/* Screen */}
        <div 
          className={`w-full aspect-[9/19] rounded-[2rem] overflow-hidden ${getLayoutClass()}`}
          style={{
            ...getBackgroundStyle(),
            fontFamily: design.font_family
          }}
        >
          {/* Profile Content */}
          <div className="px-4 flex flex-col items-center h-full">
            {/* Avatar */}
            <div className={`w-16 h-16 mx-auto mb-3 flex items-center justify-center text-xl font-bold
              ${design.layout === 'minimal' ? 'hidden' : 'bg-white/20 border-2 border-white/30 rounded-full'}`}
            >
              T
            </div>
            
            {/* Name */}
            <h2 
              className={`font-bold text-center mb-1 ${design.layout === 'hero' ? 'text-2xl' : 'text-lg'}`}
              style={{ color: design.title_color }}
            >
              Test User
            </h2>
            
            <p className="text-sm opacity-70 mb-4 text-center" style={{ color: design.title_color }}>
              @testuser
            </p>
            
            {/* Links */}
            <div className="w-full space-y-3 flex-1">
              {mockLinks.map((link) => (
                <button
                  key={link.id}
                  className={getButtonClass()}
                  style={{ 
                    backgroundColor: design.button_style === 'glass' ? undefined : design.button_color,
                    color: getTextColor()
                  }}
                >
                  <span className="text-sm font-medium">{link.title}</span>
                </button>
              ))}
            </div>
            
            {/* Footer */}
            <div className="mt-auto pt-4">
              <p className="text-xs opacity-50 text-center" style={{ color: design.title_color }}>
                Made with GitoLink
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Preview Label */}
      <div className="mt-4 flex items-center gap-2 text-gray-500">
        {Icons.phone}
        <span className="text-xs font-mono uppercase tracking-wider">Live Preview</span>
      </div>
    </div>
  )
}

export function DesignTab({ user, onDesignUpdate }: DesignTabProps) {
  const [activeSection, setActiveSection] = useState<SectionType>('layout')
  const [displayState, setDisplayState] = useState<DesignUser>(user)
  const [savedState, setSavedState] = useState<DesignUser>(user)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingChanges, setPendingChanges] = useState<Partial<DesignUser>>({})

  const effectiveDesign: DesignUser = { ...savedState, ...pendingChanges }
  const hasUnsavedChanges = Object.keys(pendingChanges).length > 0

  useEffect(() => {
    setSavedState(user)
    setDisplayState(user)
    setPendingChanges({})
  }, [user])

  const handleDesignChange = useCallback((changes: Partial<DesignUser>) => {
    setPendingChanges(prev => ({ ...prev, ...changes }))
    setDisplayState(prev => ({ ...prev, ...changes }))
  }, [])

  const handleApplyChanges = async () => {
    if (!hasUnsavedChanges) return
    
    setIsSaving(true)
    try {
      await onDesignUpdate(pendingChanges)
      const newState = { ...savedState, ...pendingChanges }
      setSavedState(newState)
      setDisplayState(newState)
      setPendingChanges({})
      toast.success('Design saved!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  const handleReset = () => {
    setDisplayState(savedState)
    setPendingChanges({})
    toast('Changes discarded')
  }

  const sections = [
    { id: 'layout' as SectionType, label: '01 LAYOUT', icon: Icons.layout },
    { id: 'typography' as SectionType, label: '02 TYPOGRAPHY', icon: Icons.type },
    { id: 'colors' as SectionType, label: '03 COLORS', icon: Icons.palette },
    { id: 'buttons' as SectionType, label: '04 BUTTONS', icon: Icons.grid },
    { id: 'background' as SectionType, label: '05 APPEARANCE', icon: Icons.image },
  ]

  const themeObj = themes.find(t => t.id === effectiveDesign.theme) || themes[0]

  return (
    <div className="grid lg:grid-cols-[280px_1fr_320px] gap-6">
      {/* Left Sidebar - Sections */}
      <aside className="bg-[#0a0a0a] border border-gray-800 p-2 h-fit">
        <nav className="space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-l-2 font-mono text-sm
                ${activeSection === section.id 
                  ? 'border-[#00FF41] bg-white/5 text-white' 
                  : 'border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'}`}
            >
              <span className={activeSection === section.id ? 'text-[#00FF41]' : ''}>
                {section.icon}
              </span>
              <span>{section.label}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Middle - Controls */}
      <div className="space-y-6">
        {/* Header with Actions */}
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold">CUSTOMIZE DESIGN</h1>
            <div className="w-12 h-[2px] bg-[#00FF41] mt-2" />
          </div>
          
          <div className="flex items-center gap-2">
            {hasUnsavedChanges && (
              <span className="px-2 py-1 bg-amber-500/20 text-amber-400 text-xs font-mono">
                UNSAVED
              </span>
            )}
            <button
              onClick={handleReset}
              disabled={!hasUnsavedChanges || isSaving}
              className="flex items-center gap-2 px-4 py-2 border border-gray-700 text-gray-300 hover:bg-gray-800 disabled:opacity-50"
            >
              {Icons.rotate}
              RESET
            </button>
            
            <button
              onClick={handleApplyChanges}
              disabled={!hasUnsavedChanges || isSaving}
              className="flex items-center gap-2 px-4 py-2 bg-[#00FF41] text-black font-bold hover:bg-[#00CC33] disabled:opacity-50"
            >
              {isSaving ? (
                <>Processing...</>
              ) : (
                <>
                  {Icons.save}
                  SAVE
                </>
              )}
            </button>
          </div>
        </div>

        {/* Section Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-[#0a0a0a] border border-gray-800 p-6"
          >
            {/* LAYOUT SECTION */}
            {activeSection === 'layout' && (
              <div className="space-y-4">
                <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">Choose Layout</h3>
                <div className="grid grid-cols-3 gap-4">
                  {layouts.map((layout) => (
                    <button
                      key={layout.id}
                      onClick={() => handleDesignChange({ layout: layout.id as typeof user.layout })}
                      className={`p-4 border-2 text-left transition-all
                        ${effectiveDesign.layout === layout.id
                          ? 'border-[#00FF41] bg-[#00FF41]/5' 
                          : 'border-gray-800 hover:border-gray-600'}`}
                    >
                      <div className="h-16 bg-gray-800 mb-3 flex items-center justify-center">
                        {Icons.layout}
                      </div>
                      <p className="font-medium text-sm">{layout.name}</p>
                      <p className="text-xs text-gray-500">{layout.description}</p>
                      {effectiveDesign.layout === layout.id && (
                        <div className="mt-2 text-[#00FF41] text-xs font-mono">SELECTED</div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TYPOGRAPHY SECTION */}
            {activeSection === 'typography' && (
              <div className="space-y-4">
                <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">Choose Font</h3>
                <div className="grid grid-cols-2 gap-3">
                  {googleFonts.map((font) => (
                    <button
                      key={font.id}
                      onClick={() => handleDesignChange({ font_family: font.id })}
                      className={`p-4 border-2 text-left transition-all
                        ${effectiveDesign.font_family === font.id
                          ? 'border-[#00FF41] bg-[#00FF41]/5'
                          : 'border-gray-800 hover:border-gray-600'}`}
                      style={{ fontFamily: font.id }}
                    >
                      <p className="text-lg">{font.name}</p>
                      <p className="text-xs text-gray-500 font-mono">{font.category}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* COLORS SECTION */}
            {activeSection === 'colors' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">Title Color</h3>
                  <div className="grid grid-cols-8 gap-2">
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleDesignChange({ title_color: color })}
                        className={`aspect-square transition-all border-2
                          ${effectiveDesign.title_color === color 
                            ? 'border-white scale-110' 
                            : 'border-transparent hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                      >
                        {effectiveDesign.title_color === color && (
                          <span className={color === '#ffffff' ? 'text-black' : 'text-white'}>
                            {Icons.check}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">Custom Hex</h3>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      value={effectiveDesign.title_color}
                      onChange={(e) => handleDesignChange({ title_color: e.target.value })}
                      className="w-12 h-12 bg-transparent border-0 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={effectiveDesign.title_color}
                      onChange={(e) => handleDesignChange({ title_color: e.target.value })}
                      className="flex-1 bg-black border border-gray-700 px-4 text-white font-mono uppercase focus:border-[#00FF41] focus:outline-none"
                      placeholder="#FFFFFF"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* BUTTONS SECTION */}
            {activeSection === 'buttons' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">Button Style</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {buttonStyles.map((style) => (
                      <button
                        key={style.id}
                        onClick={() => handleDesignChange({ button_style: style.id as typeof user.button_style })}
                        className={`p-4 border-2 text-center transition-all
                          ${effectiveDesign.button_style === style.id
                            ? 'border-[#00FF41] bg-[#00FF41]/5'
                            : 'border-gray-800 hover:border-gray-600'}`}
                      >
                        <div 
                          className="w-full h-10 mb-2 mx-auto"
                          style={{
                            backgroundColor: effectiveDesign.button_color,
                            borderRadius: style.id === 'pill' ? '9999px' : style.id === 'square' ? '0' : '0.5rem'
                          }}
                        />
                        <p className="text-sm">{style.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">Button Color</h3>
                  <div className="grid grid-cols-8 gap-2">
                    {presetColors.map((color) => (
                      <button
                        key={color}
                        onClick={() => handleDesignChange({ button_color: color })}
                        className={`aspect-square transition-all border-2
                          ${effectiveDesign.button_color === color 
                            ? 'border-white scale-110' 
                            : 'border-transparent hover:scale-105'}`}
                        style={{ backgroundColor: color }}
                      >
                        {effectiveDesign.button_color === color && (
                          <span className={color === '#ffffff' ? 'text-black' : 'text-white'}>
                            {Icons.check}
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* BACKGROUND SECTION */}
            {activeSection === 'background' && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">Select Theme</h3>
                  <div className="grid grid-cols-4 gap-3">
                    {themes.map((theme) => (
                      <button
                        key={theme.id}
                        onClick={() => handleDesignChange({ theme: theme.id, background_type: 'gradient', background_value: theme.id })}
                        className={`relative h-24 border-2 overflow-hidden transition-all
                          ${effectiveDesign.theme === theme.id && effectiveDesign.background_type !== 'image'
                            ? 'border-[#00FF41]' 
                            : 'border-gray-800 hover:border-gray-600'}`}
                      >
                        <div className={`absolute inset-0 ${theme.class}`} />
                        <span className="absolute bottom-0 left-0 right-0 p-2 bg-black/80 text-xs font-mono truncate">
                          {theme.name}
                        </span>
                        {effectiveDesign.theme === theme.id && effectiveDesign.background_type !== 'image' && (
                          <div className="absolute top-2 right-2 w-5 h-5 bg-[#00FF41] flex items-center justify-center">
                            <span className="text-black">{Icons.check}</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-mono text-gray-500 uppercase tracking-wider mb-4">Custom Background</h3>
                  <div className="border-2 border-dashed border-gray-700 p-8 text-center hover:border-gray-500 transition-colors cursor-pointer">
                    {Icons.upload}
                    <p className="mt-2 text-sm text-gray-400">Drop image here or click to upload</p>
                    <p className="text-xs text-gray-600 font-mono mt-1">JPG, PNG up to 5MB</p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Right - Mobile Preview */}
      <aside className="bg-[#0a0a0a] border border-gray-800 p-6">
        <MobilePreview design={effectiveDesign} />
      </aside>
    </div>
  )
}

export default DesignTab
