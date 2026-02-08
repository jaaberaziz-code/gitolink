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

  // Load Google Font
  useEffect(() => {
    if (profile?.user.font_family && profile.user.font_family !== 'Inter') {
      const link = document.createElement('link')
      link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(profile.user.font_family)}:wght@400;500;600;700&display=swap`
      link.rel = 'stylesheet'
      document.head.appendChild(link)
      return () => {
        document.head.removeChild(link)
      }
    }
  }, [profile?.user.font_family])

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
  const defaultTextColor = isLight ? '#111827' : '#ffffff'
  const defaultSubTextColor = isLight ? '#4b5563' : 'rgba(255,255,255,0.8)'
  const bgType = user.background_type || 'gradient'
  const showCustomCSS = user.custom_css && user.custom_css.trim().length > 0

  // Design customization values
  const layout = user.layout || 'classic'
  const fontFamily = user.font_family || 'Inter'
  const titleColor = user.title_color || defaultTextColor
  const buttonStyle = user.button_style || 'rounded'
  const buttonColor = user.button_color || '#3b82f6'

  // Get button classes based on style
  const getButtonClass = () => {
    const baseClass = 'w-full flex items-center gap-4 group transition-all hover:scale-[1.02]'
    
    if (buttonStyle === 'glass') {
      return `${baseClass} rounded-xl p-4 bg-white/20 backdrop-blur-md border border-white/30 hover:bg-white/30`
    }
    
    const bgClass = buttonStyle === 'pill' || buttonStyle === 'rounded'
      ? '' // Color handled by style
      : isLight ? 'bg-white/90 hover:bg-white shadow-md' : 'glass hover:bg-white/20'
    
    switch (buttonStyle) {
      case 'pill':
        return `${baseClass} ${bgClass} rounded-full px-6 py-4`
      case 'square':
        return `${baseClass} ${bgClass} rounded-none p-4`
      case 'rounded':
      default:
        return `${baseClass} ${bgClass} rounded-xl p-4`
    }
  }

  const getButtonStyle = () => {
    if (buttonStyle === 'glass') return {}
    return { backgroundColor: buttonColor }
  }

  const getTextColor = () => {
    // For custom colored buttons, determine if we need white or dark text
    if (buttonStyle !== 'glass') {
      // Simple luminance check for button text color
      const hex = buttonColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
      return luminance > 0.5 ? '#111827' : '#ffffff'
    }
    return defaultTextColor
  }

  return (
    <>
      {/* Custom CSS Injection */}
      {showCustomCSS && (
        <style dangerouslySetInnerHTML={{ __html: user.custom_css }} />
      )}

      <div 
        className={`min-h-screen ${getThemeClass()}`}
        style={{
          ...getBackgroundStyle(),
          fontFamily,
        }}
      >
        <div className="max-w-2xl mx-auto px-4 py-12">
          {/* Classic Layout */}
          {layout === 'classic' && (
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
                  <span style={{ color: titleColor }}>
                    {(user.name?.[0] || user.username[0])?.toUpperCase()}
                  </span>
                )}
              </div>

              <h1 
                className="text-2xl font-bold mb-2 drop-shadow-lg"
                style={{ color: titleColor }}
              >
                {user.name || user.username}
              </h1>

              <p className="mb-4" style={{ color: defaultSubTextColor }}>@{user.username}</p>

              {user.bio && (
                <p className="max-w-md mx-auto drop-shadow" style={{ color: defaultSubTextColor }}>{user.bio}</p>
              )}
            </div>
          )}

          {/* Hero Layout */}
          {layout === 'hero' && (
            <div className="text-center mb-12 py-8">
              <h1 
                className="text-5xl md:text-6xl font-bold mb-4 drop-shadow-lg"
                style={{ color: titleColor }}
              >
                {user.name || user.username}
              </h1>

              <p className="mb-6 text-lg" style={{ color: defaultSubTextColor }}>@{user.username}</p>

              <div className={`
                w-20 h-20 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold
                overflow-hidden
                ${isLight ? 'bg-white shadow-lg' : 'bg-white/20 backdrop-blur-sm border-2 border-white/30'}
              `}>
                {user.avatar_url || user.avatar ? (
                  <Image
                    src={user.avatar_url || user.avatar || ''}
                    alt={user.name || user.username}
                    width={80}
                    height={80}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span style={{ color: titleColor }}>
                    {(user.name?.[0] || user.username[0])?.toUpperCase()}
                  </span>
                )}
              </div>

              {user.bio && (
                <p className="max-w-md mx-auto drop-shadow" style={{ color: defaultSubTextColor }}>{user.bio}</p>
              )}
            </div>
          )}

          {/* Minimal Layout */}
          {layout === 'minimal' && (
            <div className="text-center mb-8">
              <h1 
                className="text-3xl font-bold mb-1"
                style={{ color: titleColor }}
              >
                {user.name || user.username}
              </h1>

              <p className="mb-6 text-sm" style={{ color: defaultSubTextColor }}>@{user.username}</p>

              {user.bio && (
                <p className="max-w-md mx-auto mb-6 text-sm" style={{ color: defaultSubTextColor }}>{user.bio}</p>
              )}
            </div>
          )}

          {/* Links */}
          <div className="space-y-4">
            {links.map((link) => {
              const Icon = link.icon ? iconMap[link.icon] : FaGlobe
              const buttonTextColor = getTextColor()

              return (
                <button
                  key={link.id}
                  onClick={() => handleLinkClick(link.id, link.url)}
                  className={getButtonClass()}
                  style={getButtonStyle()}
                >
                  <div className={`
                    w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0
                    ${buttonStyle === 'glass' ? 'bg-white/20' : 'bg-white/20'}
                  `}>
                    {Icon && <Icon className="w-6 h-6" style={{ color: buttonTextColor }} />}
                  </div>

                  <span 
                    className="flex-1 text-lg font-medium text-left drop-shadow"
                    style={{ color: buttonTextColor }}
                  >
                    {link.title}
                  </span>

                  <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center
                    opacity-0 group-hover:opacity-100 transition-opacity
                    ${buttonStyle === 'glass' ? 'bg-white/20' : 'bg-white/20'}
                  `}>
                    <svg
                      className="w-4 h-4"
                      style={{ color: buttonTextColor }}
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
              className="hover:text-white transition-colors text-sm"
              style={{ color: defaultSubTextColor }}
            >
              Powered by GitoLink
            </a>
          </div>
        </div>
      </div>
    </>
  )
}
