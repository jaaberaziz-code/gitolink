'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGlobe, FiExternalLink, FiShare2, FiHeart, FiArrowRight, FiCheck, FiFilter } from 'react-icons/fi'
import { FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaLinkedin } from 'react-icons/fa'
import Link from 'next/link'
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

const demoLinks = [
  { id: '1', title: '🎨 My Portfolio', icon: <FiGlobe className="w-5 h-5" /> },
  { id: '2', title: '📸 Instagram', icon: <FaInstagram className="w-5 h-5" /> },
  { id: '3', title: '📺 YouTube', icon: <FaYoutube className="w-5 h-5" /> },
  { id: '4', title: '🐦 Twitter', icon: <FaTwitter className="w-5 h-5" /> },
  { id: '5', title: '💼 LinkedIn', icon: <FaLinkedin className="w-5 h-5" /> },
  { id: '6', title: '🎵 TikTok', icon: <FaTiktok className="w-5 h-5" /> },
]

export default function DemoPage() {
  const [selectedTheme, setSelectedTheme] = useState(themes[0])
  const [activeCategory, setActiveCategory] = useState<ThemeCategory>('all')
  const [hoveredTheme, setHoveredTheme] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const filteredThemes = activeCategory === 'all'
    ? themes
    : themes.filter(theme => {
        const categories = themeCategoryMap[theme.id]
        return categories?.includes(activeCategory)
      })

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleThemeSelect = (theme: typeof themes[0]) => {
    setSelectedTheme(theme)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0a0a0f' }}>
      {/* Header */}
      <div style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        backgroundColor: 'rgba(0,0,0,0.8)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        zIndex: 50 
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '16px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>🎨 Theme Showcase</h1>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Choose from 18 beautiful themes</p>
          </div>
          <Link href="/register" style={{ 
            background: 'linear-gradient(to right, #2563eb, #9333ea)', 
            color: 'white', 
            padding: '10px 20px', 
            borderRadius: '8px',
            textDecoration: 'none',
            fontWeight: '500'
          }}>
            Create Yours →
          </Link>
        </div>
      </div>

      <div style={{ paddingTop: '100px', paddingBottom: '40px' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
            
            {/* Left: Theme Selector */}
            <div>
              {/* Header */}
              <div style={{ marginBottom: '24px' }}>
                <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 'bold', marginBottom: '8px' }}>Choose your theme</h2>
                <p style={{ color: '#9ca3af', fontSize: '16px' }}>Pick a style that represents you</p>
              </div>

              {/* Category Filters */}
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                marginBottom: '24px',
                overflowX: 'auto',
                paddingBottom: '8px'
              }}>
                <FiFilter style={{ color: '#6b7280', flexShrink: 0 }} />
                <div style={{ display: 'flex', gap: '8px' }}>
                  {themeCategories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '9999px',
                        fontSize: '14px',
                        fontWeight: '500',
                        whiteSpace: 'nowrap',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        background: activeCategory === category.id ? '#2563eb' : '#374151',
                        color: activeCategory === category.id ? 'white' : '#9ca3af',
                      }}
                    >
                      {category.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Theme Grid */}
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', 
                gap: '16px' 
              }}>
                {filteredThemes.map((theme, index) => {
                  const isSelected = selectedTheme.id === theme.id
                  const isHovered = hoveredTheme === theme.id

                  return (
                    <motion.button
                      key={theme.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.03 }}
                      onClick={() => handleThemeSelect(theme)}
                      onMouseEnter={() => setHoveredTheme(theme.id)}
                      onMouseLeave={() => setHoveredTheme(null)}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.98 }}
                      style={{
                        position: 'relative',
                        overflow: 'hidden',
                        borderRadius: '16px',
                        border: 'none',
                        padding: 0,
                        cursor: 'pointer',
                        background: 'transparent',
                        boxShadow: isSelected 
                          ? '0 0 0 3px #3b82f6, 0 20px 25px -5px rgba(59, 130, 246, 0.3)' 
                          : '0 0 0 1px #374151',
                      }}
                    >
                      {/* Theme Preview Card */}
                      <div 
                        className={theme.class}
                        style={{
                          aspectRatio: '4/5',
                          position: 'relative',
                          overflow: 'hidden',
                        }}
                      >
                        {/* Mock Profile Preview */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          padding: '16px',
                        }}>
                          {/* Avatar */}
                          <div style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '50%',
                            marginBottom: '12px',
                            background: theme.id === 'minimal' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
                            backdropFilter: theme.id === 'minimal' ? 'none' : 'blur(4px)',
                          }} />
                          
                          {/* Name */}
                          <div style={{
                            width: '96px',
                            height: '12px',
                            borderRadius: '4px',
                            marginBottom: '8px',
                            background: theme.id === 'minimal' ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)',
                          }} />
                          
                          {/* Bio */}
                          <div style={{
                            width: '64px',
                            height: '8px',
                            borderRadius: '4px',
                            marginBottom: '16px',
                            background: theme.id === 'minimal' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)',
                          }} />
                          
                          {/* Mock Links */}
                          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {[1, 2, 3].map((i) => (
                              <div
                                key={i}
                                style={{
                                  width: '100%',
                                  height: '28px',
                                  borderRadius: '8px',
                                  background: theme.id === 'minimal' 
                                    ? 'rgba(255,255,255,0.8)' 
                                    : 'rgba(255,255,255,0.1)',
                                  backdropFilter: theme.id === 'minimal' ? 'none' : 'blur(4px)',
                                }}
                              />
                            ))}
                          </div>
                        </div>

                        {/* Gradient Overlay */}
                        <div style={{
                          position: 'absolute',
                          inset: 0,
                          background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                          padding: '16px',
                          opacity: isSelected || isHovered ? 1 : 0,
                          transition: 'opacity 0.3s',
                        }}>
                          <p style={{ color: 'white', fontWeight: 600, fontSize: '14px', margin: 0 }}>{theme.name}</p>
                          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px', margin: 0 }}>
                            {themeCategoryMap[theme.id]?.[0] || 'Theme'}
                          </p>
                        </div>

                        {/* Selected Indicator */}
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            style={{
                              position: 'absolute',
                              top: '12px',
                              right: '12px',
                              width: '28px',
                              height: '28px',
                              background: '#3b82f6',
                              borderRadius: '50%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)',
                            }}
                          >
                            <FiCheck style={{ color: 'white', width: '16px', height: '16px' }} />
                          </motion.div>
                        )}

                        {/* Hover Overlay */}
                        {isHovered && !isSelected && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            style={{
                              position: 'absolute',
                              inset: 0,
                              background: 'rgba(255,255,255,0.1)',
                              backdropFilter: 'blur(2px)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <span style={{
                              padding: '8px 16px',
                              background: 'rgba(255,255,255,0.9)',
                              color: '#111827',
                              borderRadius: '9999px',
                              fontSize: '14px',
                              fontWeight: 500,
                            }}>
                              Preview
                            </span>
                          </motion.div>
                        )}
                      </div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Empty State */}
              {filteredThemes.length === 0 && (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <p style={{ color: '#6b7280' }}>No themes found in this category</p>
                </div>
              )}

              {/* Preview Note */}
              <div style={{ textAlign: 'center', paddingTop: '24px' }}>
                <p style={{ color: '#6b7280', fontSize: '14px' }}>
                  You can customize colors, fonts, and more in your dashboard after setup.
                </p>
              </div>
            </div>

            {/* Right: Phone Preview */}
            <div style={{ position: 'sticky', top: '120px' }}>
              <div style={{ 
                backgroundColor: 'rgba(255,255,255,0.05)', 
                borderRadius: '24px', 
                padding: '24px',
                border: '1px solid rgba(255,255,255,0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <span style={{ color: 'white', fontWeight: 500 }}>Live Preview</span>
                  <span style={{ color: '#9ca3af', fontSize: '14px' }}>{selectedTheme.name}</span>
                </div>

                {/* Phone Mockup */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedTheme.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    style={{ display: 'flex', justifyContent: 'center' }}
                  >
                    {/* Phone Frame */}
                    <div style={{
                      width: '280px',
                      backgroundColor: '#1a1a1a',
                      borderRadius: '40px',
                      padding: '8px',
                      boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)'
                    }}>
                      {/* Screen */}
                      <div 
                        className={selectedTheme.class}
                        style={{
                          borderRadius: '32px',
                          height: '560px',
                          position: 'relative',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Notch */}
                        <div style={{
                          position: 'absolute',
                          top: 0,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          width: '100px',
                          height: '24px',
                          backgroundColor: 'black',
                          borderBottomLeftRadius: '16px',
                          borderBottomRightRadius: '16px'
                        }} />

                        {/* Content */}
                        <div style={{ padding: '60px 20px 20px', height: '100%', overflowY: 'auto' }}>
                          {/* Share */}
                          <button 
                            onClick={handleCopy}
                            style={{
                              position: 'absolute',
                              top: '50px',
                              right: '16px',
                              backgroundColor: selectedTheme.id === 'minimal' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                              borderRadius: '50%',
                              width: '36px',
                              height: '36px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              border: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            {copied ? <FiCheck style={{ color: '#4ade80' }} /> : <FiShare2 style={{ color: selectedTheme.id === 'minimal' ? '#374151' : 'white' }} />}
                          </button>

                          {/* Profile */}
                          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{
                              width: '80px',
                              height: '80px',
                              borderRadius: '50%',
                              backgroundColor: selectedTheme.id === 'minimal' ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)',
                              backdropFilter: selectedTheme.id === 'minimal' ? 'none' : 'blur(10px)',
                              border: selectedTheme.id === 'minimal' ? '2px solid rgba(0,0,0,0.2)' : '2px solid rgba(255,255,255,0.3)',
                              margin: '0 auto 12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '28px',
                              fontWeight: 'bold',
                              color: selectedTheme.id === 'minimal' ? '#374151' : 'white'
                            }}>
                              AC
                            </div>
                            <h2 style={{ color: selectedTheme.id === 'minimal' ? '#111827' : 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>Alex Creator</h2>
                            <p style={{ color: selectedTheme.id === 'minimal' ? '#6b7280' : 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px' }}>@alexcreator</p>
                            <p style={{ color: selectedTheme.id === 'minimal' ? '#4b5563' : 'rgba(255,255,255,0.8)', fontSize: '12px', lineHeight: '1.5' }}>
                              🎨 Digital Artist | 📸 Photographer<br/>Welcome to my creative corner!
                            </p>
                          </div>

                          {/* Links */}
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {demoLinks.map((link, index) => (
                              <motion.button
                                key={link.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                style={{
                                  backgroundColor: selectedTheme.id === 'minimal' ? 'white' : 'rgba(255,255,255,0.15)',
                                  backdropFilter: selectedTheme.id === 'minimal' ? 'none' : 'blur(10px)',
                                  borderRadius: '12px',
                                  padding: '12px 16px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  border: selectedTheme.id === 'minimal' ? '1px solid rgba(0,0,0,0.1)' : 'none',
                                  boxShadow: selectedTheme.id === 'minimal' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                  cursor: 'pointer',
                                  color: selectedTheme.id === 'minimal' ? '#374151' : 'white',
                                  fontWeight: 500
                                }}
                              >
                                <div style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  backgroundColor: selectedTheme.id === 'minimal' ? '#f3f4f6' : 'rgba(255,255,255,0.2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: selectedTheme.id === 'minimal' ? '#6b7280' : 'inherit'
                                }}>
                                  {link.icon}
                                </div>
                                <span style={{ flex: 1, textAlign: 'left', fontSize: '14px' }}>{link.title}</span>
                              </motion.button>
                            ))}
                          </div>

                          {/* Footer */}
                          <div style={{ textAlign: 'center', marginTop: '24px' }}>
                            <span style={{ color: selectedTheme.id === 'minimal' ? '#9ca3af' : 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Powered by GitoLink</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>

                {/* CTA */}
                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                  <Link href="/register" style={{
                    display: 'inline-block',
                    background: 'linear-gradient(to right, #2563eb, #9333ea)',
                    color: 'white',
                    padding: '12px 32px',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '600'
                  }}>
                    Use This Theme
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
