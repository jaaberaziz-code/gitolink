'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import toast from 'react-hot-toast'
import { DashboardSkeleton, AnalyticsSkeleton } from '@/components/ui/Skeleton'
import LinkList from '@/components/dashboard/LinkList'
import AddLinkModal from '@/components/dashboard/AddLinkModal'
import QRCodeGenerator from '@/components/qr/QRCodeGenerator'
import LinkAnalytics from '@/components/dashboard/LinkAnalytics'
import type { User, Link as LinkType, DesignCustomization } from '@/types'
import { themes } from '@/lib/utils'
import DesignTab from '@/components/dashboard/DesignTab'

// SVG Icons (Neo-brutalist style)
const Icons = {
  plus: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M12 5v14M5 12h14" />
    </svg>
  ),
  logout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </svg>
  ),
  external: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  ),
  copy: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  ),
  chart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <line x1="18" y1="20" x2="18" y2="10" />
      <line x1="12" y1="20" x2="12" y2="4" />
      <line x1="6" y1="20" x2="6" y2="14" />
    </svg>
  ),
  image: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
  link: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  ),
  layout: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
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
  check: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  download: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  ),
  arrowUp: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <line x1="12" y1="19" x2="12" y2="5" />
      <polyline points="5 12 12 5 19 12" />
    </svg>
  ),
  arrowDown: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
      <line x1="12" y1="5" x2="12" y2="19" />
      <polyline points="19 12 12 19 5 12" />
    </svg>
  ),
  trending: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
      <polyline points="17 6 23 6 23 12" />
    </svg>
  ),
  layers: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <polygon points="12 2 2 7 12 12 22 7 12 2" />
      <polyline points="2 17 12 22 22 17" />
      <polyline points="2 12 12 17 22 12" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-5 h-5">
      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
      <line x1="16" y1="2" x2="16" y2="6" />
      <line x1="8" y1="2" x2="8" y2="6" />
      <line x1="3" y1="10" x2="21" y2="10" />
    </svg>
  ),
  barChart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-16 h-16">
      <line x1="12" y1="20" x2="12" y2="10" />
      <line x1="18" y1="20" x2="18" y2="4" />
      <line x1="6" y1="20" x2="6" y2="16" />
    </svg>
  )
}

const iconMap: Record<string, React.ComponentType> = {
  website: () => Icons.external,
}

type TabType = 'links' | 'appearance' | 'analytics' | 'design'

interface AnalyticsData {
  totalClicks: number
  clicksPerLink: { linkId: string; title: string; count: number }[]
  deviceStats: { device: string; count: number }[]
  browserStats: { browser: string; count: number }[]
  timelineData: { date: string; count: number }[]
}

interface OptimisticLink extends LinkType {
  isOptimistic?: boolean
  isUpdating?: boolean
  isDeleting?: boolean
  originalData?: LinkType
}

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [links, setLinks] = useState<OptimisticLink[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabType>('links')
  const [previewTheme, setPreviewTheme] = useState<string | null>(null)
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [analyticsLoading, setAnalyticsLoading] = useState(false)
  const [analyticsDays, setAnalyticsDays] = useState(30)
  const [analyticsSortBy, setAnalyticsSortBy] = useState<'clicks' | 'name'>('clicks')
  const [analyticsSortOrder, setAnalyticsSortOrder] = useState<'asc' | 'desc'>('desc')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)

  const displayTheme = previewTheme || user?.theme || 'cyberpunk'

  useEffect(() => {
    fetchUser()
    fetchLinks()
  }, [])

  useEffect(() => {
    if (activeTab === 'analytics') {
      fetchAnalytics()
    }
  }, [activeTab, analyticsDays])

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
      const res = await fetch(`/api/analytics?days=${analyticsDays}`)
      if (res.ok) {
        const data = await res.json()
        setAnalytics(data)
      }
    } catch { toast.error('Failed to load analytics') }
    finally { setAnalyticsLoading(false) }
  }

  const handleAddLink = async (formData: { title: string; url: string; icon?: string }) => {
    const tempId = `temp-${Date.now()}`
    const optimisticLink: OptimisticLink = {
      id: tempId,
      title: formData.title,
      url: formData.url,
      icon: formData.icon || null,
      order: links.length,
      active: true,
      userId: user?.id || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      _count: { clicks: 0 },
      isOptimistic: true,
    }

    setLinks(prev => [...prev, optimisticLink])
    setShowAddModal(false)
    toast.success('Link added!')

    try {
      const res = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to add link')
      }

      const { link: savedLink } = await res.json()
      setLinks(prev => prev.map(l => l.id === tempId ? { ...savedLink, _count: { clicks: 0 } } : l))
      toast.success('Link saved to server')
    } catch (error) {
      setLinks(prev => prev.filter(l => l.id !== tempId))
      toast.error(error instanceof Error ? error.message : 'Failed to add link')
      setShowAddModal(true)
    }
  }

  const handleUpdateLink = async (id: string, updates: Partial<LinkType>) => {
    const linkToUpdate = links.find(l => l.id === id)
    if (!linkToUpdate) return

    const originalData = { ...linkToUpdate }
    setLinks(prev => prev.map(l => l.id === id ? { ...l, ...updates, isUpdating: true, originalData } : l))

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to update link')
      }

      const { link: updatedLink } = await res.json()
      setLinks(prev => prev.map(l => l.id === id ? { ...updatedLink, _count: l._count, isUpdating: false, originalData: undefined } : l))
      toast.success('Link updated')
    } catch (error) {
      setLinks(prev => prev.map(l => l.id === id && l.originalData ? { ...l.originalData, isUpdating: false, originalData: undefined } : l))
      toast.error(error instanceof Error ? error.message : 'Failed to update link')
    }
  }

  const handleDeleteLink = async (id: string) => {
    const linkToDelete = links.find(l => l.id === id)
    if (!linkToDelete) return

    const originalLinks = [...links]
    setLinks(prev => prev.filter(l => l.id !== id))
    toast.success('Link deleted')

    try {
      const res = await fetch(`/api/links/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete link')
    } catch (error) {
      setLinks(originalLinks)
      toast.error('Failed to delete link')
    }
  }

  const handleReorderLinks = async (newOrder: string[]) => {
    const originalLinks = [...links]
    const linkMap = new Map(links.map(l => [l.id, l]))
    const reorderedLinks = newOrder
      .map(id => linkMap.get(id))
      .filter((l): l is OptimisticLink => l !== undefined)
      .map((l, index) => ({ ...l, order: index }))
    
    setLinks(reorderedLinks)

    try {
      await fetch(`/api/links/${newOrder[0]}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkIds: newOrder }),
      })
      toast.success('Order saved')
    } catch (error) {
      setLinks(originalLinks)
      toast.error('Failed to reorder links')
    }
  }

  const handleToggleActive = async (id: string) => {
    const link = links.find(l => l.id === id)
    if (!link) return

    const newActiveState = !link.active
    setLinks(prev => prev.map(l => l.id === id ? { ...l, active: newActiveState } : l))

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: newActiveState }),
      })
      if (!res.ok) throw new Error('Failed to update')
      toast.success(newActiveState ? 'Link visible' : 'Link hidden')
    } catch (error) {
      setLinks(prev => prev.map(l => l.id === id ? { ...l, active: !newActiveState } : l))
      toast.error('Failed to update link')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const handleThemeChange = async (themeId: string) => {
    const originalTheme = user?.theme
    setUser(prev => prev ? { ...prev, theme: themeId } : null)
    setPreviewTheme(themeId)

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themeId }),
      })
      if (!res.ok) throw new Error('Failed to update theme')
      toast.success('Theme updated!')
    } catch {
      setUser(prev => prev ? { ...prev, theme: originalTheme || 'cyberpunk' } : null)
      setPreviewTheme(originalTheme || 'cyberpunk')
      toast.error('Failed to update theme')
    }
  }

  const handleDesignUpdate = async (design: Partial<DesignCustomization>) => {
    const originalUser = user ? { ...user } : null
    setUser(prev => prev ? { ...prev, ...design } : null)

    try {
      const res = await fetch('/api/auth/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(design),
      })
      
      if (!res.ok) {
        const error = await res.json()
        throw new Error(error.error || 'Failed to save design changes')
      }
      
      const data = await res.json()
      setUser(prev => prev ? { ...prev, ...data.user } : null)
      return data.user
    } catch (error: any) {
      if (originalUser) setUser(originalUser)
      throw error
    }
  }

  const exportAnalytics = () => {
    if (!analytics) return

    const csvRows = [
      ['Link Title', 'Clicks', 'Share %', 'Link URL'],
      ...analytics.clicksPerLink.map(link => {
        const share = analytics.totalClicks > 0 ? ((link.count / analytics.totalClicks) * 100).toFixed(1) : '0'
        const linkData = links.find(l => l.id === link.linkId)
        return [link.title, link.count.toString(), `${share}%`, linkData?.url || '']
      })
    ]

    const csvContent = csvRows.map(row => row.map(cell => `"${cell}"`).join(',')).join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `analytics-${analyticsDays}d-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
    toast.success('Analytics exported!')
  }

  if (loading || !user) {
    return <DashboardSkeleton />
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-black border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold tracking-tight">
            GitoLink
          </Link>
          <div className="flex items-center gap-3">
            <a 
              href={`/${user.username}`} 
              target="_blank" 
              className="flex items-center gap-2 px-4 py-2 bg-white text-black font-medium hover:bg-gray-200 transition-colors"
            >
              {Icons.external}
              <span className="hidden sm:inline text-sm">View Profile</span>
            </a>
            <button 
              onClick={handleLogout} 
              className="p-2 text-gray-400 hover:text-white transition-colors"
              title="Logout"
            >
              {Icons.logout}
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Sidebar */}
          <aside>
            <div className="bg-[#0a0a0a] border border-gray-800 p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="w-20 h-20 mx-auto mb-4 flex items-center justify-center text-2xl font-bold bg-gray-800 border-2 border-gray-700">
                  {user.name?.[0] || user.username[0].toUpperCase()}
                </div>
                <h2 className="text-lg font-semibold">{user.name || user.username}</h2>
                <p className="text-gray-500 text-sm font-mono">@{user.username}</p>
              </div>

              <nav className="space-y-1">
                {[
                  { id: 'links' as TabType, label: 'My Links', icon: Icons.link },
                  { id: 'appearance' as TabType, label: 'Appearance', icon: Icons.image },
                  { id: 'design' as TabType, label: 'Design', icon: Icons.layout },
                  { id: 'analytics' as TabType, label: 'Analytics', icon: Icons.chart },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 transition-all ${
                      activeTab === item.id 
                        ? 'bg-white text-black font-medium' 
                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                    }`}
                  >
                    <span>{item.icon}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </nav>

              <div className="mt-6 pt-6 border-t border-gray-800">
                <p className="text-xs text-gray-500 mb-2 font-mono uppercase tracking-wider">Your URL</p>
                <div className="flex items-center gap-2 bg-black border border-gray-800 px-3 py-2">
                  <span className="text-sm text-gray-400 truncate flex-1 font-mono">
                    gitolink.vercel.app/{user.username}
                  </span>
                  <button 
                    onClick={() => { 
                      navigator.clipboard.writeText(`https://gitolink.vercel.app/${user.username}`)
                      toast.success('Copied!')
                    }}
                    className="text-gray-500 hover:text-white transition-colors"
                  >
                    {Icons.copy}
                  </button>
                </div>
                <button
                  onClick={() => setShowQRModal(true)}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 bg-[#00FF41] text-black font-bold hover:bg-[#00CC33] transition-colors"
                >
                  {Icons.grid}
                  QR Code
                </button>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main>
            <AnimatePresence mode="wait">
              {/* Links Tab */}
              {activeTab === 'links' && (
                <motion.div 
                  key="links" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-2xl font-bold">YOUR LINKS</h1>
                      <div className="w-12 h-[2px] bg-[#00FF41] mt-2" />
                    </div>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-2 px-4 py-3 bg-white text-black font-medium hover:bg-gray-200 transition-colors"
                    >
                      {Icons.plus}
                      Add Link
                    </button>
                  </div>

                  {links.length === 0 ? (
                    <div className="bg-[#0a0a0a] border border-gray-800 p-12 text-center">
                      <div className="text-gray-600 mb-4">{Icons.link}</div>
                      <p className="text-gray-400 mb-4 font-mono">No links yet</p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-3 bg-white text-black font-medium hover:bg-gray-200 transition-colors"
                      >
                        Add Your First Link
                      </button>
                    </div>
                  ) : (
                    <LinkList 
                      links={links}
                      onUpdateLink={handleUpdateLink}
                      onDeleteLink={handleDeleteLink}
                      onReorderLinks={handleReorderLinks}
                      onToggleActive={handleToggleActive}
                    />
                  )}
                </motion.div>
              )}

              {/* Appearance Tab */}
              {activeTab === 'appearance' && (
                <motion.div 
                  key="appearance" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold">APPEARANCE</h1>
                    <div className="w-12 h-[2px] bg-[#00FF41] mt-2" />
                    <p className="text-gray-400 mt-2 font-mono text-sm">Choose a theme for your profile</p>
                  </div>

                  <div className="bg-[#0a0a0a] border border-gray-800 p-6">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {themes.map((theme) => (
                        <button
                          key={theme.id}
                          onClick={() => handleThemeChange(theme.id)}
                          onMouseEnter={() => setPreviewTheme(theme.id)}
                          onMouseLeave={() => setPreviewTheme(user.theme)}
                          className={`relative h-24 overflow-hidden border-2 transition-all ${
                            user.theme === theme.id 
                              ? 'border-[#00FF41]' 
                              : 'border-gray-800 hover:border-gray-600'
                          }`}
                        >
                          <div className={`absolute inset-0 ${theme.class}`} />
                          <span className="absolute bottom-0 left-0 right-0 p-2 bg-black/80 text-xs font-mono truncate">
                            {theme.name}
                          </span>
                          {user.theme === theme.id && (
                            <div className="absolute top-2 right-2 w-5 h-5 bg-[#00FF41] flex items-center justify-center">
                              <span className="text-black">{Icons.check}</span>
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
                <motion.div 
                  key="design" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                >
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
                <motion.div 
                  key="analytics" 
                  initial={{ opacity: 0, y: 10 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h1 className="text-2xl font-bold">ANALYTICS</h1>
                      <div className="w-12 h-[2px] bg-[#00FF41] mt-2" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1 border border-gray-800">
                        {[7, 30, 90].map((days) => (
                          <button
                            key={days}
                            onClick={() => setAnalyticsDays(days)}
                            className={`px-3 py-2 text-sm font-mono transition-all ${
                              analyticsDays === days
                                ? 'bg-white text-black'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800'
                            }`}
                          >
                            {days}d
                          </button>
                        ))}
                      </div>
                      <button
                        onClick={exportAnalytics}
                        disabled={!analytics || analyticsLoading}
                        className="flex items-center gap-2 px-3 py-2 border border-gray-800 text-gray-300 hover:bg-gray-800 transition-colors disabled:opacity-50"
                      >
                        {Icons.download}
                        <span className="hidden sm:inline text-sm">Export</span>
                      </button>
                    </div>
                  </div>

                  {analyticsLoading ? (
                    <AnalyticsSkeleton />
                  ) : analytics ? (
                    <>
                      {/* Stats Cards */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {[
                          { label: 'Total Clicks', value: analytics.totalClicks, icon: Icons.trending },
                          { label: 'Active Links', value: links.filter(l => l.active).length, icon: Icons.link },
                          { label: 'Total Links', value: links.length, icon: Icons.layers },
                          { label: 'Avg Per Day', value: Math.round(analytics.totalClicks / analyticsDays), icon: Icons.calendar },
                        ].map((stat, i) => (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-[#0a0a0a] border border-gray-800 p-5"
                          >
                            <div className="text-gray-500 mb-3">{stat.icon}</div>
                            <p className="text-3xl font-bold mb-1">{stat.value}</p>
                            <p className="text-gray-500 text-sm font-mono">{stat.label}</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Links Performance */}
                      <div className="bg-[#0a0a0a] border border-gray-800 p-6 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                          <div>
                            <h3 className="text-lg font-bold">LINK PERFORMANCE</h3>
                            <p className="text-gray-500 text-sm font-mono">Click statistics for each link</p>
                          </div>
                        </div>

                        {analytics.clicksPerLink.length > 0 && (
                          <div className="space-y-3">
                            {analytics.clicksPerLink
                              .sort((a, b) => b.count - a.count)
                              .slice(0, 10)
                              .map((link, i) => {
                                const maxClicks = Math.max(...analytics.clicksPerLink.map(l => l.count))
                                const percentage = maxClicks > 0 ? (link.count / maxClicks) * 100 : 0
                                const sharePercentage = analytics.totalClicks > 0 
                                  ? Math.round((link.count / analytics.totalClicks) * 100) 
                                  : 0
                                
                                return (
                                  <div key={link.linkId} className="flex items-center gap-4">
                                    <span className="text-gray-600 w-6 text-sm font-mono">#{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between mb-1">
                                        <p className="font-medium truncate text-sm">{link.title}</p>
                                        <div className="flex items-center gap-3">
                                          <span className="text-gray-500 text-xs font-mono">{sharePercentage}%</span>
                                          <span className="font-bold text-sm w-12 text-right">{link.count}</span>
                                        </div>
                                      </div>
                                      <div className="h-2 bg-gray-800 overflow-hidden">
                                        <motion.div
                                          initial={{ width: 0 }}
                                          animate={{ width: `${Math.max(percentage, 5)}%` }}
                                          transition={{ duration: 0.5, delay: i * 0.05 }}
                                          className="h-full bg-[#00FF41]"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                          </div>
                        )}
                      </div>

                      {/* Device & Browser Stats */}
                      <div className="grid sm:grid-cols-2 gap-6">
                        {analytics.deviceStats.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-[#0a0a0a] border border-gray-800 p-6"
                          >
                            <h3 className="text-lg font-bold mb-4">DEVICES</h3>
                            <div className="space-y-3">
                              {analytics.deviceStats
                                .sort((a, b) => b.count - a.count)
                                .map((stat) => {
                                  const percentage = analytics.totalClicks > 0 
                                    ? Math.round((stat.count / analytics.totalClicks) * 100) 
                                    : 0
                                  return (
                                    <div key={stat.device} className="flex items-center gap-3">
                                      <span className="text-gray-300 text-sm flex-1">{stat.device}</span>
                                      <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-gray-800 overflow-hidden">
                                          <div 
                                            className="h-full bg-gray-600"
                                            style={{ width: `${percentage}%` }}
                                          />
                                        </div>
                                        <span className="font-medium text-sm w-10 text-right font-mono">{stat.count}</span>
                                      </div>
                                    </div>
                                  )
                                })}
                            </div>
                          </motion.div>
                        )}

                        {analytics.browserStats.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="bg-[#0a0a0a] border border-gray-800 p-6"
                          >
                            <h3 className="text-lg font-bold mb-4">BROWSERS</h3>
                            <div className="space-y-3">
                              {analytics.browserStats
                                .sort((a, b) => b.count - a.count)
                                .map((stat) => {
                                  const percentage = analytics.totalClicks > 0 
                                    ? Math.round((stat.count / analytics.totalClicks) * 100) 
                                    : 0
                                  return (
                                    <div key={stat.browser} className="flex items-center gap-3">
                                      <span className="text-gray-300 text-sm flex-1">{stat.browser}</span>
                                      <div className="flex items-center gap-2">
                                        <div className="w-24 h-2 bg-gray-800 overflow-hidden">
                                          <div 
                                            className="h-full bg-gray-600"
                                            style={{ width: `${percentage}%` }}
                                          />
                                        </div>
                                        <span className="font-medium text-sm w-10 text-right font-mono">{stat.count}</span>
                                      </div>
                                    </div>
                                  )
                                })}
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="bg-[#0a0a0a] border border-gray-800 p-8 text-center">
                      <div className="text-gray-600 mb-4">{Icons.barChart}</div>
                      <p className="text-gray-300 mb-2">No analytics data yet</p>
                      <p className="text-gray-500 text-sm font-mono">Start sharing your profile to see analytics!</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {showAddModal && (
          <AddLinkModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {}}
            onAdd={handleAddLink}
          />
        )}
      </AnimatePresence>

      {showQRModal && (
        <QRCodeGenerator
          username={user.username}
          isOpen={showQRModal}
          onClose={() => setShowQRModal(false)}
        />
      )}
    </div>
  )
}
