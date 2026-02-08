'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import {
  FiPlus, FiLogOut, FiExternalLink, FiCopy, FiBarChart2, FiImage,
  FiTrendingUp, FiUser, FiLink, FiSettings, FiEye,
  FiTrash2, FiEdit2, FiCheck, FiX, FiChevronUp, FiChevronDown, FiSmartphone, FiLayers,
  FiLayout, FiType
} from 'react-icons/fi'
import {
  FaGlobe, FaTwitter, FaInstagram, FaYoutube, FaTiktok, FaGithub,
  FaLinkedin, FaFacebook, FaTwitch, FaDiscord, FaSpotify, FaSnapchat,
  FaPinterest, FaReddit, FaTelegram, FaWhatsapp,
} from 'react-icons/fa'
import type { User, Link as LinkType, DesignCustomization } from '@/types'
import { themes } from '@/lib/utils'
import DesignTab from '@/components/dashboard/DesignTab'

const iconMap: Record<string, React.ComponentType> = {
  website: FaGlobe, twitter: FaTwitter, instagram: FaInstagram,
  youtube: FaYoutube, tiktok: FaTiktok, github: FaGithub,
  linkedin: FaLinkedin, facebook: FaFacebook, twitch: FaTwitch,
  discord: FaDiscord, spotify: FaSpotify, snapchat: FaSnapchat,
  pinterest: FaPinterest, reddit: FaReddit, telegram: FaTelegram,
  whatsapp: FaWhatsapp,
}

type TabType = 'links' | 'appearance' | 'analytics' | 'design'

interface AnalyticsData {
  totalClicks: number
  clicksPerLink: { linkId: string; title: string; count: number }[]
  deviceStats: { device: string; count: number }[]
  browserStats: { browser: string; count: number }[]
  timelineData: { date: string; count: number }[]
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [links, setLinks] = useState<LinkType[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('links')
  const [previewTheme, setPreviewTheme] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)

  const displayTheme = previewTheme || user?.theme || 'cyberpunk'

  useEffect(() => {
    fetchUser()
    fetchLinks()
  }, [])

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics()
    }
  }, [activeTab])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me')
      if (!res.ok) { router.push('/login'); return }
      const data = await res.json()
      setUser(data.user)
      setPreviewTheme(data.user.theme)
    } catch { router.push('/login') }
  }

  const fetchLinks = async () => {
    try {
      const res = await fetch('/api/links')
      if (res.ok) {
        const data = await res.json()
        setLinks(data.links)
      }
    } catch { toast.error('Failed to load links') }
    finally { setLoading(false) }
  }

  const fetchAnalytics = async () => {
    setAnalyticsLoading(true)
    try {
      const res = await fetch('/api/analytics?days=30')
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
      }
    } catch { toast.error('Failed to load analytics') }
    finally { setAnalyticsLoading(false) }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const handleThemeChange = async (themeId: string) => {
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themeId }),
      })
      if (res.ok) {
        setUser(prev => prev ? { ...prev, theme: themeId } : null)
        setPreviewTheme(themeId)
        toast.success('Theme updated!')
      }
    } catch { toast.error('Failed to update theme') }
  }

  const handleDesignUpdate = async (design: Partial<DesignCustomization>) => {
    // Optimistically update the user state
    setUser(prev => prev ? { ...prev, ...design } : null)
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
      </div>
    )
  }

  const themeObj = themes.find(t => t.id === displayTheme) || themes[0]

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-black/80 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            <span className="text-blue-400">Gito</span>Link
          </Link>
          <div className="flex items-center gap-3">
            <a href={`/${user.username}`} target="_blank" className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700 transition-all">
              <FiExternalLink className="w-4 h-4" />
              <span className="hidden sm:inline text-sm">View Profile</span>
            </a>
            <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-white transition-colors">
              <FiLogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside>
            <div className="glass-card rounded-2xl p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-white">
                  {user.name?.[0] || user.username[0].toUpperCase()}
                </div>
                <h2 className="text-lg font-semibold text-white">{user.name || user.username}</h2>
                <p className="text-gray-400 text-sm">@{user.username}</p>
              </div>

              <nav className="space-y-2">
                {[
                  { id: 'links' as TabType, label: 'My Links', icon: FiLink },
                  { id: 'appearance' as TabType, label: 'Appearance', icon: FiImage },
                  { id: 'design' as TabType, label: 'Design', icon: FiLayout },
                  { id: 'analytics' as TabType, label: 'Analytics', icon: FiBarChart2 },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      activeTab === item.id ? 'bg-blue-600 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-white/10">
                <p className="text-xs text-gray-500 mb-2">Your profile URL:</p>
                <div className="flex items-center gap-2 bg-gray-900 rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-400 truncate flex-1">gitolink.vercel.app/{user.username}</span>
                  <button onClick={() => { navigator.clipboard.writeText(`https://gitolink.vercel.app/${user.username}`); toast.success('Copied!') }}>
                    <FiCopy className="w-4 h-4 text-gray-400 hover:text-white" />
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main>
            <AnimatePresence mode="wait">
              {/* Links Tab */}
              {activeTab === 'links' && (
                <motion.div key="links" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-white">Your Links</h1>
                      <p className="text-gray-400 text-sm">Manage and organize your links</p>
                    </div>
                  </div>

                  {links.length === 0 ? (
                    <div className="glass-card rounded-2xl p-12 text-center">
                      <FiLink className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No links yet</p>
                      <p className="text-gray-500 text-sm">Add your first link to get started!</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {links.map((link, index) => {
                        const Icon = link.icon ? iconMap[link.icon] : FaGlobe
                        return (
                          <motion.div
                            key={link.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="glass-card rounded-xl p-4"
                          >
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                                {Icon && <Icon className="w-5 h-5 text-white" />}
                              </div>
                              <div className="flex-1 min-w-0">
                                <h3 className="text-white font-medium truncate">{link.title}</h3>
                                <p className="text-gray-400 text-sm truncate">{link.url}</p>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`px-2 py-1 rounded-full text-xs ${link.active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                  {link.active ? 'Active' : 'Inactive'}
                                </span>
                                <button onClick={() => { navigator.clipboard.writeText(link.url); toast.success('Copied!') }} className="p-2 text-gray-400 hover:text-white">
                                  <FiCopy className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </motion.div>
                        )
                      })}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <motion.div key="appearance" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">Appearance</h1>
                    <p className="text-gray-400 text-sm">Customize your profile look</p>
                  </div>

                  <div className="glass-card rounded-2xl p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Choose Theme</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {themes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeChange(theme.id)}
                          onMouseEnter={() => setPreviewTheme(theme.id)}
                          onMouseLeave={() => setPreviewTheme(user.theme)}
                          className={`relative h-20 rounded-xl overflow-hidden transition-all ${
                            user.theme === theme.id ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900' : ''
                          }`}
                        >
                          <div className={`absolute inset-0 ${theme.class}`} />
                          <span className="relative z-10 text-sm font-medium text-white drop-shadow-md">{theme.name}</span>
                          {user.theme === theme.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                              <FiCheck className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Design Tab */}
              {activeTab === 'design' && (
                <motion.div key="design" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <DesignTab 
                    user={{
                      layout: user.layout,
                      font_family: user.font_family,
                      title_color: user.title_color,
                      button_style: user.button_style,
                      button_color: user.button_color,
                      theme: user.theme,
                      background_type: user.background_type,
                      background_value: user.background_value,
                    }}
                    links={links}
                    onDesignUpdate={handleDesignUpdate}
                  />
                </motion.div>
              )}

              {/* Analytics Tab */}
              {activeTab === 'analytics' && (
                <motion.div key="analytics" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold text-white">Analytics</h1>
                    <p className="text-gray-400 text-sm">Track your link performance (Last 30 days)</p>
                  </div>

                  {analyticsLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                    </div>
                  ) : analytics ? (
                    <>
                      {/* Stats Cards */}
                      <div className="grid sm:grid-cols-3 gap-4 mb-6">
                        {[
                          { label: 'Total Clicks', value: analytics.totalClicks, icon: FiTrendingUp, color: 'from-blue-500 to-cyan-500' },
                          { label: 'Active Links', value: links.filter(l => l.active).length, icon: FiLink, color: 'from-purple-500 to-pink-500' },
                          { label: 'Total Links', value: links.length, icon: FiLayers, color: 'from-orange-500 to-red-500' },
                        ].map((stat, i) => (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card rounded-2xl p-6"
                          >
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4`}>
                              <stat.icon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-3xl font-bold text-white mb-1">{stat.value}</p>
                            <p className="text-gray-400 text-sm">{stat.label}</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Clicks Per Link */}
                      {analytics.clicksPerLink.length > 0 && (
                        <div className="glass-card rounded-2xl p-6 mb-6">
                          <h3 className="text-lg font-semibold text-white mb-4">Clicks Per Link</h3>
                          <div className="space-y-3">
                            {analytics.clicksPerLink
                              .sort((a, b) => b.count - a.count)
                              .map((link, i) => (
                                <div key={link.linkId} className="flex items-center gap-4">
                                  <span className="text-gray-500 w-6">#{i + 1}</span>
                                  <div className="flex-1">
                                    <p className="text-white font-medium">{link.title}</p>
                                    <div className="h-2 bg-white/10 rounded-full mt-1">
                                      <div 
                                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                                        style={{ width: `${Math.max((link.count / Math.max(...analytics.clicksPerLink.map(l => l.count))) * 100, 5)}%` }}
                                      />
                                    </div>
                                  </div>
                                  <span className="text-white font-bold">{link.count}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}

                      {/* Device & Browser Stats */}
                      <div className="grid sm:grid-cols-2 gap-6">
                        {analytics.deviceStats.length > 0 && (
                          <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Devices</h3>
                            <div className="space-y-3">
                              {analytics.deviceStats.sort((a, b) => b.count - a.count).map((stat) => (
                                <div key={stat.device} className="flex items-center justify-between">
                                  <span className="text-gray-300">{stat.device}</span>
                                  <span className="text-white font-medium">{stat.count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {analytics.browserStats.length > 0 && (
                          <div className="glass-card rounded-2xl p-6">
                            <h3 className="text-lg font-semibold text-white mb-4">Browsers</h3>
                            <div className="space-y-3">
                              {analytics.browserStats.sort((a, b) => b.count - a.count).map((stat) => (
                                <div key={stat.browser} className="flex items-center justify-between">
                                  <span className="text-gray-300">{stat.browser}</span>
                                  <span className="text-white font-medium">{stat.count}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="glass-card rounded-2xl p-8 text-center">
                      <FiBarChart2 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-300 mb-2">No analytics data yet</p>
                      <p className="text-gray-500 text-sm">Start sharing your profile to see analytics!</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  )
}
