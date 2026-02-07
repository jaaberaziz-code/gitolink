'use client'

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
import { getThemeClass } from '@/lib/utils'

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

interface Link {
  id: string
  title: string
  url: string
  icon?: string
  active?: boolean
  order?: number
}

interface User {
  id: string
  username: string
  name?: string | null
  bio?: string | null
  avatar?: string | null
  theme: string
}

interface ProfileViewProps {
  user: User
  links: Link[]
}

export default function ProfileView({ user, links }: ProfileViewProps) {
  const themeClass = getThemeClass(user.theme)
  const isGradient = user.theme.startsWith('gradient') || 
    ['cyberpunk', 'matrix', 'sunset', 'tropical', 'desert', 'corporate', 'executive',
     'aurora', 'cotton-candy', 'retro', 'forest', 'ocean', 'lavender', 'gold', 'rose-gold', 'midnight'].includes(user.theme)

  const handleLinkClick = (url: string) => {
    window.open(url, '_blank')
  }

  return (
    <div className={`min-h-screen ${themeClass} ${isGradient ? '' : 'bg-gray-900'}`}>
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Profile Header */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 rounded-full bg-white/20 mx-auto mb-4 flex items-center justify-center text-4xl font-bold text-white backdrop-blur-sm border-2 border-white/30 overflow-hidden">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name || user.username} className="w-full h-full object-cover" />
            ) : (
              user.name?.[0] || user.username[0].toUpperCase()
            )}
          </div>

          <h1 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">
            {user.name || user.username}
          </h1>

          <p className="text-white/80 mb-4">@{user.username}</p>

          {user.bio && (
            <p className="text-white/90 max-w-md mx-auto drop-shadow whitespace-pre-line">{user.bio}</p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4">
          {links.map((link) => {
            const Icon = link.icon ? iconMap[link.icon] : FaGlobe

            return (
              <button
                key={link.id}
                onClick={() => handleLinkClick(link.url)}
                className="w-full glass rounded-xl p-4 flex items-center gap-4 group transition-all hover:scale-[1.02] hover:bg-white/20"
              >
                <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                  {Icon && <Icon className="w-6 h-6 text-white" />}
                </div>

                <span className="flex-1 text-lg font-medium text-white text-left drop-shadow">
                  {link.title}
                </span>

                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </div>
              </button>
            )
          })}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <a
            href="/"
            className="text-white/60 hover:text-white transition-colors text-sm"
          >
            Powered by GitoLink
          </a>
        </div>
      </div>
    </div>
  )
}