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
import {
  FiPlus, FiLogOut, FiExternalLink, FiCopy, FiBarChart2, FiImage,
  FiTrendingUp, FiUser, FiLink, FiSettings, FiEye,
  FiTrash2, FiEdit2, FiCheck, FiX, FiChevronUp, FiChevronDown, FiSmartphone, FiLayers,
  FiLayout, FiType, FiDownload, FiCalendar, FiArrowUp, FiArrowDown, FiGrid
} from 'react-icons/fi'
import type { User, Link as LinkType, DesignCustomization } from '@/types'
import { themes } from '@/lib/utils'
import DesignTab from '@/components/dashboard/DesignTab'

const iconMap: Record<string, React.ComponentType> = {
  website: FiExternalLink,
}

type TabType = 'links' | 'appearance' | 'analytics' | 'design'

interface AnalyticsData {
  totalClicks: number
  clicksPerLink: { linkId: string; title: string; count: number }[]
  deviceStats: { device: string; count: number }[]
  browserStats: { browser: string; count: number }[]
  timelineData: { date: string; count: number }[]
}

// Type for optimistic links
interface OptimisticLink extends LinkType {
  isOptimistic?: boolean
  isUpdating?: boolean
  isDeleting?: boolean
  originalData?: LinkType // Store original data for rollback
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

  // ============ OPTIMISTIC ADD LINK ============
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

    // Optimistically add to UI
    setLinks(prev => [...prev, optimisticLink])
    setShowAddModal(false)
    toast.success('Link added!')

    try {
      // Save to server
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
      
      // Replace temp with real
      setLinks(prev => prev.map(l => l.id === tempId ? { ...savedLink, _count: { clicks: 0 } } : l))
      toast.success('Link saved to server')
    } catch (error) {
      // Rollback on error
      setLinks(prev => prev.filter(l => l.id !== tempId))
      toast.error(error instanceof Error ? error.message : 'Failed to add link')
      setShowAddModal(true) // Re-open modal so user can retry
    }
  }

  // ============ OPTIMISTIC UPDATE LINK ============
  const handleUpdateLink = async (id: string, updates: Partial<LinkType>) => {
    const linkToUpdate = links.find(l => l.id === id)
    if (!linkToUpdate) return

    const originalData = { ...linkToUpdate }

    // Optimistically update UI
    setLinks(prev => prev.map(l => 
      l.id === id 
        ? { ...l, ...updates, isUpdating: true, originalData } 
        : l
    ))

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
      
      // Update with server data and remove updating state
      setLinks(prev => prev.map(l => 
        l.id === id 
          ? { ...updatedLink, _count: l._count, isUpdating: false, originalData: undefined } 
          : l
      ))
      toast.success('Link updated')
    } catch (error) {
      // Rollback on error
      setLinks(prev => prev.map(l => 
        l.id === id && l.originalData 
          ? { ...l.originalData, isUpdating: false, originalData: undefined } 
          : l
      ))
      toast.error(error instanceof Error ? error.message : 'Failed to update link')
    }
  }

  // ============ OPTIMISTIC DELETE LINK ============
  const handleDeleteLink = async (id: string) => {
    const linkToDelete = links.find(l => l.id === id)
    if (!linkToDelete) return

    const originalLinks = [...links]

    // Optimistically remove from UI
    setLinks(prev => prev.filter(l => l.id !== id))
    toast.success('Link deleted')

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error('Failed to delete link')
      }
    } catch (error) {
      // Rollback on error
      setLinks(originalLinks)
      toast.error('Failed to delete link')
    }
  }

  // ============ OPTIMISTIC REORDER LINKS ============
  const handleReorderLinks = async (newOrder: string[]) => {
    const originalLinks = [...links]
    
    // Create a map for quick lookup
    const linkMap = new Map(links.map(l => [l.id, l]))
    
    // Optimistically reorder UI
    const reorderedLinks = newOrder
      .map(id => linkMap.get(id))
      .filter((l): l is OptimisticLink => l !== undefined)
      .map((l, index) => ({ ...l, order: index }))
    
    setLinks(reorderedLinks)

    try {
      // Save new order to server
      await fetch(`/api/links/${newOrder[0]}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ linkIds: newOrder }),
      })
      toast.success('Order saved')
    } catch (error) {
      // Rollback on error
      setLinks(originalLinks)
      toast.error('Failed to reorder links')
    }
  }

  // ============ OPTIMISTIC TOGGLE ACTIVE ============
  const handleToggleActive = async (id: string) => {
    const link = links.find(l => l.id === id)
    if (!link) return

    const newActiveState = !link.active
    
    // Optimistically toggle
    setLinks(prev => prev.map(l => 
      l.id === id ? { ...l, active: newActiveState } : l
    ))

    try {
      const res = await fetch(`/api/links/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: newActiveState }),
      })

      if (!res.ok) throw new Error('Failed to update')
      
      toast.success(newActiveState ? 'Link visible' : 'Link hidden')
    } catch (error) {
      // Rollback
      setLinks(prev => prev.map(l => 
        l.id === id ? { ...l, active: !newActiveState } : l
      ))
      toast.error('Failed to update link')
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/')
  }

  const handleThemeChange = async (themeId: string) => {
    const originalTheme = user?.theme
    
    // Optimistically update theme
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
      // Rollback
      setUser(prev => prev ? { ...prev, theme: originalTheme || 'cyberpunk' } : null)
      setPreviewTheme(originalTheme || 'cyberpunk')
      toast.error('Failed to update theme')
    }
  }

  const handleDesignUpdate = async (design: Partial<DesignCustomization>) => {
    const originalUser = user ? { ...user } : null
    
    // Optimistically update design
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
      // Rollback on error
      if (originalUser) {
        setUser(originalUser)
      }
      throw error
    }
  }

  // Export analytics data as CSV
  const exportAnalytics = () => {
    if (!analytics) return

    const csvRows = [
      ['Link Title', 'Clicks', 'Share %', 'Link URL'],
      ...analytics.clicksPerLink.map(link => {
        const share = analytics.totalClicks > 0 
          ? ((link.count / analytics.totalClicks) * 100).toFixed(1)
          : '0'
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
                <button
                  onClick={() => setShowQRModal(true)}
                  className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all"
                >
                  <FiGrid className="w-4 h-4" />
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
                <motion.div key="links" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-white">Your Links</h1>
                      <p className="text-gray-400 text-sm">Manage and organize your links</p>
                    </div>
                    <button
                      onClick={() => setShowAddModal(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    >
                      <FiPlus className="w-5 h-5" />
                      Add Link
                    </button>
                  </div>

                  {links.length === 0 ? (
                    <div className="glass-card rounded-2xl p-12 text-center">
                      <FiLink className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                      <p className="text-gray-400 mb-4">No links yet</p>
                      <button
                        onClick={() => setShowAddModal(true)}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                      <h1 className="text-2xl font-bold text-white">Analytics</h1>
                      <p className="text-gray-400 text-sm">Track your link performance</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {/* Time Range Filter */}
                      <div className="flex items-center gap-2 bg-white/5 rounded-lg p-1">
                        {[7, 30, 90].map((days) => (
                          <button
                            key={days}
                            onClick={() => setAnalyticsDays(days)}
                            className={`px-3 py-1.5 rounded-md text-sm transition-all ${
                              analyticsDays === days
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                          >
                            {days}d
                          </button>
                        ))}
                      </div>
                      {/* Export Button */}
                      <button
                        onClick={exportAnalytics}
                        disabled={!analytics || analyticsLoading}
                        className="flex items-center gap-2 px-3 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <FiDownload className="w-4 h-4" />
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
                          { label: 'Total Clicks', value: analytics.totalClicks, icon: FiTrendingUp, color: 'from-blue-500 to-cyan-500' },
                          { label: 'Active Links', value: links.filter(l => l.active).length, icon: FiLink, color: 'from-purple-500 to-pink-500' },
                          { label: 'Total Links', value: links.length, icon: FiLayers, color: 'from-orange-500 to-red-500' },
                          { label: 'Avg Per Day', value: Math.round(analytics.totalClicks / analyticsDays), icon: FiCalendar, color: 'from-green-500 to-emerald-500' },
                        ].map((stat, i) => (
                          <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="glass-card rounded-2xl p-5"
                          >
                            <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center mb-3`}>
                              <stat.icon className="w-5 h-5 text-white" />
                            </div>
                            <p className="text-2xl font-bold text-white mb-1">{stat.value}</p>
                            <p className="text-gray-400 text-sm">{stat.label}</p>
                          </motion.div>
                        ))}
                      </div>

                      {/* Links Performance Section */}
                      <div className="glass-card rounded-2xl p-6 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                          <div>
                            <h3 className="text-lg font-semibold text-white">Links Performance</h3>
                            <p className="text-gray-400 text-sm">Click statistics for each link</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gray-400 text-sm">Sort by:</span>
                            <select
                              value={analyticsSortBy}
                              onChange={(e) => setAnalyticsSortBy(e.target.value as 'clicks' | 'name')}
                              className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-blue-500"
                            >
                              <option value="clicks" className="bg-gray-900">Clicks</option>
                              <option value="name" className="bg-gray-900">Name</option>
                            </select>
                            <button
                              onClick={() => setAnalyticsSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                              className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
                            >
                              {analyticsSortOrder === 'desc' ? <FiArrowDown className="w-4 h-4" /> : <FiArrowUp className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        {/* Bar Chart for Clicks Per Link */}
                        {analytics.clicksPerLink.length > 0 && (
                          <div className="mb-8">
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
                                      <span className="text-gray-500 w-6 text-sm">#{i + 1}</span>
                                      <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-1">
                                          <p className="text-white font-medium truncate text-sm">{link.title}</p>
                                          <div className="flex items-center gap-3">
                                            <span className="text-gray-400 text-xs">{sharePercentage}%</span>
                                            <span className="text-white font-bold text-sm w-12 text-right">{link.count}</span>
                                          </div>
                                        </div>
                                        <div className="h-2.5 bg-white/10 rounded-full overflow-hidden">
                                          <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.max(percentage, 5)}%` }}
                                            transition={{ duration: 0.5, delay: i * 0.05 }}
                                            className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  )
                                })}
                            </div>
                          </div>
                        )}

                        {/* Detailed Link Cards */}
                        <LinkAnalytics 
                          links={analytics.clicksPerLink.map(link => ({
                            ...link,
                            url: links.find(l => l.id === link.linkId)?.url
                          }))}
                          totalClicks={analytics.totalClicks}
                          sortBy={analyticsSortBy}
                          sortOrder={analyticsSortOrder}
                        />
                      </div>

                      {/* Device & Browser Stats */}
                      <div className="grid sm:grid-cols-2 gap-6">
                        {analytics.deviceStats.length > 0 && (
                          <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card rounded-2xl p-6"
                          >
                            <h3 className="text-lg font-semibold text-white mb-4">Devices</h3>
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
                                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                          />
                                        </div>
                                        <span className="text-white font-medium text-sm w-10 text-right">{stat.count}</span>
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
                            className="glass-card rounded-2xl p-6"
                          >
                            <h3 className="text-lg font-semibold text-white mb-4">Browsers</h3>
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
                                        <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                                          <div 
                                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                            style={{ width: `${percentage}%` }}
                                          />
                                        </div>
                                        <span className="text-white font-medium text-sm w-10 text-right">{stat.count}</span>
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

      {/* Add Link Modal */}
      <AnimatePresence>
        {showAddModal && (
          <AddLinkModal
            onClose={() => setShowAddModal(false)}
            onSuccess={() => {}}
            onAdd={handleAddLink}
          />
        )}
      </AnimatePresence>

      {/* QR Code Generator Modal */}
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
