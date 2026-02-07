'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { FiSmartphone } from 'react-icons/fi'
import {
  FaGlobe,
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
  FaWhatsapp,
} from 'react-icons/fa'
import { FiMail, FiPhone } from 'react-icons/fi'
import type { User, Link as LinkType } from '@/types'
import { themes } from '@/lib/utils'
import Image from 'next/image'

const iconMap: Record<string, React.ComponentType> = {
  website: FaGlobe,
  twitter: FaTwitter,
  instagram: FaInstagram,
  youtube: FaYoutube,
  tiktok: FaTiktok,
  github: FaGithub,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  twitch: FaTwitch,
  discord: FaDiscord,
  spotify: FaSpotify,
  snapchat: FaSnapchat,
  pinterest: FaPinterest,
  reddit: FaReddit,
  telegram: FaTelegram,
  whatsapp: FaWhatsapp,
  email: FiMail,
  phone: FiPhone,
}

interface LivePreviewProps {
  user: User
  links: LinkType[]
  previewTheme?: string | null
  previewBackground?: {
    type: 'gradient' | 'solid' | 'image'
    value: string
  }
  previewAvatar?: string | null
}

export function LivePreview({ 
  user, 
  links, 
  previewTheme,
  previewBackground,
  previewAvatar 
}: LivePreviewProps) {
  const themeId = previewTheme || user.theme || 'cyberpunk'
  const theme = themes.find(t => t.id === themeId) || themes[0]
  
  // Determine background style
  const getBackgroundStyle = () => {
    const bg = previewBackground || { 
      type: user.background_type as 'gradient' | 'solid' | 'image', 
      value: user.background_value 
    }

    if (bg.type === 'image' && bg.value) {
      return {
        backgroundImage: `url(${bg.value})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    }
    
    if (bg.type === 'solid' && bg.value) {
      return { backgroundColor: bg.value }
    }
    
    // Default to theme gradient
    return {}
  }

  const getThemeClass = () => {
    const bg = previewBackground || { 
      type: user.background_type as 'gradient' | 'solid' | 'image', 
      value: user.background_value 
    }

    if (bg.type === 'gradient' || (!bg.type && !bg.value)) {
      // Find theme class for the selected gradient
      const selectedTheme = themes.find(t => t.id === bg.value)
      if (selectedTheme) {
        return selectedTheme.class
      }
    }
    
    return theme.class
  }

  const isLight = themeId === 'minimal'
  const textColor = isLight ? 'text-gray-900' : 'text-white'
  const subTextColor = isLight ? 'text-gray-600' : 'text-white/70'
  const activeLinks = links.filter(l => l.active)
  const displayAvatar = previewAvatar || user.avatar_url || user.avatar

  return (
    <div className="relative">
      <div className="w-[280px] bg-gray-900 rounded-[2.5rem] p-2 shadow-2xl shadow-black/50 mx-auto">
        <div 
          className={`relative overflow-hidden rounded-[2rem] ${getThemeClass()}`}
          style={{ 
            height: '560px',
            ...getBackgroundStyle()
          }}
        >
          {/* Notch */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-24 h-6 bg-black rounded-b-xl" />
          
          {/* Status Bar */}
          <div className={`absolute top-2 left-4 right-4 z-10 flex justify-between items-center text-xs font-semibold ${textColor}`}>
            <span>9:41</span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5z" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="h-full overflow-y-auto scrollbar-hide pt-12 pb-6 px-4">
            {/* Profile */}
            <div className="text-center mb-6">
              <div className={`
                w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold overflow-hidden
                ${isLight ? 'bg-white shadow-lg' : 'bg-white/20 backdrop-blur-md border-2 border-white/30'}
              `}>
                {displayAvatar ? (
                  <Image
                    src={displayAvatar}
                    alt={user.name || user.username}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className={textColor}>{(user.name?.[0] || user.username[0])?.toUpperCase()}</span>
                )}
              </div>
              <h1 className={`text-lg font-bold ${textColor} mb-1`}>{user.name || user.username}</h1>
              <p className={`text-sm ${subTextColor} mb-2`}>@{user.username}</p>
              {user.bio && (
                <p className={`text-xs ${subTextColor} max-w-[200px] mx-auto leading-relaxed`}>{user.bio}</p>
              )}
            </div>

            {/* Links */}
            <div className="space-y-2.5">
              {activeLinks.length === 0 ? (
                <div className={`text-center py-8 ${subTextColor} text-sm`}>No active links</div>
              ) : (
                activeLinks.map((link, i) => {
                  const Icon = link.icon ? iconMap[link.icon] : FaGlobe
                  return (
                    <motion.div
                      key={link.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`
                        w-full ${isLight ? 'bg-white/80' : 'bg-white/10'} 
                        backdrop-blur-md rounded-xl p-3 flex items-center gap-3
                        shadow-sm
                      `}
                    >
                      <div className={`
                        w-10 h-10 rounded-full ${isLight ? 'bg-gray-100' : 'bg-white/20'} 
                        flex items-center justify-center flex-shrink-0
                      `}>
                        {Icon && <Icon className={`w-5 h-5 ${textColor}`} />}
                      </div>
                      <span className={`flex-1 text-sm font-medium truncate ${textColor}`}>{link.title}</span>
                    </motion.div>
                  )
                })
              )}
            </div>

            {/* Footer */}
            <div className="mt-8 text-center">
              <span className={`text-[10px] ${subTextColor}`}>Powered by GitoLink</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/30 blur-xl rounded-full" />
    </div>
  )
}