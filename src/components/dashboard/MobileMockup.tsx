'use client'

import { motion } from 'framer-motion'
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
import { FiMail, FiPhone, FiShare2 } from 'react-icons/fi'
import type { User, Link } from '@/types'
import { getThemeClass, themes } from '@/lib/utils'

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
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

interface MobileMockupProps {
  user: User
  links: Link[]
  previewTheme?: string
}

export default function MobileMockup({ user, links, previewTheme }: MobileMockupProps) {
  const themeClass = getThemeClass(previewTheme || user.theme)
  const isGradient = (previewTheme || user.theme).startsWith('gradient')
  const activeLinks = links.filter(l => l.active)
  
  // Get theme info for styling adjustments
  const themeInfo = themes.find(t => t.id === (previewTheme || user.theme))
  const isLightTheme = themeInfo?.id === 'white'
  const textColor = isLightTheme ? 'text-gray-900' : 'text-white'
  const subTextColor = isLightTheme ? 'text-gray-600' : 'text-white/70'
  const glassBg = isLightTheme 
    ? 'bg-white/40 border-white/50' 
    : 'bg-white/10 border-white/20'

  return (
    <div className="relative">
      {/* Phone Frame */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mx-auto w-[280px] sm:w-[320px]"
      >
        {/* Phone Bezel */}
        <div className="relative bg-gray-900 rounded-[3rem] p-2 shadow-2xl shadow-black/50">
          {/* Phone Screen */}
          <div 
            className={`relative overflow-hidden rounded-[2.5rem] ${themeClass} ${isGradient ? '' : ''}`}
            style={{ height: '640px' }}
          >
            {/* Dynamic Island / Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 z-20 w-28 h-7 bg-black rounded-b-2xl" />
            
            {/* Status Bar */}
            <div className="absolute top-2 left-6 right-6 z-10 flex justify-between items-center">
              <span className={`text-xs font-semibold ${textColor}`}>9:41</span>
              <div className="flex items-center gap-1">
                <svg className={`w-4 h-4 ${textColor}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zm6-4a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zm6-3a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                </svg>
                <svg className={`w-4 h-4 ${textColor}`} fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>

            {/* Content */}
            <div className="h-full overflow-y-auto scrollbar-hide pt-12 pb-8 px-4">
              {/* Share Button */}
              <button className={`absolute top-14 right-4 p-2 rounded-full ${glassBg} backdrop-blur-md transition-all hover:scale-110`}>
                <FiShare2 className={`w-4 h-4 ${textColor}`} />
              </button>

              {/* Profile Header */}
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-center mb-6"
              >
                {/* Avatar */}
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className={`w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-2xl font-bold ${glassBg} backdrop-blur-md border-2 ${isLightTheme ? 'border-white/50' : 'border-white/30'} shadow-lg`}
                >
                  <span className={textColor}>{user.name?.[0] || user.username[0].toUpperCase()}</span>
                </motion.div>

                {/* Name */}
                <h1 className={`text-lg font-bold ${textColor} mb-1`}>
                  {user.name || user.username}
                </h1>
                
                {/* Username */}
                <p className={`text-sm ${subTextColor} mb-2`}>@{user.username}</p>
                
                {/* Bio */}
                {user.bio && (
                  <p className={`text-xs ${subTextColor} max-w-[200px] mx-auto leading-relaxed`}>
                    {user.bio}
                  </p>
                )}
              </motion.div>

              {/* Links */}
              <div className="space-y-3">
                {activeLinks.length === 0 ? (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`text-center py-8 ${subTextColor} text-sm`}
                  >
                    No active links yet
                  </motion.div>
                ) : (
                  activeLinks.map((link, index) => {
                    const Icon = link.icon ? iconMap[link.icon] : FaGlobe
                    return (
                      <motion.button
                        key={link.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 + index * 0.05 }}
                        whileHover={{ scale: 1.02, x: 2 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full ${glassBg} backdrop-blur-md rounded-xl p-3 flex items-center gap-3 group transition-all hover:shadow-lg`}
                      >
                        <div className={`w-10 h-10 rounded-full ${isLightTheme ? 'bg-white/50' : 'bg-white/20'} flex items-center justify-center flex-shrink-0`}>
                          {Icon && <Icon className={`w-5 h-5 ${textColor}`} />}
                        </div>
                        <span className={`flex-1 text-sm font-medium ${textColor} text-left truncate`}>
                          {link.title}
                        </span>
                        <motion.div 
                          initial={{ opacity: 0, x: -5 }}
                          whileHover={{ opacity: 1, x: 0 }}
                          className={`w-6 h-6 rounded-full ${isLightTheme ? 'bg-white/50' : 'bg-white/20'} flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity`}
                        >
                          <svg className={`w-3 h-3 ${textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                          </svg>
                        </motion.div>
                      </motion.button>
                    )
                  })
                )}
              </div>

              {/* Footer */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-8 text-center"
              >
                <span className={`text-[10px] ${subTextColor}`}>Powered by GitoLink</span>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Phone Reflection */}
        <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-4 bg-black/20 blur-xl rounded-full" />
      </motion.div>
    </div>
  )
}
