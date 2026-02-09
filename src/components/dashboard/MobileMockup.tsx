'use client'

import { motion } from 'framer-motion'
import type { User, Link } from '@/types'
import { getThemeById, ThemeId } from '@/lib/utils'
import { useEffect, useRef, useState } from 'react'

// SVG Icons - No Emojis
const Icons = {
  share: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  ),
  arrowRight: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  globe: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  play: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </svg>
  ),
  terminal: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <polyline points="4 17 10 11 4 5" />
      <line x1="12" y1="19" x2="20" y2="19" />
    </svg>
  ),
  music: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  ),
}

interface MobileMockupProps {
  user: User
  links: Link[]
  previewTheme?: string
}

// Matrix Rain Component
function MatrixRain({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    if (!active || !canvasRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    
    const chars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'
    const fontSize = 10
    const columns = canvas.width / fontSize
    const drops: number[] = Array(Math.floor(columns)).fill(1)
    
    let animationId: number
    
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      ctx.fillStyle = '#00ff41'
      ctx.font = `${fontSize}px monospace`
      
      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)
        
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
      
      animationId = requestAnimationFrame(draw)
    }
    
    draw()
    
    return () => cancelAnimationFrame(animationId)
  }, [active])
  
  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full opacity-30 pointer-events-none"
    />
  )
}

// Gradient Mesh Background
function GradientMesh({ active }: { active: boolean }) {
  if (!active) return null
  
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div className="mesh-blob absolute -top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-orange-500/30 to-cyan-500/30 blur-3xl" style={{ animationDelay: '0s' }} />
      <div className="mesh-blob absolute -bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-cyan-500/30 to-orange-500/30 blur-3xl" style={{ animationDelay: '-2s' }} />
      <div className="mesh-blob absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-br from-amber-500/20 to-teal-500/20 blur-3xl" style={{ animationDelay: '-4s' }} />
    </div>
  )
}

// Terminal Cursor
function TerminalCursor() {
  return (
    <motion.span
      animate={{ opacity: [1, 0] }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      className="inline-block w-2 h-4 bg-green-400 ml-1"
    />
  )
}

// Link Button Variants based on theme
function LinkButton({ link, index, themeId }: { link: Link; index: number; themeId: ThemeId }) {
  const baseDelay = 0.1 + index * 0.05
  
  const variants = {
    cyberpunk: (
      <motion.a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: baseDelay }}
        whileHover={{ scale: 1.02, x: 4 }}
        whileTap={{ scale: 0.98 }}
        className="group relative w-full p-4 bg-black/50 border border-cyan-400/30 text-white font-mono text-sm overflow-hidden cursor-pointer"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/0 via-cyan-400/10 to-cyan-400/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500" />
        <span className="relative flex items-center gap-3">
          <span className="text-cyan-400">[{String(index + 1).padStart(2, '0')}]</span>
          <span className="flex-1 truncate">{link.title}</span>
          <span className="text-cyan-400/50 group-hover:text-cyan-400 transition-colors">{Icons.arrowRight}</span>
        </span>
      </motion.a>
    ),
    
    minimalist: (
      <motion.a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: baseDelay }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="group w-full p-5 bg-white border-2 border-black text-black font-display text-sm cursor-pointer transition-all hover:shadow-[4px_4px_0px_0px_#000]"
      >
        <span className="flex items-center justify-between">
          <span className="font-medium">{link.title}</span>
          <span className="opacity-0 group-hover:opacity-100 transition-opacity">{Icons.arrowRight}</span>
        </span>
      </motion.a>
    ),
    
    editorial: (
      <motion.a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: baseDelay }}
        className="group w-full py-4 border-b border-stone-200 text-stone-800 cursor-pointer"
      >
        <div className="flex items-baseline gap-4">
          <span className="text-xs text-stone-400 font-mono">{String(index + 1).padStart(2, '0')}</span>
          <span className="flex-1 font-serif text-lg tracking-tight">{link.title}</span>
          <span className="text-red-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs uppercase tracking-widest">View</span>
        </div>
      </motion.a>
    ),
    
    'gradient-mesh': (
      <motion.a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: baseDelay }}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group relative w-full p-4 bg-slate-900/60 backdrop-blur-md border border-orange-500/20 text-white rounded-xl cursor-pointer overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
        <span className="relative flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-500 to-cyan-500 flex items-center justify-center text-white text-xs font-bold">
            {link.title[0]}
          </span>
          <span className="flex-1 truncate font-medium">{link.title}</span>
        </span>
      </motion.a>
    ),
    
    'retro-terminal': (
      <motion.a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: baseDelay }}
        className="group w-full p-3 bg-black border border-green-500/30 text-green-400 font-mono text-sm cursor-pointer hover:border-green-400 hover:bg-green-400/5"
      >
        <span className="flex items-center gap-2">
          <span className="text-green-600">$</span>
          <span className="flex-1 truncate">{link.title.toLowerCase().replace(/\s+/g, '-')}</span>
          <span className="text-green-600/50">.exe</span>
        </span>
      </motion.a>
    ),
    
    'glass-2': (
      <motion.a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: baseDelay }}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="group w-full p-4 bg-white/[0.03] backdrop-blur-xl border border-white/10 text-white rounded-2xl cursor-pointer hover:bg-white/[0.06] hover:border-white/20 transition-all"
      >
        <span className="flex items-center gap-3">
          <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400/20 to-blue-600/20 flex items-center justify-center">
            {Icons.link}
          </span>
          <span className="flex-1 truncate font-medium">{link.title}</span>
        </span>
      </motion.a>
    ),
    
    'nft-gallery': (
      <motion.div
        initial={{ opacity: 0, rotateY: -90 }}
        animate={{ opacity: 1, rotateY: 0 }}
        transition={{ delay: baseDelay, type: 'spring' }}
        className="perspective-1000"
      >
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative w-full aspect-square bg-zinc-900 border border-purple-500/20 rounded-xl overflow-hidden cursor-pointer"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
            <span className="text-3xl font-bold text-white mb-2">{link.title[0]}</span>
            <span className="text-xs text-zinc-400 truncate w-full">{link.title}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
            <span className="text-[10px] text-purple-400 font-mono">#{String(index + 1).padStart(4, '0')}</span>
          </div>
        </a>
      </motion.div>
    ),
    
    'music-player': (
      <motion.a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: baseDelay }}
        className="group w-full p-3 bg-neutral-800 hover:bg-neutral-700 rounded-lg flex items-center gap-3 cursor-pointer transition-colors"
      >
        <div className="w-12 h-12 rounded bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
          {Icons.music}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{link.title}</p>
          <p className="text-neutral-400 text-xs truncate">Link</p>
        </div>
        <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity">
          {Icons.play}
        </div>
      </motion.a>
    ),
    
    portfolio: (
      <motion.a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: baseDelay }}
        className="group w-full cursor-pointer"
      >
        <div className="aspect-video bg-gray-200 rounded-lg mb-3 overflow-hidden">
          <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-105 transition-transform duration-500" />
        </div>
        <h3 className="text-gray-900 font-medium text-sm">{link.title}</h3>
        <p className="text-gray-500 text-xs mt-1">{new URL(link.url).hostname}</p>
      </motion.a>
    ),
    
    hacker: (
      <motion.a
        href={link.url}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0 }}
        animate={{ opacity: link.active ? 1 : 0.3 }}
        transition={{ delay: baseDelay }}
        className="group w-full p-3 bg-black border border-green-500/20 text-green-400 font-mono text-xs cursor-pointer hover:border-green-400/50 hover:bg-green-400/5"
      >
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="flex-1 truncate">{link.title}</span>
          <span className="text-green-600">[{link._count?.clicks || 0}]</span>
        </span>
      </motion.a>
    ),
  }
  
  return variants[themeId] || variants.cyberpunk
}

// Profile Header Variants
function ProfileHeader({ user, themeId }: { user: User; themeId: ThemeId }) {
  const variants = {
    cyberpunk: (
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-24 h-24 mx-auto mb-4"
        >
          <div className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-30 animate-pulse" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-cyan-400 to-pink-500 flex items-center justify-center text-3xl font-bold text-black border-2 border-cyan-400">
            {user.name?.[0] || user.username[0].toUpperCase()}
          </div>
        </motion.div>
        <motion.h1 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-bold text-white mb-1 font-display"
        >
          {user.name || user.username}
        </motion.h1>
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-cyan-400 font-mono text-sm"
        >
          @{user.username}
        </motion.p>
        {user.bio && (
          <motion.p 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-sm mt-3 max-w-[200px] mx-auto"
          >
            {user.bio}
          </motion.p>
        )}
      </div>
    ),
    
    minimalist: (
      <div className="mb-8">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-bold text-black mb-2 font-display tracking-tight"
        >
          {user.name || user.username}
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-gray-500 font-mono text-sm"
        >
          @{user.username}
        </motion.p>
        {user.bio && (
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-gray-600 text-base mt-4 leading-relaxed"
          >
            {user.bio}
          </motion.p>
        )}
      </div>
    ),
    
    editorial: (
      <div className="mb-8 pb-8 border-b border-stone-200">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-red-600 uppercase tracking-[0.2em] mb-4 font-mono"
        >
          Profile
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-3xl font-serif text-stone-900 mb-2"
        >
          {user.name || user.username}
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-stone-500 italic"
        >
          @{user.username}
        </motion.p>
        {user.bio && (
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="text-stone-600 mt-4 leading-relaxed"
          >
            {user.bio}
          </motion.p>
        )}
      </div>
    ),
    
    'gradient-mesh': (
      <div className="text-center mb-8 relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white shadow-lg shadow-orange-500/20"
        >
          {user.name?.[0] || user.username[0].toUpperCase()}
        </motion.div>
        <motion.h1 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-bold text-white mb-1"
        >
          {user.name || user.username}
        </motion.h1>
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-gray-400 text-sm"
        >
          @{user.username}
        </motion.p>
      </div>
    ),
    
    'retro-terminal': (
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-green-400 text-sm mb-4"
        >
          <span className="text-green-600">$</span> whoami
        </motion.div>
        <motion.h1 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-2xl font-mono text-green-400 mb-1"
        >
          {user.name || user.username}
        </motion.h1>
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-green-600 font-mono text-sm"
        >
          @{user.username}
        </motion.p>
        {user.bio && (
          <motion.div 
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15 }}
            className="mt-4 p-3 bg-green-400/5 border border-green-400/20"
          >
            <span className="text-green-500 font-mono text-xs"># {user.bio}</span>
          </motion.div>
        )}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-4 font-mono text-green-400 text-sm"
        >
          <span className="text-green-600">$</span> ls links/<TerminalCursor />
        </motion.div>
      </div>
    ),
    
    'glass-2': (
      <div className="text-center mb-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 mx-auto mb-4 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-3xl font-bold text-white"
        >
          {user.name?.[0] || user.username[0].toUpperCase()}
        </motion.div>
        <motion.h1 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-xl font-bold text-white mb-1"
        >
          {user.name || user.username}
        </motion.h1>
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-sky-400 text-sm"
        >
          @{user.username}
        </motion.p>
      </div>
    ),
    
    'nft-gallery': (
      <div className="mb-8">
        <motion.div
          initial={{ opacity: 0, rotateY: -30 }}
          animate={{ opacity: 1, rotateY: 0 }}
          className="relative w-full aspect-square bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-2xl border border-purple-500/20 overflow-hidden mb-4"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl font-bold text-white">{user.name?.[0] || user.username[0].toUpperCase()}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
            <p className="text-xs text-purple-400 font-mono">@{user.username}</p>
          </div>
        </motion.div>
        <motion.h1 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-xl font-bold text-white text-center"
        >
          {user.name || user.username}
        </motion.h1>
      </div>
    ),
    
    'music-player': (
      <div className="mb-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center gap-4 mb-6"
        >
          <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white text-2xl font-bold">
            {user.name?.[0] || user.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">{user.name || user.username}</h1>
            <p className="text-neutral-400 text-sm">@{user.username}</p>
          </div>
        </motion.div>
        {user.bio && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-neutral-400 text-sm"
          >
            {user.bio}
          </motion.p>
        )}
      </div>
    ),
    
    portfolio: (
      <div className="mb-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span className="text-xs text-gray-500 uppercase tracking-widest">Available for work</span>
        </motion.div>
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-3xl font-bold text-gray-900 mb-2"
        >
          {user.name || user.username}
        </motion.h1>
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-gray-500"
        >
          @{user.username}
        </motion.p>
        {user.bio && (
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 mt-4 leading-relaxed"
          >
            {user.bio}
          </motion.p>
        )}
      </div>
    ),
    
    hacker: (
      <div className="mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="font-mono text-green-400 text-xs mb-2"
        >
          [SYSTEM] Loading user profile...
        </motion.div>
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-2xl font-mono text-green-400 mb-1"
        >
          {user.name || user.username}
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15 }}
          className="text-green-600 font-mono text-xs"
        >
          ID: {user.username} | STATUS: ONLINE
        </motion.p>
        {user.bio && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-4 p-2 border border-green-500/30"
          >
            <span className="text-green-500 font-mono text-xs">&gt; {user.bio}</span>
          </motion.div>
        )}
      </div>
    ),
  }
  
  return variants[themeId] || variants.cyberpunk
}

// Phone Frame Component
function PhoneFrame({ children, themeId }: { children: React.ReactNode; themeId: ThemeId }) {
  const isLight = ['minimalist', 'editorial', 'portfolio'].includes(themeId)
  
  return (
    <div className="relative mx-auto w-[280px] sm:w-[320px]">
      {/* Phone Bezel */}
      <div className={`relative rounded-[3rem] p-2 shadow-2xl ${isLight ? 'bg-gray-900' : 'bg-neutral-950'}`}>
        {/* Phone Screen */}
        <div 
          className="relative overflow-hidden rounded-[2.5rem]"
          style={{ height: '640px' }}
        >
          {/* Dynamic Island / Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-28 h-7 bg-black rounded-b-2xl" />
          
          {/* Status Bar */}
          <div className={`absolute top-2 left-6 right-6 z-10 flex justify-between items-center ${isLight ? 'text-white' : 'text-white'}`}>
            <span className="text-xs font-semibold font-mono">9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
          </div>
          
          {/* Content */}
          <div className="h-full overflow-y-auto scrollbar-hide pt-12 pb-8 px-4 relative">
            {children}
          </div>
        </div>
      </div>
      
      {/* Phone Reflection */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/20 blur-xl rounded-full" />
    </div>
  )
}

// Main Component
export default function MobileMockup({ user, links, previewTheme }: MobileMockupProps) {
  const themeId = (previewTheme || 'cyberpunk') as ThemeId
  const theme = getThemeById(themeId)
  const activeLinks = links.filter(l => l.active)
  
  // Theme-specific container styles
  const containerStyles: Record<ThemeId, React.CSSProperties> = {
    cyberpunk: {
      background: 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a1a1a 100%)',
    },
    minimalist: {
      background: '#ffffff',
    },
    editorial: {
      background: '#fafaf9',
    },
    'gradient-mesh': {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
    },
    'retro-terminal': {
      background: '#050505',
    },
    'glass-2': {
      background: 'linear-gradient(135deg, #020617 0%, #0f172a 50%, #1e293b 100%)',
    },
    'nft-gallery': {
      background: 'linear-gradient(180deg, #09090b 0%, #18181b 100%)',
    },
    'music-player': {
      background: 'linear-gradient(180deg, #171717 0%, #0a0a0a 100%)',
    },
    portfolio: {
      background: '#f9fafb',
    },
    hacker: {
      background: '#000000',
    },
  }
  
  const isGridLayout = themeId === 'nft-gallery'
  const isMasonryLayout = themeId === 'portfolio'
  
  return (
    <PhoneFrame themeId={themeId}>
      {/* Background Effects */}
      <div className="absolute inset-0" style={containerStyles[themeId]}>
        {themeId === 'hacker' && <MatrixRain active={true} />}
        {themeId === 'gradient-mesh' && <GradientMesh active={true} />}
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Share Button */}
        <button 
          className="absolute top-0 right-0 p-2 rounded-full cursor-pointer transition-opacity hover:opacity-70"
          style={{ color: theme.styles.text }}
        >
          {Icons.share}
        </button>
        
        {/* Profile Header */}
        <ProfileHeader user={user} themeId={themeId} />
        
        {/* Links */}
        <div className={isGridLayout ? 'grid grid-cols-2 gap-3' : isMasonryLayout ? 'columns-2 gap-3 space-y-3' : 'space-y-3'}>
          {activeLinks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-8"
              style={{ color: theme.styles.textSecondary }}
            >
              <p className="text-sm font-mono">No links found</p>
            </motion.div>
          ) : (
            activeLinks.map((link, index) => (
              <LinkButton key={link.id} link={link} index={index} themeId={themeId} />
            ))
          )}
        </div>
        
        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <span 
            className="text-[10px] font-mono"
            style={{ color: theme.styles.textSecondary }}
          >
            GitoLink
          </span>
        </motion.div>
      </div>
    </PhoneFrame>
  )
}
