'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
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
import type { ProfileData } from '@/types'
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

interface ProfilePageProps {
  params: { username: string }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [params.username])

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/profile/${params.username}`)
      if (!res.ok) {
        setError(true)
        return
      }
      const data = await res.json()
      setProfile(data)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  const handleLinkClick = async (linkId: string, url: string) => {
    // Track click
    try {
      await fetch(`/api/profile/${params.username}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkId }),
      })
    } catch {
      // Silent fail - don't block the user
    }

    // Open link
    window.open(url, '_blank')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    )
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">404</h1>
          <p className="text-gray-400">Profile not found</p>
        </div>
      </div>
    )
  }

  const { user, links } = profile
  
  // Determine background styles
  const getBackgroundStyle = () => {
    const bgType = user.background_type || 'gradient'
    const bgValue = user.background_value || user.theme || 'cyberpunk'

    if (bgType === 'image' && bgValue) {
      return {
        backgroundImage: `url(${bgValue})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }
    }
    
    if (bgType === 'solid' && bgValue) {
      return { backgroundColor: bgValue }
    }
    
    return {}
  }

  const getThemeClass = () => {
    const bgType = user.background_type || 'gradient'
    const bgValue = user.background_value || user.theme || 'cyberpunk'

    if (bgType === 'gradient' || bgType === 'solid') {
      const theme = themes.find(t => t.id === bgValue)
      if (theme) {
        return theme.class
      }
    }
    
    // Find theme by user.theme if no background_value matches
    const theme = themes.find(t => t.id === user.theme)
    return theme?.class || 'bg-gradient-to-br from-purple-600 to-blue-600'
  }

  const themeId = user.theme || 'cyberpunk'
  const isLight = themeId === 'minimal'
  const textColor = isLight ? 'text-gray-900' : 'text-white'
  const subTextColor = isLight ? 'text-gray-600' : 'text-white/80'
  const bgType = user.background_type || 'gradient'
  const showCustomCSS = user.custom_css && user.custom_css.trim().length > 0

  return (
    <>
      {/* Custom CSS Injection */}
      {showCustomCSS && (
        <style dangerouslySetInnerHTML={{ __html: user.custom_css }} />
      )}

      <div 
        className={`min-h-screen ${getThemeClass()}`}
        style={getBackgroundStyle()}
      >
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Profile Header */}
          <div className="text-center mb-8">
            <div className={`
              w-24 h-24 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl font-bold
              overflow-hidden
              ${isLight ? 'bg-white shadow-lg' : 'bg-white/20 backdrop-blur-sm border-2 border-white/30'}
            `}>
              {user.avatar_url || user.avatar ? (
                <Image
                  src={user.avatar_url || user.avatar || ''}
                  alt={user.name || user.username}
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className={textColor}>
                  {(user.name?.[0] || user.username[0])?.toUpperCase()}
                </span>
              )}
            </div>

            <h1 className={`text-2xl font-bold ${textColor} mb-2 drop-shadow-lg`}>
              {user.name || user.username}
            </h1>

            <p className={`${subTextColor} mb-4`}>@{user.username}</p>

            {user.bio && (
              <p className={`${subTextColor} max-w-md mx-auto drop-shadow`}>{user.bio}</p>
            )}
          </div>

          {/* Links */}
          <div className="space-y-4">
            {links.map((link) => {
              const Icon = link.icon ? iconMap[link.icon] : FaGlobe

              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.url)}
                  className={`
                    w-full rounded-xl p-4 flex items-center gap-4 group transition-all hover:scale-[1.02]
                    ${isLight 
                      ? 'bg-white/90 hover:bg-white shadow-md' 
                      : 'glass hover:bg-white/20'
                    }
                    link-button
                  `}
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    ${isLight ? 'bg-gray-100' : 'bg-white/20'}
                  `}>
                    {Icon && <Icon className={`w-6 h-6 ${textColor}`} />}
                  </div>

                  <span className={`flex-1 text-lg font-medium text-left drop-shadow ${textColor}`}>
                    {link.title}
                  </span>

                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity
                    ${isLight ? 'bg-gray-100' : 'bg-white/20'}
                  `}>
                    <svg
                      className={`w-4 h-4 ${textColor}`}
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
          <div className="mt-12 text-center gitolink-footer">
            <a
              href="/"
              className={`${subTextColor} hover:text-white transition-colors text-sm`}
            >
              Powered by GitoLink
            </a>
          </div>
        </div>
      </div>
    </>
  )
}