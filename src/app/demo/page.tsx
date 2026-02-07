'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiGlobe, FiExternalLink, FiShare2, FiHeart, FiArrowRight, FiCheck } from 'react-icons/fi'
import { FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaLinkedin } from 'react-icons/fa'
import Link from 'next/link'

const themes = [
  { id: 'cyberpunk', name: 'Cyberpunk Neon', gradient: 'from-pink-500 via-purple-500 to-cyan-400' },
  { id: 'sunset', name: 'Sunset Beach', gradient: 'from-orange-400 via-pink-500 to-purple-600' },
  { id: 'tropical', name: 'Tropical Paradise', gradient: 'from-teal-300 via-cyan-400 to-blue-500' },
  { id: 'corporate', name: 'Corporate Blue', gradient: 'from-blue-600 via-indigo-600 to-slate-700' },
  { id: 'forest', name: 'Deep Forest', gradient: 'from-emerald-500 via-teal-600 to-green-700' },
  { id: 'gold', name: 'Luxury Gold', gradient: 'from-yellow-400 via-yellow-500 to-amber-600' },
  { id: 'midnight', name: 'Midnight Purple', gradient: 'from-indigo-900 via-purple-900 to-slate-900' },
  { id: 'rainbow', name: 'Pride Rainbow', gradient: 'from-red-500 via-yellow-500 via-green-500 to-purple-500' },
]

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
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ color: 'white', fontSize: '20px', fontWeight: 'bold' }}>🎨 Theme Showcase</h1>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Choose from 20+ beautiful themes</p>
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
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
            
            {/* Left: Theme Selector */}
            <div>
              <h2 style={{ color: 'white', fontSize: '24px', marginBottom: '24px' }}>Select a Theme</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '16px' }}>
                {themes.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => setSelectedTheme(theme)}
                    style={{
                      background: selectedTheme.id === theme.id ? 'rgba(37, 99, 235, 0.2)' : 'rgba(255,255,255,0.05)',
                      border: selectedTheme.id === theme.id ? '2px solid #2563eb' : '2px solid transparent',
                      borderRadius: '12px',
                      padding: '16px',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{
                      height: '80px',
                      borderRadius: '8px',
                      background: `linear-gradient(to bottom right, var(--tw-gradient-stops))`,
                    }} className={`bg-gradient-to-br ${theme.gradient}`} />
                    <p style={{ color: 'white', marginTop: '8px', fontSize: '14px', fontWeight: '500' }}>{theme.name}</p>
                  </button>
                ))}
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
                  <span style={{ color: 'white', fontWeight: '500' }}>Live Preview</span>
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
                        className={`bg-gradient-to-br ${selectedTheme.gradient}`}
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
                              backgroundColor: 'rgba(255,255,255,0.2)',
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
                            {copied ? <FiCheck style={{ color: '#4ade80' }} /> : <FiShare2 style={{ color: 'white' }} />}
                          </button>

                          {/* Profile */}
                          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                            <div style={{
                              width: '80px',
                              height: '80px',
                              borderRadius: '50%',
                              backgroundColor: 'rgba(255,255,255,0.2)',
                              backdropFilter: 'blur(10px)',
                              border: '2px solid rgba(255,255,255,0.3)',
                              margin: '0 auto 12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '28px',
                              fontWeight: 'bold',
                              color: 'white'
                            }}>
                              AC
                            </div>
                            <h2 style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', marginBottom: '4px' }}>Alex Creator</h2>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '14px', marginBottom: '8px' }}>@alexcreator</p>
                            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '12px', lineHeight: '1.5' }}>
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
                                  backgroundColor: 'rgba(255,255,255,0.15)',
                                  backdropFilter: 'blur(10px)',
                                  borderRadius: '12px',
                                  padding: '12px 16px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                  border: 'none',
                                  cursor: 'pointer',
                                  color: 'white',
                                  fontWeight: '500'
                                }}
                              >
                                <div style={{
                                  width: '36px',
                                  height: '36px',
                                  borderRadius: '50%',
                                  backgroundColor: 'rgba(255,255,255,0.2)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}>
                                  {link.icon}
                                </div>
                                <span style={{ flex: 1, textAlign: 'left', fontSize: '14px' }}>{link.title}</span>
                              </motion.button>
                            ))}
                          </div>

                          {/* Footer */}
                          <div style={{ textAlign: 'center', marginTop: '24px' }}>
                            <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>Powered by GitoLink</span>
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